// Web Scrape Agent
// Extracts specific data from web pages using selectors

const WebScrapeAgent = {
    // Execute a web scraping request
    async execute(toolName, params) {
        console.log(`Executing web scrape: ${JSON.stringify(params)}`);
        
        // Validate parameters
        if (!params.url) {
            return 'Error: Missing required parameter "url"';
        }
        
        if (!params.selector) {
            return 'Error: Missing required parameter "selector"';
        }
        
        try {
            // Validate URL
            const url = this.validateAndFormatUrl(params.url);
            
            // Fetch the web page content
            const pageContent = await this.fetchWebPage(url);
            
            // Extract data using the selector
            const extractedData = this.extractDataWithSelector(pageContent, params.selector);
            
            // Format the results
            return this.formatScrapedData(url, params.selector, extractedData);
        } catch (error) {
            console.error('Web scrape error:', error);
            return `Error scraping web page: ${error.message}`;
        }
    },
    
    // Validate and format URL
    validateAndFormatUrl(url) {
        try {
            // Add https:// if no protocol is specified
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            // Validate URL format
            new URL(url);
            
            return url;
        } catch (error) {
            throw new Error(`Invalid URL: ${url}`);
        }
    },
    
    // Fetch a web page
    async fetchWebPage(url) {
        try {
            // In a real implementation, this would use a proxy service or CORS-enabled API
            // For demonstration, we'll simulate the response
            return await this.simulateFetchWebPage(url);
        } catch (error) {
            throw new Error(`Failed to fetch web page: ${error.message}`);
        }
    },
    
    // Simulate fetching a web page (for demonstration)
    async simulateFetchWebPage(url) {
        // Use the WebBrowseAgent to get simulated page content
        if (window.WebBrowseAgent) {
            return await window.WebBrowseAgent.simulateFetchWebPage(url);
        }
        
        // Fallback if WebBrowseAgent is not available
        return {
            title: `Page at ${url}`,
            content: `<h1>Sample Page</h1><p>This is a sample page content.</p>`,
            links: []
        };
    },
    
    // Extract data from HTML using a CSS selector
    extractDataWithSelector(pageData, selector) {
        const { content } = pageData;
        
        // In a real implementation, this would use a proper HTML parser
        // For demonstration, we'll use a simplified approach
        
        // Map common selectors to content patterns
        const extractedElements = [];
        
        if (selector === 'h1' || selector === 'header' || selector === '.header' || selector === '#header') {
            // Extract h1 elements
            const h1Regex = /<h1[^>]*>(.*?)<\/h1>/gi;
            let match;
            while ((match = h1Regex.exec(content)) !== null) {
                extractedElements.push({
                    type: 'heading',
                    content: match[1].trim()
                });
            }
        } else if (selector === 'p' || selector === '.content' || selector === '#content') {
            // Extract paragraph elements
            const pRegex = /<p[^>]*>(.*?)<\/p>/gi;
            let match;
            while ((match = pRegex.exec(content)) !== null) {
                extractedElements.push({
                    type: 'paragraph',
                    content: match[1].trim()
                });
            }
        } else if (selector === 'a' || selector === 'link' || selector === '.links' || selector === '#links') {
            // Extract link elements
            const aRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
            let match;
            while ((match = aRegex.exec(content)) !== null) {
                extractedElements.push({
                    type: 'link',
                    url: match[1],
                    content: match[2].trim()
                });
            }
        } else if (selector === 'ul' || selector === 'ol' || selector === 'li' || selector === '.list' || selector === '#list') {
            // Extract list elements
            const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
            let match;
            while ((match = liRegex.exec(content)) !== null) {
                extractedElements.push({
                    type: 'list-item',
                    content: match[1].trim()
                });
            }
        } else if (selector === 'code' || selector === 'pre' || selector === '.code' || selector === '#code') {
            // Extract code elements
            const codeRegex = /<code[^>]*>(.*?)<\/code>/gi;
            let match;
            while ((match = codeRegex.exec(content)) !== null) {
                extractedElements.push({
                    type: 'code',
                    content: match[1].trim()
                });
            }
        } else if (selector === '.product' || selector === '.products' || selector === '#products') {
            // Extract product elements (for e-commerce sites)
            const productRegex = /<div[^>]*class=["']product["'][^>]*>.*?<h3[^>]*>(.*?)<\/h3>.*?<p[^>]*class=["']price["'][^>]*>(.*?)<\/p>.*?<\/div>/gis;
            let match;
            while ((match = productRegex.exec(content)) !== null) {
                extractedElements.push({
                    type: 'product',
                    name: match[1].trim(),
                    price: match[2].trim()
                });
            }
        } else {
            // Generic selector - try to match any element with the given class or id
            const classRegex = new RegExp(`<[^>]*class=["'][^"']*${selector.replace(/[.#]/g, '')}[^"']*["'][^>]*>(.*?)<\/[^>]*>`, 'gi');
            const idRegex = new RegExp(`<[^>]*id=["']${selector.replace(/[.#]/g, '')}["'][^>]*>(.*?)<\/[^>]*>`, 'gi');
            
            let match;
            // Try class selector
            while ((match = classRegex.exec(content)) !== null) {
                extractedElements.push({
                    type: 'element',
                    content: match[1].trim()
                });
            }
            
            // Try id selector
            while ((match = idRegex.exec(content)) !== null) {
                extractedElements.push({
                    type: 'element',
                    content: match[1].trim()
                });
            }
        }
        
        return extractedElements;
    },
    
    // Format scraped data for display
    formatScrapedData(url, selector, extractedData) {
        if (extractedData.length === 0) {
            return `No data found for selector "${selector}" on page: ${url}`;
        }
        
        let formattedData = `### Scraped Data from [${url}](${url})\n\n`;
        formattedData += `**Selector:** \`${selector}\`\n\n`;
        formattedData += `**Extracted ${extractedData.length} elements:**\n\n`;
        
        extractedData.forEach((element, index) => {
            formattedData += `**Element ${index + 1}**`;
            
            if (element.type) {
                formattedData += ` (${element.type})`;
            }
            
            formattedData += `:\n`;
            
            if (element.type === 'link') {
                formattedData += `[${element.content}](${element.url})\n\n`;
            } else if (element.type === 'product') {
                formattedData += `${element.name} - ${element.price}\n\n`;
            } else {
                formattedData += `${element.content}\n\n`;
            }
        });
        
        return formattedData;
    }
};

// Export the Web Scrape Agent
window.WebScrapeAgent = WebScrapeAgent;