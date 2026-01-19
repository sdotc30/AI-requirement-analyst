from pydantic_ai import Agent
from backend.utils.openrouter import model

idea_analyzer_agent = Agent(
    model=model,
    system_prompt=(
        "You are a senior product analyst.\n"
        "Given a rough product idea, generate 3 to 5 clear clarification questions.\n"
        "Return the questions as a numbered list."
    ),
    retries=2,
)
