# backend/app/database/qdrant/__init__.py

import os

from langchain_core.documents import Document
from langchain_google_vertexai import VertexAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams

from app.config import settings
from app.utils.logger import CustomLogger

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS


class QdrantDatabase:
    def __init__(self):
        try:
            if settings.PYTHON_ENV.lower() == "prod":
                CustomLogger.create_log("info", "Connecting to Qdrant Cloud (PROD)")
                self.client = QdrantClient(
                    url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY
                )
            else:
                CustomLogger.create_log("info", "Connecting to Qdrant Local (DEV)")
                self.client = QdrantClient(url="http://localhost:6333")

            self.client.get_collections()
            CustomLogger.create_log("info", "Successfully connected to Qdrant")

            # If you change the model, you need to change the dimension size
            self.embeddings = VertexAIEmbeddings(model_name="text-embedding-005")

            self._ensure_collection_exists()

            self.vector_store = QdrantVectorStore(
                client=self.client,
                collection_name=settings.QDRANT_COLLECTION_NAME,
                embedding=self.embeddings,
            )
        except Exception as e:
            CustomLogger.create_log("error", f"Failed to connect to Qdrant: {str(e)}")
            raise Exception(f"Failed to connect to Qdrant database: {str(e)}")

    def _ensure_collection_exists(self):
        collections = self.client.get_collections()
        collection_exists = any(
            collection.name == settings.QDRANT_COLLECTION_NAME
            for collection in collections.collections
        )

        if not collection_exists:
            CustomLogger.create_log(
                "info",
                f"Creating collection {settings.QDRANT_COLLECTION_NAME} in Qdrant",
            )
            self.client.create_collection(
                collection_name=settings.QDRANT_COLLECTION_NAME,
                # Dimension size is 768 since text-embedding-005 (model that we are using for embeddings) has 768 dimensions
                vectors_config=VectorParams(size=768, distance=Distance.COSINE),
            )
        else:
            CustomLogger.create_log(
                "info",
                f"Collection {settings.QDRANT_COLLECTION_NAME} already exists in Qdrant",
            )

    def _recreate_collection(self):
        try:
            self.client.delete_collection(settings.QDRANT_COLLECTION_NAME)
            CustomLogger.create_log("info", "Deleted existing collection")
        except Exception:
            # Collection might not exist, which is fine
            pass

        CustomLogger.create_log(
            "info",
            f"Creating collection {settings.QDRANT_COLLECTION_NAME} in Qdrant",
        )
        self.client.create_collection(
            collection_name=settings.QDRANT_COLLECTION_NAME,
            # Dimension size is 768 since text-embedding-005 (model that we are using for embeddings) has 768 dimensions
            vectors_config=VectorParams(size=768, distance=Distance.COSINE),
        )

    def add_document(self, text: str):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, add_start_index=True
        )
        texts = text_splitter.split_text(text)
        documents = [
            Document(
                page_content=t,
                metadata={"page_number": i + 1},
            )
            for i, t in enumerate(texts)
        ]
        CustomLogger.create_log("info", f"Adding {len(documents)} documents to Qdrant")
        self.vector_store.add_documents(documents)
        CustomLogger.create_log("info", "Documents added to Qdrant")

    def search(self, query, k=2):
        CustomLogger.create_log("info", f"Searching for {query}")
        results = self.vector_store.similarity_search_with_score(query, k=k)
        processed_results = []

        for doc, score in results:
            doc.metadata["score"] = round(score, 4)
            processed_results.append(doc)

        return processed_results

    def delete_all_documents(self):
        self._recreate_collection()
        self.vector_store = QdrantVectorStore(
            client=self.client,
            collection_name=settings.QDRANT_COLLECTION_NAME,
            embedding=self.embeddings,
        )
