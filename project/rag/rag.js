// RAG (Retrieval-Augmented Generation) functionality

// In-memory document store
const documentStore = {
    documents: [],
    chunks: []
};

// Initialize RAG system
function init() {
    console.log("Initializing RAG system...");
    loadDocumentsFromLocalStorage();
    console.log("RAG system initialized successfully");
}

// Save documents to localStorage
function saveDocumentsToLocalStorage() {
    localStorage.setItem('rag_documents', JSON.stringify(documentStore.documents));
    localStorage.setItem('rag_chunks', JSON.stringify(documentStore.chunks));
}

// Load documents from localStorage
function loadDocumentsFromLocalStorage() {
    try {
        const savedDocuments = localStorage.getItem('rag_documents');
        const savedChunks = localStorage.getItem('rag_chunks');
        
        if (savedDocuments) {
            documentStore.documents = JSON.parse(savedDocuments);
        }
        
        if (savedChunks) {
            documentStore.chunks = JSON.parse(savedChunks);
        }
        
        updateDocumentList();
        console.log(`Loaded ${documentStore.documents.length} documents and ${documentStore.chunks.length} chunks from storage`);
    } catch (error) {
        console.error("Error loading documents from localStorage:", error);
    }
}

// Process and add a document to the store
function addDocument(file, content, type) {
    const documentId = RAGCoreUtils.generateId();
    const document = {
        id: documentId,
        name: file.name,
        type: type,
        content: content,
        dateAdded: new Date().toISOString()
    };
    
    documentStore.documents.push(document);
    
    const rawChunks = RAGCoreUtils.chunkDocument(document.content);
    const processedChunks = rawChunks.map((c, idx) => ({
        id: `${documentId}-chunk-${idx}`,
        documentId: documentId,
        documentName: file.name,
        content: c,
        startChar: idx * 500,
        endChar: (idx * 500) + c.length
    }));
    documentStore.chunks.push(...processedChunks);
    
    saveDocumentsToLocalStorage();
    updateDocumentList();
    
    return documentId;
}

// Retrieve relevant chunks for a query
function retrieveRelevantChunks(query, maxResults = 3) {
    if (documentStore.chunks.length === 0) {
        return [];
    }
    
    // Simple keyword-based retrieval (in a real implementation, this would use embeddings)
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 3);
    
    // Score each chunk based on term frequency
    const scoredChunks = documentStore.chunks.map(chunk => {
        const chunkText = chunk.content.toLowerCase();
        let score = 0;
        
        queryTerms.forEach(term => {
            const regex = new RegExp(term, 'g');
            const matches = chunkText.match(regex);
            if (matches) {
                score += matches.length;
            }
        });
        
        return { chunk, score };
    });
    
    // Sort by score and take top results
    const results = scoredChunks
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(item => item.chunk);
    
    return results;
}

// Handle file upload
function handleFileUpload(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const content = event.target.result;
                const fileType = file.type || 'text/plain';
                
                const documentId = addDocument(file, content, fileType);
                resolve(documentId);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Error reading file'));
        };
        
        if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
            reader.readAsText(file);
        } else {
            reject(new Error('Unsupported file type. Please upload text files only.'));
        }
    });
}

// Update the document list in the UI
function updateDocumentList() {
    const documentListElement = document.getElementById('document-list');
    if (!documentListElement) return;
    
    documentListElement.innerHTML = '';
    
    if (documentStore.documents.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-documents';
        emptyMessage.textContent = 'No documents added yet. Upload documents to enable RAG.';
        documentListElement.appendChild(emptyMessage);
        return;
    }
    
    documentStore.documents.forEach(doc => {
        const docElement = document.createElement('div');
        docElement.className = 'document-item';
        
        const docName = document.createElement('span');
        docName.className = 'document-name';
        docName.textContent = doc.name;
        
        const docActions = document.createElement('div');
        docActions.className = 'document-actions';
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'document-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => removeDocument(doc.id);
        
        docActions.appendChild(deleteButton);
        docElement.appendChild(docName);
        docElement.appendChild(docActions);
        documentListElement.appendChild(docElement);
    });
}

// Remove a document
function removeDocument(documentId) {
    documentStore.documents = documentStore.documents.filter(doc => doc.id !== documentId);
    documentStore.chunks = documentStore.chunks.filter(chunk => chunk.documentId !== documentId);
    
    saveDocumentsToLocalStorage();
    updateDocumentList();
}

// Clear all documents
function clearAllDocuments() {
    if (confirm('Are you sure you want to remove all documents?')) {
        documentStore.documents = [];
        documentStore.chunks = [];
        saveDocumentsToLocalStorage();
        updateDocumentList();
    }
}

// Augment a prompt with relevant context
function augmentPromptWithRAG(userMessage) {
    const relevantChunks = retrieveRelevantChunks(userMessage);
    
    if (relevantChunks.length === 0) {
        return {
            augmentedPrompt: userMessage,
            usedRAG: false,
            context: []
        };
    }
    
    // Format context from retrieved chunks
    const context = relevantChunks.map(chunk => {
        return `Document: ${chunk.documentName}\n${chunk.content}\n`;
    }).join('\n---\n\n');
    
    // Create augmented prompt
    const augmentedPrompt = 
        `I have the following context information:\n\n${context}\n\n` +
        `Using the context information (if relevant), please respond to the following question:\n${userMessage}`;
    
    return {
        augmentedPrompt: augmentedPrompt,
        usedRAG: true,
        context: relevantChunks
    };
}

// Export functions
window.RAG = {
    init,
    handleFileUpload,
    updateDocumentList,
    removeDocument,
    clearAllDocuments,
    augmentPromptWithRAG,
    getDocumentCount: () => documentStore.documents.length
};