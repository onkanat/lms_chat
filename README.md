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
- Conversation management system:
  - Save and name conversations for later reference
  - Organize conversations into folders
  - Easily switch between different conversations
  - Automatic tracking of unsaved changes
- Theme customization:
  - Multiple preset themes (Light, Dark, High Contrast, Solarized, Nord, Dracula)
  - Custom color selection for all UI elements
  - Font family and size options
  - Compact and comfortable layout options
- Mobile-optimized interface:
  - Responsive design that works on all screen sizes
  - Touch-friendly controls with larger tap targets
  - Optimized layouts for small screens
  - Smooth scrolling and animations
- Streaming responses that appear in real-time as they're generated
- Message timestamps and token usage statistics
- Export chat history as JSON
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
   - Enable/disable streaming responses for real-time generation
   - Adjust temperature for more/less randomness
   - Set Top P for nucleus sampling
   - Configure frequency and presence penalties to reduce repetition
   - Set max tokens or leave as -1 for unlimited
   - Customize the system prompt
8. Start chatting! The interface will automatically format messages according to your model's requirements and display responses in real-time if streaming is enabled
9. Use the conversation manager (📚 button) to save, organize, and switch between conversations
10. Customize the interface appearance with the theme manager (🎨 button):
    - Choose from preset themes
    - Customize colors, fonts, and layout density
    - Changes are automatically saved to your browser

### Managing Conversations

1. Click the conversation manager button (📚) in the top menu to open the conversation panel
2. Save the current conversation:
   - Click "💾 Save" and enter a title for your conversation
   - The conversation will be saved to your browser's localStorage
3. Create a new conversation:
   - Click "+ New Chat" to start a fresh conversation
   - You'll be prompted to save any unsaved changes
4. Organize conversations:
   - Click "📁 New Folder" to create a folder for organizing conversations
   - Drag conversations into folders to organize them
   - Rename folders by clicking the edit button (✏️)
5. Load a previous conversation:
   - Click on any saved conversation to load it
   - The current conversation title is displayed above the chat
   - An asterisk (*) indicates unsaved changes
6. Delete conversations or folders:
   - Click the delete button (🗑️) next to any conversation or folder

### Customizing Themes

1. Click the theme manager button (🎨) in the top menu to open the theme panel
2. Choose a preset theme:
   - Click on any of the preset theme options (Dark, Light, High Contrast, etc.)
   - The theme will be applied immediately
3. Customize colors:
   - Use the color pickers to adjust individual UI elements
   - Changes are applied in real-time
4. Adjust fonts and layout:
   - Select a font family from the dropdown menu
   - Choose a font size that works best for you
   - Switch between comfortable and compact layouts
5. Save your customizations:
   - All changes are automatically saved to your browser's localStorage
   - You can also save your current settings as a custom theme
6. Reset to defaults:
   - Click "Reset to Default" to revert to the original dark theme

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
│   ├── model-templates.js    # Model-specific templates
│   ├── p_editor.html         # Popup text editor
│   ├── chat/                 # Additional chat components
│   ├── rag/                  # RAG functionality
│   │   ├── rag.js            # Core RAG implementation
│   │   ├── rag-ui.js         # RAG user interface components
│   │   └── rag-styles.css    # RAG-specific styling
│   ├── conversations/        # Conversation management
│   │   ├── conversation-manager.js    # Conversation logic
│   │   ├── conversation-ui.js         # Conversation UI components
│   │   └── conversation-styles.css    # Conversation styling
│   └── themes/               # Theme customization
│       ├── theme-manager.js  # Theme management logic
│       ├── theme-ui.js       # Theme UI components
│       └── theme-styles.css  # Theme-specific styling
└── lms.html                  # Legacy interface
```

### Key Files

- `index.html` - Main entry point and HTML structure
- `styles.css` - Global styling for the application
- `app.js` - Core chat functionality and API integration
- `model-templates.js` - Templates for different LLM models
- `p_editor.html` - Popup text editor for complex message composition
- `rag/rag.js` - Document processing, storage, and retrieval logic
- `rag/rag-ui.js` - UI components for document management
- `rag/rag-styles.css` - Styling for RAG interface elements
- `conversations/conversation-manager.js` - Conversation saving and loading logic
- `conversations/conversation-ui.js` - UI for conversation management
- `conversations/conversation-styles.css` - Styling for conversation components
- `themes/theme-manager.js` - Theme management and customization logic
- `themes/theme-ui.js` - UI for theme customization
- `themes/theme-styles.css` - Styling for themes and responsive design

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