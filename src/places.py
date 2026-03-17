import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

if not API_KEY:
    raise RuntimeError("GOOGLE_MAPS_API_KEY is not set")

TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"


def search_places(query: str):
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        # Request only what you need
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location"
    }

    body = {
        "textQuery": query
    }

    response = requests.post(TEXT_SEARCH_URL, headers=headers, json=body, timeout=20)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    data = search_places("coffee shops in Kansas City")
    print(data)