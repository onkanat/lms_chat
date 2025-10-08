// Enhanced RAG UI
// Handles the user interface for the enhanced RAG functionality

const RAGEnhancedUI = {
    // Initialize the RAG Enhanced UI
    init() {
        if (typeof document === 'undefined' || !document.createElement) {
            console.error('No DOM available');
            return;
        }

        // Create UI elements
        this.createRAGToggle();
        this.createRAGPanel();
        
        // Set up event listeners
        this.setupEventListeners();
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Document drag and drop
        const uploadSection = document.getElementById('rag-enhanced-upload-section');
        if (uploadSection) {
            uploadSection.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadSection.classList.add('drag-over');
            });
            
            uploadSection.addEventListener('dragleave', () => {
                uploadSection.classList.remove('drag-over');
            });
            
            uploadSection.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadSection.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    this.handleFileUpload(e.dataTransfer.files);
                }
            });
        }
        
        // File input change
        const fileInput = document.getElementById('rag-enhanced-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files);
                }
            });
        }
        
        // Settings changes
        this.setupSettingsListeners();
    },
    
    // Set up listeners for settings controls
    setupSettingsListeners() {
        // Chunking strategy
        const chunkingStrategySelect = document.getElementById('rag-enhanced-chunking-strategy');
        if (chunkingStrategySelect) {
            chunkingStrategySelect.value = window.RAGEnhanced.settings.chunkingStrategy;
            chunkingStrategySelect.addEventListener('change', (e) => {
                window.RAGEnhanced.updateSetting('chunkingStrategy', e.target.value);
                this.updateDocumentList();
            });
        }
        
        // Chunk size
        const chunkSizeInput = document.getElementById('rag-enhanced-chunk-size');
        const chunkSizeValue = document.getElementById('rag-enhanced-chunk-size-value');
        if (chunkSizeInput && chunkSizeValue) {
            chunkSizeInput.value = window.RAGEnhanced.settings.chunkSize;
            chunkSizeValue.textContent = window.RAGEnhanced.settings.chunkSize;
            chunkSizeInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                chunkSizeValue.textContent = value;
                window.RAGEnhanced.updateSetting('chunkSize', value);
                this.updateDocumentList();
            });
        }
        
        // Chunk overlap
        const chunkOverlapInput = document.getElementById('rag-enhanced-chunk-overlap');
        const chunkOverlapValue = document.getElementById('rag-enhanced-chunk-overlap-value');
        if (chunkOverlapInput && chunkOverlapValue) {
            chunkOverlapInput.value = window.RAGEnhanced.settings.chunkOverlap;
            chunkOverlapValue.textContent = window.RAGEnhanced.settings.chunkOverlap;
            chunkOverlapInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                chunkOverlapValue.textContent = value;
                window.RAGEnhanced.updateSetting('chunkOverlap', value);
                this.updateDocumentList();
            });
        }
        
        // Top K
        const topKInput = document.getElementById('rag-enhanced-top-k');
        const topKValue = document.getElementById('rag-enhanced-top-k-value');
        if (topKInput && topKValue) {
            topKInput.value = window.RAGEnhanced.settings.topK;
            topKValue.textContent = window.RAGEnhanced.settings.topK;
            topKInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                topKValue.textContent = value;
                window.RAGEnhanced.updateSetting('topK', value);
            });
        }
        
        // Similarity threshold
        const similarityThresholdInput = document.getElementById('rag-enhanced-similarity-threshold');
        const similarityThresholdValue = document.getElementById('rag-enhanced-similarity-threshold-value');
        if (similarityThresholdInput && similarityThresholdValue) {
            similarityThresholdInput.value = window.RAGEnhanced.settings.similarityThreshold;
            similarityThresholdValue.textContent = window.RAGEnhanced.settings.similarityThreshold.toFixed(1);
            similarityThresholdInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                similarityThresholdValue.textContent = value.toFixed(1);
                window.RAGEnhanced.updateSetting('similarityThreshold', value);
            });
        }
        
        // Retrieval strategy
        const retrievalStrategySelect = document.getElementById('rag-enhanced-retrieval-strategy');
        if (retrievalStrategySelect) {
            retrievalStrategySelect.value = window.RAGEnhanced.settings.retrievalStrategy;
            retrievalStrategySelect.addEventListener('change', (e) => {
                window.RAGEnhanced.updateSetting('retrievalStrategy', e.target.value);
                this.updateWeightVisibility();
            });
        }
        
        // Keyword weight
        const keywordWeightInput = document.getElementById('rag-enhanced-keyword-weight');
        const keywordWeightValue = document.getElementById('rag-enhanced-keyword-weight-value');
        if (keywordWeightInput && keywordWeightValue) {
            keywordWeightInput.value = window.RAGEnhanced.settings.keywordWeight;
            keywordWeightValue.textContent = window.RAGEnhanced.settings.keywordWeight.toFixed(1);
            keywordWeightInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                keywordWeightValue.textContent = value.toFixed(1);
                window.RAGEnhanced.updateSetting('keywordWeight', value);
                
                // Update semantic weight to maintain sum of 1.0
                const semanticWeight = 1.0 - value;
                const semanticWeightInput = document.getElementById('rag-enhanced-semantic-weight');
                const semanticWeightValue = document.getElementById('rag-enhanced-semantic-weight-value');
                if (semanticWeightInput && semanticWeightValue) {
                    semanticWeightInput.value = semanticWeight;
                    semanticWeightValue.textContent = semanticWeight.toFixed(1);
                    window.RAGEnhanced.updateSetting('semanticWeight', semanticWeight);
                }
            });
        }
        
        // Semantic weight
        const semanticWeightInput = document.getElementById('rag-enhanced-semantic-weight');
        const semanticWeightValue = document.getElementById('rag-enhanced-semantic-weight-value');
        if (semanticWeightInput && semanticWeightValue) {
            semanticWeightInput.value = window.RAGEnhanced.settings.semanticWeight;
            semanticWeightValue.textContent = window.RAGEnhanced.settings.semanticWeight.toFixed(1);
            semanticWeightInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                semanticWeightValue.textContent = value.toFixed(1);
                window.RAGEnhanced.updateSetting('semanticWeight', value);
                
                // Update keyword weight to maintain sum of 1.0
                const keywordWeight = 1.0 - value;
                const keywordWeightInput = document.getElementById('rag-enhanced-keyword-weight');
                const keywordWeightValue = document.getElementById('rag-enhanced-keyword-weight-value');
                if (keywordWeightInput && keywordWeightValue) {
                    keywordWeightInput.value = keywordWeight;
                    keywordWeightValue.textContent = keywordWeight.toFixed(1);
                    window.RAGEnhanced.updateSetting('keywordWeight', keywordWeight);
                }
            });
        }
        
        // Update weight visibility based on retrieval strategy
        this.updateWeightVisibility();
    },
    
    // Update weight visibility based on retrieval strategy
    updateWeightVisibility() {
        const retrievalStrategy = window.RAGEnhanced.settings.retrievalStrategy;
        const keywordWeightGroup = document.getElementById('rag-enhanced-keyword-weight-group');
        const semanticWeightGroup = document.getElementById('rag-enhanced-semantic-weight-group');
        
        if (keywordWeightGroup && semanticWeightGroup) {
            if (retrievalStrategy === 'hybrid') {
                keywordWeightGroup.style.display = 'block';
                semanticWeightGroup.style.display = 'block';
            } else {
                keywordWeightGroup.style.display = 'none';
                semanticWeightGroup.style.display = 'none';
            }
        }
    },
    
    // Create the RAG toggle
    createRAGToggle() {
        // Eğer zaten oluşturulduysa tekrar oluşturma
        if (document.getElementById('rag-enhanced-toggle-container')) {
            console.log("RAG-Enhanced toggle zaten oluşturulmuş, tekrarlanmıyor.");
            return;
        }

        if (typeof document === 'undefined') {
            console.error('Document is not available in this environment.');
            return;
        }

        const serverUrlContainer = document.getElementById('server-url-container');
        if (!serverUrlContainer) return;
        
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'rag-enhanced-toggle-container';
        toggleContainer.id = 'rag-enhanced-toggle-container';
        
        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'rag-enhanced-toggle-label';
        toggleLabel.textContent = 'RAG';
        
        const toggle = document.createElement('label');
        toggle.className = 'rag-enhanced-toggle';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'rag-enhanced-toggle';
        
        const slider = document.createElement('span');
        slider.className = 'rag-enhanced-toggle-slider';
        
        toggle.appendChild(input);
        toggle.appendChild(slider);
        
        toggleContainer.appendChild(toggle);
        toggleContainer.appendChild(toggleLabel);
        
        // Add toggle button to open RAG panel
        const panelButton = document.createElement('button');
        panelButton.className = 'rag-enhanced-panel-button';
        panelButton.innerHTML = '📚';
        panelButton.title = 'Open RAG Panel';
        panelButton.addEventListener('click', () => {
            this.toggleRAGPanel();
        });
        
        toggleContainer.appendChild(panelButton);
        
        serverUrlContainer.appendChild(toggleContainer);
    },
    
    // Create the RAG panel
    createRAGPanel() {
        if (typeof document === 'undefined' || !document.createElement) {
            console.error('No DOM available');
            return;
        }

        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // Create the panel
        const panel = document.createElement('div');
        panel.className = 'rag-enhanced-panel';
        panel.id = 'rag-enhanced-panel';
        
        // Create the panel header
        const header = document.createElement('div');
        header.className = 'rag-enhanced-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Enhanced RAG';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-panel-button';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', () => {
            this.toggleRAGPanel();
        });
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create the panel content
        const content = document.createElement('div');
        content.className = 'rag-enhanced-panel-content';
        
        // Add upload section
        content.appendChild(this.createUploadSection());
        
        // Add document list
        content.appendChild(this.createDocumentList());
        
        // Add settings section
        content.appendChild(this.createSettingsSection());
        
        // Add the header and content to the panel
        panel.appendChild(header);
        panel.appendChild(content);
        
        // Add the panel to the app container
        appContainer.appendChild(panel);
    },
    
    // Create the upload section
    createUploadSection() {
        const section = document.createElement('div');
        section.className = 'rag-enhanced-upload-section';
        section.id = 'rag-enhanced-upload-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Upload Documents';
        
        const description = document.createElement('p');
        description.textContent = 'Drag and drop files here or click to upload';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'rag-enhanced-file-input';
        fileInput.multiple = true;
        fileInput.accept = '.txt,.md,.pdf,.docx';
        fileInput.style.display = 'none';
        
        const uploadButton = document.createElement('button');
        uploadButton.className = 'rag-enhanced-upload-button';
        uploadButton.textContent = 'Upload Files';
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });
        
        const info = document.createElement('div');
        info.className = 'rag-enhanced-upload-info';
        info.textContent = 'Supported formats: TXT, MD, PDF, DOCX';
        
        section.appendChild(title);
        section.appendChild(description);
        section.appendChild(fileInput);
        section.appendChild(uploadButton);
        section.appendChild(info);
        
        return section;
    },
    
    // Create the document list
    createDocumentList() {
        if (typeof document === 'undefined') {
            console.error('Document is not available in this environment.');
            return;
        }

        const section = document.createElement('div');
        section.className = 'rag-enhanced-document-list';
        section.id = 'rag-enhanced-document-list';
        
        const title = document.createElement('h4');
        title.textContent = 'Documents';
        
        section.appendChild(title);
        
        // Add document items
        this.updateDocumentList(section);
        
        return section;
    },
    
    // Update the document list
    updateDocumentList(container = null) {
        if (typeof document === 'undefined' || !document.createElement) {
            console.error('No DOM available');
            return;
        }
        
        const documentList = container || document.getElementById('rag-enhanced-document-list');
        if (!documentList) {
            console.error('Document list element not found.');
            return;
        }
        
        // Clear existing items (except the title)
        while (documentList.childNodes.length > 1) {
            documentList.removeChild(documentList.lastChild);
        }
        
        // Get documents
        const documents = window.RAGEnhanced.documents || [];
        
        if (documents.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'rag-enhanced-empty-message';
            emptyMessage.textContent = 'No documents uploaded yet';
            documentList.appendChild(emptyMessage);
            return;
        }
        
        // Add document items
        for (const doc of documents) {
            const item = document.createElement('div');
            item.className = 'rag-enhanced-document-item';
            item.dataset.id = doc.id;
            
            const info = document.createElement('div');
            info.className = 'rag-enhanced-document-info';
            
            const name = document.createElement('div');
            name.className = 'rag-enhanced-document-name';
            name.textContent = doc.name;
            
            const meta = document.createElement('div');
            meta.className = 'rag-enhanced-document-meta';
            
            // Format file size
            let sizeText = '';
            if (doc.size < 1024) {
                sizeText = `${doc.size} B`;
            } else if (doc.size < 1024 * 1024) {
                sizeText = `${(doc.size / 1024).toFixed(1)} KB`;
            } else {
                sizeText = `${(doc.size / (1024 * 1024)).toFixed(1)} MB`;
            }
            
            // Get chunk count
            const chunkCount = window.RAGEnhanced.chunks?.filter(chunk => chunk.documentId === doc.id).length || 0;
            
            meta.textContent = `${sizeText} • ${chunkCount} chunks • Added ${new Date(doc.dateAdded).toLocaleDateString()}`;
            
            info.appendChild(name);
            info.appendChild(meta);
            
            const actions = document.createElement('div');
            actions.className = 'rag-enhanced-document-actions';
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'rag-enhanced-document-delete';
            deleteButton.innerHTML = '🗑️';
            deleteButton.title = 'Delete document';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Delete document "${doc.name}"?`)) {
                    window.RAGEnhanced.deleteDocument(doc.id);
                    this.updateDocumentList();
                }
            });
            
            actions.appendChild(deleteButton);
            
            item.appendChild(info);
            item.appendChild(actions);
            
            documentList.appendChild(item);
        }
        
        // Add summary
        const summary = document.createElement('div');
        summary.className = 'rag-enhanced-document-summary';
        summary.textContent = `${documents.length} document(s), ${window.RAGEnhanced.getChunkCount()} chunks`;
        documentList.appendChild(summary);
    },
    
    // Create the settings section
    createSettingsSection() {
        const section = document.createElement('div');
        section.className = 'rag-enhanced-settings-section';
        section.id = 'rag-enhanced-settings-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Settings';
        
        section.appendChild(title);
        
        // Chunking settings
        const chunkingTitle = document.createElement('h5');
        chunkingTitle.textContent = 'Chunking';
        section.appendChild(chunkingTitle);
        
        // Chunking strategy
        const chunkingStrategyGroup = document.createElement('div');
        chunkingStrategyGroup.className = 'rag-enhanced-setting-group';
        
        const chunkingStrategyLabel = document.createElement('label');
        chunkingStrategyLabel.textContent = 'Chunking Strategy';
        chunkingStrategyLabel.htmlFor = 'rag-enhanced-chunking-strategy';
        
        const chunkingStrategySelect = document.createElement('select');
        chunkingStrategySelect.id = 'rag-enhanced-chunking-strategy';
        
        const strategies = [
            { value: 'fixed', label: 'Fixed Size' },
            { value: 'paragraph', label: 'Paragraph' },
            { value: 'semantic', label: 'Semantic' }
        ];
        
        for (const strategy of strategies) {
            const option = document.createElement('option');
            option.value = strategy.value;
            option.textContent = strategy.label;
            chunkingStrategySelect.appendChild(option);
        }
        
        chunkingStrategyGroup.appendChild(chunkingStrategyLabel);
        chunkingStrategyGroup.appendChild(chunkingStrategySelect);
        section.appendChild(chunkingStrategyGroup);
        
        // Chunk size
        const chunkSizeGroup = document.createElement('div');
        chunkSizeGroup.className = 'rag-enhanced-setting-group';
        
        const chunkSizeLabel = document.createElement('label');
        chunkSizeLabel.textContent = 'Chunk Size';
        chunkSizeLabel.htmlFor = 'rag-enhanced-chunk-size';
        
        const chunkSizeInput = document.createElement('input');
        chunkSizeInput.type = 'range';
        chunkSizeInput.id = 'rag-enhanced-chunk-size';
        chunkSizeInput.min = '100';
        chunkSizeInput.max = '2000';
        chunkSizeInput.step = '100';
        
        const chunkSizeValue = document.createElement('span');
        chunkSizeValue.className = 'rag-enhanced-setting-value';
        chunkSizeValue.id = 'rag-enhanced-chunk-size-value';
        
        chunkSizeGroup.appendChild(chunkSizeLabel);
        chunkSizeGroup.appendChild(chunkSizeInput);
        chunkSizeGroup.appendChild(chunkSizeValue);
        section.appendChild(chunkSizeGroup);
        
        // Chunk overlap
        const chunkOverlapGroup = document.createElement('div');
        chunkOverlapGroup.className = 'rag-enhanced-setting-group';
        
        const chunkOverlapLabel = document.createElement('label');
        chunkOverlapLabel.textContent = 'Chunk Overlap';
        chunkOverlapLabel.htmlFor = 'rag-enhanced-chunk-overlap';
        
        const chunkOverlapInput = document.createElement('input');
        chunkOverlapInput.type = 'range';
        chunkOverlapInput.id = 'rag-enhanced-chunk-overlap';
        chunkOverlapInput.min = '0';
        chunkOverlapInput.max = '500';
        chunkOverlapInput.step = '50';
        
        const chunkOverlapValue = document.createElement('span');
        chunkOverlapValue.className = 'rag-enhanced-setting-value';
        chunkOverlapValue.id = 'rag-enhanced-chunk-overlap-value';
        
        chunkOverlapGroup.appendChild(chunkOverlapLabel);
        chunkOverlapGroup.appendChild(chunkOverlapInput);
        chunkOverlapGroup.appendChild(chunkOverlapValue);
        section.appendChild(chunkOverlapGroup);
        
        // Retrieval settings
        const retrievalTitle = document.createElement('h5');
        retrievalTitle.textContent = 'Retrieval';
        section.appendChild(retrievalTitle);
        
        // Top K
        const topKGroup = document.createElement('div');
        topKGroup.className = 'rag-enhanced-setting-group';
        
        const topKLabel = document.createElement('label');
        topKLabel.textContent = 'Number of Chunks to Retrieve (K)';
        topKLabel.htmlFor = 'rag-enhanced-top-k';
        
        const topKInput = document.createElement('input');
        topKInput.type = 'range';
        topKInput.id = 'rag-enhanced-top-k';
        topKInput.min = '1';
        topKInput.max = '10';
        topKInput.step = '1';
        
        const topKValue = document.createElement('span');
        topKValue.className = 'rag-enhanced-setting-value';
        topKValue.id = 'rag-enhanced-top-k-value';
        
        topKGroup.appendChild(topKLabel);
        topKGroup.appendChild(topKInput);
        topKGroup.appendChild(topKValue);
        section.appendChild(topKGroup);
        
        // Similarity threshold
        const similarityThresholdGroup = document.createElement('div');
        similarityThresholdGroup.className = 'rag-enhanced-setting-group';
        
        const similarityThresholdLabel = document.createElement('label');
        similarityThresholdLabel.textContent = 'Similarity Threshold';
        similarityThresholdLabel.htmlFor = 'rag-enhanced-similarity-threshold';
        
        const similarityThresholdInput = document.createElement('input');
        similarityThresholdInput.type = 'range';
        similarityThresholdInput.id = 'rag-enhanced-similarity-threshold';
        similarityThresholdInput.min = '0.1';
        similarityThresholdInput.max = '0.9';
        similarityThresholdInput.step = '0.1';
        
        const similarityThresholdValue = document.createElement('span');
        similarityThresholdValue.className = 'rag-enhanced-setting-value';
        similarityThresholdValue.id = 'rag-enhanced-similarity-threshold-value';
        
        similarityThresholdGroup.appendChild(similarityThresholdLabel);
        similarityThresholdGroup.appendChild(similarityThresholdInput);
        similarityThresholdGroup.appendChild(similarityThresholdValue);
        section.appendChild(similarityThresholdGroup);
        
        // Retrieval strategy
        const retrievalStrategyGroup = document.createElement('div');
        retrievalStrategyGroup.className = 'rag-enhanced-setting-group';
        
        const retrievalStrategyLabel = document.createElement('label');
        retrievalStrategyLabel.textContent = 'Retrieval Strategy';
        retrievalStrategyLabel.htmlFor = 'rag-enhanced-retrieval-strategy';
        
        const retrievalStrategySelect = document.createElement('select');
        retrievalStrategySelect.id = 'rag-enhanced-retrieval-strategy';
        
        const retrievalStrategies = [
            { value: 'keyword', label: 'Keyword' },
            { value: 'semantic', label: 'Semantic' },
            { value: 'hybrid', label: 'Hybrid (Keyword + Semantic)' }
        ];
        
        for (const strategy of retrievalStrategies) {
            const option = document.createElement('option');
            option.value = strategy.value;
            option.textContent = strategy.label;
            retrievalStrategySelect.appendChild(option);
        }
        
        retrievalStrategyGroup.appendChild(retrievalStrategyLabel);
        retrievalStrategyGroup.appendChild(retrievalStrategySelect);
        section.appendChild(retrievalStrategyGroup);
        
        // Keyword weight (for hybrid)
        const keywordWeightGroup = document.createElement('div');
        keywordWeightGroup.className = 'rag-enhanced-setting-group';
        keywordWeightGroup.id = 'rag-enhanced-keyword-weight-group';
        
        const keywordWeightLabel = document.createElement('label');
        keywordWeightLabel.textContent = 'Keyword Weight';
        keywordWeightLabel.htmlFor = 'rag-enhanced-keyword-weight';
        
        const keywordWeightInput = document.createElement('input');
        keywordWeightInput.type = 'range';
        keywordWeightInput.id = 'rag-enhanced-keyword-weight';
        keywordWeightInput.min = '0';
        keywordWeightInput.max = '1';
        keywordWeightInput.step = '0.1';
        
        const keywordWeightValue = document.createElement('span');
        keywordWeightValue.className = 'rag-enhanced-setting-value';
        keywordWeightValue.id = 'rag-enhanced-keyword-weight-value';
        
        keywordWeightGroup.appendChild(keywordWeightLabel);
        keywordWeightGroup.appendChild(keywordWeightInput);
        keywordWeightGroup.appendChild(keywordWeightValue);
        section.appendChild(keywordWeightGroup);
        
        // Semantic weight (for hybrid)
        const semanticWeightGroup = document.createElement('div');
        semanticWeightGroup.className = 'rag-enhanced-setting-group';
        semanticWeightGroup.id = 'rag-enhanced-semantic-weight-group';
        
        const semanticWeightLabel = document.createElement('label');
        semanticWeightLabel.textContent = 'Semantic Weight';
        semanticWeightLabel.htmlFor = 'rag-enhanced-semantic-weight';
        
        const semanticWeightInput = document.createElement('input');
        semanticWeightInput.type = 'range';
        semanticWeightInput.id = 'rag-enhanced-semantic-weight';
        semanticWeightInput.min = '0';
        semanticWeightInput.max = '1';
        semanticWeightInput.step = '0.1';
        
        const semanticWeightValue = document.createElement('span');
        semanticWeightValue.className = 'rag-enhanced-setting-value';
        semanticWeightValue.id = 'rag-enhanced-semantic-weight-value';
        
        semanticWeightGroup.appendChild(semanticWeightLabel);
        semanticWeightGroup.appendChild(semanticWeightInput);
        semanticWeightGroup.appendChild(semanticWeightValue);
        section.appendChild(semanticWeightGroup);
        
        return section;
    },
    
    // Toggle the RAG panel
    toggleRAGPanel() {
        const panel = document.getElementById('rag-enhanced-panel');
        if (panel) {
            panel.classList.toggle('visible');
            
            // Update document list when panel is shown
            if (panel.classList.contains('visible')) {
                this.updateDocumentList();
            }
        }
    },
    
    // Handle file upload
    async handleFileUpload(files) {
        if (!files || files.length === 0) {
            console.error('No files provided for upload.');
            return;
        }

        try {
            // Show loading indicator
            this.showLoading();
            
            // Process each file
            Array.from(files).forEach((file) => {
                if (!['application/pdf', 'text/plain', 'text/markdown'].includes(file.type)) {
                    console.error('Unsupported file type:', file.type);
                    return;
                }

                // Add document
                window.RAGEnhanced.addDocument(file);
            });
            
            // Update document list
            this.updateDocumentList();
            
            // Hide loading indicator
            this.hideLoading();
            
            // Show success message
            alert(`${files.length} file(s) uploaded successfully`);
        } catch (error) {
            console.error('Error uploading files:', error);
            alert(`Error uploading files: ${error.message}`);
            
            // Hide loading indicator
            this.hideLoading();
        }
    },
    
    // Check if file type is supported
    isFileTypeSupported(fileType) {
        const supportedTypes = [
            'text/plain',
            'text/markdown',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        return supportedTypes.includes(fileType);
    },
    
    // Show loading indicator
    showLoading() {
        const documentList = document.getElementById('rag-enhanced-document-list');
        if (!documentList) return;
        
        const loading = document.createElement('div');
        loading.className = 'rag-enhanced-loading';
        loading.id = 'rag-enhanced-loading';
        
        const spinner = document.createElement('div');
        spinner.className = 'rag-enhanced-loading-spinner';
        
        loading.appendChild(spinner);
        documentList.appendChild(loading);
    },
    
    // Hide loading indicator
    hideLoading() {
        const loading = document.getElementById('rag-enhanced-loading');
        if (loading) {
            loading.remove();
        }
    },
    
    // Create RAG context element for messages
    createRAGContextElement(context) {
        if (!context || context.length === 0) {
            return null;
        }
        
        const contextDiv = document.createElement('div');
        contextDiv.className = 'rag-enhanced-context';
        
        const contextHeader = document.createElement('div');
        contextHeader.className = 'rag-enhanced-context-header';
        
        const contextTitle = document.createElement('div');
        contextTitle.className = 'rag-enhanced-context-title';
        contextTitle.textContent = `Sources (${context.length})`;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'rag-enhanced-context-toggle';
        toggleButton.textContent = 'Show sources';
        
        contextHeader.appendChild(contextTitle);
        contextHeader.appendChild(toggleButton);
        
        const contextContent = document.createElement('div');
        contextContent.className = 'rag-enhanced-context-content';
        
        // Add each source document
        context.forEach(chunk => {
            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'rag-enhanced-source';
            
            // Format content (truncate if too long)
            const content = chunk.content.length > 200 
                ? chunk.content.substring(0, 200) + '...' 
                : chunk.content;
            
            sourceDiv.innerHTML = `<strong>${chunk.documentName}</strong>: "${content}"`;
            
            // Add metadata if available
            if (chunk.score) {
                const metaDiv = document.createElement('div');
                metaDiv.className = 'rag-enhanced-source-meta';
                metaDiv.textContent = `Relevance: ${(chunk.score * 100).toFixed(0)}%`;
                sourceDiv.appendChild(metaDiv);
            }
            
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
};

// Export the RAG Enhanced UI
window.RAGEnhancedUI = RAGEnhancedUI;