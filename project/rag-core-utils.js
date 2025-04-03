// Ortak RAG yardımcı fonksiyonları

// Basit ID oluşturma
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Temel chunk'lama fonksiyonu
function chunkDocument(documentContent, chunkSize = 500, overlap = 100) {
    const chunks = [];
    for (let i = 0; i < documentContent.length; i += (chunkSize - overlap)) {
        const chunkText = documentContent.substr(i, chunkSize);
        if (chunkText.length < 50) {
            continue;
        }
        chunks.push(chunkText);
    }
    return chunks;
}

// Ortak dışa aktarımlar
window.RAGCoreUtils = {
    generateId,
    chunkDocument
};
