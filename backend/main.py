from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
print("OPENAI_API_KEY loaded:", bool(os.getenv("OPENAI_API_KEY")))
print("OPENAI_BASE_URL:", os.getenv("OPENAI_BASE_URL"))

from fastapi import FastAPI
from backend.schemas.input import IdeaInput
from backend.schemas.generate_input import GenerateInput
from backend.agents.idea_analyzer import idea_analyzer_agent
from backend.agents.requirement_generator import requirement_generator_agent
from backend.utils.logger import logger

app = FastAPI(title="AI Requirement Analyst")

# -------------------------
# Health Check
# -------------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# -------------------------
# Step 1: Analyze Idea
# -------------------------
@app.post("/analyze")
async def analyze_idea(data: IdeaInput):
    logger.info("Received idea for analysis")
    logger.info(f"Idea text: {data.idea}")

    result = await idea_analyzer_agent.run(data.idea)

    logger.info("Idea analysis completed successfully")
    return result.output

# -------------------------
# Step 2: Generate Requirements
# -------------------------
@app.post("/generate")
async def generate_requirements(data: GenerateInput):
    logger.info("Generating requirement specification")

    combined_context = (
        f"Product Idea:\n{data.idea}\n\n"
        f"Clarification Answers:\n{data.answers}"
    )

    result = await requirement_generator_agent.run(combined_context)

    logger.info("Requirement generation completed successfully")
    return result.output
