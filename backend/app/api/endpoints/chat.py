# backend/app/api/endpoints/chat.py

from typing import List, Optional

from fastapi import APIRouter, Response
from fastapi import Request as ServerRequest
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.AIService import AIService
from app.utils.logger import CustomLogger
from app.utils.response import error_response

router = APIRouter()


class ChatRequestBody(BaseModel):
    query: str
    history: Optional[List[dict]] = []


@router.post("/chat")
async def chat(request: ServerRequest, response: Response, body: ChatRequestBody):
    try:
        CustomLogger.create_log("info", f"Received chat request: {body.query}")
        ai_service = AIService()

        async def generate():
            try:
                response_stream = await ai_service.get_response(
                    body.query, body.history
                )
                async for chunk in response_stream:
                    yield f"data: {chunk}\n\n"
            except Exception as e:
                if "not found in the storage" in str(e):
                    yield "data: I apologize, but I don't have any relevant information in my knowledge base to answer your question. Please try asking something else or rephrase your question.\n\n"
                else:
                    CustomLogger.create_log(
                        "error", f"Error in generate function: {str(e)}"
                    )
                    yield f"data: An error occurred while processing your request: {str(e)}\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        CustomLogger.create_log("error", f"Error in chat endpoint: {str(e)}")
        return error_response(message=str(e), code=500, response=response)
