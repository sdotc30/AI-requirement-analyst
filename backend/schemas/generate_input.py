from pydantic import BaseModel
from typing import Dict

class GenerateInput(BaseModel):
    idea: str
    answers: Dict[str, str]
