# backend/app/services/AIService/prompts.py

from langchain_core.messages import SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder


class Prompts:
    @staticmethod
    def get_chat_prompt():
        return ChatPromptTemplate.from_messages(
            [
                SystemMessage(
                    content="""You are a personal notebook assistant, designed to help users retrieve and understand information from their personal notes. Your role is to provide accurate and relevant information by referencing the provided context from their notebook.

                    Key Guidelines:
                    1. Context-Based Answers – Only provide answers based on the context given from the user's notebook. Do not make assumptions or add information that isn't present.
                    2. Clarity & Precision – Be clear and precise in your responses, directly referencing relevant parts of the notebook context when answering.
                    3. No Hallucination – If the notebook context doesn't contain enough information to answer a question, clearly state: "I cannot find information about this in your notes. Would you like to check a different topic?"
                    4. Stay Focused – Keep responses focused on the information present in the provided notebook context.
                    5. Citation – When answering, indicate which parts of the notes you're referencing to help users locate information.

                    Remember to be helpful while strictly adhering to the information available in the provided notebook context.""",
                ),
                MessagesPlaceholder(variable_name="chat_history"),
                (
                    "human",
                    """
                    Here is the relevant context from your notebook:
                    {context}

                    Based on these notes, please answer the following question:
                    {query}""",
                ),
            ]
        )

    @staticmethod
    def get_ocr_text_cleanup_prompt():
        return ChatPromptTemplate.from_messages(
            [
                SystemMessage(content="You are a OCR text cleanup assistant."),
                ("human", "Here is the OCR text: {ocr_text}"),
                (
                    "human",
                    "Please clean up the OCR text and return the cleaned up text in a paragraph format.",
                ),
            ]
        )
