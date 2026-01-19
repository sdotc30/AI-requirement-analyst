from pydantic import BaseModel
from typing import List

class ClarificationQuestions(BaseModel):
    questions: List[str]


class RequirementSpec(BaseModel):
    problem_statement: str
    user_roles: List[str]
    functional_requirements: List[str]
    non_functional_requirements: List[str]
    assumptions: List[str]
    risks: List[str]
