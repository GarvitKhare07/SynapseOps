# Industrial Operations Brain Backend

FastAPI backend for document ingestion, RAG chat, asset intelligence, and dashboard metrics.

## Run

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn backend.main:app --reload
```

MongoDB must be reachable at `MONGODB_URI`. ChromaDB persists locally in `embeddings/`.

## Endpoints

- `POST /upload`
- `GET /documents`
- `POST /chat`
- `GET /assets`
- `GET /assets/{id}`
- `GET /dashboard`
