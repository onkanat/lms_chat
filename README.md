# LM Studio Chat Interface

A lightweight web interface for interacting with LM Studio's local API server.

## Features

- Connect to any LM Studio server by URL
- Select from available models
- Chat with AI models through a clean interface
- Retrieval-Augmented Generation (RAG) support
- Document knowledge base management
- Markdown rendering for responses
- Code syntax highlighting
- LaTeX math rendering
- Copy message content with a single click
- Save chat history as JSON

## Getting Started

### Prerequisites

- [LM Studio](https://lmstudio.ai/) installed and running with local server enabled
- A modern web browser

### Usage

1. Open `index.html` in your web browser
2. Enter the LM Studio server address (typically `http://localhost:1234`)
3. Click "Connect" to establish a connection
4. Select a model from the dropdown menu
5. Start chatting!

### Using RAG (Retrieval-Augmented Generation)

1. Toggle the RAG switch in the top menu to enable RAG functionality
2. Upload text documents (.txt, .md) to your knowledge base
3. Ask questions related to your documents
4. The system will automatically retrieve relevant information and augment the AI's responses
5. View source documents by clicking "Show sources" in the response

## Keyboard Shortcuts

- Press `Enter` to send a message
- Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux) to open a popup text editor

## Project Structure

- `index.html` - Main chat interface
- `styles.css` - Styling for the application
- `app.js` - Core application logic
- `p_editor.html` - Popup text editor
- `chat/` - Additional chat-related components
- `rag/` - Retrieval-Augmented Generation components
  - `rag.js` - Core RAG functionality
  - `rag-ui.js` - RAG user interface components
  - `rag-styles.css` - Styling for RAG components

## Development

This is a vanilla JavaScript project with no build steps required. Simply edit the files and refresh your browser to see changes.

## License

This project is open source and available for personal and commercial use.