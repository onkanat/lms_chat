// RAG UI Components

// Create RAG UI elements
function createRAGUI() {
    createRAGToggle();
    createDocumentPanel();
}

// Create RAG toggle button
function createRAGToggle() {
    // Eğer zaten oluşturulduysa tekrar oluşturma
    if (document.getElementById('rag-toggle-container')) {
        console.log("RAG toggle zaten oluşturulmuş, tekrarlanmıyor.");
        return;
    }
    
    const serverUrlContainer = document.getElementById('server-url-container');
    if (!serverUrlContainer) return;
    
    const ragToggleContainer = document.createElement('div');
    ragToggleContainer.id = 'rag-toggle-container';
    ragToggleContainer.className = 'rag-toggle-container';
    
    const ragToggleLabel = document.createElement('label');
    ragToggleLabel.className = 'rag-toggle-label';
    ragToggleLabel.htmlFor = 'rag-toggle';
    ragToggleLabel.textContent = 'RAG';
    
    const ragToggle = document.createElement('input');
    ragToggle.type = 'checkbox';
    ragToggle.id = 'rag-toggle';
    ragToggle.className = 'rag-toggle';
    
    ragToggle.addEventListener('change', function() {
        document.body.classList.toggle('rag-enabled', this.checked);
        if (this.checked) {
            showDocumentPanel();
        } else {
            hideDocumentPanel();
        }
    });
    
    ragToggleContainer.appendChild(ragToggleLabel);
    ragToggleContainer.appendChild(ragToggle);
    
    serverUrlContainer.appendChild(ragToggleContainer);
}

// Create document panel
function createDocumentPanel() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;
    
    const documentPanel = document.createElement('div');
    documentPanel.id = 'document-panel';
    documentPanel.className = 'document-panel';
    
    documentPanel.innerHTML = `
        <div class="document-panel-header">
            <h3>Document Knowledge Base</h3>
            <button id="close-document-panel" class="close-panel-button">×</button>
        </div>
        <div class="document-panel-content">
            <div class="document-upload">
                <label for="document-file" class="document-upload-label">Upload Document</label>
                <input type="file" id="document-file" accept=".txt,.md,.text" />
                <button id="clear-documents" class="clear-documents-button">Clear All</button>
            </div>
            <div id="document-list" class="document-list"></div>
        </div>
    `;
    
    appContainer.appendChild(documentPanel);
    
    // Add event listeners
    document.getElementById('close-document-panel').addEventListener('click', hideDocumentPanel);
    document.getElementById('document-file').addEventListener('change', handleDocumentFileSelect);
    document.getElementById('clear-documents').addEventListener('click', () => window.RAG.clearAllDocuments());
}

// Handle document file selection
function handleDocumentFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const uploadButton = document.querySelector('.document-upload-label');
    const originalText = uploadButton.textContent;
    uploadButton.textContent = 'Uploading...';
    
    window.RAG.handleFileUpload(file)
        .then(() => {
            uploadButton.textContent = 'Upload Success!';
            event.target.value = ''; // Clear the file input
            setTimeout(() => {
                uploadButton.textContent = originalText;
            }, 2000);
        })
        .catch(error => {
            console.error('Error uploading document:', error);
            uploadButton.textContent = 'Upload Failed';
            setTimeout(() => {
                uploadButton.textContent = originalText;
            }, 2000);
        });
}

// Show document panel
function showDocumentPanel() {
    const panel = document.getElementById('document-panel');
    if (panel) {
        panel.classList.add('visible');
        window.RAG.updateDocumentList();
    }
}

// Hide document panel
function hideDocumentPanel() {
    const panel = document.getElementById('document-panel');
    if (panel) {
        panel.classList.remove('visible');
        document.getElementById('rag-toggle').checked = false;
        document.body.classList.remove('rag-enabled');
    }
}

// RAG UI başlatma fonksiyonu
function init() {
    console.log("Initializing RAG UI...");
    createRAGUI();
    if (window.RAG && typeof window.RAG.init === 'function') {
        window.RAG.init();
    } else {
        console.error('RAG object is not properly defined');
    }
    console.log("RAG UI initialized successfully");
}

// Export init function
window.RAGUI = {
    init,
    showDocumentPanel,
    hideDocumentPanel
};