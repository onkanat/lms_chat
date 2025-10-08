// Unified RAG UI
// Combines basic RAG and enhanced RAG functionality into a single interface

const UnifiedRAGUI = {
    // Initialize the Unified RAG UI
    init() {
        console.log("Initializing Unified RAG UI...");
        
        if (typeof document === 'undefined' || !document.createElement) {
            console.error('No DOM available');
            return;
        }

        // Create UI elements
        this.createRAGToggle();
        this.createRAGPanel();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize RAG systems
        this.initializeRAGSystems();
        
        console.log("Unified RAG UI initialized successfully");
    },
    
    // Initialize RAG systems
    async initializeRAGSystems() {
        console.log("Initializing RAG systems...");
        
        // Initialize basic RAG
        if (window.RAG && typeof window.RAG.init === 'function') {
            window.RAG.init();
            console.log("✓ Basic RAG system initialized");
        } else {
            console.error("✗ Basic RAG system not found or could not be initialized");
        }
        
        // Initialize enhanced RAG (async)
        try {
            if (window.RAGEnhanced && typeof window.RAGEnhanced.init === 'function') {
                await window.RAGEnhanced.init();
                console.log("✓ Enhanced RAG system initialized");
            } else {
                console.error("✗ Enhanced RAG system not found or could not be initialized");
            }
        } catch (error) {
            console.error("✗ Error initializing Enhanced RAG system:", error);
        }
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Document drag and drop
        const uploadSection = document.getElementById('unified-rag-upload-section');
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
        const fileInput = document.getElementById('unified-rag-file-input');
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
        const chunkingStrategySelect = document.getElementById('unified-rag-chunking-strategy');
        if (chunkingStrategySelect && window.RAGEnhanced) {
            chunkingStrategySelect.value = window.RAGEnhanced.settings.chunkingStrategy;
            chunkingStrategySelect.addEventListener('change', (e) => {
                window.RAGEnhanced.updateSetting('chunkingStrategy', e.target.value);
                this.updateDocumentList();
            });
        }
        
        // Chunk size
        const chunkSizeInput = document.getElementById('unified-rag-chunk-size');
        const chunkSizeValue = document.getElementById('unified-rag-chunk-size-value');
        if (chunkSizeInput && chunkSizeValue && window.RAGEnhanced) {
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
        const chunkOverlapInput = document.getElementById('unified-rag-chunk-overlap');
        const chunkOverlapValue = document.getElementById('unified-rag-chunk-overlap-value');
        if (chunkOverlapInput && chunkOverlapValue && window.RAGEnhanced) {
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
        const topKInput = document.getElementById('unified-rag-top-k');
        const topKValue = document.getElementById('unified-rag-top-k-value');
        if (topKInput && topKValue && window.RAGEnhanced) {
            topKInput.value = window.RAGEnhanced.settings.topK;
            topKValue.textContent = window.RAGEnhanced.settings.topK;
            topKInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                topKValue.textContent = value;
                window.RAGEnhanced.updateSetting('topK', value);
            });
        }
        
        // Similarity threshold
        const similarityThresholdInput = document.getElementById('unified-rag-similarity-threshold');
        const similarityThresholdValue = document.getElementById('unified-rag-similarity-threshold-value');
        if (similarityThresholdInput && similarityThresholdValue && window.RAGEnhanced) {
            similarityThresholdInput.value = window.RAGEnhanced.settings.similarityThreshold;
            similarityThresholdValue.textContent = window.RAGEnhanced.settings.similarityThreshold.toFixed(1);
            similarityThresholdInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                similarityThresholdValue.textContent = value.toFixed(1);
                window.RAGEnhanced.updateSetting('similarityThreshold', value);
            });
        }
        
        // Retrieval strategy
        const retrievalStrategySelect = document.getElementById('unified-rag-retrieval-strategy');
        if (retrievalStrategySelect && window.RAGEnhanced) {
            retrievalStrategySelect.value = window.RAGEnhanced.settings.retrievalStrategy;
            retrievalStrategySelect.addEventListener('change', (e) => {
                window.RAGEnhanced.updateSetting('retrievalStrategy', e.target.value);
                this.updateWeightVisibility();
            });
        }
        
        // Keyword weight
        const keywordWeightInput = document.getElementById('unified-rag-keyword-weight');
        const keywordWeightValue = document.getElementById('unified-rag-keyword-weight-value');
        if (keywordWeightInput && keywordWeightValue && window.RAGEnhanced) {
            keywordWeightInput.value = window.RAGEnhanced.settings.keywordWeight;
            keywordWeightValue.textContent = window.RAGEnhanced.settings.keywordWeight.toFixed(1);
            keywordWeightInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                keywordWeightValue.textContent = value.toFixed(1);
                window.RAGEnhanced.updateSetting('keywordWeight', value);
                
                // Update semantic weight to maintain sum of 1.0
                const semanticWeight = 1.0 - value;
                const semanticWeightInput = document.getElementById('unified-rag-semantic-weight');
                const semanticWeightValue = document.getElementById('unified-rag-semantic-weight-value');
                if (semanticWeightInput && semanticWeightValue) {
                    semanticWeightInput.value = semanticWeight;
                    semanticWeightValue.textContent = semanticWeight.toFixed(1);
                    window.RAGEnhanced.updateSetting('semanticWeight', semanticWeight);
                }
            });
        }
        
        // Semantic weight
        const semanticWeightInput = document.getElementById('unified-rag-semantic-weight');
        const semanticWeightValue = document.getElementById('unified-rag-semantic-weight-value');
        if (semanticWeightInput && semanticWeightValue && window.RAGEnhanced) {
            semanticWeightInput.value = window.RAGEnhanced.settings.semanticWeight;
            semanticWeightValue.textContent = window.RAGEnhanced.settings.semanticWeight.toFixed(1);
            semanticWeightInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                semanticWeightValue.textContent = value.toFixed(1);
                window.RAGEnhanced.updateSetting('semanticWeight', value);
                
                // Update keyword weight to maintain sum of 1.0
                const keywordWeight = 1.0 - value;
                const keywordWeightInput = document.getElementById('unified-rag-keyword-weight');
                const keywordWeightValue = document.getElementById('unified-rag-keyword-weight-value');
                if (keywordWeightInput && keywordWeightValue) {
                    keywordWeightInput.value = keywordWeight;
                    keywordWeightValue.textContent = keywordWeight.toFixed(1);
                    window.RAGEnhanced.updateSetting('keywordWeight', keywordWeight);
                }
            });
        }
        
        // Update weight visibility based on retrieval strategy
        this.updateWeightVisibility();
        
        // RAG mode selection
        const ragModeSelect = document.getElementById('unified-rag-mode');
        if (ragModeSelect) {
            ragModeSelect.addEventListener('change', (e) => {
                const mode = e.target.value;
                this.setRAGMode(mode);
            });
        }
    },
    
    // Set RAG mode (basic or enhanced)
    setRAGMode(mode) {
        const enhancedSettings = document.getElementById('unified-rag-enhanced-settings');
        if (enhancedSettings) {
            if (mode === 'enhanced') {
                enhancedSettings.style.display = 'block';
            } else {
                enhancedSettings.style.display = 'none';
            }
        }
        
        // Store the selected mode
        localStorage.setItem('unified-rag-mode', mode);
    },
    
    // Update weight visibility based on retrieval strategy
    updateWeightVisibility() {
        if (!window.RAGEnhanced) return;
        
        const retrievalStrategy = window.RAGEnhanced.settings.retrievalStrategy;
        const keywordWeightGroup = document.getElementById('unified-rag-keyword-weight-group');
        const semanticWeightGroup = document.getElementById('unified-rag-semantic-weight-group');
        
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
        if (document.getElementById('unified-rag-toggle-container')) {
            console.log("Unified RAG toggle already exists, not creating again.");
            return;
        }

        const serverUrlContainer = document.getElementById('server-url-container');
        if (!serverUrlContainer) return;
        
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'unified-rag-toggle-container';
        toggleContainer.id = 'unified-rag-toggle-container';
        
        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'unified-rag-toggle-label';
        toggleLabel.textContent = 'RAG';
        
        const toggle = document.createElement('label');
        toggle.className = 'unified-rag-toggle';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'unified-rag-toggle';
        
        const slider = document.createElement('span');
        slider.className = 'unified-rag-toggle-slider';
        
        toggle.appendChild(input);
        toggle.appendChild(slider);
        
        toggleContainer.appendChild(toggle);
        toggleContainer.appendChild(toggleLabel);
        
        // Add toggle button to open RAG panel
        const panelButton = document.createElement('button');
        panelButton.className = 'unified-rag-panel-button';
        panelButton.innerHTML = '📚';
        panelButton.title = 'Open RAG Panel';
        panelButton.addEventListener('click', () => {
            this.toggleRAGPanel();
        });
        
        toggleContainer.appendChild(panelButton);
        
        // Add event listener to toggle
        input.addEventListener('change', function() {
            document.body.classList.toggle('rag-enabled', this.checked);
        });
        
        serverUrlContainer.appendChild(toggleContainer);
    },
    
    // Create the RAG panel
    createRAGPanel() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // Create the panel
        const panel = document.createElement('div');
        panel.className = 'unified-rag-panel';
        panel.id = 'unified-rag-panel';
        
        // Create the panel header
        const header = document.createElement('div');
        header.className = 'unified-rag-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = 'RAG System';
        
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
        content.className = 'unified-rag-panel-content';
        
        // Add RAG mode selection
        content.appendChild(this.createRAGModeSection());
        
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
    
    // Create RAG mode selection section
    createRAGModeSection() {
        const section = document.createElement('div');
        section.className = 'unified-rag-mode-section';
        
        const title = document.createElement('h4');
        title.textContent = 'RAG Mode';
        
        const modeSelect = document.createElement('select');
        modeSelect.id = 'unified-rag-mode';
        modeSelect.className = 'unified-rag-mode-select';
        
        const basicOption = document.createElement('option');
        basicOption.value = 'basic';
        basicOption.textContent = 'Basic RAG';
        
        const enhancedOption = document.createElement('option');
        enhancedOption.value = 'enhanced';
        enhancedOption.textContent = 'Enhanced RAG (with Vector Embeddings)';
        
        modeSelect.appendChild(basicOption);
        modeSelect.appendChild(enhancedOption);
        
        // Set default mode or load from localStorage
        const savedMode = localStorage.getItem('unified-rag-mode') || 'enhanced';
        modeSelect.value = savedMode;
        
        section.appendChild(title);
        section.appendChild(modeSelect);
        
        return section;
    },
    
    // Create the upload section
    createUploadSection() {
        const section = document.createElement('div');
        section.className = 'unified-rag-upload-section';
        section.id = 'unified-rag-upload-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Upload Documents';
        
        const description = document.createElement('p');
        description.textContent = 'Drag and drop files here or click to upload';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'unified-rag-file-input';
        fileInput.multiple = true;
        fileInput.accept = '.txt,.md,.pdf,.docx';
        fileInput.style.display = 'none';
        
        const uploadButton = document.createElement('button');
        uploadButton.className = 'unified-rag-upload-button';
        uploadButton.textContent = 'Upload Files';
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });
        
        const info = document.createElement('div');
        info.className = 'unified-rag-upload-info';
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
        const section = document.createElement('div');
        section.className = 'unified-rag-document-list';
        section.id = 'unified-rag-document-list';
        
        const title = document.createElement('h4');
        title.textContent = 'Documents';
        
        section.appendChild(title);
        
        // Add document items
        this.updateDocumentList(section);
        
        return section;
    },
    
    // Update the document list
    updateDocumentList(container = null) {
        const documentList = container || document.getElementById('unified-rag-document-list');
        if (!documentList) {
            console.error('Document list element not found.');
            return;
        }
        
        // Clear existing items (except the title)
        while (documentList.childNodes.length > 1) {
            documentList.removeChild(documentList.lastChild);
        }
        
        // Get documents from the active RAG system
        let documents = [];
        const ragMode = document.getElementById('unified-rag-mode')?.value || 'enhanced';
        
        if (ragMode === 'enhanced' && window.RAGEnhanced) {
            documents = window.RAGEnhanced.documents || [];
        } else if (window.RAG) {
            documents = window.RAG.getDocuments() || [];
        }
        
        if (documents.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'unified-rag-empty-message';
            emptyMessage.textContent = 'No documents uploaded yet';
            documentList.appendChild(emptyMessage);
            return;
        }
        
        // Add document items
        for (const doc of documents) {
            const item = document.createElement('div');
            item.className = 'unified-rag-document-item';
            item.dataset.id = doc.id;
            
            const info = document.createElement('div');
            info.className = 'unified-rag-document-info';
            
            const name = document.createElement('div');
            name.className = 'unified-rag-document-name';
            name.textContent = doc.name;
            
            const meta = document.createElement('div');
            meta.className = 'unified-rag-document-meta';
            
            // Format file size
            let sizeText = '';
            if (doc.size < 1024) {
                sizeText = `${doc.size} B`;
            } else if (doc.size < 1024 * 1024) {
                sizeText = `${(doc.size / 1024).toFixed(1)} KB`;
            } else {
                sizeText = `${(doc.size / (1024 * 1024)).toFixed(1)} MB`;
            }
            
            // Get chunk count for enhanced RAG
            let chunkCount = 0;
            if (ragMode === 'enhanced' && window.RAGEnhanced) {
                chunkCount = window.RAGEnhanced.chunks?.filter(chunk => chunk.documentId === doc.id).length || 0;
            }
            
            meta.textContent = `${sizeText}${chunkCount ? ` • ${chunkCount} chunks` : ''} • Added ${new Date(doc.dateAdded).toLocaleDateString()}`;
            
            info.appendChild(name);
            info.appendChild(meta);
            
            const actions = document.createElement('div');
            actions.className = 'unified-rag-document-actions';
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'unified-rag-document-delete';
            deleteButton.innerHTML = '🗑️';
            deleteButton.title = 'Delete document';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Delete document "${doc.name}"?`)) {
                    if (ragMode === 'enhanced' && window.RAGEnhanced) {
                        window.RAGEnhanced.deleteDocument(doc.id);
                    } else if (window.RAG) {
                        window.RAG.deleteDocument(doc.id);
                    }
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
        summary.className = 'unified-rag-document-summary';
        
        if (ragMode === 'enhanced' && window.RAGEnhanced) {
            summary.textContent = `${documents.length} document(s), ${window.RAGEnhanced.getChunkCount()} chunks`;
        } else {
            summary.textContent = `${documents.length} document(s)`;
        }
        
        documentList.appendChild(summary);
    },
    
    // Create the settings section
    createSettingsSection() {
        const section = document.createElement('div');
        section.className = 'unified-rag-settings-section';
        section.id = 'unified-rag-settings-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Settings';
        
        section.appendChild(title);
        
        // Create enhanced RAG settings container
        const enhancedSettings = document.createElement('div');
        enhancedSettings.id = 'unified-rag-enhanced-settings';
        enhancedSettings.className = 'unified-rag-enhanced-settings';
        
        // Chunking settings
        const chunkingTitle = document.createElement('h5');
        chunkingTitle.textContent = 'Chunking';
        enhancedSettings.appendChild(chunkingTitle);
        
        // Chunking strategy
        const chunkingStrategyGroup = document.createElement('div');
        chunkingStrategyGroup.className = 'unified-rag-setting-group';
        
        const chunkingStrategyLabel = document.createElement('label');
        chunkingStrategyLabel.textContent = 'Chunking Strategy';
        chunkingStrategyLabel.htmlFor = 'unified-rag-chunking-strategy';
        
        const chunkingStrategySelect = document.createElement('select');
        chunkingStrategySelect.id = 'unified-rag-chunking-strategy';
        
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
        enhancedSettings.appendChild(chunkingStrategyGroup);
        
        // Chunk size
        const chunkSizeGroup = document.createElement('div');
        chunkSizeGroup.className = 'unified-rag-setting-group';
        
        const chunkSizeLabel = document.createElement('label');
        chunkSizeLabel.textContent = 'Chunk Size';
        chunkSizeLabel.htmlFor = 'unified-rag-chunk-size';
        
        const chunkSizeInput = document.createElement('input');
        chunkSizeInput.type = 'range';
        chunkSizeInput.id = 'unified-rag-chunk-size';
        chunkSizeInput.min = '100';
        chunkSizeInput.max = '2000';
        chunkSizeInput.step = '100';
        
        const chunkSizeValue = document.createElement('span');
        chunkSizeValue.className = 'unified-rag-setting-value';
        chunkSizeValue.id = 'unified-rag-chunk-size-value';
        
        chunkSizeGroup.appendChild(chunkSizeLabel);
        chunkSizeGroup.appendChild(chunkSizeInput);
        chunkSizeGroup.appendChild(chunkSizeValue);
        enhancedSettings.appendChild(chunkSizeGroup);
        
        // Chunk overlap
        const chunkOverlapGroup = document.createElement('div');
        chunkOverlapGroup.className = 'unified-rag-setting-group';
        
        const chunkOverlapLabel = document.createElement('label');
        chunkOverlapLabel.textContent = 'Chunk Overlap';
        chunkOverlapLabel.htmlFor = 'unified-rag-chunk-overlap';
        
        const chunkOverlapInput = document.createElement('input');
        chunkOverlapInput.type = 'range';
        chunkOverlapInput.id = 'unified-rag-chunk-overlap';
        chunkOverlapInput.min = '0';
        chunkOverlapInput.max = '500';
        chunkOverlapInput.step = '50';
        
        const chunkOverlapValue = document.createElement('span');
        chunkOverlapValue.className = 'unified-rag-setting-value';
        chunkOverlapValue.id = 'unified-rag-chunk-overlap-value';
        
        chunkOverlapGroup.appendChild(chunkOverlapLabel);
        chunkOverlapGroup.appendChild(chunkOverlapInput);
        chunkOverlapGroup.appendChild(chunkOverlapValue);
        enhancedSettings.appendChild(chunkOverlapGroup);
        
        // Retrieval settings
        const retrievalTitle = document.createElement('h5');
        retrievalTitle.textContent = 'Retrieval';
        enhancedSettings.appendChild(retrievalTitle);
        
        // Top K
        const topKGroup = document.createElement('div');
        topKGroup.className = 'unified-rag-setting-group';
        
        const topKLabel = document.createElement('label');
        topKLabel.textContent = 'Number of Chunks to Retrieve (K)';
        topKLabel.htmlFor = 'unified-rag-top-k';
        
        const topKInput = document.createElement('input');
        topKInput.type = 'range';
        topKInput.id = 'unified-rag-top-k';
        topKInput.min = '1';
        topKInput.max = '10';
        topKInput.step = '1';
        
        const topKValue = document.createElement('span');
        topKValue.className = 'unified-rag-setting-value';
        topKValue.id = 'unified-rag-top-k-value';
        
        topKGroup.appendChild(topKLabel);
        topKGroup.appendChild(topKInput);
        topKGroup.appendChild(topKValue);
        enhancedSettings.appendChild(topKGroup);
        
        // Similarity threshold
        const similarityThresholdGroup = document.createElement('div');
        similarityThresholdGroup.className = 'unified-rag-setting-group';
        
        const similarityThresholdLabel = document.createElement('label');
        similarityThresholdLabel.textContent = 'Similarity Threshold';
        similarityThresholdLabel.htmlFor = 'unified-rag-similarity-threshold';
        
        const similarityThresholdInput = document.createElement('input');
        similarityThresholdInput.type = 'range';
        similarityThresholdInput.id = 'unified-rag-similarity-threshold';
        similarityThresholdInput.min = '0.1';
        similarityThresholdInput.max = '0.9';
        similarityThresholdInput.step = '0.1';
        
        const similarityThresholdValue = document.createElement('span');
        similarityThresholdValue.className = 'unified-rag-setting-value';
        similarityThresholdValue.id = 'unified-rag-similarity-threshold-value';
        
        similarityThresholdGroup.appendChild(similarityThresholdLabel);
        similarityThresholdGroup.appendChild(similarityThresholdInput);
        similarityThresholdGroup.appendChild(similarityThresholdValue);
        enhancedSettings.appendChild(similarityThresholdGroup);
        
        // Retrieval strategy
        const retrievalStrategyGroup = document.createElement('div');
        retrievalStrategyGroup.className = 'unified-rag-setting-group';
        
        const retrievalStrategyLabel = document.createElement('label');
        retrievalStrategyLabel.textContent = 'Retrieval Strategy';
        retrievalStrategyLabel.htmlFor = 'unified-rag-retrieval-strategy';
        
        const retrievalStrategySelect = document.createElement('select');
        retrievalStrategySelect.id = 'unified-rag-retrieval-strategy';
        
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
        enhancedSettings.appendChild(retrievalStrategyGroup);
        
        // Keyword weight (for hybrid)
        const keywordWeightGroup = document.createElement('div');
        keywordWeightGroup.className = 'unified-rag-setting-group';
        keywordWeightGroup.id = 'unified-rag-keyword-weight-group';
        
        const keywordWeightLabel = document.createElement('label');
        keywordWeightLabel.textContent = 'Keyword Weight';
        keywordWeightLabel.htmlFor = 'unified-rag-keyword-weight';
        
        const keywordWeightInput = document.createElement('input');
        keywordWeightInput.type = 'range';
        keywordWeightInput.id = 'unified-rag-keyword-weight';
        keywordWeightInput.min = '0';
        keywordWeightInput.max = '1';
        keywordWeightInput.step = '0.1';
        
        const keywordWeightValue = document.createElement('span');
        keywordWeightValue.className = 'unified-rag-setting-value';
        keywordWeightValue.id = 'unified-rag-keyword-weight-value';
        
        keywordWeightGroup.appendChild(keywordWeightLabel);
        keywordWeightGroup.appendChild(keywordWeightInput);
        keywordWeightGroup.appendChild(keywordWeightValue);
        enhancedSettings.appendChild(keywordWeightGroup);
        
        // Semantic weight (for hybrid)
        const semanticWeightGroup = document.createElement('div');
        semanticWeightGroup.className = 'unified-rag-setting-group';
        semanticWeightGroup.id = 'unified-rag-semantic-weight-group';
        
        const semanticWeightLabel = document.createElement('label');
        semanticWeightLabel.textContent = 'Semantic Weight';
        semanticWeightLabel.htmlFor = 'unified-rag-semantic-weight';
        
        const semanticWeightInput = document.createElement('input');
        semanticWeightInput.type = 'range';
        semanticWeightInput.id = 'unified-rag-semantic-weight';
        semanticWeightInput.min = '0';
        semanticWeightInput.max = '1';
        semanticWeightInput.step = '0.1';
        
        const semanticWeightValue = document.createElement('span');
        semanticWeightValue.className = 'unified-rag-setting-value';
        semanticWeightValue.id = 'unified-rag-semantic-weight-value';
        
        semanticWeightGroup.appendChild(semanticWeightLabel);
        semanticWeightGroup.appendChild(semanticWeightInput);
        semanticWeightGroup.appendChild(semanticWeightValue);
        enhancedSettings.appendChild(semanticWeightGroup);
        
        // Add enhanced settings to main settings section
        section.appendChild(enhancedSettings);
        
        // Set initial visibility based on saved mode
        const savedMode = localStorage.getItem('unified-rag-mode') || 'enhanced';
        this.setRAGMode(savedMode);
        
        return section;
    },
    
    // Toggle the RAG panel
    toggleRAGPanel() {
        const panel = document.getElementById('unified-rag-panel');
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
            
            // Get current RAG mode
            const ragMode = document.getElementById('unified-rag-mode')?.value || 'enhanced';
            
            // Process each file
            Array.from(files).forEach((file) => {
                // Check file type
                if (!this.isFileTypeSupported(file.type)) {
                    console.error('Unsupported file type:', file.type);
                    return;
                }

                // Add document to the appropriate RAG system
                if (ragMode === 'enhanced' && window.RAGEnhanced) {
                    window.RAGEnhanced.addDocument(file);
                } else if (window.RAG) {
                    window.RAG.handleFileUpload(file);
                }
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
        const documentList = document.getElementById('unified-rag-document-list');
        if (!documentList) return;
        
        const loading = document.createElement('div');
        loading.className = 'unified-rag-loading';
        loading.id = 'unified-rag-loading';
        
        const spinner = document.createElement('div');
        spinner.className = 'unified-rag-loading-spinner';
        
        loading.appendChild(spinner);
        documentList.appendChild(loading);
    },
    
    // Hide loading indicator
    hideLoading() {
        const loading = document.getElementById('unified-rag-loading');
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
        contextDiv.className = 'unified-rag-context';
        
        const contextHeader = document.createElement('div');
        contextHeader.className = 'unified-rag-context-header';
        
        const contextTitle = document.createElement('div');
        contextTitle.className = 'unified-rag-context-title';
        contextTitle.textContent = `Sources (${context.length})`;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'unified-rag-context-toggle';
        toggleButton.textContent = 'Show sources';
        
        contextHeader.appendChild(contextTitle);
        contextHeader.appendChild(toggleButton);
        
        const contextContent = document.createElement('div');
        contextContent.className = 'unified-rag-context-content';
        
        // Add each source document
        context.forEach(chunk => {
            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'unified-rag-source';
            
            // Format content (truncate if too long)
            const content = chunk.content.length > 200 
                ? chunk.content.substring(0, 200) + '...' 
                : chunk.content;
            
            sourceDiv.innerHTML = `<strong>${chunk.documentName}</strong>: "${content}"`;
            
            // Add metadata if available
            if (chunk.score) {
                const metaDiv = document.createElement('div');
                metaDiv.className = 'unified-rag-source-meta';
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

// Export the Unified RAG UI
window.UnifiedRAGUI = UnifiedRAGUI;