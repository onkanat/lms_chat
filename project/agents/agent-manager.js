// Agent Manager
// Manages the agent system and routes requests to the appropriate agents

const AgentManager = {
    // Available agents
    agents: {},
    
    // Active state
    isActive: false,
    
    // Current agent execution state
    currentExecution: null,
    
    // Initialize the agent manager
    async init() {
        console.log('Initializing Agent Manager...');
        
        // Load agent modules
        await this.loadAgents();
        
        // Load settings
        this.loadSettings();
        
        console.log('Agent Manager initialized successfully');
    },
    
    // Load all agent modules
    async loadAgents() {
        try {
            // Register all agents
            this.registerAgent('webSearch', window.WebSearchAgent);
            this.registerAgent('webBrowse', window.WebBrowseAgent);
            this.registerAgent('webScrape', window.WebScrapeAgent);
            this.registerAgent('arxivSearch', window.ArxivSearchAgent);
            this.registerAgent('arxivDownload', window.ArxivDownloadAgent);
            this.registerAgent('calculator', window.CalculatorAgent);
            
            console.log(`Loaded ${Object.keys(this.agents).length} agents`);
        } catch (error) {
            console.error('Error loading agents:', error);
        }
    },
    
    // Register an agent
    registerAgent(name, agent) {
        if (agent) {
            this.agents[name] = agent;
            console.log(`Registered agent: ${name}`);
        }
    },
    
    // Load settings from localStorage
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('lms_chat_agent_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.isActive = settings.isActive || false;
            }
        } catch (error) {
            console.error('Error loading agent settings:', error);
            this.isActive = false;
        }
    },
    
    // Save settings to localStorage
    saveSettings() {
        try {
            const settings = {
                isActive: this.isActive
            };
            localStorage.setItem('lms_chat_agent_settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving agent settings:', error);
        }
    },
    
    // Toggle agent system active state
    toggleActive() {
        this.isActive = !this.isActive;
        this.saveSettings();
        return this.isActive;
    },
    
    // Get the active state
    getActiveState() {
        return this.isActive;
    },
    
    // Process a message with agents
    async processMessage(message) {
        if (!this.isActive) {
            return { processed: false, message };
        }
        
        try {
            // Parse the message to detect tool calls
            const toolCalls = this.parseToolCalls(message);
            
            if (toolCalls.length === 0) {
                return { processed: false, message };
            }
            
            // Execute each tool call
            const results = [];
            for (const toolCall of toolCalls) {
                const result = await this.executeToolCall(toolCall);
                results.push(result);
            }
            
            // Replace tool calls with results in the message
            let processedMessage = message;
            for (let i = 0; i < toolCalls.length; i++) {
                const toolCall = toolCalls[i];
                const result = results[i];
                processedMessage = processedMessage.replace(
                    toolCall.original,
                    `${toolCall.original}\n\n**Tool Result:**\n${result}`
                );
            }
            
            return { processed: true, message: processedMessage };
        } catch (error) {
            console.error('Error processing message with agents:', error);
            return { 
                processed: true, 
                message: `${message}\n\n**Tool Error:**\nFailed to process tool calls: ${error.message}` 
            };
        }
    },
    
    // Parse tool calls from a message
    parseToolCalls(message) {
        const toolCalls = [];
        
        // Regular expression to match tool calls
        // Format: {{tool_name(param1="value1", param2="value2")}}
        const toolCallRegex = /{{([a-zA-Z]+)\(([^)]*)\)}}/g;
        let match;
        
        while ((match = toolCallRegex.exec(message)) !== null) {
            const toolName = match[1];
            const paramsString = match[2];
            const original = match[0];
            
            // Parse parameters
            const params = {};
            const paramRegex = /([a-zA-Z_]+)=["']([^"']*)["']/g;
            let paramMatch;
            
            while ((paramMatch = paramRegex.exec(paramsString)) !== null) {
                const paramName = paramMatch[1];
                const paramValue = paramMatch[2];
                params[paramName] = paramValue;
            }
            
            toolCalls.push({
                toolName,
                params,
                original
            });
        }
        
        return toolCalls;
    },
    
    // Execute a tool call
    async executeToolCall(toolCall) {
        const { toolName, params } = toolCall;
        
        // Map tool name to agent
        const agentName = this.mapToolToAgent(toolName);
        
        if (!agentName || !this.agents[agentName]) {
            return `Error: Unknown tool "${toolName}"`;
        }
        
        try {
            // Set current execution
            this.currentExecution = {
                agentName,
                toolName,
                params,
                startTime: Date.now()
            };
            
            // Announce tool execution
            window.announceToScreenReader?.(`Executing ${toolName} tool`);
            
            // Execute the tool
            const result = await this.agents[agentName].execute(toolName, params);
            
            // Clear current execution
            this.currentExecution = null;
            
            return result;
        } catch (error) {
            console.error(`Error executing tool ${toolName}:`, error);
            
            // Clear current execution
            this.currentExecution = null;
            
            return `Error executing ${toolName}: ${error.message}`;
        }
    },
    
    // Map a tool name to an agent
    mapToolToAgent(toolName) {
        const toolToAgentMap = {
            // Web Search Agent
            'search': 'webSearch',
            'googleSearch': 'webSearch',
            'bingSearch': 'webSearch',
            
            // Web Browse Agent
            'browse': 'webBrowse',
            'visitUrl': 'webBrowse',
            'getWebPage': 'webBrowse',
            
            // Web Scrape Agent
            'scrape': 'webScrape',
            'extractData': 'webScrape',
            'parseWebPage': 'webScrape',
            
            // arXiv Search Agent
            'arxivSearch': 'arxivSearch',
            'findPapers': 'arxivSearch',
            'searchArxiv': 'arxivSearch',
            
            // arXiv Download Agent
            'arxivDownload': 'arxivDownload',
            'getPaper': 'arxivDownload',
            'downloadPaper': 'arxivDownload',
            
            // Calculator Agent
            'calculate': 'calculator',
            'solve': 'calculator',
            'compute': 'calculator'
        };
        
        return toolToAgentMap[toolName];
    },
    
    // Get the current execution state
    getCurrentExecution() {
        return this.currentExecution;
    },
    
    // Get all available tools with descriptions
    getAvailableTools() {
        return [
            {
                name: 'search',
                description: 'Search the web for information',
                parameters: [
                    { name: 'query', description: 'The search query', required: true },
                    { name: 'num_results', description: 'Number of results to return', required: false, default: '5' }
                ],
                example: '{{search(query="latest AI developments", num_results="3")}}'
            },
            {
                name: 'browse',
                description: 'Browse a web page and get its content',
                parameters: [
                    { name: 'url', description: 'The URL to browse', required: true }
                ],
                example: '{{browse(url="https://example.com")}}'
            },
            {
                name: 'scrape',
                description: 'Extract specific data from a web page',
                parameters: [
                    { name: 'url', description: 'The URL to scrape', required: true },
                    { name: 'selector', description: 'CSS selector for the data to extract', required: true }
                ],
                example: '{{scrape(url="https://example.com", selector=".main-content")}}'
            },
            {
                name: 'arxivSearch',
                description: 'Search for papers on arXiv.org',
                parameters: [
                    { name: 'query', description: 'The search query', required: true },
                    { name: 'max_results', description: 'Maximum number of results', required: false, default: '5' },
                    { name: 'sort_by', description: 'Sort order (relevance, lastUpdatedDate, submittedDate)', required: false, default: 'relevance' }
                ],
                example: '{{arxivSearch(query="transformer neural networks", max_results="3", sort_by="relevance")}}'
            },
            {
                name: 'arxivDownload',
                description: 'Get details and download link for an arXiv paper',
                parameters: [
                    { name: 'paper_id', description: 'The arXiv paper ID', required: true }
                ],
                example: '{{arxivDownload(paper_id="2303.08774")}}'
            },
            {
                name: 'calculate',
                description: 'Perform engineering calculations',
                parameters: [
                    { name: 'expression', description: 'The mathematical expression to evaluate', required: true },
                    { name: 'precision', description: 'Number of decimal places', required: false, default: '4' }
                ],
                example: '{{calculate(expression="5 * sin(45 deg) + sqrt(16)", precision="2")}}'
            }
        ];
    }
};

// Export the Agent Manager
window.AgentManager = AgentManager;