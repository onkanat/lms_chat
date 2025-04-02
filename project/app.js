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

// Model parameters with default values
const defaultModelParams = {
    temperature: 0.8,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    max_tokens: -1,
    system_prompt: 'I am Qwen, created by Alibaba Cloud. I am a helpful coder python, C, JS assistant.',
    template: 'default',
    streaming: true
};

// Current model parameters (initialized with defaults)
let modelParams = { ...defaultModelParams };

// Current model template
let currentModelTemplate = null;

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

// Model Parameters Event Listeners
document.getElementById('model-params-toggle').addEventListener('click', toggleModelParamsPanel);
document.getElementById('temperature-slider').addEventListener('input', updateTemperature);
document.getElementById('top-p-slider').addEventListener('input', updateTopP);
document.getElementById('frequency-penalty-slider').addEventListener('input', updateFrequencyPenalty);
document.getElementById('presence-penalty-slider').addEventListener('input', updatePresencePenalty);
document.getElementById('max-tokens-input').addEventListener('input', updateMaxTokens);
document.getElementById('system-prompt-textarea').addEventListener('input', updateSystemPrompt);
document.getElementById('model-template-select').addEventListener('change', updateModelTemplate);
document.getElementById('streaming-toggle').addEventListener('change', updateStreaming);
document.getElementById('reset-params-button').addEventListener('click', resetModelParams);
document.getElementById('save-params-button').addEventListener('click', saveModelParams);

// Initial Setup
serverUrlInput.focus();
createSaveButton();
loadSavedModelParams();
populateModelTemplates();

// Functions
function handleModelChange(e) {
    currentModel = e.target.value;
    addMessage(`Model changed to: ${currentModel}`, false);
    
    // Clear chat history when model changes
    clearChatHistory();
    
    // Auto-detect and apply the appropriate template for this model
    autoSelectModelTemplate(currentModel);
}

// Populate the model templates dropdown
function populateModelTemplates() {
    const templateSelect = document.getElementById('model-template-select');
    
    // Clear existing options except the default
    while (templateSelect.options.length > 1) {
        templateSelect.remove(1);
    }
    
    // Add all templates from the ModelTemplates module
    for (const [key, template] of Object.entries(window.ModelTemplates.templates)) {
        if (key === 'default') continue; // Skip default as it's already added
        
        const option = document.createElement('option');
        option.value = key;
        option.textContent = template.name;
        templateSelect.appendChild(option);
    }
}

// Auto-select the appropriate template based on model name
function autoSelectModelTemplate(modelName) {
    if (!modelName) return;
    
    // Find the appropriate template
    const template = window.ModelTemplates.findTemplateForModel(modelName);
    const templateKey = Object.keys(window.ModelTemplates.templates).find(
        key => window.ModelTemplates.templates[key] === template
    ) || 'default';
    
    // Update the template selector
    const templateSelect = document.getElementById('model-template-select');
    templateSelect.value = templateKey;
    
    // Apply the template
    updateModelTemplate({ target: { value: templateKey } });
    
    // Show a message about the auto-detected template
    if (templateKey !== 'default') {
        addMessage(`Auto-detected model type: ${template.name}. Applied appropriate template.`, false);
    }
}

// Update the model template when selected
function updateModelTemplate(e) {
    const templateKey = e.target.value;
    modelParams.template = templateKey;
    
    // Get the template
    const template = window.ModelTemplates.templates[templateKey];
    currentModelTemplate = template;
    
    // Update the system prompt with the template's default
    document.getElementById('system-prompt-textarea').value = template.systemPrompt;
    modelParams.system_prompt = template.systemPrompt;
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

// Model Parameters Functions
function toggleModelParamsPanel() {
    const panel = document.getElementById('model-params-panel');
    panel.classList.toggle('visible');
}

function updateTemperature(e) {
    const value = parseFloat(e.target.value);
    document.getElementById('temperature-value').textContent = value.toFixed(1);
    modelParams.temperature = value;
}

function updateTopP(e) {
    const value = parseFloat(e.target.value);
    document.getElementById('top-p-value').textContent = value.toFixed(2);
    modelParams.top_p = value;
}

function updateFrequencyPenalty(e) {
    const value = parseFloat(e.target.value);
    document.getElementById('frequency-penalty-value').textContent = value.toFixed(1);
    modelParams.frequency_penalty = value;
}

function updatePresencePenalty(e) {
    const value = parseFloat(e.target.value);
    document.getElementById('presence-penalty-value').textContent = value.toFixed(1);
    modelParams.presence_penalty = value;
}

function updateMaxTokens(e) {
    const value = parseInt(e.target.value);
    const displayValue = value === -1 ? "-1 (unlimited)" : value;
    document.getElementById('max-tokens-value').textContent = displayValue;
    modelParams.max_tokens = value;
}

function updateSystemPrompt(e) {
    modelParams.system_prompt = e.target.value;
}

function updateStreaming(e) {
    modelParams.streaming = e.target.checked;
}

function resetModelParams() {
    // Reset to default values
    modelParams = { ...defaultModelParams };
    
    // Update UI
    document.getElementById('temperature-slider').value = modelParams.temperature;
    document.getElementById('temperature-value').textContent = modelParams.temperature.toFixed(1);
    
    document.getElementById('top-p-slider').value = modelParams.top_p;
    document.getElementById('top-p-value').textContent = modelParams.top_p.toFixed(2);
    
    document.getElementById('frequency-penalty-slider').value = modelParams.frequency_penalty;
    document.getElementById('frequency-penalty-value').textContent = modelParams.frequency_penalty.toFixed(1);
    
    document.getElementById('presence-penalty-slider').value = modelParams.presence_penalty;
    document.getElementById('presence-penalty-value').textContent = modelParams.presence_penalty.toFixed(1);
    
    document.getElementById('max-tokens-input').value = modelParams.max_tokens;
    const displayValue = modelParams.max_tokens === -1 ? "-1 (unlimited)" : modelParams.max_tokens;
    document.getElementById('max-tokens-value').textContent = displayValue;
    
    document.getElementById('system-prompt-textarea').value = modelParams.system_prompt;
    
    document.getElementById('streaming-toggle').checked = modelParams.streaming;
    
    addMessage('Model parameters reset to defaults.', false);
}

function saveModelParams() {
    // Save current parameters to localStorage
    localStorage.setItem('lms_chat_model_params', JSON.stringify(modelParams));
    addMessage('Model parameters saved as default.', false);
}

function loadSavedModelParams() {
    // Load parameters from localStorage if available
    const savedParams = localStorage.getItem('lms_chat_model_params');
    if (savedParams) {
        try {
            const params = JSON.parse(savedParams);
            modelParams = { ...defaultModelParams, ...params };
            
            // Update UI with loaded values
            document.getElementById('temperature-slider').value = modelParams.temperature;
            document.getElementById('temperature-value').textContent = modelParams.temperature.toFixed(1);
            
            document.getElementById('top-p-slider').value = modelParams.top_p;
            document.getElementById('top-p-value').textContent = modelParams.top_p.toFixed(2);
            
            document.getElementById('frequency-penalty-slider').value = modelParams.frequency_penalty;
            document.getElementById('frequency-penalty-value').textContent = modelParams.frequency_penalty.toFixed(1);
            
            document.getElementById('presence-penalty-slider').value = modelParams.presence_penalty;
            document.getElementById('presence-penalty-value').textContent = modelParams.presence_penalty.toFixed(1);
            
            document.getElementById('max-tokens-input').value = modelParams.max_tokens;
            const displayValue = modelParams.max_tokens === -1 ? "-1 (unlimited)" : modelParams.max_tokens;
            document.getElementById('max-tokens-value').textContent = displayValue;
            
            document.getElementById('system-prompt-textarea').value = modelParams.system_prompt;
            
            // Set streaming toggle
            if (typeof modelParams.streaming !== 'undefined') {
                document.getElementById('streaming-toggle').checked = modelParams.streaming;
            }
            
            // Set the template if it exists
            if (modelParams.template) {
                const templateSelect = document.getElementById('model-template-select');
                if (templateSelect) {
                    // Check if the template exists in the options
                    const templateExists = Array.from(templateSelect.options).some(
                        option => option.value === modelParams.template
                    );
                    
                    if (templateExists) {
                        templateSelect.value = modelParams.template;
                        // Set the current template
                        currentModelTemplate = window.ModelTemplates.templates[modelParams.template];
                    }
                }
            }
        } catch (error) {
            console.error('Error loading saved model parameters:', error);
        }
    }
}

// Functions for handling streaming messages
function addStreamingMessage(ragContext = null) {
    // Create a unique ID for this message
    const messageId = 'msg-' + Date.now();
    
    // Create the message element
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'assistant-message', 'streaming-message');
    messageDiv.id = messageId;
    
    // Add model name if available
    if (currentModel) {
        messageDiv.appendChild(createModelDiv(currentModel));
    }
    
    // Add header
    messageDiv.appendChild(createHeaderDiv(false));
    
    // Add RAG context if available
    if (ragContext && ragContext.length > 0) {
        messageDiv.appendChild(createRAGContextDiv(ragContext));
    }
    
    // Add content div with loading indicator
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    messageDiv.appendChild(contentDiv);
    
    // Add metrics div (will be updated later)
    const metricsDiv = document.createElement('div');
    metricsDiv.classList.add('message-metrics');
    metricsDiv.textContent = 'Generating...';
    messageDiv.appendChild(metricsDiv);
    
    // Add to chat container and scroll to bottom
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return messageId;
}

function updateStreamingMessage(messageId, content) {
    const messageDiv = document.getElementById(messageId);
    if (!messageDiv) return;
    
    const contentDiv = messageDiv.querySelector('.message-content');
    if (!contentDiv) return;
    
    // Update content with the current text
    contentDiv.innerHTML = marked.parse(content);
    
    // Apply syntax highlighting
    processCodeBlocksAndMathJax(contentDiv);
    
    // Scroll to bottom if we're already near the bottom
    const isNearBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 100;
    if (isNearBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function finalizeStreamingMessage(messageId, content, totalTokens, timeElapsed, stopReason, ragContext = null) {
    const messageDiv = document.getElementById(messageId);
    if (!messageDiv) return;
    
    // Remove streaming class
    messageDiv.classList.remove('streaming-message');
    
    // Update content one last time
    updateStreamingMessage(messageId, content);
    
    // Update metrics
    const metricsDiv = messageDiv.querySelector('.message-metrics');
    if (metricsDiv) {
        const stopReasonText = stopReason === 'stop' ? 'eosFound' : stopReason;
        metricsDiv.textContent = `${totalTokens || '?'} tokens • ${timeElapsed || '0.00'}s • Stop: ${stopReasonText}`;
        
        // Show template info if a special template is being used
        if (currentModelTemplate && currentModelTemplate.requiresSpecialHandling && 
            currentModelTemplate.name !== 'Default Template') {
            const templateInfo = document.createElement('div');
            templateInfo.className = 'template-info';
            templateInfo.textContent = `Using ${currentModelTemplate.name} template`;
            metricsDiv.appendChild(templateInfo);
        }
    }
    
    // Add to chat history
    chatHistory.push({ role: 'assistant', content: content });
    
    // Re-enable send button
    sendButton.disabled = false;
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
    messages.push({ role: 'system', content: modelParams.system_prompt });
    
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
    
    // Apply model-specific formatting if a template is selected
    if (currentModelTemplate && currentModelTemplate.requiresSpecialHandling) {
        messages = window.ModelTemplates.formatConversation(messages, currentModelTemplate);
    }
    
    // Get stop tokens for the model if available
    const stopTokens = currentModelTemplate ? 
        currentModelTemplate.stopTokens || [] : [];
    
    // Prepare request body
    const requestBody = {
        model: currentModel,
        messages: messages,
        temperature: modelParams.temperature,
        top_p: modelParams.top_p,
        frequency_penalty: modelParams.frequency_penalty,
        presence_penalty: modelParams.presence_penalty,
        max_tokens: modelParams.max_tokens,
        stop: stopTokens.length > 0 ? stopTokens : undefined,
        stream: modelParams.streaming
    };
    
    // Check if streaming is enabled
    if (modelParams.streaming) {
        // Create a placeholder for the assistant's response
        const assistantMessageId = addStreamingMessage(ragContext);
        
        // Use streaming API
        fetch(`${serverUrlInput.value}/v1/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get a reader from the response body stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            let fullContent = '';
            let totalTokens = 0;
            let startTime = performance.now();
            
            // Process the stream
            function processStream() {
                return reader.read().then(({ done, value }) => {
                    if (done) {
                        // Stream is complete, finalize the message
                        const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(2);
                        finalizeStreamingMessage(assistantMessageId, fullContent, totalTokens, timeElapsed, 'stop', ragContext);
                        return;
                    }
                    
                    // Decode the chunk and add it to the buffer
                    buffer += decoder.decode(value, { stream: true });
                    
                    // Process complete lines in the buffer
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // Keep the last incomplete line in the buffer
                    
                    for (const line of lines) {
                        if (line.trim() === '') continue;
                        if (line.trim() === 'data: [DONE]') continue;
                        
                        try {
                            // Remove the "data: " prefix and parse the JSON
                            const jsonStr = line.replace(/^data: /, '');
                            const json = JSON.parse(jsonStr);
                            
                            // Extract the content delta
                            const delta = json.choices[0].delta;
                            if (delta && delta.content) {
                                fullContent += delta.content;
                                updateStreamingMessage(assistantMessageId, fullContent);
                            }
                            
                            // Update token count if available
                            if (json.usage && json.usage.total_tokens) {
                                totalTokens = json.usage.total_tokens;
                            }
                        } catch (e) {
                            console.error('Error parsing streaming response:', e, line);
                        }
                    }
                    
                    // Continue processing the stream
                    return processStream();
                });
            }
            
            return processStream();
        })
        .catch(error => {
            // Handle errors during streaming
            console.error('Streaming error:', error);
            updateStreamingMessage(assistantMessageId, 'Error: Unable to get a response from the server. Please try again.');
            finalizeStreamingMessage(assistantMessageId, 'Error: Unable to get a response from the server.', 0, 0, 'error');
            sendButton.disabled = false;
        });
    } else {
        // Use non-streaming API
        fetch(`${serverUrlInput.value}/v1/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => handleResponseData(message, data, ragContext))
        .catch(error => handleErrorSend(error));
    }
}

function handleResponseData(originalMessage, data, ragContext = null) {
    const botReply = data.choices[0].message.content;
    const totalTokens = data.usage.total_tokens;
    const timeElapsed = ((performance.now() - performance.now()) / 1000).toFixed(2);
    const stopReason = data.choices[0].finish_reason === 'stop' ? 'eosFound' : data.choices[0].finish_reason;

    // Add assistant response to chat history
    // If using a template with special formatting, we store the raw content
    chatHistory.push({ role: 'assistant', content: botReply });
    
    // Add message to UI
    addMessage(botReply, false, `${totalTokens} tokens • ${timeElapsed}s • Stop: ${stopReason}`, ragContext);
    sendButton.disabled = false;
    
    // Show template info in the UI if a special template is being used
    if (currentModelTemplate && currentModelTemplate.requiresSpecialHandling && 
        currentModelTemplate.name !== 'Default Template') {
        const templateInfo = document.createElement('div');
        templateInfo.className = 'template-info';
        templateInfo.textContent = `Using ${currentModelTemplate.name} template`;
        
        // Find the last message and append the template info
        const lastMessage = chatContainer.querySelector('.message:last-child');
        if (lastMessage) {
            const metricsDiv = lastMessage.querySelector('.message-metrics');
            if (metricsDiv) {
                metricsDiv.appendChild(templateInfo);
            }
        }
    }
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