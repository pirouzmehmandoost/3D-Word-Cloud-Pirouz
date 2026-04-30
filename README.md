# 3D Word Cloud Pirouz

An interactive full-stack app that analyzes a news article URL and renders the
most relevant extracted words as a 3D word cloud.

The frontend is built with Next.js, TypeScript, React Three Fiber, Drei, Three.js,
and Tailwind CSS. The backend is built with FastAPI and uses TF-IDF keyword
extraction with scikit-learn.

## Features

- URL input for analyzing a news article.
- Sample article links for quick testing.
- FastAPI `POST /analyze` endpoint that fetches article text and returns weighted keywords.
- 3D word cloud with weight-based size, color, position, rotation, and per-word y-position animation.
- Loading and error states for the article analysis flow.

## Frontend

The frontend keeps the form UI separate from the full-screen React Three Fiber
canvas. Submitting a URL sends it to the FastAPI backend, stores the returned
keywords in React state, and passes those words into the R3F scene.

The word cloud renders each keyword as a Drei `Text` mesh inside a rotating
`WordCloud` group. Word weights affect font size, color, and 3D placement. The
positions are calculated with a Fibonacci-sphere distribution so words occupy
the x, y, and z axes instead of a flat plane.

Each word also receives a small y-position animation. The animation uses a
stable per-word seed so labels do not move in sync, and the text orientation is
kept readable while the parent group rotates.

## Requirements

- macOS
- Node.js and npm
- Python 3.13+
- uv

## Run With Setup Script

From the project root:

```bash
bash setup.sh
```

The script installs frontend dependencies, installs backend dependencies with
`uv`, then starts both development servers:

- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`

## Manual Run

Install and start the frontend:

```bash
npm install
npm run dev
```

Install and start the backend from a second terminal:

```bash
cd backend
uv sync
uv run fastapi dev main.py --host 127.0.0.1 --port 8000
```

## Backend API

`POST /analyze`

Request:

```json
{
  "url": "https://www.example.com/news/article"
}
```

Response:

```json
{
  "url": "https://www.example.com/news/article",
  "word_count": 1200,
  "words": [
    { "word": "example", "weight": 1 },
    { "word": "topic", "weight": 0.72 }
  ]
}
```

## Notes

The crawler is intentionally basic. It removes common non-content elements,
extracts text from article-like HTML nodes, and returns an error when it cannot
find enough meaningful text.

The backend normalizes TF-IDF scores to a `0-1` range so the frontend can map
word relevance to visual properties such as size, color, and 3D position.

Some sites block automated requests or require authentication. Use publicly accessible HTML pages for testing. 
