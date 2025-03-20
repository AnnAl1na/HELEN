# HELEN (High-End Learning Environment)

HELEN is an AI-powered RAG based application designed to assist visually impaired students in interacting with educational PDFs. It utilizes a chat interface with accessible features, voice control for interacting with documents, and an AI-driven quiz section for evaluating student responses.

##Frontend (React-based)
  - Provides an interactive interface for users to view and interact with PDF documents.
  - Implements voice recognition and text-to-speech features for accessibility.
  - AI-driven quiz functionality to test knowledge based on the PDF content.

##Backend (Flask-based)
  - API to handle requests related to PDF processing and user interaction.
  - Utilizes **Llama-3.1-8B-Instant** model for AI-based queries and response generation.
  - **Langchain** integrated with **Groq API** to handle model inference.
  - **ChromaDB** for database storage and management of documents and query responses.
