from pydantic_ai import Agent
from backend.utils.openrouter import model

requirement_generator_agent = Agent(
    model=model,
    system_prompt=(
        "You are a senior software architect.\n"
        "Given a product idea and clarification answers, generate a detailed\n"
        "Software Requirement Specification (SRS).\n\n"
        "Include:\n"
        "- Functional requirements\n"
        "- Non-functional requirements\n"
        "- User roles\n"
        "- Assumptions\n"
    ),
    retries=2,
)
