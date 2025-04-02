// Conversation UI
// Handles the UI for conversation management

const ConversationUI = {
    // Initialize the conversation UI
    init() {
        this.createConversationPanel();
        this.setupEventListeners();
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Listen for chat modifications
        document.addEventListener('message-added', () => {
            // Notify the conversation manager that the conversation has been modified
            document.dispatchEvent(new Event('conversation-modified'));
        });
    },
    
    // Create the conversation panel
    createConversationPanel() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // Create the conversation panel
        const conversationPanel = document.createElement('div');
        conversationPanel.id = 'conversation-panel';
        conversationPanel.className = 'conversation-panel';
        
        // Create the panel header
        const panelHeader = document.createElement('div');
        panelHeader.className = 'conversation-panel-header';
        
        // Create the panel title
        const panelTitle = document.createElement('h3');
        panelTitle.textContent = 'Conversations';
        
        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-panel-button';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', () => {
            this.toggleConversationPanel();
        });
        
        panelHeader.appendChild(panelTitle);
        panelHeader.appendChild(closeButton);
        
        // Create the panel content
        const panelContent = document.createElement('div');
        panelContent.className = 'conversation-panel-content';
        
        // Create the conversation actions
        const conversationActions = document.createElement('div');
        conversationActions.className = 'conversation-actions-bar';
        
        // Create the new conversation button
        const newConversationButton = document.createElement('button');
        newConversationButton.className = 'new-conversation-button';
        newConversationButton.innerHTML = '+ New Chat';
        newConversationButton.addEventListener('click', () => {
            window.ConversationManager.createNewConversation();
        });
        
        // Create the save conversation button
        const saveConversationButton = document.createElement('button');
        saveConversationButton.className = 'save-conversation-button';
        saveConversationButton.innerHTML = '💾 Save';
        saveConversationButton.addEventListener('click', () => {
            window.ConversationManager.saveCurrentConversation();
        });
        
        // Create the new folder button
        const newFolderButton = document.createElement('button');
        newFolderButton.className = 'new-folder-button';
        newFolderButton.innerHTML = '📁 New Folder';
        newFolderButton.addEventListener('click', () => {
            window.ConversationManager.createFolder();
        });
        
        conversationActions.appendChild(newConversationButton);
        conversationActions.appendChild(saveConversationButton);
        conversationActions.appendChild(newFolderButton);
        
        // Create the conversation list
        const conversationList = document.createElement('div');
        conversationList.id = 'conversation-list';
        conversationList.className = 'conversation-list';
        
        panelContent.appendChild(conversationActions);
        panelContent.appendChild(conversationList);
        
        // Add the panel header and content to the panel
        conversationPanel.appendChild(panelHeader);
        conversationPanel.appendChild(panelContent);
        
        // Add the panel to the app container
        appContainer.appendChild(conversationPanel);
        
        // Create the conversation toggle button
        this.createConversationToggle();
        
        // Create the current conversation title display
        this.createConversationTitleDisplay();
    },
    
    // Create the conversation toggle button
    createConversationToggle() {
        const serverUrlContainer = document.getElementById('server-url-container');
        if (!serverUrlContainer) return;
        
        const conversationToggle = document.createElement('button');
        conversationToggle.id = 'conversation-toggle';
        conversationToggle.className = 'conversation-toggle';
        conversationToggle.innerHTML = '📚';
        conversationToggle.title = 'Manage Conversations';
        conversationToggle.addEventListener('click', () => {
            this.toggleConversationPanel();
        });
        
        serverUrlContainer.appendChild(conversationToggle);
    },
    
    // Create the current conversation title display
    createConversationTitleDisplay() {
        const connectionStatus = document.getElementById('connection-status');
        if (!connectionStatus) return;
        
        const conversationTitleContainer = document.createElement('div');
        conversationTitleContainer.id = 'conversation-title-container';
        conversationTitleContainer.className = 'conversation-title-container';
        
        const conversationTitle = document.createElement('div');
        conversationTitle.id = 'current-conversation-title';
        conversationTitle.className = 'current-conversation-title';
        conversationTitle.textContent = 'New Conversation';
        
        conversationTitleContainer.appendChild(conversationTitle);
        
        // Insert after connection status
        connectionStatus.parentNode.insertBefore(conversationTitleContainer, connectionStatus.nextSibling);
    },
    
    // Toggle the conversation panel
    toggleConversationPanel() {
        const panel = document.getElementById('conversation-panel');
        if (panel) {
            panel.classList.toggle('visible');
            
            // Update the conversation list when the panel is shown
            if (panel.classList.contains('visible')) {
                window.ConversationManager.updateUI();
            }
        }
    }
};

// Export the conversation UI
window.ConversationUI = ConversationUI;