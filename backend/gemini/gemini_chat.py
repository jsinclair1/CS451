from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)


response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Explain JWT authentication in simple terms."
)

print(response.text)