#!/usr/bin/env python3
"""
IndexNow Broadcast Script for geminiwatermarkai.online
Pushes updated URLs to Bing & Yandex within seconds of deployment.
"""

import json
import urllib.request
import sys

HOST = "geminiwatermarkai.online"
KEY = "geminiwatermarkai2026indexnow"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

URL_LIST = [
    f"https://{HOST}/",
    f"https://{HOST}/about",
    f"https://{HOST}/privacy",
    f"https://{HOST}/terms",
    f"https://{HOST}/contact"
]

def submit_indexnow():
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": URL_LIST
    }
    
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"[IndexNow] Successfully submitted {len(URL_LIST)} URLs. Status: {resp.status}")
    except Exception as e:
        print(f"[IndexNow Warning] Broadcast failed (ensure domain is live and key file is deployed): {e}")

if __name__ == "__main__":
    submit_indexnow()
