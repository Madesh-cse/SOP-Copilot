from sentence_transformers import SentenceTransformer #type: ignore

class EmbeddingService:

    def __init__(self, model_name):
        self.model = SentenceTransformer(model_name)

    def generate_embeddings(self, texts):

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            convert_to_numpy=True
        )

        return embeddings.astype("float32")