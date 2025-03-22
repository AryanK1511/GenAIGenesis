# backend/app/utils/ai.py

from langchain_core.messages import AIMessage, HumanMessage


def format_chat_history(history):
    formatted_history = []

    for chat_message in history:
        if chat_message["role"] == "user":
            formatted_history.append(HumanMessage(content=chat_message["content"]))
        elif chat_message["role"] == "bot":
            formatted_history.append(AIMessage(content=chat_message["content"]))

    return formatted_history


def format_documents(documents):
    formatted_docs = "\n".join([doc.page_content for doc in documents])
    return formatted_docs
