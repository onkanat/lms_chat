// DOM Elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const serverUrlInput = document.getElementById('server-url');
const connectButton = document.getElementById('connect-button');
const connectionStatus = document.getElementById('connection-status');
const sendButton = document.getElementById('send-button');
const modelSelect = document.getElementById('model-select');

// Global Variables
let isConnected = false;
let currentModel = '';
let chatHistory = []; // Store chat history as an array of message objects

// Marked.js Configuration
marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: false,
    highlight: (code, lang) => Prism.highlight(code, Prism.languages[lang] || Prism.languages.javascript, 'javascript')
});

// Event Listeners
connectButton.addEventListener('click', connectToServer);
userInput.addEventListener('keypress', sendMessageKeydown);
sendButton.addEventListener('click', sendMessage);
modelSelect.addEventListener('change', handleModelChange);

// Initial Setup
serverUrlInput.focus();
createSaveButton();

// Functions
function handleModelChange(e) {
    currentModel = e.target.value;
    addMessage(`Model changed to: ${currentModel}`, false);
    
    // Clear chat history when model changes
    clearChatHistory();
}

// Function to clear chat history
function clearChatHistory() {
    chatHistory = [];
    console.log("Chat history cleared");
}

function connectToServer() {
    const serverUrl = serverUrlInput.value.trim();
    if (!serverUrl) return updateConnectionStatus('Please enter a valid server address', false);

    // Clear chat history when connecting to a server
    clearChatHistory();
    
    fetch(`${serverUrl}/v1/models`, { method: 'GET' })
        .then(response => response.json())
        .then(data => handleModelData(serverUrl, data))
        .catch(error => handleError(error));
}

function handleModelData(serverUrl, data) {
    if (!data.data || !data.data.length) throw new Error('No models available');

    modelSelect.innerHTML = '<option value="">Select a model...</option>';
    data.data.forEach(model => addOptionToSelect(model.id));

    modelSelect.disabled = false;
    currentModel = data.data[0].id;
    modelSelect.value = currentModel;
    sendButton.disabled = false;
    isConnected = true;
    updateConnectionStatus('Connected', true);
}

function handleError(error) {
    console.error('Error:', error);
    updateConnectionStatus('Failed to connect', false);
    addMessage('Error: Unable to connect to the LM Studio server. Please check the address and try again.', false);
}

function addOptionToSelect(value) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    modelSelect.appendChild(option);
}

function updateConnectionStatus(message, connected) {
    connectionStatus.textContent = message;
    connectionStatus.style.color = connected ? 'var(--accent-color)' : '#f44336';
    connectButton.textContent = connected ? 'Disconnect' : 'Connect';

    serverUrlInput.disabled = connected;
    modelSelect.disabled = !connected;
    userInput.disabled = !connected;
    sendButton.disabled = !connected;
}

function sendMessage() {
    const message = userInput.value.trim();
    if (!message || !isConnected) return;

    // Add user message to UI
    addMessage(message, true);
    
    // Add user message to chat history
    chatHistory.push({ role: 'user', content: message });
    
    userInput.value = '';
    sendButton.disabled = true;
    
    // Check if RAG is enabled
    const ragEnabled = document.getElementById('rag-toggle')?.checked || false;
    let userPrompt = message;
    let ragContext = null;
    let messages = [];
    
    // Start with system message
    messages.push({ role: 'system', content: 'I am Qwen, created by Alibaba Cloud. I am a helpful coder python, C, JS assistant.' });
    
    // If RAG is enabled and we have documents, create a special RAG prompt for the current message
    if (ragEnabled && window.RAG && window.RAG.getDocumentCount() > 0) {
        const ragResult = window.RAG.augmentPromptWithRAG(message);
        userPrompt = ragResult.augmentedPrompt;
        ragContext = ragResult.context;
        
        // Add previous chat history (excluding the last user message which will be replaced with RAG-augmented one)
        if (chatHistory.length > 1) {
            messages = messages.concat(chatHistory.slice(0, -1));
        }
        
        // Add the RAG-augmented message
        messages.push({ role: 'user', content: userPrompt });
    } else {
        // No RAG, just use the full chat history
        messages = messages.concat(chatHistory);
    }

    fetch(`${serverUrlInput.value}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: currentModel,
            messages: messages,
            temperature: 0.8,
            max_tokens: -1,
            stream: false
        })
    })
    .then(response => response.json())
    .then(data => handleResponseData(message, data, ragContext))
    .catch(error => handleErrorSend(error));
}

function handleResponseData(originalMessage, data, ragContext = null) {
    const botReply = data.choices[0].message.content;
    const totalTokens = data.usage.total_tokens;
    const timeElapsed = ((performance.now() - performance.now()) / 1000).toFixed(2);
    const stopReason = data.choices[0].finish_reason === 'stop' ? 'eosFound' : data.choices[0].finish_reason;

    // Add assistant response to chat history
    chatHistory.push({ role: 'assistant', content: botReply });
    
    // Add message to UI
    addMessage(botReply, false, `${totalTokens} tokens • ${timeElapsed}s • Stop: ${stopReason}`, ragContext);
    sendButton.disabled = false;
}

function handleErrorSend(error) {
    console.error('Error:', error);
    addMessage('Error: Unable to get a response from the server. Please try again.', false);

    isConnected = false;
    updateConnectionStatus('Disconnected', false);
    sendButton.disabled = true;
    userInput.focus();
}

function sendMessageKeydown(e) {
    if (e.key === 'Enter') sendMessage();
}

function createSaveButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'chat-buttons';
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Chat';
    saveButton.className = 'save-chat-button';
    saveButton.onclick = saveChat;
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Chat';
    clearButton.className = 'clear-chat-button';
    clearButton.onclick = clearChat;
    
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(clearButton);
    chatContainer.appendChild(buttonContainer);
}

function clearChat() {
    // Clear chat history
    clearChatHistory();
    
    // Clear chat UI
    while (chatContainer.firstChild) {
        chatContainer.removeChild(chatContainer.firstChild);
    }
    
    // Re-add the buttons
    createSaveButton();
    
    // Add a message indicating the chat was cleared
    addMessage('Chat history has been cleared.', false);
}

function saveChat() {
    // Get messages from UI
    const uiMessages = Array.from(chatContainer.querySelectorAll('.message')).map(msg => ({
        author: msg.querySelector('.message-header .header-content')?.innerText || 'Unknown',
        content: msg.querySelector('.message-content')?.innerText || '',
        timestamp: new Date().toISOString()
    }));

    // Create a combined export with both formats
    const exportData = {
        // Format compatible with OpenAI API
        messages: chatHistory,
        
        // UI format with additional metadata
        ui_messages: uiMessages,
        
        // Metadata
        metadata: {
            model: currentModel,
            exported_at: new Date().toISOString(),
            message_count: chatHistory.length
        }
    };

    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function addMessage(content, isUser, metrics = null, ragContext = null) {
    chatContainer.appendChild(createMessageElement(content, isUser, metrics, ragContext));
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createMessageElement(content, isUser, metrics, ragContext = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'assistant-message');

    if (!isUser && currentModel)
        messageDiv.appendChild(createModelDiv(currentModel));

    messageDiv.appendChild(createHeaderDiv(isUser));
    messageDiv.appendChild(createCopyButton(content));
    
    // Add RAG context if available
    if (!isUser && ragContext && ragContext.length > 0) {
        messageDiv.appendChild(createRAGContextDiv(ragContext));
    }
    
    const contentDiv = createContentDiv(content, isUser);
    processCodeBlocksAndMathJax(contentDiv);
    messageDiv.appendChild(contentDiv);

    if (metrics)
        messageDiv.appendChild(createMetricsDiv(metrics));

    return messageDiv;
}

function createRAGContextDiv(ragContext) {
    const contextDiv = document.createElement('div');
    contextDiv.classList.add('rag-context');
    
    const contextHeader = document.createElement('div');
    contextHeader.classList.add('rag-context-header');
    
    const headerText = document.createElement('span');
    headerText.textContent = `Response augmented with ${ragContext.length} document${ragContext.length > 1 ? 's' : ''}`;
    
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('rag-context-toggle');
    toggleButton.textContent = 'Show sources';
    
    contextHeader.appendChild(headerText);
    contextHeader.appendChild(toggleButton);
    
    const contextContent = document.createElement('div');
    contextContent.classList.add('rag-context-content');
    
    // Add each source document
    ragContext.forEach(chunk => {
        const sourceDiv = document.createElement('div');
        sourceDiv.classList.add('rag-source');
        sourceDiv.innerHTML = `<strong>${chunk.documentName}</strong>: "${chunk.content.substring(0, 150)}${chunk.content.length > 150 ? '...' : ''}"`;
        contextContent.appendChild(sourceDiv);
    });
    
    // Toggle visibility of context content
    toggleButton.addEventListener('click', () => {
        const isExpanded = contextContent.classList.toggle('expanded');
        toggleButton.textContent = isExpanded ? 'Hide sources' : 'Show sources';
    });
    
    contextDiv.appendChild(contextHeader);
    contextDiv.appendChild(contextContent);
    
    return contextDiv;
}

function createModelDiv(model) {
    const modelDiv = document.createElement('div');
    modelDiv.classList.add('message-model');
    modelDiv.textContent = model;
    return modelDiv;
}

function createHeaderDiv(isUser) {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('message-header', 'header-flex');

    const headerContent = document.createElement('div');
    headerContent.classList.add('header-content');
    headerContent.textContent = isUser ? 'You:' : 'Assistant:';

    headerDiv.appendChild(headerContent);
    return headerDiv;
}

function createContentDiv(content, isUser) {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    if (!isUser) {
        // Check if the content appears to be JSON
        if ((content.trim().startsWith('{') && content.trim().endsWith('}')) || 
            (content.trim().startsWith('[') && content.trim().endsWith(']'))) {
            try {
                // Try to parse the JSON
                const jsonData = JSON.parse(content);
                
                // Format the JSON nicely
                const formattedJson = formatJsonResponse(jsonData);
                contentDiv.innerHTML = formattedJson;
            } catch (e) {
                // If JSON parsing fails, treat as regular markdown
                console.log("JSON parsing failed, treating as markdown:", e);
                contentDiv.innerHTML = marked.parse(content);
            }
        } else {
            // Regular markdown parsing
            contentDiv.innerHTML = marked.parse(content);
        }
    } else {
        contentDiv.textContent = content;
    }

    return contentDiv;
}

// Format JSON responses in a more readable way
function formatJsonResponse(json) {
    // For simple key-value objects, create a nice table
    if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
        let html = '<div class="json-response">';
        
        // Check if it's a nested object with a single key that contains an object
        const keys = Object.keys(json);
        if (keys.length === 1 && typeof json[keys[0]] === 'object' && json[keys[0]] !== null) {
            // Handle case like {"name": {properties...}}
            const mainKey = keys[0];
            const nestedObj = json[mainKey];
            
            html += `<h3 class="json-title">${escapeHtml(mainKey)}</h3>`;
            
            if (typeof nestedObj === 'object') {
                html += '<table class="json-table">';
                for (const [key, value] of Object.entries(nestedObj)) {
                    html += '<tr>';
                    html += `<td class="json-key">${escapeHtml(key)}</td>`;
                    html += `<td class="json-value">${formatJsonValue(value)}</td>`;
                    html += '</tr>';
                }
                html += '</table>';
            } else {
                html += `<p>${formatJsonValue(nestedObj)}</p>`;
            }
        } else {
            // Regular object with multiple keys
            html += '<table class="json-table">';
            for (const [key, value] of Object.entries(json)) {
                html += '<tr>';
                html += `<td class="json-key">${escapeHtml(key)}</td>`;
                html += `<td class="json-value">${formatJsonValue(value)}</td>`;
                html += '</tr>';
            }
            html += '</table>';
        }
        
        html += '</div>';
        return html;
    }
    
    // For arrays or other types, use a pre-formatted code block with syntax highlighting
    return `<pre><code class="language-json">${JSON.stringify(json, null, 2)}</code></pre>`;
}

// Format different types of JSON values appropriately
function formatJsonValue(value) {
    if (value === null) return '<span class="json-null">null</span>';
    
    if (typeof value === 'string') {
        // Check if the string is a URL
        if (value.match(/^https?:\/\/[^\s]+$/)) {
            return `<a href="${escapeHtml(value)}" target="_blank">${escapeHtml(value)}</a>`;
        }
        return escapeHtml(value);
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
        return `<span class="json-${typeof value}">${value}</span>`;
    }
    
    if (Array.isArray(value)) {
        if (value.length === 0) return '[]';
        
        if (typeof value[0] === 'string' || typeof value[0] === 'number' || typeof value[0] === 'boolean') {
            // Simple array of primitives
            return value.map(item => formatJsonValue(item)).join(', ');
        }
        
        // Complex array
        return `[Array with ${value.length} items]`;
    }
    
    if (typeof value === 'object') {
        return '{...}'; // Simplified representation of nested objects
    }
    
    return String(value);
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function processCodeBlocksAndMathJax(contentDiv) {
    try {
        Prism.highlightAllUnder(contentDiv);
    } catch (error) {
        console.error('Prism.js highlighting failed:', error);
    }
    handleMathJax(contentDiv);
    loadAndRenderMathJax(contentDiv);
}

function handleMathJax(contentDiv) {
    try {
        MathJax.typeset([contentDiv]);
    } catch (error) {
        console.error('MathJax processing failed:', error);
    }
}

function loadAndRenderMathJax(contentDiv) {
    if (!document.querySelector('script[type="math/tex"]')) {
        const scriptTag = document.createElement('script');
        const head = document.head || document.documentElement;
        scriptTag.type = 'text/x-mathjax-config';
        scriptTag.src = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML';
        head.appendChild(scriptTag);

        const configScript = document.createElement('script');
        configScript.type = 'text/x-mathjax-config';
        configScript.innerHTML = `MathJax.Hub.Config({tex2jax: {inlineMath: [["$","$"],["\$$","\$$"]]}});`;
        head.appendChild(configScript);
    }
    MathJax.typeset([contentDiv]);
}

function createCopyButton(content) {
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-button');

    copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`;

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(content).then(() => {
            copyButton.classList.add('copied');
            setTimeout(() => copyButton.classList.remove('copied'), 1000);
        });
    });

    return copyButton;
}

function createMetricsDiv(metrics) {
    const metricsDiv = document.createElement('div');
    metricsDiv.classList.add('message-metrics');
    metricsDiv.textContent = metrics;
    return metricsDiv;
}

document.addEventListener('keydown', function(event) {
    if (event.metaKey && event.key === 'p') {
        event.preventDefault();
        window.open('p_editor.html', 'Text Editor', 'width=820,height=320');
    }
});

window.addEventListener('message', function(event) {
    const text = event.data;
    const userInput = document.getElementById('user-input');
    userInput.value = text;
}); 