import os
from google import genai
from google.genai import types

MODEL = 'gemini-2.5-flash'
_client = None


def get_client():
    global _client
    if _client is None:
        api_key = os.getenv('GEMINI_API_KEY', '')
        if not api_key or api_key == 'your-actual-gemini-api-key':
            print("WARNING: GEMINI_API_KEY is not set. Using mock responses.")
            return None
        _client = genai.Client(api_key=api_key)
    return _client


def call_gemini(prompt: str, system: str = '', max_tokens: int = 1024) -> str:
    client = get_client()
    if not client:
        if "Evaluate this answer" in prompt:
            return "Score: 5\nStrengths: Mock strength (API key missing).\nImprovements: Mock improvement.\nModel Answer: Mock model answer."
        return "[MOCK AI] Please add your GEMINI_API_KEY to backend/.env to see real responses. This is a mock response."

    contents = f"{system}\n\n{prompt}" if system else prompt
    response = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(max_output_tokens=max_tokens),
    )
    return response.text


def call_gemini_stream(prompt: str, system: str = ''):
    client = get_client()
    if not client:
        yield "[MOCK AI] Please add your GEMINI_API_KEY to backend/.env to see real responses."
        return

    contents = f"{system}\n\n{prompt}" if system else prompt
    for chunk in client.models.generate_content_stream(
        model=MODEL,
        contents=contents,
    ):
        if chunk.text:
            yield chunk.text
