from typing import Annotated
from pydantic import BaseModel, Field, HttpUrl


class AnalyzeRequest(BaseModel):
    url: HttpUrl


class WordWeight(BaseModel):
    word: str
    weight: Annotated[float, Field(ge=0, le=1)]


class AnalyzeResponse(BaseModel):
    url: str
    word_count: int
    words: list[WordWeight]
