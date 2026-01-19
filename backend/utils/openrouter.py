import os
from pydantic_ai.models.openai import OpenAIChatModel

# Ensure OpenRouter base URL
os.environ.setdefault("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")

# Ensure API key exists
api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY")
if not api_key:
    raise RuntimeError("No OpenRouter / OpenAI API key found")

os.environ["OPENAI_API_KEY"] = api_key

# Use any free / cheap model from OpenRouter
model = OpenAIChatModel(
    "mistralai/mistral-7b-instruct"
)
