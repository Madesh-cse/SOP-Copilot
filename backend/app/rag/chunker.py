def chunk_documents(documents, chunk_size=500, chunk_overlap=120):
    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive")
    
    if chunk_overlap < 0 or chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be non-negative and less than chunk_size")
    chunks = []
    for document in documents:
        text = document["text"]
        metadata = document["metadata"]
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end].strip()
            if chunk_text:
                chunks.append({
                    "text": chunk_text,
                    "metadata": metadata
                })
            start = start +  chunk_size - chunk_overlap
    return chunks