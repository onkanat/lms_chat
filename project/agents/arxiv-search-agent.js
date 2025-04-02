// arXiv Search Agent
// Searches for papers on arXiv.org

const ArxivSearchAgent = {
    // arXiv API endpoint
    apiEndpoint: 'https://export.arxiv.org/api/query',
    
    // Execute an arXiv search request
    async execute(toolName, params) {
        console.log(`Executing arXiv search: ${JSON.stringify(params)}`);
        
        // Validate parameters
        if (!params.query) {
            return 'Error: Missing required parameter "query"';
        }
        
        // Get optional parameters with defaults
        const maxResults = parseInt(params.max_results || '5');
        const sortBy = params.sort_by || 'relevance';
        
        try {
            // Search arXiv
            const searchResults = await this.searchArxiv(params.query, maxResults, sortBy);
            
            // Format the results
            return this.formatSearchResults(params.query, searchResults);
        } catch (error) {
            console.error('arXiv search error:', error);
            return `Error searching arXiv: ${error.message}`;
        }
    },
    
    // Search arXiv for papers
    async searchArxiv(query, maxResults, sortBy) {
        try {
            // In a real implementation, this would make an API call to arXiv
            // For demonstration, we'll simulate the response
            return this.simulateArxivSearch(query, maxResults, sortBy);
        } catch (error) {
            throw new Error(`Failed to search arXiv: ${error.message}`);
        }
    },
    
    // Simulate an arXiv API call (for demonstration)
    simulateArxivSearch(query, maxResults, sortBy) {
        // Generate a deterministic but varied set of results based on the query
        const queryHash = this.simpleHash(query);
        
        // Categories based on common arXiv categories
        const categories = [
            'cs.AI', 'cs.CL', 'cs.CV', 'cs.LG', 'cs.NE',  // Computer Science
            'math.ST', 'math.OC',                         // Mathematics
            'physics.comp-ph', 'physics.data-an',         // Physics
            'q-bio.QM', 'q-bio.GN',                       // Quantitative Biology
            'stat.ML', 'stat.ME'                          // Statistics
        ];
        
        // Generate papers
        const papers = [];
        for (let i = 0; i < maxResults; i++) {
            const paperHash = this.simpleHash(query + i);
            const categoryIndex = (paperHash + i) % categories.length;
            const year = 2018 + (paperHash % 6);  // Papers from 2018-2023
            const month = 1 + (paperHash % 12);   // Month 1-12
            const day = 1 + (paperHash % 28);     // Day 1-28
            
            papers.push({
                id: `${year}.${(paperHash % 99999).toString().padStart(5, '0')}`,
                title: this.generatePaperTitle(query, paperHash),
                authors: this.generateAuthors(paperHash, 1 + (paperHash % 4)),
                summary: this.generatePaperSummary(query, paperHash),
                categories: [categories[categoryIndex]],
                published: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
                updated: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
                doi: paperHash % 3 === 0 ? `10.${1000 + (paperHash % 9000)}/journal.${(paperHash % 999999).toString(36)}` : null
            });
        }
        
        // Sort papers based on sortBy parameter
        if (sortBy === 'lastUpdatedDate') {
            papers.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        } else if (sortBy === 'submittedDate') {
            papers.sort((a, b) => new Date(b.published) - new Date(a.published));
        }
        
        return {
            query,
            totalResults: 50 + (queryHash % 950),  // Simulate total results count
            papers
        };
    },
    
    // Generate a paper title based on the query
    generatePaperTitle(query, hash) {
        const queryTerms = query.split(/\s+/).filter(term => term.length > 2);
        
        const titlePrefixes = [
            "Advances in",
            "Towards",
            "A Novel Approach to",
            "Improving",
            "On the",
            "Efficient",
            "Robust",
            "Deep",
            "Learning-based",
            "Optimizing"
        ];
        
        const titleMiddles = [
            "Methods for",
            "Techniques in",
            "Frameworks for",
            "Algorithms for",
            "Models of",
            "Applications of",
            "Systems for",
            "Approaches to",
            "Analysis of",
            "Evaluation of"
        ];
        
        const titleSuffixes = [
            "using Deep Learning",
            "with Neural Networks",
            "through Reinforcement Learning",
            "via Transfer Learning",
            "using Transformer Models",
            "with Attention Mechanisms",
            "through Multi-modal Learning",
            "using Graph Neural Networks",
            "with Self-supervised Learning",
            "via Federated Learning"
        ];
        
        const prefixIndex = hash % titlePrefixes.length;
        const middleIndex = (hash + 3) % titleMiddles.length;
        const suffixIndex = (hash + 7) % titleSuffixes.length;
        
        // Use at least one term from the query if available
        let queryTerm = "";
        if (queryTerms.length > 0) {
            const termIndex = hash % queryTerms.length;
            queryTerm = queryTerms[termIndex].charAt(0).toUpperCase() + queryTerms[termIndex].slice(1);
        }
        
        // Construct title with some randomness in structure
        if (hash % 3 === 0) {
            return `${titlePrefixes[prefixIndex]} ${queryTerm} ${titleMiddles[middleIndex]} ${query}`;
        } else if (hash % 3 === 1) {
            return `${titlePrefixes[prefixIndex]} ${titleMiddles[middleIndex]} ${query} ${titleSuffixes[suffixIndex]}`;
        } else {
            return `${queryTerm}: ${titleMiddles[middleIndex]} ${query} ${titleSuffixes[suffixIndex]}`;
        }
    },
    
    // Generate paper authors
    generateAuthors(hash, count) {
        const firstNames = [
            "James", "John", "Robert", "Michael", "William", 
            "David", "Richard", "Joseph", "Thomas", "Charles",
            "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", 
            "Barbara", "Susan", "Jessica", "Sarah", "Karen",
            "Wei", "Li", "Zhang", "Chen", "Liu",
            "Raj", "Priya", "Amit", "Sunita", "Rahul"
        ];
        
        const lastNames = [
            "Smith", "Johnson", "Williams", "Jones", "Brown",
            "Davis", "Miller", "Wilson", "Moore", "Taylor",
            "Anderson", "Thomas", "Jackson", "White", "Harris",
            "Wang", "Li", "Zhang", "Chen", "Liu",
            "Singh", "Kumar", "Patel", "Shah", "Gupta"
        ];
        
        const authors = [];
        for (let i = 0; i < count; i++) {
            const firstNameIndex = (hash + i * 3) % firstNames.length;
            const lastNameIndex = (hash + i * 7) % lastNames.length;
            authors.push(`${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`);
        }
        
        return authors;
    },
    
    // Generate a paper summary based on the query
    generatePaperSummary(query, hash) {
        const queryTerms = query.split(/\s+/).filter(term => term.length > 2);
        
        const summaryTemplates = [
            "In this paper, we present a novel approach to {query} that outperforms existing methods. Our technique leverages recent advances in deep learning to address key challenges in the field. We evaluate our approach on several benchmark datasets and demonstrate significant improvements in performance metrics.",
            
            "We propose a new framework for {query} that addresses the limitations of current approaches. By integrating multiple learning paradigms, our method achieves state-of-the-art results while maintaining computational efficiency. Extensive experiments validate the effectiveness of our approach across diverse scenarios.",
            
            "This work introduces an innovative solution to the problem of {query}. We develop a theoretical foundation and implement a practical system that demonstrates superior performance. Our results show that the proposed method can be effectively applied to real-world applications with minimal adaptation.",
            
            "Recent advances in {query} have shown promising results, but significant challenges remain. In this paper, we address these challenges by developing a new algorithm that combines the strengths of existing approaches while mitigating their weaknesses. Our comprehensive evaluation demonstrates the robustness of our method.",
            
            "We present a comprehensive study of {query}, analyzing the trade-offs between different methodologies. Based on our findings, we propose a hybrid approach that achieves optimal performance across various metrics. Our work provides new insights into the fundamental aspects of the problem and opens avenues for future research.",
            
            "This paper explores the application of {query} to solve complex real-world problems. We develop a scalable and efficient framework that can handle large-scale data while maintaining high accuracy. Our experiments on diverse datasets demonstrate the versatility and effectiveness of the proposed approach.",
            
            "We investigate the theoretical foundations of {query} and derive new insights that lead to improved algorithms. Our analysis reveals important properties that have been overlooked in previous work. Based on these findings, we develop a novel method that achieves significant performance gains while maintaining theoretical guarantees.",
            
            "In this work, we address the challenging problem of {query} through a multi-disciplinary approach. By combining techniques from machine learning, optimization, and domain-specific knowledge, we develop a robust solution that generalizes well to unseen data. Our comprehensive evaluation validates the effectiveness of the proposed method.",
            
            "This paper presents a systematic study of {query}, identifying key factors that influence performance. We propose a new methodology that adaptively adjusts to different conditions, resulting in consistent improvements across diverse scenarios. Our findings provide valuable insights for practitioners and researchers in the field.",
            
            "We introduce a novel framework for {query} that achieves state-of-the-art performance while requiring minimal computational resources. Our approach leverages recent theoretical advances to develop efficient algorithms that scale to large datasets. Extensive experiments demonstrate the practical benefits of our method in real-world applications."
        ];
        
        const templateIndex = hash % summaryTemplates.length;
        let summary = summaryTemplates[templateIndex].replace(/{query}/g, query);
        
        // Add some technical terms related to the query
        if (queryTerms.length > 0) {
            const technicalTerms = [
                "gradient descent", "backpropagation", "convolutional networks", 
                "recurrent neural networks", "attention mechanisms", "transformers",
                "reinforcement learning", "unsupervised learning", "transfer learning",
                "federated learning", "generative models", "adversarial training"
            ];
            
            const termIndex1 = hash % technicalTerms.length;
            const termIndex2 = (hash + 5) % technicalTerms.length;
            
            const additionalSentence = `Our implementation utilizes ${technicalTerms[termIndex1]} and ${technicalTerms[termIndex2]} to achieve these results.`;
            summary += " " + additionalSentence;
        }
        
        return summary;
    },
    
    // Format search results for display
    formatSearchResults(query, searchData) {
        const { totalResults, papers } = searchData;
        
        if (papers.length === 0) {
            return `No papers found for query: "${query}"`;
        }
        
        let formattedResults = `### arXiv Search Results for: "${query}"\n\n`;
        formattedResults += `Found ${totalResults} papers in total. Showing ${papers.length} results.\n\n`;
        
        papers.forEach((paper, index) => {
            formattedResults += `**${index + 1}. [${paper.title}](https://arxiv.org/abs/${paper.id})**\n`;
            formattedResults += `**Authors:** ${paper.authors.join(', ')}\n`;
            formattedResults += `**Published:** ${paper.published} | **Categories:** ${paper.categories.join(', ')}\n`;
            formattedResults += `**Summary:** ${paper.summary}\n`;
            formattedResults += `**arXiv ID:** [${paper.id}](https://arxiv.org/abs/${paper.id}) | `;
            formattedResults += `[PDF](https://arxiv.org/pdf/${paper.id}.pdf) | `;
            formattedResults += `[Abstract](https://arxiv.org/abs/${paper.id})\n\n`;
        });
        
        return formattedResults;
    },
    
    // Simple hash function for generating deterministic but varied results
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
};

// Export the arXiv Search Agent
window.ArxivSearchAgent = ArxivSearchAgent;