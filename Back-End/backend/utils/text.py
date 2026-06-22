import re


def safe_filename(filename: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", filename.strip())
    return cleaned or "document"


def compact_snippet(text: str, limit: int = 420) -> str:
    snippet = " ".join(text.split())
    if len(snippet) <= limit:
        return snippet
    return f"{snippet[: limit - 3].rstrip()}..."
