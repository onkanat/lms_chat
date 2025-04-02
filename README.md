# LM Studio Chat Interface

A lightweight, browser-based interface for interacting with [LM Studio](https://lmstudio.ai/)'s local API server. This application allows you to chat with any model loaded in LM Studio without requiring additional dependencies or complex setup.

## Features

### Core Functionality
- Connect to any LM Studio server by URL (local or remote)
- Automatic model detection and selection
- Clean, intuitive chat interface
- Full chat history support for contextual conversations
- Model-specific templates with optimal prompting formats:
  - Auto-detection of model families (Llama, Mistral, Claude, etc.)
  - Appropriate system prompts for each model
  - Special tokens and formatting for each model type
  - Stop token configuration
- Advanced model parameter controls:
  - Temperature adjustment
  - Top P (nucleus sampling)
  - Frequency and presence penalties
  - Max tokens limit
  - Custom system prompts
- Parameter presets that can be saved and loaded

### Retrieval-Augmented Generation (RAG)
- Upload and manage document knowledge base
- Automatic document chunking and indexing
- Context-aware retrieval based on user queries
- Source attribution for AI responses
- Toggle RAG on/off as needed

### Content Rendering
- Full Markdown support for rich text formatting
- Automatic JSON detection and pretty formatting
- Syntax highlighting for multiple programming languages
- LaTeX math rendering for equations and formulas
- Code block formatting with language detection
- Copy-to-clipboard functionality for any message

### User Experience
- Responsive design that works on desktop and mobile
- Dark mode support
- Message timestamps and token usage statistics
- Save entire chat history as JSON for later reference
- Clear chat functionality with a single click
- Popup text editor for composing complex messages

## Getting Started

### Prerequisites

- [LM Studio](https://lmstudio.ai/) installed and running with local server enabled
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional libraries or installations required

### Installation

1. Clone this repository or download the ZIP file
   ```bash
   git clone https://github.com/onkanat/lms_chat.git
   ```
2. No build process is required - the application is ready to use

### Usage

1. Start LM Studio and load your preferred model
2. In LM Studio, go to the "Local Server" tab and click "Start Server"
3. Open `index.html` in your web browser
4. Enter the LM Studio server address (typically `http://localhost:1234`)
5. Click "Connect" to establish a connection
6. Select a model from the dropdown menu
7. (Optional) Click "Parameters" to adjust model settings:
   - Select an appropriate template for your model type
   - Adjust temperature for more/less randomness
   - Set Top P for nucleus sampling
   - Configure frequency and presence penalties to reduce repetition
   - Set max tokens or leave as -1 for unlimited
   - Customize the system prompt
8. Start chatting! The interface will automatically format messages according to your model's requirements

### Using RAG (Retrieval-Augmented Generation)

1. Toggle the RAG switch in the top menu to enable RAG functionality
2. Upload text documents (.txt, .md) to your knowledge base
   - Click "Upload Document" and select files from your computer
   - Documents are stored locally in your browser's localStorage
3. Ask questions related to your documents
4. The system will automatically:
   - Analyze your question
   - Retrieve relevant information from your documents
   - Include this context in the prompt sent to the AI
   - Generate a more informed response
5. View source documents by clicking "Show sources" in the response
6. Toggle RAG off when you want standard responses without document context

> **Note:** The RAG implementation uses a simple keyword-based retrieval system. For production use, consider implementing a more sophisticated embedding-based retrieval system.

## Keyboard Shortcuts

- `Enter` - Send a message
- `Shift+Enter` - Add a new line without sending
- `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux) - Open popup text editor
- `Esc` - Close popup dialogs

## Project Structure

```
lms_chat/
├── project/                  # Main application directory
│   ├── index.html            # Main chat interface
│   ├── styles.css            # Core application styling
│   ├── app.js                # Core application logic
│   ├── p_editor.html         # Popup text editor
│   ├── chat/                 # Additional chat components
│   └── rag/                  # RAG functionality
│       ├── rag.js            # Core RAG implementation
│       ├── rag-ui.js         # RAG user interface components
│       └── rag-styles.css    # RAG-specific styling
└── lms.html                  # Legacy interface
```

### Key Files

- `index.html` - Main entry point and HTML structure
- `styles.css` - Global styling for the application
- `app.js` - Core chat functionality and API integration
- `p_editor.html` - Popup text editor for complex message composition
- `rag/rag.js` - Document processing, storage, and retrieval logic
- `rag/rag-ui.js` - UI components for document management
- `rag/rag-styles.css` - Styling for RAG interface elements

## Development

### Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Dependencies**: 
  - [Marked.js](https://marked.js.org/) for Markdown rendering
  - [MathJax](https://www.mathjax.org/) for LaTeX math rendering
  - [Prism.js](https://prismjs.com/) for syntax highlighting
- **Storage**: Browser's localStorage for document persistence
- **API**: Compatible with OpenAI Chat Completions API format

### Development Workflow

1. This is a vanilla JavaScript project with no build steps required
2. Make changes to the source files
3. Refresh your browser to see changes
4. Test with LM Studio's local server

### Extending the Application

- **Adding Models**: The application automatically detects models from the LM Studio server
- **Custom Styling**: Modify `styles.css` to change the appearance
- **New Features**: Add new functionality by extending `app.js`
- **Enhancing RAG**: Improve the retrieval system in `rag.js` for better context matching

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgements

- [LM Studio](https://lmstudio.ai/) for providing the local API server
- All contributors who have helped improve this project