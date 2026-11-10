import os

from pathlib import Path
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.rag.pdf_loader import load_pdf_documents
from app.rag.chunker import chunk_documents
from app.rag.embeddings import EmbeddingService
from app.rag.retriever import VectorRetriever
from app.rag.generator import AnswerGenerator, ABSTENTION_MESSAGE


load_dotenv(override=True)

DATA_DIR = os.getenv("DATA_DIR", "data")

TOP_K = int(os.getenv("TOP_K", 4))
MIN_SIMILARITY = float(os.getenv("MIN_SIMILARITY", 0.30))

EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2"
)

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 700))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 120))

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


app = FastAPI(
    title="Manufacturing SOP Copilot API",
    description="RAG-based assistant for manufacturing documents",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.29.128:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedding_service = EmbeddingService(EMBEDDING_MODEL)

retriever = VectorRetriever(embedding_service)

answer_generator = None

if OPENAI_API_KEY:
    answer_generator = AnswerGenerator(
        OPENAI_API_KEY,
        OPENAI_MODEL
    )


class ChatRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)


class SourceResponse(BaseModel):
    document: str
    page: int
    similarity: float
    excerpt: str


class ChatResponse(BaseModel):
    question: str
    answer: str
    sources: list[SourceResponse]
    abstained: bool


def ingest_documents():

    Path(DATA_DIR).mkdir(parents=True, exist_ok=True)

    documents = load_pdf_documents(DATA_DIR)

    chunks = chunk_documents(
        documents,
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )

    retriever.build_index(chunks)

    return {
        "documents": len(set(
            item["metadata"]["source"] for item in documents
        )),
        "pages": len(documents),
        "chunks": len(chunks)
    }


@app.on_event("startup")
def startup_event():
    ingest_documents()


@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "service": "manufacturing-sop-copilot",
        "indexed_chunks": len(retriever.chunks),
        "llm_configured": answer_generator is not None
    }


@app.post("/api/ingest")
def ingest_endpoint():

    try:
        result = ingest_documents()

        return {
            "message": "Documents indexed successfully",
            **result
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Document ingestion failed: {str(error)}"
        )


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    if not retriever.chunks:
        raise HTTPException(
            status_code=503,
            detail="No documents have been indexed."
        )

    if answer_generator is None:
        raise HTTPException(
            status_code=503,
            detail="LLM API key is not configured."
        )

    retrieved_chunks = retriever.search(
        request.question,
        top_k=TOP_K
    )

    relevant_chunks = [
        item for item in retrieved_chunks
        if item["similarity"] >= MIN_SIMILARITY
    ]

    if not relevant_chunks:

        return ChatResponse(
            question=request.question,
            answer=ABSTENTION_MESSAGE,
            sources=[],
            abstained=True
        )

    answer = answer_generator.generate_answer(
        request.question,
        relevant_chunks
    )

    abstained = ABSTENTION_MESSAGE.lower() in answer.lower()

    sources = []

    if not abstained:
        seen = set()

        for item in relevant_chunks:

            metadata = item["metadata"]
            key = (metadata["source"], metadata["page"])

            if key in seen:
                continue

            seen.add(key)

            sources.append(
                SourceResponse(
                    document=metadata["source"],
                    page=metadata["page"],
                    similarity=round(item["similarity"], 4),
                    excerpt=item["text"][:300]
                )
            )

    return ChatResponse(
        question=request.question,
        answer=answer,
        sources=sources,
        abstained=abstained
    )