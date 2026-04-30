from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from schemas import AnalyzeRequest, AnalyzeResponse
from article import fetch_article_html, extract_article_text
from keywords import extract_keywords


app = FastAPI(title="3D-Word-Cloud-Pirouz-Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_article(request: AnalyzeRequest) -> AnalyzeResponse:
    article_url = str(request.url)
    html = await fetch_article_html(article_url)
    text = extract_article_text(html)

    if len(text.split()) < 50:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Could not extract enough text from the provided URL.",
        )

    words = extract_keywords(text)
    if not words:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Could not identify meaningful keywords from the extracted text content.",
        )

    return AnalyzeResponse(url=article_url, word_count=len(text.split()), words=words)
