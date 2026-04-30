import httpx
from bs4 import BeautifulSoup
from fastapi import HTTPException, status


async def fetch_article_html(url: str) -> str:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/121.0 Safari/537.36"
        )
    }

    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            headers=headers,
            timeout=10,
        ) as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == status.HTTP_404_NOT_FOUND:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="URL was not found.",
            ) from exc

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Request failed with status {exc.response.status_code}.",
        ) from exc
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Timed out while fetching URL.",
        ) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch URL.",
        ) from exc

    content_type = response.headers.get("content-type", "")
    if "text/html" not in content_type:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Provided URL did not return HTML content.",
        )

    return response.text


def extract_article_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")

    for element in soup.find_all(
        ["script", "style", "noscript", "svg", "nav", "footer"]
    ):
        element.decompose()

    article = soup.find("article") or soup.find("main") or soup.body or soup
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    paragraphs = [
        paragraph.get_text(" ", strip=True)
        for paragraph in article.find_all(["h1", "h2", "h3", "p", "li", "blockquote"])
    ]

    return " ".join(part for part in [title, *paragraphs] if part)
