import urllib.request
import urllib.error
import json
import os

print("--- 1. Testing GET /healthz ---")
try:
    res = urllib.request.urlopen("http://localhost:3001/healthz", timeout=5)
    print("Healthz:", res.status, res.read().decode())
except Exception as e:
    print("Healthz failed:", e)

print("\n--- 2. Testing GET /audit.html ---")
try:
    res = urllib.request.urlopen("http://localhost:3001/audit.html", timeout=5)
    content = res.read().decode()
    print("audit.html:", res.status, f"({len(content)} bytes)")
    if "bookForm" in content and "API_BOOK" in content:
        print("  -> Integrated booking form verified on audit.html!")
    else:
        print("  -> WARNING: Integrated booking form not found in audit.html!")
except Exception as e:
    print("audit.html failed:", e)

print("\n--- 3. Testing POST /api/audit (Live Scrape & Score) ---")
payload = {
    "name": "Jane Smith",
    "email": "jane@relaunch.us",
    "business": "ReLaunch Test Corp",
    "website": "https://relaunch.us"
}
req = urllib.request.Request(
    "http://localhost:3001/api/audit",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json"}
)
try:
    res = urllib.request.urlopen(req, timeout=25)
    data = json.loads(res.read().decode())
    print("Scoring API Status:", res.status)
    print("Overall Score:", data.get("overall"), "/ 100")
    print("Band:", data.get("band"))
    print("Band Note:", data.get("bandNote"))
    print("Layers:", data.get("layers"))
    print("Weakest Area:", data.get("weakest", {}).get("area"), f"({data.get('weakest', {}).get('score')})")
    print("Fixes count:", len(data.get("fixes", [])))
    print("Sales Hook:", data.get("salesHook"))
except Exception as e:
    print("POST /api/audit failed:", e)

print("\n--- 4. Testing POST /api/book (Strategy Call Booking) ---")
book_payload = {
    "name": "Jane Smith",
    "email": "jane@relaunch.us",
    "phone": "(480) 779-9875",
    "business": "ReLaunch Test Corp",
    "website": "https://relaunch.us",
    "preferredDate": "2026-10-25",
    "preferredTime": "10:00 AM MST",
    "notes": "Testing v1.1 booking integration"
}
req_book = urllib.request.Request(
    "http://localhost:3001/api/book",
    data=json.dumps(book_payload).encode(),
    headers={"Content-Type": "application/json"}
)
try:
    res = urllib.request.urlopen(req_book, timeout=10)
    data = json.loads(res.read().decode())
    print("Booking API Status:", res.status)
    print("Booking response:", data)
except Exception as e:
    print("POST /api/book failed:", e)

print("\n--- 5. Testing Bad Email Validation ---")
bad_email_payload = {
    "name": "Bad Email",
    "email": "not-an-email",
    "business": "Test",
    "website": "https://relaunch.us"
}
req_bad_email = urllib.request.Request(
    "http://localhost:3001/api/audit",
    data=json.dumps(bad_email_payload).encode(),
    headers={"Content-Type": "application/json"}
)
try:
    res = urllib.request.urlopen(req_bad_email, timeout=5)
    print("Unexpected success:", res.status)
except urllib.error.HTTPError as e:
    err_body = e.read().decode()
    print("Bad Email Handled correctly:", e.code, err_body)

print("\n--- 6. Checking leads.csv & bookings.csv ---")
csv_path = "relaunch-audit/leads.csv"
if os.path.exists(csv_path):
    print("leads.csv exists! Size:", os.path.getsize(csv_path), "bytes")
else:
    print("leads.csv NOT found!")

bookings_path = "relaunch-audit/bookings.csv"
if os.path.exists(bookings_path):
    print("bookings.csv exists! Size:", os.path.getsize(bookings_path), "bytes")
    with open(bookings_path, "r", encoding="utf-8") as f:
        print("Last line in bookings.csv:")
        lines = [line.strip() for line in f if line.strip()]
        if lines:
            print("  ", lines[-1])
else:
    print("bookings.csv NOT found!")
