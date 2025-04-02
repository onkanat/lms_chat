// Enhanced RAG Core Implementation
// Provides advanced document processing, embedding, and retrieval capabilities

// Main RAG Enhanced object
const RAGEnhanced = {
    // State
    documents: [],
    chunks: [],
    embeddings: null,
    embeddingModel: null,
    isModelLoaded: false,
    isProcessing: false,
    
    // Settings
    settings: {
        chunkingStrategy: 'paragraph', // 'fixed', 'paragraph', 'semantic'
        chunkSize: 500,
        chunkOverlap: 100,
        topK: 5,
        similarityThreshold: 0.7,
        retrievalStrategy: 'hybrid', // 'keyword', 'semantic', 'hybrid'
        keywordWeight: 0.3,
        semanticWeight: 0.7
    },
    
    // Initialize the RAG Enhanced system
    async init() {
        console.log('Initializing RAG Enhanced...');
        
        // Load saved documents from localStorage
        this.loadDocuments();
        
        // Load saved settings from localStorage
        this.loadSettings();
        
        // Preload PDF.js if not already loaded
        try {
            if (typeof pdfjsLib === 'undefined') {
                console.log('Preloading PDF.js...');
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/pdf.js@3.9.179/build/pdf.min.js';
                    script.onload = () => {
                        // Set worker path after loading
                        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdf.js@3.9.179/build/pdf.worker.min.js';
                        console.log('PDF.js preloaded successfully');
                        resolve();
                    };
                    script.onerror = (error) => {
                        console.warn('Failed to preload PDF.js, will load on demand:', error);
                        resolve(); // Continue initialization even if PDF.js fails to load
                    };
                    document.head.appendChild(script);
                });
            }
        } catch (error) {
            console.warn('Error preloading PDF.js:', error);
            // Continue initialization even if PDF.js fails to load
        }
        
        // Initialize the embedding model
        try {
            await this.initEmbeddingModel();
            console.log('RAG Enhanced initialized successfully');
        } catch (error) {
            console.error('Error initializing RAG Enhanced:', error);
        }
    },
    
    // Load the embedding model
    async initEmbeddingModel() {
        try {
            // We'll use a simple Universal Sentence Encoder (USE) model
            // This is a lightweight model that works well for text embeddings
            this.isModelLoaded = false;
            
            // Load the model
            console.log('Loading embedding model...');
            this.embeddingModel = await tf.loadGraphModel(
                'https://tfhub.dev/tensorflow/tfjs-model/universal-sentence-encoder-lite/1/default/1',
                { fromTFHub: true }
            );
            
            this.isModelLoaded = true;
            console.log('Embedding model loaded successfully');
            
            // Process any existing documents
            if (this.documents.length > 0) {
                await this.processAllDocuments();
            }
            
            return true;
        } catch (error) {
            console.error('Error loading embedding model:', error);
            this.isModelLoaded = false;
            return false;
        }
    },
    
    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('rag_enhanced_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving RAG Enhanced settings:', error);
        }
    },
    
    // Load settings from localStorage
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('rag_enhanced_settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.error('Error loading RAG Enhanced settings:', error);
        }
    },
    
    // Update a setting
    updateSetting(key, value) {
        if (key in this.settings) {
            this.settings[key] = value;
            this.saveSettings();
            
            // If chunking settings changed, reprocess documents
            if (['chunkingStrategy', 'chunkSize', 'chunkOverlap'].includes(key)) {
                this.processAllDocuments();
            }
            
            return true;
        }
        return false;
    },
    
    // Save documents to localStorage
    saveDocuments() {
        try {
            // Only save document metadata, not the full content or embeddings
            const documentsToSave = this.documents.map(doc => ({
                id: doc.id,
                name: doc.name,
                type: doc.type,
                size: doc.size,
                dateAdded: doc.dateAdded,
                metadata: doc.metadata
            }));
            
            localStorage.setItem('rag_enhanced_documents', JSON.stringify(documentsToSave));
            
            // Save chunks separately
            localStorage.setItem('rag_enhanced_chunks', JSON.stringify(this.chunks));
        } catch (error) {
            console.error('Error saving RAG Enhanced documents:', error);
        }
    },
    
    // Load documents from localStorage
    loadDocuments() {
        try {
            // Load document metadata
            const savedDocuments = localStorage.getItem('rag_enhanced_documents');
            if (savedDocuments) {
                this.documents = JSON.parse(savedDocuments);
            }
            
            // Load chunks
            const savedChunks = localStorage.getItem('rag_enhanced_chunks');
            if (savedChunks) {
                this.chunks = JSON.parse(savedChunks);
            }
        } catch (error) {
            console.error('Error loading RAG Enhanced documents:', error);
            this.documents = [];
            this.chunks = [];
        }
    },
    
    // Get the number of documents
    getDocumentCount() {
        return this.documents.length;
    },
    
    // Get the number of chunks
    getChunkCount() {
        return this.chunks.length;
    },
    
    // Add a document
    async addDocument(file) {
        try {
            this.isProcessing = true;
            
            // Extract text based on file type
            const text = await this.extractTextFromFile(file);
            
            if (!text) {
                throw new Error('Could not extract text from file');
            }
            
            // Create document object
            const document = {
                id: 'doc-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5),
                name: file.name,
                type: file.type,
                size: file.size,
                dateAdded: new Date().toISOString(),
                content: text,
                metadata: {
                    wordCount: text.split(/\s+/).length,
                    charCount: text.length
                }
            };
            
            // Add document to collection
            this.documents.push(document);
            
            // Process the document (chunk and embed)
            await this.processDocument(document);
            
            // Save to localStorage
            this.saveDocuments();
            
            this.isProcessing = false;
            return document.id;
        } catch (error) {
            console.error('Error adding document:', error);
            this.isProcessing = false;
            throw error;
        }
    },
    
    // Extract text from a file based on its type
    async extractTextFromFile(file) {
        const reader = new FileReader();
        
        // Handle different file types
        if (file.type === 'application/pdf') {
            // PDF file
            return new Promise((resolve, reject) => {
                reader.onload = async function(event) {
                    try {
                        // Check if PDF.js is available
                        if (typeof pdfjsLib === 'undefined') {
                            // Load PDF.js dynamically if not available
                            console.log('PDF.js not loaded, loading it now...');
                            await new Promise((resolveScript, rejectScript) => {
                                const script = document.createElement('script');
                                script.src = 'https://cdn.jsdelivr.net/npm/pdf.js@3.9.179/build/pdf.min.js';
                                script.onload = () => {
                                    // Set worker path after loading
                                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdf.js@3.9.179/build/pdf.worker.min.js';
                                    resolveScript();
                                };
                                script.onerror = rejectScript;
                                document.head.appendChild(script);
                            });
                            console.log('PDF.js loaded successfully');
                        }
                        
                        const typedArray = new Uint8Array(event.target.result);
                        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                        
                        let text = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            const pageText = content.items.map(item => item.str).join(' ');
                            text += pageText + '\n\n';
                        }
                        
                        resolve(text);
                    } catch (error) {
                        console.error('Error extracting text from PDF:', error);
                        reject(error);
                    }
                };
                reader.onerror = function(error) {
                    console.error('Error reading file:', error);
                    reject(error);
                };
                reader.readAsArrayBuffer(file);
            });
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // DOCX file
            return new Promise((resolve, reject) => {
                reader.onload = async function(event) {
                    try {
                        const arrayBuffer = event.target.result;
                        const result = await mammoth.extractRawText({ arrayBuffer });
                        resolve(result.value);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
            // Text or Markdown file
            return new Promise((resolve, reject) => {
                reader.onload = function(event) {
                    resolve(event.target.result);
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
        } else {
            // Unsupported file type
            throw new Error(`Unsupported file type: ${file.type}`);
        }
    },
    
    // Process a document (chunk and embed)
    async processDocument(document) {
        try {
            // Chunk the document
            const documentChunks = this.chunkDocument(document);
            
            // Add chunks to collection
            this.chunks.push(...documentChunks);
            
            // Generate embeddings if model is loaded
            if (this.isModelLoaded) {
                await this.generateEmbeddings(documentChunks);
            }
            
            return documentChunks.length;
        } catch (error) {
            console.error('Error processing document:', error);
            throw error;
        }
    },
    
    // Process all documents
    async processAllDocuments() {
        try {
            this.isProcessing = true;
            
            // Clear existing chunks
            this.chunks = [];
            
            // Process each document
            for (const document of this.documents) {
                await this.processDocument(document);
            }
            
            // Save to localStorage
            this.saveDocuments();
            
            this.isProcessing = false;
            return true;
        } catch (error) {
            console.error('Error processing all documents:', error);
            this.isProcessing = false;
            throw error;
        }
    },
    
    // Chunk a document based on the selected strategy
    chunkDocument(document) {
        const { chunkingStrategy, chunkSize, chunkOverlap } = this.settings;
        const text = document.content;
        const chunks = [];
        
        if (chunkingStrategy === 'fixed') {
            // Fixed-size chunking
            let i = 0;
            while (i < text.length) {
                const chunk = text.substr(i, chunkSize);
                chunks.push({
                    id: `chunk-${document.id}-${i}`,
                    documentId: document.id,
                    documentName: document.name,
                    content: chunk,
                    startIndex: i,
                    endIndex: i + chunk.length,
                    embedding: null
                });
                i += chunkSize - chunkOverlap;
            }
        } else if (chunkingStrategy === 'paragraph') {
            // Paragraph-based chunking
            const paragraphs = text.split(/\\n\\s*\\n/);
            let currentChunk = '';
            let startIndex = 0;
            
            for (const paragraph of paragraphs) {
                if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
                    // Add current chunk
                    chunks.push({
                        id: `chunk-${document.id}-${startIndex}`,
                        documentId: document.id,
                        documentName: document.name,
                        content: currentChunk,
                        startIndex,
                        endIndex: startIndex + currentChunk.length,
                        embedding: null
                    });
                    
                    // Start new chunk with overlap
                    const words = currentChunk.split(/\\s+/);
                    const overlapWords = words.slice(-Math.floor(chunkOverlap / 5)); // Approximate word count
                    currentChunk = overlapWords.join(' ') + ' ' + paragraph;
                    startIndex = startIndex + currentChunk.length - overlapWords.join(' ').length;
                } else {
                    // Add paragraph to current chunk
                    if (currentChunk.length > 0) {
                        currentChunk += '\\n\\n';
                    }
                    currentChunk += paragraph;
                }
            }
            
            // Add the last chunk if not empty
            if (currentChunk.length > 0) {
                chunks.push({
                    id: `chunk-${document.id}-${startIndex}`,
                    documentId: document.id,
                    documentName: document.name,
                    content: currentChunk,
                    startIndex,
                    endIndex: startIndex + currentChunk.length,
                    embedding: null
                });
            }
        } else if (chunkingStrategy === 'semantic') {
            // Semantic chunking (simplified version)
            // In a real implementation, this would use more sophisticated methods
            // to identify semantic boundaries like section headers, topic changes, etc.
            
            // For now, we'll use a combination of paragraph and sentence boundaries
            const paragraphs = text.split(/\\n\\s*\\n/);
            let currentChunk = '';
            let startIndex = 0;
            
            for (const paragraph of paragraphs) {
                // Split paragraph into sentences
                const sentences = paragraph.split(/(?<=[.!?])\\s+/);
                
                for (const sentence of sentences) {
                    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
                        // Add current chunk
                        chunks.push({
                            id: `chunk-${document.id}-${startIndex}`,
                            documentId: document.id,
                            documentName: document.name,
                            content: currentChunk,
                            startIndex,
                            endIndex: startIndex + currentChunk.length,
                            embedding: null
                        });
                        
                        // Start new chunk with overlap
                        const words = currentChunk.split(/\\s+/);
                        const overlapWords = words.slice(-Math.floor(chunkOverlap / 5));
                        currentChunk = overlapWords.join(' ') + ' ' + sentence;
                        startIndex = startIndex + currentChunk.length - overlapWords.join(' ').length;
                    } else {
                        // Add sentence to current chunk
                        if (currentChunk.length > 0 && !currentChunk.endsWith(' ')) {
                            currentChunk += ' ';
                        }
                        currentChunk += sentence;
                    }
                }
                
                // Add paragraph break
                if (currentChunk.length > 0) {
                    currentChunk += '\\n\\n';
                }
            }
            
            // Add the last chunk if not empty
            if (currentChunk.length > 0) {
                chunks.push({
                    id: `chunk-${document.id}-${startIndex}`,
                    documentId: document.id,
                    documentName: document.name,
                    content: currentChunk,
                    startIndex,
                    endIndex: startIndex + currentChunk.length,
                    embedding: null
                });
            }
        }
        
        return chunks;
    },
    
    // Generate embeddings for chunks
    async generateEmbeddings(chunks) {
        if (!this.isModelLoaded || !this.embeddingModel) {
            throw new Error('Embedding model not loaded');
        }
        
        try {
            // Process in batches to avoid memory issues
            const batchSize = 10;
            for (let i = 0; i < chunks.length; i += batchSize) {
                const batch = chunks.slice(i, i + batchSize);
                const texts = batch.map(chunk => chunk.content);
                
                // Generate embeddings
                const embeddings = await this.embeddingModel.embed(texts);
                
                // Store embeddings in chunks
                for (let j = 0; j < batch.length; j++) {
                    batch[j].embedding = Array.from(embeddings.slice([j, 0], [1, -1]).dataSync());
                }
                
                // Free memory
                embeddings.dispose();
            }
            
            return true;
        } catch (error) {
            console.error('Error generating embeddings:', error);
            throw error;
        }
    },
    
    // Delete a document
    deleteDocument(documentId) {
        // Find the document
        const documentIndex = this.documents.findIndex(doc => doc.id === documentId);
        if (documentIndex === -1) {
            return false;
        }
        
        // Remove the document
        this.documents.splice(documentIndex, 1);
        
        // Remove associated chunks
        this.chunks = this.chunks.filter(chunk => chunk.documentId !== documentId);
        
        // Save to localStorage
        this.saveDocuments();
        
        return true;
    },
    
    // Augment a prompt with RAG context
    async augmentPromptWithRAG(prompt) {
        if (this.chunks.length === 0) {
            return {
                augmentedPrompt: prompt,
                context: []
            };
        }
        
        try {
            // Get relevant chunks
            const relevantChunks = await this.retrieveRelevantChunks(prompt);
            
            if (relevantChunks.length === 0) {
                return {
                    augmentedPrompt: prompt,
                    context: []
                };
            }
            
            // Create context string
            const contextString = relevantChunks
                .map(chunk => `Document: ${chunk.documentName}\nContent: ${chunk.content}\n`)
                .join('\n');
            
            // Create augmented prompt
            const augmentedPrompt = `I need information about the following: ${prompt}\n\nHere is some relevant context to help you answer:\n\n${contextString}\n\nBased on the above context, please answer: ${prompt}`;
            
            return {
                augmentedPrompt,
                context: relevantChunks
            };
        } catch (error) {
            console.error('Error augmenting prompt with RAG:', error);
            return {
                augmentedPrompt: prompt,
                context: []
            };
        }
    },
    
    // Retrieve relevant chunks for a query
    async retrieveRelevantChunks(query) {
        const { retrievalStrategy, topK, similarityThreshold, keywordWeight, semanticWeight } = this.settings;
        
        try {
            let relevantChunks = [];
            
            if (retrievalStrategy === 'keyword' || retrievalStrategy === 'hybrid') {
                // Keyword-based retrieval
                const keywordChunks = this.retrieveByKeywords(query);
                
                if (retrievalStrategy === 'keyword') {
                    relevantChunks = keywordChunks;
                } else {
                    // Store for hybrid approach
                    relevantChunks = keywordChunks.map(chunk => ({
                        ...chunk,
                        score: chunk.score * keywordWeight
                    }));
                }
            }
            
            if (retrievalStrategy === 'semantic' || retrievalStrategy === 'hybrid') {
                // Semantic retrieval (if model is loaded)
                if (this.isModelLoaded && this.embeddingModel) {
                    const semanticChunks = await this.retrieveBySimilarity(query);
                    
                    if (retrievalStrategy === 'semantic') {
                        relevantChunks = semanticChunks;
                    } else {
                        // Hybrid approach: combine keyword and semantic results
                        const semanticScored = semanticChunks.map(chunk => ({
                            ...chunk,
                            score: chunk.score * semanticWeight
                        }));
                        
                        // Merge results
                        const allChunks = [...relevantChunks, ...semanticScored];
                        
                        // Group by chunk ID and sum scores
                        const chunkMap = new Map();
                        for (const chunk of allChunks) {
                            if (chunkMap.has(chunk.id)) {
                                const existing = chunkMap.get(chunk.id);
                                existing.score += chunk.score;
                            } else {
                                chunkMap.set(chunk.id, { ...chunk });
                            }
                        }
                        
                        relevantChunks = Array.from(chunkMap.values());
                    }
                } else if (retrievalStrategy === 'semantic') {
                    // Fall back to keyword if semantic is not available
                    relevantChunks = this.retrieveByKeywords(query);
                }
            }
            
            // Sort by score (descending)
            relevantChunks.sort((a, b) => b.score - a.score);
            
            // Filter by threshold
            relevantChunks = relevantChunks.filter(chunk => chunk.score >= similarityThreshold);
            
            // Limit to top K
            relevantChunks = relevantChunks.slice(0, topK);
            
            return relevantChunks;
        } catch (error) {
            console.error('Error retrieving relevant chunks:', error);
            return [];
        }
    },
    
    // Retrieve chunks by keyword matching
    retrieveByKeywords(query) {
        // Tokenize query
        const queryTokens = query.toLowerCase().split(/\\W+/).filter(token => token.length > 2);
        
        // Score each chunk
        const scoredChunks = this.chunks.map(chunk => {
            const content = chunk.content.toLowerCase();
            let score = 0;
            
            // Count matches for each token
            for (const token of queryTokens) {
                const regex = new RegExp(token, 'g');
                const matches = content.match(regex);
                if (matches) {
                    score += matches.length;
                }
            }
            
            // Normalize by content length
            score = score / (content.length / 100);
            
            return { ...chunk, score };
        });
        
        // Filter out zero scores
        return scoredChunks.filter(chunk => chunk.score > 0);
    },
    
    // Retrieve chunks by embedding similarity
    async retrieveBySimilarity(query) {
        if (!this.isModelLoaded || !this.embeddingModel) {
            throw new Error('Embedding model not loaded');
        }
        
        try {
            // Generate query embedding
            const queryEmbedding = await this.embeddingModel.embed([query]);
            const queryVector = Array.from(queryEmbedding.dataSync());
            
            // Free memory
            queryEmbedding.dispose();
            
            // Score each chunk by cosine similarity
            const scoredChunks = this.chunks
                .filter(chunk => chunk.embedding) // Only consider chunks with embeddings
                .map(chunk => {
                    const similarity = this.cosineSimilarity(queryVector, chunk.embedding);
                    return { ...chunk, score: similarity };
                });
            
            return scoredChunks;
        } catch (error) {
            console.error('Error retrieving by similarity:', error);
            return [];
        }
    },
    
    // Calculate cosine similarity between two vectors
    cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) {
            return 0;
        }
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        if (normA === 0 || normB === 0) {
            return 0;
        }
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
};

// Export the RAG Enhanced object
window.RAGEnhanced = RAGEnhanced;