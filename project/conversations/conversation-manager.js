// Conversation Manager
// Handles saving, loading, and organizing conversations

// Data structure for conversations
// conversations = {
//   items: {
//     "conv-id-1": {
//       id: "conv-id-1",
//       title: "Conversation Title",
//       date: "2023-04-01T12:34:56Z",
//       messages: [...],
//       model: "model-name",
//       folderId: "folder-id-1" // optional
//     },
//     ...
//   },
//   folders: {
//     "folder-id-1": {
//       id: "folder-id-1",
//       name: "Folder Name",
//       date: "2023-04-01T12:34:56Z"
//     },
//     ...
//   },
//   order: ["conv-id-1", "folder-id-1", ...] // Order of items at root level
// }

// Initialize the conversation manager
const ConversationManager = {
    // Data storage
    conversations: {
        items: {},
        folders: {},
        order: []
    },
    
    // Current conversation state
    currentConversationId: null,
    isConversationModified: false,
    
    // Initialize the conversation manager
    init() {
        this.loadConversationsFromStorage();
        this.setupEventListeners();
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Listen for changes to the chat that would modify the current conversation
        document.addEventListener('conversation-modified', () => {
            this.isConversationModified = true;
            this.updateUI();
        });
    },
    
    // Load conversations from localStorage
    loadConversationsFromStorage() {
        try {
            const savedConversations = localStorage.getItem('lms_chat_conversations');
            if (savedConversations) {
                this.conversations = JSON.parse(savedConversations);
            }
        } catch (error) {
            console.error('Error loading conversations from storage:', error);
            // Initialize with empty data if there's an error
            this.conversations = {
                items: {},
                folders: {},
                order: []
            };
        }
    },
    
    // Save conversations to localStorage
    saveConversationsToStorage() {
        try {
            localStorage.setItem('lms_chat_conversations', JSON.stringify(this.conversations));
        } catch (error) {
            console.error('Error saving conversations to storage:', error);
            alert('Failed to save conversations. LocalStorage may be full.');
        }
    },
    
    // Generate a unique ID
    generateId() {
        return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
    },
    
    // Create a new conversation
    createNewConversation() {
        // Check if there are unsaved changes
        if (this.isConversationModified && this.currentConversationId) {
            if (!confirm('You have unsaved changes. Create a new conversation anyway?')) {
                return;
            }
        }
        
        // Clear the chat
        this.clearChat();
        
        // Reset the current conversation state
        this.currentConversationId = null;
        this.isConversationModified = false;
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    // Save the current conversation
    saveCurrentConversation(title = null) {
        // Get the current chat messages
        const messages = this.getCurrentChatMessages();
        if (messages.length === 0) {
            alert('Cannot save an empty conversation.');
            return false;
        }
        
        // If no title is provided, prompt the user
        if (!title) {
            title = prompt('Enter a title for this conversation:', 'Conversation ' + new Date().toLocaleString());
            if (!title) return false; // User cancelled
        }
        
        // Check if we're updating an existing conversation or creating a new one
        let conversationId = this.currentConversationId;
        let isNew = false;
        
        if (!conversationId) {
            // Create a new conversation
            conversationId = this.generateId();
            isNew = true;
        }
        
        // Create or update the conversation object
        const conversation = {
            id: conversationId,
            title: title,
            date: new Date().toISOString(),
            messages: messages,
            model: currentModel || 'unknown',
            modelParams: { ...modelParams } // Save current model parameters
        };
        
        // Add or update the conversation in our data structure
        this.conversations.items[conversationId] = conversation;
        
        // If it's a new conversation, add it to the order array
        if (isNew) {
            this.conversations.order.unshift(conversationId);
        }
        
        // Save to localStorage
        this.saveConversationsToStorage();
        
        // Update the current conversation state
        this.currentConversationId = conversationId;
        this.isConversationModified = false;
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    // Load a conversation
    loadConversation(conversationId) {
        // Check if the conversation exists
        if (!this.conversations.items[conversationId]) {
            alert('Conversation not found.');
            return false;
        }
        
        // Check if there are unsaved changes
        if (this.isConversationModified && this.currentConversationId) {
            if (!confirm('You have unsaved changes. Load another conversation anyway?')) {
                return false;
            }
        }
        
        // Get the conversation
        const conversation = this.conversations.items[conversationId];
        
        // Clear the current chat
        this.clearChat();
        
        // Load the conversation messages
        this.loadChatMessages(conversation.messages);
        
        // Load the model parameters if available
        if (conversation.modelParams) {
            // Only update if the model is the same
            if (conversation.model === currentModel) {
                this.loadModelParameters(conversation.modelParams);
            }
        }
        
        // Update the current conversation state
        this.currentConversationId = conversationId;
        this.isConversationModified = false;
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    // Delete a conversation
    deleteConversation(conversationId) {
        // Check if the conversation exists
        if (!this.conversations.items[conversationId]) {
            alert('Conversation not found.');
            return false;
        }
        
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this conversation?')) {
            return false;
        }
        
        // If this is the current conversation, clear it
        if (conversationId === this.currentConversationId) {
            this.createNewConversation();
        }
        
        // Remove from order array
        const index = this.conversations.order.indexOf(conversationId);
        if (index !== -1) {
            this.conversations.order.splice(index, 1);
        }
        
        // Delete the conversation
        delete this.conversations.items[conversationId];
        
        // Save to localStorage
        this.saveConversationsToStorage();
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    // Create a new folder
    createFolder(name = null) {
        // If no name is provided, prompt the user
        if (!name) {
            name = prompt('Enter a name for the new folder:');
            if (!name) return false; // User cancelled
        }
        
        // Create a new folder ID
        const folderId = 'folder-' + this.generateId();
        
        // Create the folder object
        const folder = {
            id: folderId,
            name: name,
            date: new Date().toISOString()
        };
        
        // Add the folder to our data structure
        this.conversations.folders[folderId] = folder;
        
        // Add it to the order array
        this.conversations.order.unshift(folderId);
        
        // Save to localStorage
        this.saveConversationsToStorage();
        
        // Update UI
        this.updateUI();
        
        return folderId;
    },
    
    // Delete a folder
    deleteFolder(folderId) {
        // Check if the folder exists
        if (!this.conversations.folders[folderId]) {
            alert('Folder not found.');
            return false;
        }
        
        // Check if the folder contains conversations
        const conversationsInFolder = Object.values(this.conversations.items)
            .filter(conv => conv.folderId === folderId);
        
        if (conversationsInFolder.length > 0) {
            if (!confirm(`This folder contains ${conversationsInFolder.length} conversation(s). Delete them too?`)) {
                return false;
            }
            
            // Delete all conversations in the folder
            conversationsInFolder.forEach(conv => {
                // Remove from order array
                const index = this.conversations.order.indexOf(conv.id);
                if (index !== -1) {
                    this.conversations.order.splice(index, 1);
                }
                
                // Delete the conversation
                delete this.conversations.items[conv.id];
                
                // If this is the current conversation, clear it
                if (conv.id === this.currentConversationId) {
                    this.createNewConversation();
                }
            });
        }
        
        // Remove from order array
        const index = this.conversations.order.indexOf(folderId);
        if (index !== -1) {
            this.conversations.order.splice(index, 1);
        }
        
        // Delete the folder
        delete this.conversations.folders[folderId];
        
        // Save to localStorage
        this.saveConversationsToStorage();
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    // Move a conversation to a folder
    moveConversationToFolder(conversationId, folderId) {
        // Check if the conversation exists
        if (!this.conversations.items[conversationId]) {
            alert('Conversation not found.');
            return false;
        }
        
        // Check if the folder exists (or null for root)
        if (folderId !== null && !this.conversations.folders[folderId]) {
            alert('Folder not found.');
            return false;
        }
        
        // Update the conversation's folderId
        this.conversations.items[conversationId].folderId = folderId;
        
        // If moving to a folder, remove from order array (it's no longer at root level)
        if (folderId !== null) {
            const index = this.conversations.order.indexOf(conversationId);
            if (index !== -1) {
                this.conversations.order.splice(index, 1);
            }
        } else {
            // If moving to root, add to order array if not already there
            if (!this.conversations.order.includes(conversationId)) {
                this.conversations.order.unshift(conversationId);
            }
        }
        
        // Save to localStorage
        this.saveConversationsToStorage();
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    // Rename a conversation
    renameConversation(conversationId, newTitle) {
        // Check if the conversation exists
        if (!this.conversations.items[conversationId]) {
            alert('Conversation not found.');
            return false;
        }
        
        // If no title is provided, prompt the user
        if (!newTitle) {
            newTitle = prompt('Enter a new title:', this.conversations.items[conversationId].title);
            if (!newTitle) return false; // User cancelled
        }
        
        // Update the conversation title
        this.conversations.items[conversationId].title = newTitle;
        
        // Save to localStorage
        this.saveConversationsToStorage();
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    // Rename a folder
    renameFolder(folderId, newName) {
        // Check if the folder exists
        if (!this.conversations.folders[folderId]) {
            alert('Folder not found.');
            return false;
        }
        
        // If no name is provided, prompt the user
        if (!newName) {
            newName = prompt('Enter a new name:', this.conversations.folders[folderId].name);
            if (!newName) return false; // User cancelled
        }
        
        // Update the folder name
        this.conversations.folders[folderId].name = newName;
        
        // Save to localStorage
        this.saveConversationsToStorage();
        
        // Update UI
        this.updateUI();
        
        return true;
    },
    
    // Get conversations in a folder
    getConversationsInFolder(folderId) {
        return Object.values(this.conversations.items)
            .filter(conv => conv.folderId === folderId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    // Get root level items (conversations and folders)
    getRootItems() {
        const rootItems = [];
        
        // Add items in the order specified by the order array
        this.conversations.order.forEach(id => {
            if (id.startsWith('folder-')) {
                if (this.conversations.folders[id]) {
                    rootItems.push({
                        type: 'folder',
                        ...this.conversations.folders[id]
                    });
                }
            } else {
                if (this.conversations.items[id] && !this.conversations.items[id].folderId) {
                    rootItems.push({
                        type: 'conversation',
                        ...this.conversations.items[id]
                    });
                }
            }
        });
        
        // Add any remaining root conversations that aren't in the order array
        Object.values(this.conversations.items)
            .filter(conv => !conv.folderId && !this.conversations.order.includes(conv.id))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach(conv => {
                rootItems.push({
                    type: 'conversation',
                    ...conv
                });
            });
        
        return rootItems;
    },
    
    // Get the current chat messages
    getCurrentChatMessages() {
        return [...chatHistory]; // Clone the chat history array
    },
    
    // Clear the chat
    clearChat() {
        // Use the existing clearChat function if available
        if (typeof window.clearChat === 'function') {
            window.clearChat();
        } else {
            // Fallback implementation
            chatHistory = [];
            while (chatContainer.firstChild) {
                chatContainer.removeChild(chatContainer.firstChild);
            }
        }
    },
    
    // Load chat messages
    loadChatMessages(messages) {
        // Set the chat history
        chatHistory = [...messages]; // Clone the messages array
        
        // Add messages to the UI
        messages.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                addMessage(msg.content, msg.role === 'user');
            }
        });
    },
    
    // Load model parameters
    loadModelParameters(params) {
        // Update the model parameters
        Object.assign(modelParams, params);
        
        // Update UI elements
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
    },
    
    // Update the UI to reflect the current conversation state
    updateUI() {
        // Update the conversation list
        this.renderConversationList();
        
        // Update the current conversation title
        this.updateConversationTitle();
    },
    
    // Render the conversation list
    renderConversationList() {
        const conversationList = document.getElementById('conversation-list');
        if (!conversationList) return;
        
        // Clear the list
        conversationList.innerHTML = '';
        
        // Get root items
        const rootItems = this.getRootItems();
        
        if (rootItems.length === 0) {
            // Show empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-conversations';
            emptyState.textContent = 'No saved conversations yet.';
            conversationList.appendChild(emptyState);
            return;
        }
        
        // Create a list element for each item
        rootItems.forEach(item => {
            if (item.type === 'folder') {
                // Render folder
                const folderElement = this.createFolderElement(item);
                conversationList.appendChild(folderElement);
            } else {
                // Render conversation
                const conversationElement = this.createConversationElement(item);
                conversationList.appendChild(conversationElement);
            }
        });
    },
    
    // Create a folder element
    createFolderElement(folder) {
        const folderElement = document.createElement('div');
        folderElement.className = 'folder';
        folderElement.dataset.id = folder.id;
        
        // Folder header
        const folderHeader = document.createElement('div');
        folderHeader.className = 'folder-header';
        
        // Folder toggle
        const folderToggle = document.createElement('span');
        folderToggle.className = 'folder-toggle';
        folderToggle.innerHTML = '▶';
        folderToggle.addEventListener('click', () => {
            folderElement.classList.toggle('expanded');
            folderToggle.innerHTML = folderElement.classList.contains('expanded') ? '▼' : '▶';
        });
        
        // Folder name
        const folderName = document.createElement('span');
        folderName.className = 'folder-name';
        folderName.textContent = folder.name;
        folderName.title = new Date(folder.date).toLocaleString();
        
        // Folder actions
        const folderActions = document.createElement('div');
        folderActions.className = 'folder-actions';
        
        // Rename button
        const renameButton = document.createElement('button');
        renameButton.className = 'folder-rename';
        renameButton.innerHTML = '✏️';
        renameButton.title = 'Rename folder';
        renameButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.renameFolder(folder.id);
        });
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'folder-delete';
        deleteButton.innerHTML = '🗑️';
        deleteButton.title = 'Delete folder';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteFolder(folder.id);
        });
        
        folderActions.appendChild(renameButton);
        folderActions.appendChild(deleteButton);
        
        folderHeader.appendChild(folderToggle);
        folderHeader.appendChild(folderName);
        folderHeader.appendChild(folderActions);
        
        // Folder content
        const folderContent = document.createElement('div');
        folderContent.className = 'folder-content';
        
        // Get conversations in this folder
        const conversationsInFolder = this.getConversationsInFolder(folder.id);
        
        if (conversationsInFolder.length === 0) {
            // Show empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-folder';
            emptyState.textContent = 'This folder is empty.';
            folderContent.appendChild(emptyState);
        } else {
            // Create a list element for each conversation
            conversationsInFolder.forEach(conv => {
                const conversationElement = this.createConversationElement(
                    { type: 'conversation', ...conv },
                    true // isInFolder
                );
                folderContent.appendChild(conversationElement);
            });
        }
        
        folderElement.appendChild(folderHeader);
        folderElement.appendChild(folderContent);
        
        return folderElement;
    },
    
    // Create a conversation element
    createConversationElement(conversation, isInFolder = false) {
        const conversationElement = document.createElement('div');
        conversationElement.className = 'conversation';
        if (isInFolder) conversationElement.classList.add('in-folder');
        if (conversation.id === this.currentConversationId) conversationElement.classList.add('active');
        conversationElement.dataset.id = conversation.id;
        
        // Conversation title
        const conversationTitle = document.createElement('div');
        conversationTitle.className = 'conversation-title';
        conversationTitle.textContent = conversation.title;
        conversationTitle.title = `${conversation.title}\n${new Date(conversation.date).toLocaleString()}\nModel: ${conversation.model}`;
        
        // Conversation actions
        const conversationActions = document.createElement('div');
        conversationActions.className = 'conversation-actions';
        
        // Load button
        const loadButton = document.createElement('button');
        loadButton.className = 'conversation-load';
        loadButton.innerHTML = '📂';
        loadButton.title = 'Load conversation';
        loadButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.loadConversation(conversation.id);
        });
        
        // Rename button
        const renameButton = document.createElement('button');
        renameButton.className = 'conversation-rename';
        renameButton.innerHTML = '✏️';
        renameButton.title = 'Rename conversation';
        renameButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.renameConversation(conversation.id);
        });
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'conversation-delete';
        deleteButton.innerHTML = '🗑️';
        deleteButton.title = 'Delete conversation';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteConversation(conversation.id);
        });
        
        conversationActions.appendChild(loadButton);
        conversationActions.appendChild(renameButton);
        conversationActions.appendChild(deleteButton);
        
        conversationElement.appendChild(conversationTitle);
        conversationElement.appendChild(conversationActions);
        
        // Add click event to load the conversation
        conversationElement.addEventListener('click', () => {
            this.loadConversation(conversation.id);
        });
        
        return conversationElement;
    },
    
    // Update the conversation title in the UI
    updateConversationTitle() {
        const conversationTitle = document.getElementById('current-conversation-title');
        if (!conversationTitle) return;
        
        if (this.currentConversationId) {
            const conversation = this.conversations.items[this.currentConversationId];
            if (conversation) {
                conversationTitle.textContent = conversation.title;
                if (this.isConversationModified) {
                    conversationTitle.textContent += ' *';
                }
            } else {
                conversationTitle.textContent = 'New Conversation';
            }
        } else {
            conversationTitle.textContent = 'New Conversation';
        }
    }
};

// Export the conversation manager
window.ConversationManager = ConversationManager;