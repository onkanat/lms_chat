// Enhanced RAG Core Implementation

const RAGEnhanced = {
    // Veritabanı
    documents: [],
    chunks: [],
    embeddings: {},
    isModelLoaded: false,
    embeddingModel: null,
    
    // Ayarlar
    settings: {
        chunkSize: 500,
        chunkOverlap: 100,
        chunkingStrategy: 'fixed',
        retrievalStrategy: 'hybrid',
        topK: 3,
        similarityThreshold: 0.5,
        keywordWeight: 0.3,
        semanticWeight: 0.7
    },
    
    // Başlatma
    async init() {
        console.log('RAG-Enhanced başlatılıyor...');
        
        try {
            // TensorFlow yüklenmiş mi kontrol et
            if (typeof tf === 'undefined') {
                console.error('TensorFlow.js bulunamadı! Sayfaya TensorFlow.js dahil edildiğinden emin olun.');
                throw new Error('TensorFlow.js bulunamadı');
            }
            console.log('TensorFlow.js bulundu:', tf.version.tfjs);
            
            // Yerel depodan verileri yükle
            this.loadFromLocalStorage();
            
            // Embedding modelini yükle
            await this.loadEmbeddingModel();
            
            // Eğer önceden yüklenmiş belgeler varsa ve embeddingler yoksa, embeddingleri oluştur
            if (this.chunks.length > 0 && Object.keys(this.embeddings).length === 0) {
                console.log('Varolan belgeler için embeddingler oluşturuluyor...');
                await this.rebuildAllEmbeddings();
            }
            
            console.log('RAG-Enhanced başarıyla başlatıldı');
        } catch (error) {
            console.error('RAG-Enhanced başlatılırken hata:', error);
            alert('RAG sistemini başlatırken sorun oluştu: ' + error.message);
        }
    },
    
    // Embedding modelini yükleme
    async loadEmbeddingModel() {
        if (this.isModelLoaded && this.embeddingModel) {
            console.log('Embedding modeli zaten yüklü');
            return;
        }
        
        try {
            console.log('Embedding modeli yükleniyor...');
            
            // Universal Sentence Encoder yüklenmemiş mi kontrol et
            if (typeof use === 'undefined') {
                console.warn('Universal Sentence Encoder bulunamadı, TFHub üzerinden yükleniyor...');
                
                // TFHub'dan modeli doğrudan yüklemeyi dene
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder';
                script.async = true;
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                
                if (typeof use === 'undefined') {
                    throw new Error('Universal Sentence Encoder yüklenemedi');
                }
            }
            
            console.log('Universal Sentence Encoder yüklemeye hazır.');
            
            // Doğrudan yüklemeyi dene
            try {
                console.log('USE doğrudan yükleniyor...');
                this.embeddingModel = await use.load();
                console.log('USE başarıyla yüklendi!');
                this.isModelLoaded = true;
                return;
            } catch (directError) {
                console.warn('Doğrudan yükleme başarısız:', directError);
            }
            
            // CORS proxy ile yüklemeyi dene
            const corsProxies = [
                'https://corsproxy.io/?',
                'https://api.allorigins.win/raw?url=',
                'https://crossorigin.me/',
                'https://cors-anywhere.herokuapp.com/'
            ];
            
            for (const proxyUrl of corsProxies) {
                try {
                    console.log(`${proxyUrl} proxy'si ile model yükleniyor...`);
                    const modelUrl = `${proxyUrl}https://tfhub.dev/google/universal-sentence-encoder/4`;
                    
                    // TF Hub model URL'sini proxy URL'si ile değiştir
                    this.embeddingModel = await use.load(modelUrl);
                    console.log(`${proxyUrl} kullanılarak model başarıyla yüklendi!`);
                    this.isModelLoaded = true;
                    return;
                } catch (proxyError) {
                    console.warn(`${proxyUrl} ile yükleme başarısız:`, proxyError);
                }
            }
            
            throw new Error('Hiçbir yöntemle embedding modeli yüklenemedi');
            
        } catch (error) {
            console.error('Embedding modeli yüklenemedi:', error);
            throw error;
        }
    },
    
    // Belge ekleme
    async addDocument(file) {
        try {
            console.log(`"${file.name}" belgesi ekleniyor...`);
            
            // Dosyayı oku
            const content = await this.readFileContent(file);
            
            // Belge oluştur
            const docId = RAGCoreUtils.generateId();
            const docObj = {
                id: docId,
                name: file.name,
                content: content,
                dateAdded: new Date().toISOString()
            };
            
            // Belgeyi kaydet
            this.documents.push(docObj);
            
            // Belgeyi parçala
            const chunks = await this.chunkDocument(docId, file.name, content);
            this.chunks.push(...chunks);
            
            // Parçaları embed et
            await this.embedChunks(chunks);
            
            // Değişiklikleri kaydet
            this.saveToLocalStorage();
            
            console.log(`"${file.name}" belgesi eklendi ve ${chunks.length} parça embed edildi`);
            return docId;
        } catch (error) {
            console.error('Belge eklenirken hata:', error);
            throw error;
        }
    },
    
    // Dosya içeriğini okuma
    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Dosya okunamadı: ' + e.target.error));
            reader.readAsText(file);
        });
    },
    
    // Belgeyi parçala
    async chunkDocument(docId, docName, content) {
        console.log(`"${docName}" belgesi parçalanıyor... (Strateji: ${this.settings.chunkingStrategy})`);
        
        const rawChunks = RAGCoreUtils.chunkDocument(content, this.settings.chunkSize, this.settings.chunkOverlap);
        const chunks = rawChunks.map((c, idx) => ({
            id: `${docId}-chunk-${idx}`,
            documentId: docId,
            documentName: docName,
            content: c,
            startChar: idx * this.settings.chunkSize,
            endChar: (idx * this.settings.chunkSize) + c.length
        }));
        
        console.log(`"${docName}" belgesi için ${chunks.length} parça oluşturuldu`);
        return chunks;
    },
    
    // Parçaları embed etme
    async embedChunks(chunks) {
        if (!this.isModelLoaded || !this.embeddingModel) {
            await this.loadEmbeddingModel();
        }
        
        if (!this.isModelLoaded) {
            throw new Error('Embedding modeli yüklenemedi');
        }
        
        console.log(`${chunks.length} parça embed ediliyor...`);
        
        // Parça içeriklerini hazırla
        const texts = chunks.map(chunk => chunk.content);
        
        // Progres göster
        let processed = 0;
        const total = chunks.length;
        const batchSize = 5; // Bellek sorunlarını önlemek için küçük gruplar halinde işle
        
        for (let i = 0; i < texts.length; i += batchSize) {
            const batch = texts.slice(i, i + batchSize);
            
            try {
                // Universal Sentence Encoder kullanarak embeddingler oluştur
                const embeddings = await this.embeddingModel.embed(batch);
                
                // Embedding vektörlerini çıkar (tf.Tensor'dan JavaScript dizisine dönüştür)
                const embeddingValues = await embeddings.array();
                
                // Her parça için embedding'i depola
                for (let j = 0; j < batch.length; j++) {
                    const chunkIndex = i + j;
                    const chunkId = chunks[chunkIndex].id;
                    this.embeddings[chunkId] = embeddingValues[j];
                }
                
                processed += batch.length;
                console.log(`Embed ilerlemesi: ${processed}/${total} (${Math.round(processed/total*100)}%)`);
                
                // Tensor'ı temizle
                embeddings.dispose();
            } catch (error) {
                console.error('Batch embed ederken hata:', error);
                throw error;
            }
        }
        
        console.log(`${texts.length} parça başarıyla embed edildi`);
        
        // Embedding boyutunu kontrol et
        const sampleEmbeddingId = Object.keys(this.embeddings)[0];
        if (sampleEmbeddingId) {
            const embeddingDim = this.embeddings[sampleEmbeddingId].length;
            console.log(`Embedding boyutu: ${embeddingDim}`);
        }
    },
    
    // Tüm embeddinglari yeniden oluştur
    async rebuildAllEmbeddings() {
        if (this.chunks.length === 0) {
            console.log('Embedding oluşturulacak hiç belge parçası yok');
            return;
        }
        
        try {
            console.log(`Tüm parçalar için embeddingler yeniden oluşturuluyor... (${this.chunks.length} parça)`);
            
            // Embeddingler temizlenir
            this.embeddings = {};
            
            // Tüm parçaları embed et
            await this.embedChunks(this.chunks);
            
            // Değişiklikleri kaydet
            this.saveToLocalStorage();
            
            console.log('Tüm embeddingler yeniden oluşturuldu');
        } catch (error) {
            console.error('Embeddingler yeniden oluşturulurken hata:', error);
            throw error;
        }
    },
    
    // Prompt'u RAG ile zenginleştir
    async augmentPromptWithRAG(query) {
        console.log('RAG zenginleştirmesi başlatılıyor...');
        
        try {
            // Alakalı parçaları al
            const relevantChunks = await this.retrieveRelevantChunks(query);
            
            if (relevantChunks.length === 0) {
                console.log('İlgili belge parçası bulunamadı');
                return {
                    augmentedPrompt: query,
                    usedRAG: false,
                    context: []
                };
            }
            
            console.log(`${relevantChunks.length} ilgili parça bulundu`);
            
            // Bağlamı formatla
            const context = relevantChunks
                .map(item => `Belge: ${item.chunk.documentName}\n${item.chunk.content}\n(Benzerlik: ${(item.score * 100).toFixed(1)}%)\n`)
                .join('\n---\n\n');
            
            // Zenginleştirilmiş prompt
            const augmentedPrompt = 
                `Aşağıdaki bağlam bilgilerini kullanarak soruyu yanıtla:\n\n${context}\n\n` +
                `Bu bağlam bilgilerini dikkate alarak şu soruyu yanıtla:\n${query}\n\n` +
                `Not: Bağlam bilgilerini kullanarak yanıt ver, bağlam dışı bilgi verme.`;
            
            return {
                augmentedPrompt: augmentedPrompt,
                usedRAG: true,
                context: relevantChunks.map(item => ({
                    ...item.chunk,
                    score: item.score
                }))
            };
        } catch (error) {
            console.error('RAG zenginleştirmesi sırasında hata:', error);
            throw error;
        }
    },
    
    // İlgili parçaları getir
    async retrieveRelevantChunks(query) {
        if (this.chunks.length === 0) {
            console.warn('Sistemde hiç belge parçası yok');
            return [];
        }
        
        if (Object.keys(this.embeddings).length === 0) {
            console.warn('Embeddingler oluşturulmamış');
            return [];
        }
        
        if (!this.isModelLoaded) {
            await this.loadEmbeddingModel();
        }
        
        const strategy = this.settings.retrievalStrategy;
        console.log(`İlgili parçalar getiriliyor... (Strateji: ${strategy})`);
        
        try {
            let scoredChunks = [];
            
            switch (strategy) {
                case 'semantic':
                    scoredChunks = await this.semanticSearch(query);
                    break;
                    
                case 'keyword':
                    scoredChunks = this.keywordSearch(query);
                    break;
                    
                case 'hybrid':
                default:
                    // Karma arama: Anahtar kelime + Semantik
                    const keywordResults = this.keywordSearch(query);
                    const semanticResults = await this.semanticSearch(query);
                    
                    // Sonuçları birleştir
                    const combinedResults = new Map();
                    
                    // Anahtar kelime sonuçlarını ekle
                    keywordResults.forEach(item => {
                        combinedResults.set(item.chunk.id, {
                            chunk: item.chunk,
                            keywordScore: item.score,
                            semanticScore: 0
                        });
                    });
                    
                    // Semantik sonuçları ekle veya güncelle
                    semanticResults.forEach(item => {
                        if (combinedResults.has(item.chunk.id)) {
                            const existing = combinedResults.get(item.chunk.id);
                            existing.semanticScore = item.score;
                        } else {
                            combinedResults.set(item.chunk.id, {
                                chunk: item.chunk,
                                keywordScore: 0,
                                semanticScore: item.score
                            });
                        }
                    });
                    
                    // Ağırlıklı skorları hesapla
                    const keywordWeight = this.settings.keywordWeight;
                    const semanticWeight = this.settings.semanticWeight;
                    
                    scoredChunks = Array.from(combinedResults.values()).map(item => ({
                        chunk: item.chunk,
                        score: (item.keywordScore * keywordWeight) + (item.semanticScore * semanticWeight)
                    }));
                    break;
            }
            
            // Skor eşiğini uygula
            scoredChunks = scoredChunks.filter(item => item.score >= this.settings.similarityThreshold);
            
            // Skora göre sırala ve en yüksek K sonucu al
            return scoredChunks
                .sort((a, b) => b.score - a.score)
                .slice(0, this.settings.topK);
                
        } catch (error) {
            console.error('İlgili parçalar getirilirken hata:', error);
            // Hata durumunda boş dizi döndür
            return [];
        }
    },
    
    // Anahtar kelime araması
    keywordSearch(query) {
        console.log('Anahtar kelime araması yapılıyor...');
        
        // Basit anahtar kelime tabanlı arama
        const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 3);
        
        // Term frekansına göre her parçaya puan ver
        const scoredChunks = this.chunks.map(chunk => {
            const chunkText = chunk.content.toLowerCase();
            let score = 0;
            let matchCount = 0;
            
            queryTerms.forEach(term => {
                const regex = new RegExp(term, 'g');
                const matches = chunkText.match(regex);
                if (matches) {
                    matchCount++;
                    score += matches.length * (term.length / 10); // Uzun terimler daha önemli
                }
            });
            
            // Queryterms'in ne kadarı eşleşti hesabı
            const coverage = queryTerms.length > 0 ? matchCount / queryTerms.length : 0;
            score = score * (0.5 + 0.5 * coverage); // Daha fazla terim eşleşmesine önem ver
            
            // Normalize et (0-1 aralığına getir)
            score = Math.min(1, score / (queryTerms.length * 2));
            
            return { chunk, score };
        });
        
        console.log(`Anahtar kelime araması tamamlandı: ${scoredChunks.length} sonuç`);
        return scoredChunks.filter(item => item.score > 0);
    },
    
    // Semantik arama
    async semanticSearch(query) {
        if (!this.isModelLoaded) {
            throw new Error('Embedding modeli yüklenemedi');
        }
        
        console.log('Semantik arama yapılıyor...');
        
        try {
            const queryEmbedding = await this.createEmbedding(query);
            if (!queryEmbedding) {
                throw new Error('Query embedding oluşturulamadı');
            }
            
            const scoredChunks = await Promise.all(this.chunks.map(async chunk => {
                const chunkEmbedding = this.getEmbedding(chunk.id);
                if (!chunkEmbedding) return { chunk, score: 0 };
                
                const similarityScore = this.cosineSimilarity(queryEmbedding, chunkEmbedding);
                return { chunk, score: similarityScore };
            }));
            
            console.log(`Semantik arama tamamlandı: ${scoredChunks.length} sonuç`);
            return scoredChunks;
            
        } catch (error) {
            console.error('Semantik arama sırasında hata:', error);
            throw error;
        }
    },
    
    // Embedding oluştur
    async createEmbedding(text) {
        try {
            if (!this.isModelLoaded || !this.embeddingModel) {
                await this.loadEmbeddingModel();
            }
            
            // Universal Sentence Encoder kullanarak embedding oluştur
            const embedding = await this.embeddingModel.embed(text);
            const embeddingArray = await embedding.array();
            
            // Tensor'ı temizle
            embedding.dispose();
            
            return embeddingArray[0];
        } catch (error) {
            console.error('Embedding oluşturulurken hata:', error);
            return null;
        }
    },
    
    // Kosinüs benzerliği hesaplama
    cosineSimilarity(vectorA, vectorB) {
        if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
            return 0;
        }
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }
        
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);
        
        if (normA === 0 || normB === 0) {
            return 0;
        }
        
        return dotProduct / (normA * normB);
    },
    
    // Embedding alma
    getEmbedding(chunkId) {
        const embedding = this.embeddings[chunkId];
        if (!embedding) console.warn(`${chunkId} için embedding bulunamadı`);
        return embedding || null;
    },
    
    // Yerel depoya kaydet
    saveToLocalStorage() {
        try {
            // Belgeleri ve parçaları kaydet
            localStorage.setItem('rag_enhanced_documents', JSON.stringify(this.documents));
            localStorage.setItem('rag_enhanced_chunks', JSON.stringify(this.chunks));
            
            // Embeddinglari kaydet (çok büyük olabilir, limitlerle ilgili dikkatli olmalı)
            try {
                localStorage.setItem('rag_enhanced_embeddings', JSON.stringify(this.embeddings));
                console.log('Embeddingler kaydedildi');
            } catch (embeddingError) {
                console.warn('Embeddingler kaydedilemedi, muhtemelen çok büyük:', embeddingError);
                // Embeddingler kaydedilemedi, bir dahaki sefere yeniden oluşturulmaları gerekecek
            }
            
            // Ayarları kaydet
            localStorage.setItem('rag_enhanced_settings', JSON.stringify(this.settings));
            
            console.log('Veriler yerel depoya kaydedildi');
        } catch (error) {
            console.error('Veriler yerel depoya kaydedilemedi:', error);
        }
    },
    
    // Yerel depodan yükle
    loadFromLocalStorage() {
        try {
            // Belgeleri yükle
            const savedDocuments = localStorage.getItem('rag_enhanced_documents');
            if (savedDocuments) {
                this.documents = JSON.parse(savedDocuments);
                console.log(`${this.documents.length} belge yüklendi`);
            }
            
            // Parçaları yükle
            const savedChunks = localStorage.getItem('rag_enhanced_chunks');
            if (savedChunks) {
                this.chunks = JSON.parse(savedChunks);
                console.log(`${this.chunks.length} belge parçası yüklendi`);
            }
            
            // Embeddinglari yükle
            const savedEmbeddings = localStorage.getItem('rag_enhanced_embeddings');
            if (savedEmbeddings) {
                try {
                    this.embeddings = JSON.parse(savedEmbeddings);
                    console.log(`${Object.keys(this.embeddings).length} embedding yüklendi`);
                    
                    // Embedding boyutunu kontrol et
                    const sampleEmbeddingId = Object.keys(this.embeddings)[0];
                    if (sampleEmbeddingId) {
                        const embeddingDim = this.embeddings[sampleEmbeddingId].length;
                        console.log(`Embedding boyutu: ${embeddingDim}`);
                    }
                } catch (embeddingError) {
                    console.warn('Embeddingler yüklenemedi:', embeddingError);
                    this.embeddings = {};
                }
            }
            
            // Ayarları yükle
            const savedSettings = localStorage.getItem('rag_enhanced_settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
                console.log('Ayarlar yüklendi');
            }
            
        } catch (error) {
            console.error('Veriler yerel depodan yüklenemedi:', error);
        }
    },
    
    // Yardımcı fonksiyonlar
    deleteDocument(docId) {
        // Belgeyi sil
        this.documents = this.documents.filter(doc => doc.id !== docId);
        
        // Silinen belgenin parçalarını bul
        const chunksToDelete = this.chunks.filter(chunk => chunk.documentId === docId);
        
        // Parçaları sil
        this.chunks = this.chunks.filter(chunk => chunk.documentId !== docId);
        
        // Embeddinglari sil
        chunksToDelete.forEach(chunk => {
            delete this.embeddings[chunk.id];
        });
        
        // Değişiklikleri kaydet
        this.saveToLocalStorage();
        
        console.log(`${docId} ID'li belge ve ilgili parçalar silindi`);
    },
    
    getChunkCount() {
        return this.chunks.length;
    },
    
    getDocumentCount() {
        return this.documents.length;
    },
    
    updateSetting(key, value) {
        if (key in this.settings) {
            this.settings[key] = value;
            this.saveToLocalStorage();
            console.log(`Ayar güncellendi: ${key} = ${value}`);
            return true;
        }
        return false;
    }
};

// RAGEnhanced'ı global olarak dışa aktar
window.RAGEnhanced = RAGEnhanced;