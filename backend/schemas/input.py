from pydantic import BaseModel, Field

class IdeaInput(BaseModel):
    idea: str = Field(
        ...,
        description="Raw problem or product idea described by the user"
    )
