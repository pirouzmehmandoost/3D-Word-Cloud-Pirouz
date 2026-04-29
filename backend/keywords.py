from sklearn.feature_extraction.text import TfidfVectorizer

from schemas import WordWeight


def extract_keywords(text: str, limit: int = 40) -> list[WordWeight]:
    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=limit,
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z-]{2,}\b",
    )

    matrix = vectorizer.fit_transform([text])
    scores = matrix.toarray()[0]
    terms = vectorizer.get_feature_names_out()

    weighted_terms = sorted(
        zip(terms, scores, strict=True),
        key=lambda item: item[1],
        reverse=True,
    )

    # Normalize scores so the frontend can map weights directly to visual scale.
    max_score = weighted_terms[0][1] if weighted_terms else 0

    if max_score == 0:
        return []

    return [
        WordWeight(word=term, weight=round(float(score / max_score), 4))
        for term, score in weighted_terms
        if score > 0
    ]
