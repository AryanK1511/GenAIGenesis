# backend/app/services/AIService/__init__.py

from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import settings
from app.database.qdrant import QdrantDatabase
from app.services.AIService.prompts import Prompts
from app.utils.ai import format_chat_history, format_documents
from app.utils.logger import CustomLogger


class AIService:
    def __init__(self):
        self.qdrant_db = QdrantDatabase()
        self.google_model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash", streaming=True, api_key=settings.GOOGLE_API_KEY
        )
        self.google_model_no_stream = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash", api_key=settings.GOOGLE_API_KEY
        )

    def get_documents(self, query):
        return self.qdrant_db.search(query)

    async def cleanup_ocr_text(self, ocr_text: str) -> str:
        prompt_template = Prompts.get_ocr_text_cleanup_prompt()
        formatted_prompt = prompt_template.format(ocr_text=ocr_text)
        messages = [HumanMessage(content=formatted_prompt)]
        response = await self.google_model_no_stream.ainvoke(messages)
        return response.content

    async def generate_response(self, query, history, documents):
        formatted_history = format_chat_history(history)
        formatted_docs = format_documents(documents)

        prompt_template = Prompts.get_chat_prompt()
        formatted_prompt = prompt_template.format(
            chat_history=formatted_history, context=formatted_docs, query=query
        )

        messages = [HumanMessage(content=formatted_prompt)]

        async for chunk in self.google_model.astream(messages):
            yield chunk.content

    async def get_response(self, query, history):
        documents = self.get_documents(query)
        CustomLogger.create_log("info", f"Retrieved {len(documents)} documents")
        return self.generate_response(query, history, documents)
