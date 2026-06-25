from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, StringConstraints


class TodoCreate(BaseModel):
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]


class TodoPatch(BaseModel):
    completed: bool


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}
