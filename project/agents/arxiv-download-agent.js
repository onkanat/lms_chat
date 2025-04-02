// arXiv Download Agent
// Gets details and download links for arXiv papers

const ArxivDownloadAgent = {
    // arXiv API endpoint
    apiEndpoint: 'https://export.arxiv.org/api/query',
    
    // Execute an arXiv download request
    async execute(toolName, params) {
        console.log(`Executing arXiv download: ${JSON.stringify(params)}`);
        
        // Validate parameters
        if (!params.paper_id) {
            return 'Error: Missing required parameter "paper_id"';
        }
        
        try {
            // Validate and format paper ID
            const paperId = this.validateAndFormatPaperId(params.paper_id);
            
            // Get paper details
            const paperDetails = await this.getPaperDetails(paperId);
            
            // Format the results
            return this.formatPaperDetails(paperDetails);
        } catch (error) {
            console.error('arXiv download error:', error);
            return `Error getting arXiv paper: ${error.message}`;
        }
    },
    
    // Validate and format arXiv paper ID
    validateAndFormatPaperId(paperId) {
        // Remove any 'arXiv:' prefix
        paperId = paperId.replace(/^arxiv:/i, '');
        
        // Remove any version suffix (e.g., v1, v2)
        paperId = paperId.replace(/v\d+$/, '');
        
        // Check if it's a valid arXiv ID format
        const oldFormatRegex = /^\d{4}\.\d{4,5}$/;
        const newFormatRegex = /^\d{2}(0[1-9]|1[0-2])\.\d{4,5}$/;
        
        if (!oldFormatRegex.test(paperId) && !newFormatRegex.test(paperId)) {
            throw new Error(`Invalid arXiv paper ID: ${paperId}`);
        }
        
        return paperId;
    },
    
    // Get paper details from arXiv
    async getPaperDetails(paperId) {
        try {
            // In a real implementation, this would make an API call to arXiv
            // For demonstration, we'll simulate the response
            return this.simulateGetPaperDetails(paperId);
        } catch (error) {
            throw new Error(`Failed to get paper details: ${error.message}`);
        }
    },
    
    // Simulate getting paper details (for demonstration)
    simulateGetPaperDetails(paperId) {
        // Generate deterministic paper details based on the ID
        const idHash = this.simpleHash(paperId);
        
        // Parse year and month from ID if it's in the new format
        let year, month;
        const newFormatMatch = paperId.match(/^(\d{2})(0[1-9]|1[0-2])\.\d{4,5}$/);
        if (newFormatMatch) {
            year = 2000 + parseInt(newFormatMatch[1]);
            month = parseInt(newFormatMatch[2]);
        } else {
            // For old format, use hash to generate date
            year = 2010 + (idHash % 14); // 2010-2023
            month = 1 + (idHash % 12);   // 1-12
        }
        
        const day = 1 + (idHash % 28);   // 1-28
        
        // Categories based on common arXiv categories
        const categories = [
            'cs.AI', 'cs.CL', 'cs.CV', 'cs.LG', 'cs.NE',  // Computer Science
            'math.ST', 'math.OC',                         // Mathematics
            'physics.comp-ph', 'physics.data-an',         // Physics
            'q-bio.QM', 'q-bio.GN',                       // Quantitative Biology
            'stat.ML', 'stat.ME'                          // Statistics
        ];
        
        const categoryIndex1 = idHash % categories.length;
        const categoryIndex2 = (idHash + 5) % categories.length;
        
        // Generate paper details
        return {
            id: paperId,
            title: this.generatePaperTitle(paperId, idHash),
            authors: this.generateAuthors(idHash, 2 + (idHash % 4)),
            summary: this.generatePaperSummary(paperId, idHash),
            categories: [categories[categoryIndex1], categories[categoryIndex2]],
            published: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            updated: `${year}-${month.toString().padStart(2, '0')}-${(day + (idHash % 5)).toString().padStart(2, '0')}`,
            doi: idHash % 3 === 0 ? `10.${1000 + (idHash % 9000)}/journal.${(idHash % 999999).toString(36)}` : null,
            comment: this.generateComment(idHash),
            journal_ref: idHash % 4 === 0 ? this.generateJournalReference(idHash, year) : null,
            pdf_url: `https://arxiv.org/pdf/${paperId}.pdf`,
            abstract_url: `https://arxiv.org/abs/${paperId}`,
            versions: this.generateVersions(paperId, idHash, year, month, day)
        };
    },
    
    // Generate a paper title based on the ID
    generatePaperTitle(paperId, hash) {
        const topics = [
            "Deep Learning", "Neural Networks", "Machine Learning", 
            "Artificial Intelligence", "Computer Vision", "Natural Language Processing",
            "Reinforcement Learning", "Generative Models", "Optimization",
            "Bayesian Methods", "Graph Neural Networks", "Transformers"
        ];
        
        const applications = [
            "for Image Recognition", "in Natural Language Understanding", 
            "for Time Series Analysis", "in Robotics", "for Healthcare",
            "in Autonomous Systems", "for Recommendation Systems", 
            "in Scientific Discovery", "for Climate Modeling",
            "in Drug Discovery", "for Social Network Analysis"
        ];
        
        const topicIndex = hash % topics.length;
        const appIndex = (hash + 3) % applications.length;
        
        const titleTemplates = [
            `${topics[topicIndex]} ${applications[appIndex]}: A Novel Approach`,
            `Advances in ${topics[topicIndex]} ${applications[appIndex]}`,
            `${topics[topicIndex]}: New Methods and Applications ${applications[appIndex]}`,
            `Improving ${topics[topicIndex]} Performance ${applications[appIndex]}`,
            `A Comprehensive Study of ${topics[topicIndex]} ${applications[appIndex]}`,
            `Efficient ${topics[topicIndex]} Algorithms ${applications[appIndex]}`,
            `${topics[topicIndex]} with Attention Mechanisms ${applications[appIndex]}`,
            `Robust ${topics[topicIndex]} Frameworks ${applications[appIndex]}`
        ];
        
        const templateIndex = hash % titleTemplates.length;
        return titleTemplates[templateIndex];
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
        
        const institutions = [
            "Stanford University", "MIT", "UC Berkeley", "Carnegie Mellon University",
            "University of Oxford", "ETH Zurich", "University of Cambridge",
            "Princeton University", "Harvard University", "Caltech",
            "Google Research", "Microsoft Research", "DeepMind", "OpenAI",
            "Facebook AI Research", "IBM Research", "Tsinghua University"
        ];
        
        const authors = [];
        for (let i = 0; i < count; i++) {
            const firstNameIndex = (hash + i * 3) % firstNames.length;
            const lastNameIndex = (hash + i * 7) % lastNames.length;
            const institutionIndex = (hash + i * 5) % institutions.length;
            
            authors.push({
                name: `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`,
                institution: institutions[institutionIndex]
            });
        }
        
        return authors;
    },
    
    // Generate a paper summary based on the ID
    generatePaperSummary(paperId, hash) {
        const methods = [
            "deep neural networks", "transformer models", "graph neural networks",
            "reinforcement learning", "generative adversarial networks", "attention mechanisms",
            "Bayesian inference", "variational autoencoders", "self-supervised learning",
            "multi-task learning", "transfer learning", "meta-learning"
        ];
        
        const applications = [
            "computer vision", "natural language processing", "speech recognition",
            "healthcare", "autonomous systems", "recommendation systems",
            "scientific discovery", "climate modeling", "drug discovery",
            "robotics", "financial forecasting", "social network analysis"
        ];
        
        const methodIndex1 = hash % methods.length;
        const methodIndex2 = (hash + 5) % methods.length;
        const appIndex = (hash + 3) % applications.length;
        
        const summaryTemplates = [
            `We present a novel approach using ${methods[methodIndex1]} for ${applications[appIndex]} tasks. Our method outperforms existing techniques by leveraging ${methods[methodIndex2]} to address key challenges in the field. We evaluate our approach on several benchmark datasets and demonstrate significant improvements in performance metrics.`,
            
            `This paper introduces an innovative framework combining ${methods[methodIndex1]} and ${methods[methodIndex2]} for solving complex problems in ${applications[appIndex]}. Our comprehensive evaluation shows that the proposed method achieves state-of-the-art results while maintaining computational efficiency. We provide theoretical guarantees and empirical validation of our approach.`,
            
            `We propose a new algorithm based on ${methods[methodIndex1]} that addresses the limitations of current approaches in ${applications[appIndex]}. By integrating ${methods[methodIndex2]}, our method achieves robust performance across diverse scenarios. Extensive experiments validate the effectiveness of our approach and demonstrate its practical applicability.`,
            
            `This work presents a systematic study of ${methods[methodIndex1]} for ${applications[appIndex]}. We identify key factors that influence performance and propose a novel ${methods[methodIndex2]}-based solution that adaptively adjusts to different conditions. Our findings provide valuable insights for practitioners and researchers in the field.`,
            
            `We develop a scalable and efficient framework for ${applications[appIndex]} using ${methods[methodIndex1]}. Our approach can handle large-scale data while maintaining high accuracy through innovative use of ${methods[methodIndex2]}. Experiments on diverse datasets demonstrate the versatility and effectiveness of the proposed method.`
        ];
        
        const templateIndex = hash % summaryTemplates.length;
        return summaryTemplates[templateIndex];
    },
    
    // Generate a comment for the paper
    generateComment(hash) {
        const comments = [
            "16 pages, 8 figures, accepted to ICML 2023",
            "24 pages, 12 figures, 5 tables, to appear in NeurIPS",
            "18 pages, 10 figures, accepted to ICLR",
            "20 pages, 15 figures, under review",
            "28 pages including appendices, code available at https://github.com/example/project",
            "Revised version with additional experiments and analysis",
            "Extended version of conference paper with proofs in appendix",
            "9 pages, 6 figures, accepted to CVPR",
            "22 pages, 14 figures, 8 tables, journal version",
            "Updated with new results and comparisons"
        ];
        
        const commentIndex = hash % comments.length;
        return comments[commentIndex];
    },
    
    // Generate a journal reference
    generateJournalReference(hash, year) {
        const journals = [
            "Journal of Machine Learning Research",
            "IEEE Transactions on Pattern Analysis and Machine Intelligence",
            "Neural Computation",
            "Artificial Intelligence",
            "Journal of Artificial Intelligence Research",
            "IEEE Transactions on Neural Networks and Learning Systems",
            "Pattern Recognition",
            "Neural Networks",
            "Machine Learning",
            "Data Mining and Knowledge Discovery"
        ];
        
        const journalIndex = hash % journals.length;
        const volume = 30 + (hash % 20);
        const pages = `${100 + (hash % 900)}-${100 + (hash % 900) + 15}`;
        
        return `${journals[journalIndex]}, vol. ${volume}, pp. ${pages} (${year})`;
    },
    
    // Generate versions of the paper
    generateVersions(paperId, hash, year, month, day) {
        const versionCount = 1 + (hash % 3); // 1-3 versions
        const versions = [];
        
        for (let i = 1; i <= versionCount; i++) {
            const versionDate = new Date(year, month - 1, day + (i - 1) * 14); // Each version 2 weeks apart
            versions.push({
                version: i,
                created: versionDate.toISOString().split('T')[0]
            });
        }
        
        return versions;
    },
    
    // Format paper details for display
    formatPaperDetails(paper) {
        let formattedDetails = `### arXiv Paper: [${paper.title}](${paper.abstract_url})\n\n`;
        
        // Authors
        formattedDetails += `**Authors:** `;
        formattedDetails += paper.authors.map(author => `${author.name} (${author.institution})`).join(', ');
        formattedDetails += `\n\n`;
        
        // Abstract
        formattedDetails += `**Abstract:**\n${paper.summary}\n\n`;
        
        // Paper details
        formattedDetails += `**arXiv ID:** [${paper.id}](${paper.abstract_url})\n`;
        formattedDetails += `**Categories:** ${paper.categories.join(', ')}\n`;
        formattedDetails += `**Published:** ${paper.published}\n`;
        
        if (paper.updated !== paper.published) {
            formattedDetails += `**Last Updated:** ${paper.updated}\n`;
        }
        
        if (paper.doi) {
            formattedDetails += `**DOI:** ${paper.doi}\n`;
        }
        
        if (paper.comment) {
            formattedDetails += `**Comments:** ${paper.comment}\n`;
        }
        
        if (paper.journal_ref) {
            formattedDetails += `**Journal Reference:** ${paper.journal_ref}\n`;
        }
        
        // Versions
        if (paper.versions && paper.versions.length > 0) {
            formattedDetails += `**Versions:**\n`;
            paper.versions.forEach(version => {
                formattedDetails += `- v${version.version} [${version.created}]\n`;
            });
        }
        
        // Download links
        formattedDetails += `\n**Download Links:**\n`;
        formattedDetails += `- [PDF](${paper.pdf_url})\n`;
        formattedDetails += `- [Abstract Page](${paper.abstract_url})\n`;
        
        return formattedDetails;
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

// Export the arXiv Download Agent
window.ArxivDownloadAgent = ArxivDownloadAgent;