import faiss #type: ignore
import numpy as np


class VectorRetriever:

    def __init__(self, embedding_service):
        self.embedding_service = embedding_service
        self.index = None
        self.chunks = []

    def build_index(self, chunks):
        self.chunks = chunks
        if not chunks:
            self.index = None
            return
        texts = [chunk["text"] for chunk in chunks]
        embeddings = self.embedding_service.generate_embeddings(texts)
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)
        self.index.add(embeddings)
        
    def search(self, query, top_k=4):
        if self.index is None or self.index.ntotal == 0:
            return []
        query_embedding = self.embedding_service.generate_embeddings(
            [query]
        )
        scores, indices = self.index.search(
            query_embedding,
            min(top_k, self.index.ntotal)
        )
        results = []
        for score, index in zip(scores[0], indices[0]):
            if index < 0:
                continue
            chunk = self.chunks[index]
            results.append({
                "text": chunk["text"],
                "metadata": chunk["metadata"],
                "similarity": float(score)
            })
        return results