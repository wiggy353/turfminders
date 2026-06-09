import argparse
import os
import datetime
import sys
import urllib.parse
import pandas as pd
import requests
from azure.identity import InteractiveBrowserCredential

CLIENT_ID = os.getenv("AZURE_CLIENT_ID", "e48ca99d-4779-4722-9eb5-d920f600cc6f")
TENANT_ID = os.getenv("AZURE_TENANT_ID", "83cdf785-760a-40ff-b79a-2e9a75e19602")
GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0"


def load_customers(excel_path, name_column, alt_name_column=None):
    df = pd.read_excel(excel_path, sheet_name=0, header=3, dtype=str)
    if name_column not in df.columns:
        raise ValueError(f"Sheet does not contain column '{name_column}'. Available columns: {', '.join(df.columns)}")

    columns_to_keep = [name_column]
    if alt_name_column and alt_name_column in df.columns and alt_name_column != name_column:
        columns_to_keep.append(alt_name_column)

    df = df[columns_to_keep + [c for c in df.columns if c not in columns_to_keep]]
    df[name_column] = df[name_column].fillna("").astype(str).str.strip()
    if alt_name_column and alt_name_column in df.columns:
        df[alt_name_column] = df[alt_name_column].fillna("").astype(str).str.strip()
        df = df[(df[name_column] != "") | (df[alt_name_column] != "")]
    else:
        df = df[df[name_column] != ""]

    df = df.reset_index(drop=True)
    return df


def get_access_token(client_id, tenant_id):
    credential = InteractiveBrowserCredential(client_id=client_id, tenant_id=tenant_id)
    token = credential.get_token("https://graph.microsoft.com/.default")
    if not token or not token.token:
        raise RuntimeError("Could not obtain access token from InteractiveBrowserCredential.")
    return token.token


def graph_get(url, access_token, params=None, headers=None):
    headers = headers or {}
    headers["Authorization"] = f"Bearer {access_token}"
    resp = requests.get(url, params=params, headers=headers)
    if resp.status_code >= 400:
        raise RuntimeError(f"Graph request failed ({resp.status_code}): {resp.text}")
    return resp.json()


def build_search_terms(primary_name, alternate_name):
    terms = []

    def add_full(term, label):
        if term and term.strip():
            terms.append((label, term.strip()))

    add_full(primary_name, "full_primary")
    if alternate_name and alternate_name.strip().lower() != str(primary_name).strip().lower():
        add_full(alternate_name, "full_alternate")

    return terms


def get_calendar_events(access_token, start_datetime, end_datetime):
    max_chunk_days = 1825
    headers = {
        "Prefer": 'outlook.body-content-type="text"'
    }
    events = []
    current_start = start_datetime

    while current_start < end_datetime:
        current_end = min(current_start + datetime.timedelta(days=max_chunk_days), end_datetime)
        url = f"{GRAPH_ENDPOINT}/me/calendarview"
        params = {
            "$top": 200,
            "startDateTime": current_start.isoformat(),
            "endDateTime": current_end.isoformat(),
            "$select": "subject,start,body,bodyPreview,location,webLink"
        }

        while url:
            response = requests.get(url, params=params, headers={**headers, "Authorization": f"Bearer {access_token}"})
            if response.status_code >= 400:
                raise RuntimeError(f"Graph calendarview request failed ({response.status_code}): {response.text}")
            data = response.json()
            events.extend(data.get("value", []))
            url = data.get("@odata.nextLink")
            params = None

        current_start = current_end
    return events


def save_events(events, output_path):
    rows = []
    for event in events:
        rows.append({
            "EventId": event.get("id", ""),
            "Subject": event.get("subject", ""),
            "Start": event.get("start", {}).get("dateTime", ""),
            "StartTimeZone": event.get("start", {}).get("timeZone", ""),
            "End": event.get("end", {}).get("dateTime", ""),
            "EndTimeZone": event.get("end", {}).get("timeZone", ""),
            "Location": event.get("location", {}).get("displayName", ""),
            "BodyPreview": event.get("bodyPreview", ""),
            "Body": (event.get("body", {}) or {}).get("content", ""),
            "WebLink": event.get("webLink", ""),
            "CreatedDateTime": event.get("createdDateTime", ""),
            "LastModifiedDateTime": event.get("lastModifiedDateTime", ""),
        })
    pd.DataFrame(rows).to_excel(output_path, index=False)


def search_events_by_name(name, events):
    lower_name = name.lower()
    matches = []
    for event in events:
        subject = (event.get("subject") or "")
        body = (event.get("body", {}) or {}).get("content", "")
        full_text = f"{subject}\n{body}".lower()
        if lower_name in full_text:
            matches.append(event)
    return matches


def run_lookup(excel_path, output_path, client_id, tenant_id, name_column, alt_name_column, years_back, years_forward):
    customers = load_customers(excel_path, name_column, alt_name_column)
    start_dt = datetime.datetime.utcnow() - datetime.timedelta(days=365 * years_back)
    end_dt = datetime.datetime.utcnow() + datetime.timedelta(days=365 * years_forward)
    access_token = get_access_token(client_id, tenant_id)
    all_events = get_calendar_events(access_token, start_dt, end_dt)

    results = []
    print(f"Loaded {len(customers)} customer records and {len(all_events)} calendar events to scan.")

    for idx, row in customers.iterrows():
        primary_name = str(row[name_column]).strip()
        alternate_name = ""
        if alt_name_column and alt_name_column in row:
            alternate_name = str(row[alt_name_column]).strip()

        matches = []
        search_name = ""
        match_strategy = ""
        for strategy, term in build_search_terms(primary_name, alternate_name):
            matches = search_events_by_name(term, all_events)
            if matches:
                search_name = term
                match_strategy = strategy
                break

        if not matches:
            results.append({
                "CustomerName": primary_name,
                "MatchedName": search_name,
                "MatchStrategy": "none",
                "EventSubject": "",
                "EventStart": "",
                "EventBody": "",
                "EventLocation": "",
                "EventWebLink": "",
                "MatchFound": False,
            })
            continue

        for event in matches:
            body_content = (event.get("body", {}) or {}).get("content", "")
            results.append({
                "CustomerName": primary_name,
                "MatchedName": search_name,
                "MatchStrategy": match_strategy,
                "EventSubject": event.get("subject", ""),
                "EventStart": event.get("start", {}).get("dateTime", ""),
                "EventBody": body_content,
                "EventLocation": event.get("location", {}).get("displayName", ""),
                "EventWebLink": event.get("webLink", ""),
                "MatchFound": True,
            })

    out_df = pd.DataFrame(results)
    out_df.to_excel(output_path, index=False)
    print(f"Wrote {len(out_df)} result rows to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Lookup Outlook Online calendar events from customer names in an Excel file.")
    parser.add_argument("--excel", default="TUCSON TURF, LLC_Customer Contact List 2026.xlsx", help="Path to the Tucson Turf Excel file.")
    parser.add_argument("--output", default="calendar_matches.xlsx", help="Output Excel file for matched calendar events.")
    parser.add_argument("--events-output", default="calendar_events.xlsx", help="Output Excel file for all calendar events when --dump-events is used.")
    parser.add_argument("--client-id", default=CLIENT_ID, help="Azure AD app client ID for Microsoft Graph authentication.")
    parser.add_argument("--tenant-id", default=TENANT_ID, help="Azure AD tenant ID for authentication.")
    parser.add_argument("--name-column", default="Customer full name", help="Excel column to use as the customer name.")
    parser.add_argument("--alt-name-column", default="Full name", help="Alternate Excel column to try if the primary name does not match.")
    parser.add_argument("--years-back", type=int, default=10, help="How many years back from today to search calendar events.")
    parser.add_argument("--years-forward", type=int, default=1, help="How many years forward from today to search calendar events.")
    parser.add_argument("--dump-events", action="store_true", help="Fetch all calendar events and write them to the events output file without matching.")
    args = parser.parse_args()

    access_token = get_access_token(args.client_id, args.tenant_id)
    if args.dump_events:
        events = get_calendar_events(access_token, datetime.datetime.utcnow() - datetime.timedelta(days=365 * args.years_back), datetime.datetime.utcnow() + datetime.timedelta(days=365 * args.years_forward))
        save_events(events, args.events_output)
        print(f"Wrote {len(events)} calendar events to {args.events_output}")
        sys.exit(0)

    run_lookup(args.excel, args.output, args.client_id, args.tenant_id, args.name_column, args.alt_name_column, args.years_back, args.years_forward)
