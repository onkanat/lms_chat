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
- Agent system with toolcalls:
  - Web search for finding information online
  - Web browsing for accessing specific websites
  - Web scraping for extracting structured data
  - arXiv integration for academic paper search and download
  - Engineering calculator for mathematical computations
  - Simple syntax for invoking tools in messages
- Prompt library:
  - Categorized prompt templates for different use cases
  - Custom prompt creation and management
  - Variable placeholders for flexible prompts
  - Import/export functionality for sharing prompts
- Enhanced RAG (Retrieval-Augmented Generation):
  - Client-side vector embeddings using TensorFlow.js
  - Multiple chunking strategies (fixed, paragraph, semantic)
  - Support for PDF and DOCX documents
  - Hybrid retrieval (keyword + semantic)
  - Customizable retrieval parameters
- Theme customization:
  - Multiple preset themes (Light, Dark, High Contrast, Solarized, Nord, Dracula)
  - Custom color selection for all UI elements
  - Font family and size options
  - Compact and comfortable layout options
- Accessibility features:
  - Keyboard navigation with shortcuts
  - Screen reader compatibility
  - High contrast mode
  - Large text option
  - Reduced motion setting
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

### Using the Prompt Library

1. Click the prompt library button (📋) next to the send button
2. Browse through categorized prompt templates:
   - Writing: Essay outlines, blog posts, creative writing
   - Programming: Code generation, debugging, algorithm explanations
   - Education: Concept explanations, lesson plans, quiz generation
   - Business: Professional emails, business plans, SWOT analysis
   - Research: Literature reviews, methodology design, data analysis
3. Click on any prompt to expand it and view details
4. Fill in any variable fields to customize the prompt
5. Click "Use Prompt" to insert it into the chat input
6. Create your own custom prompts:
   - Click "+ Add Custom Prompt" in the Custom category
   - Enter a name, description, and prompt text
   - Use {variable_name} syntax for customizable parts
   - Add variables with descriptions and default values
7. Import/export custom prompts to share with others

### Using Enhanced RAG (Retrieval-Augmented Generation)

1. Toggle the RAG switch in the top menu to enable RAG functionality
   - Choose between standard RAG or enhanced RAG
   - Click the 📚 button to open the RAG panel
2. Upload documents to your knowledge base
   - Supports PDF, DOCX, TXT, and MD files
   - Drag and drop files or use the upload button
   - Documents are processed and stored locally in your browser
3. Configure RAG settings:
   - Choose chunking strategy (fixed, paragraph, semantic)
   - Adjust chunk size and overlap
   - Select retrieval method (keyword, semantic, hybrid)
   - Set similarity threshold and number of chunks to retrieve
4. Ask questions related to your documents
5. The system will automatically:
   - Analyze your question
   - Generate embeddings using TensorFlow.js
   - Retrieve the most relevant chunks from your documents
   - Include this context in the prompt sent to the AI
   - Generate a more informed response
6. View source documents by clicking "Show sources" in the response
7. Toggle RAG off when you want standard responses without document context

> **Note:** All processing happens locally in your browser - no data is sent to external servers for embedding or retrieval.

### Using the Agent System

1. Click the agent toggle (🤖) in the top menu to enable the agent system
2. Open the agent panel to view available tools and usage instructions
3. Use tools in your messages with the following syntax:
   ```
   {{tool_name(param1="value1", param2="value2")}}
   ```
4. Available tools:
   - Web Search: `{{search(query="your search query")}}`
   - Web Browsing: `{{browse(url="https://example.com")}}`
   - Web Scraping: `{{scrape(url="https://example.com", selector=".main-content")}}`
   - arXiv Search: `{{arxivSearch(query="machine learning", max_results="3")}}`
   - arXiv Download: `{{arxivDownload(paper_id="2303.08774")}}`
   - Calculator: `{{calculate(expression="5 * sin(45 deg) + sqrt(16)")}}`
5. The agent will process your tool calls and include the results in your message
6. The AI will then respond based on the augmented message with tool results
7. You can combine multiple tool calls in a single message

Example:
```
I'm researching the latest developments in transformer models.

{{search(query="recent transformer model developments")}}

Can you also find a specific paper on this topic?

{{arxivSearch(query="transformer neural networks", max_results="1")}}
```

### Accessibility Features

1. Click the accessibility button (♿) in the top menu to open accessibility settings
2. Configure accessibility options:
   - High Contrast Mode: Increases contrast for better visibility
   - Large Text: Increases text size throughout the application
   - Reduced Motion: Reduces or eliminates animations and transitions
   - Keyboard Navigation: Enables keyboard shortcuts and focus indicators
   - Screen Reader Optimizations: Enhances compatibility with screen readers
3. Use keyboard shortcuts for efficient navigation:
   - Alt+A: Open accessibility settings
   - Alt+P: Open prompt library
   - Alt+T: Open theme settings
   - Alt+C: Open conversation manager
   - Alt+R: Open RAG panel
   - Alt+E: Open enhanced RAG panel
   - Alt+S: Focus send button
   - Alt+I: Focus input field
   - Alt+M: Focus model selector
   - Escape: Close open panels
   - Enter: Send message (when input is focused)
4. All settings are saved automatically and persist between sessions

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
│   ├── agents/               # Agent system with toolcalls
│   │   ├── agent-manager.js           # Agent system core
│   │   ├── web-search-agent.js        # Web search functionality
│   │   ├── web-browse-agent.js        # Web browsing functionality
│   │   ├── web-scrape-agent.js        # Web scraping functionality
│   │   ├── arxiv-search-agent.js      # arXiv search functionality
│   │   ├── arxiv-download-agent.js    # arXiv paper download
│   │   ├── calculator-agent.js        # Engineering calculator
│   │   ├── agent-ui.js                # Agent UI components
│   │   └── agent-styles.css           # Agent styling
│   ├── rag/                  # Basic RAG functionality
│   │   ├── rag.js            # Core RAG implementation
│   │   ├── rag-ui.js         # RAG user interface components
│   │   └── rag-styles.css    # RAG-specific styling
│   ├── rag-enhanced/         # Enhanced RAG functionality
│   │   ├── rag-enhanced-core.js      # Advanced RAG implementation
│   │   ├── rag-enhanced-ui.js        # Enhanced RAG UI components
│   │   └── rag-enhanced-styles.css   # Enhanced RAG styling
│   ├── conversations/        # Conversation management
│   │   ├── conversation-manager.js    # Conversation logic
│   │   ├── conversation-ui.js         # Conversation UI components
│   │   └── conversation-styles.css    # Conversation styling
│   ├── prompts/              # Prompt library
│   │   ├── prompt-library.js          # Prompt management logic
│   │   ├── prompt-ui.js               # Prompt UI components
│   │   └── prompt-styles.css          # Prompt styling
│   ├── accessibility/        # Accessibility features
│   │   ├── accessibility.js           # Accessibility logic
│   │   └── accessibility-styles.css   # Accessibility styling
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
- `rag/rag.js` - Basic document processing and retrieval logic
- `rag/rag-ui.js` - Basic RAG UI components
- `rag/rag-styles.css` - Styling for basic RAG interface
- `rag-enhanced/rag-enhanced-core.js` - Advanced RAG with vector embeddings
- `rag-enhanced/rag-enhanced-ui.js` - Enhanced RAG UI with document management
- `rag-enhanced/rag-enhanced-styles.css` - Styling for enhanced RAG interface
- `prompts/prompt-library.js` - Prompt template management and processing
- `prompts/prompt-ui.js` - Prompt library UI components
- `prompts/prompt-styles.css` - Styling for prompt library
- `agents/agent-manager.js` - Core agent system for handling toolcalls
- `agents/web-search-agent.js` - Web search functionality
- `agents/web-browse-agent.js` - Web browsing functionality
- `agents/web-scrape-agent.js` - Web scraping functionality
- `agents/arxiv-search-agent.js` - arXiv search functionality
- `agents/arxiv-download-agent.js` - arXiv paper download functionality
- `agents/calculator-agent.js` - Engineering calculator functionality
- `agents/agent-ui.js` - Agent UI components
- `agents/agent-styles.css` - Styling for agent system
- `accessibility/accessibility.js` - Accessibility features and keyboard navigation
- `accessibility/accessibility-styles.css` - Accessibility-related styling
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

This project is licensed under the "USE IT, FIX IT, ADD TO IT" License - see the [LICENSE](LICENSE) file for details.

In short:
- USE IT IF IT WORKS: Use it for any purpose without restriction
- FIX IT IF IT'S BROKEN: Feel free to fix any issues you encounter
- ADD IT IF YOU HAVE AN IDEA: Extend and enhance as you see fit

## Credits

- Program's idea and draft creator: Hakan KILIÇASLAN
- Code and programming: [OpenHands](https://all-hands.dev)

## Acknowledgements

- [LM Studio](https://lmstudio.ai/) for providing the local API server
- All contributors who have helped improve this project