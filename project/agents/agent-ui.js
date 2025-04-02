// Agent UI
// Handles the user interface for the agent system

const AgentUI = {
    // Initialize the agent UI
    init() {
        // Create UI elements
        this.createAgentToggle();
        this.createAgentPanel();
        
        // Set up event listeners
        this.setupEventListeners();
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Listen for agent execution events
        document.addEventListener('agent-execution-start', (event) => {
            this.showAgentExecutionIndicator(event.detail);
        });
        
        document.addEventListener('agent-execution-end', () => {
            this.hideAgentExecutionIndicator();
        });
    },
    
    // Create the agent toggle
    createAgentToggle() {
        const serverUrlContainer = document.getElementById('server-url-container');
        if (!serverUrlContainer) return;
        
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'agent-toggle-container';
        toggleContainer.id = 'agent-toggle-container';
        
        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'agent-toggle-label';
        toggleLabel.textContent = 'Agents';
        
        const toggle = document.createElement('label');
        toggle.className = 'agent-toggle';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'agent-toggle';
        input.checked = window.AgentManager.getActiveState();
        input.addEventListener('change', () => {
            const isActive = window.AgentManager.toggleActive();
            this.updateAgentToggleState(isActive);
        });
        
        const slider = document.createElement('span');
        slider.className = 'agent-toggle-slider';
        
        toggle.appendChild(input);
        toggle.appendChild(slider);
        
        toggleContainer.appendChild(toggle);
        toggleContainer.appendChild(toggleLabel);
        
        // Add toggle button to open agent panel
        const panelButton = document.createElement('button');
        panelButton.className = 'agent-panel-button';
        panelButton.innerHTML = '🤖';
        panelButton.title = 'Open Agent Panel';
        panelButton.setAttribute('aria-label', 'Open Agent Panel');
        panelButton.addEventListener('click', () => {
            this.toggleAgentPanel();
        });
        
        toggleContainer.appendChild(panelButton);
        
        serverUrlContainer.appendChild(toggleContainer);
        
        // Update toggle state
        this.updateAgentToggleState(window.AgentManager.getActiveState());
    },
    
    // Update agent toggle state
    updateAgentToggleState(isActive) {
        const toggle = document.getElementById('agent-toggle');
        if (toggle) {
            toggle.checked = isActive;
        }
    },
    
    // Create the agent panel
    createAgentPanel() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // Create the panel
        const panel = document.createElement('div');
        panel.className = 'agent-panel';
        panel.id = 'agent-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-labelledby', 'agent-panel-title');
        panel.setAttribute('aria-modal', 'true');
        
        // Create the panel header
        const header = document.createElement('div');
        header.className = 'agent-panel-header';
        
        const title = document.createElement('h3');
        title.id = 'agent-panel-title';
        title.textContent = 'Agent Tools';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-panel-button';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close agent panel');
        closeButton.addEventListener('click', () => {
            this.toggleAgentPanel();
        });
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create the panel content
        const content = document.createElement('div');
        content.className = 'agent-panel-content';
        
        // Add agent toggle
        const toggleSection = document.createElement('div');
        toggleSection.className = 'agent-toggle-section';
        
        const toggleHeader = document.createElement('div');
        toggleHeader.className = 'agent-section-header';
        
        const toggleTitle = document.createElement('h4');
        toggleTitle.textContent = 'Enable Agents';
        
        const mainToggle = document.createElement('label');
        mainToggle.className = 'agent-toggle';
        
        const mainInput = document.createElement('input');
        mainInput.type = 'checkbox';
        mainInput.id = 'agent-main-toggle';
        mainInput.checked = window.AgentManager.getActiveState();
        mainInput.addEventListener('change', () => {
            const isActive = window.AgentManager.toggleActive();
            this.updateAgentToggleState(isActive);
            mainInput.checked = isActive;
        });
        
        const mainSlider = document.createElement('span');
        mainSlider.className = 'agent-toggle-slider';
        
        mainToggle.appendChild(mainInput);
        mainToggle.appendChild(mainSlider);
        
        toggleHeader.appendChild(toggleTitle);
        toggleHeader.appendChild(mainToggle);
        
        const toggleDescription = document.createElement('p');
        toggleDescription.className = 'agent-section-description';
        toggleDescription.textContent = 'Enable agent tools to enhance the chat with web search, browsing, arXiv integration, and calculations.';
        
        toggleSection.appendChild(toggleHeader);
        toggleSection.appendChild(toggleDescription);
        
        // Add available tools section
        const toolsSection = document.createElement('div');
        toolsSection.className = 'agent-tools-section';
        
        const toolsTitle = document.createElement('h4');
        toolsTitle.textContent = 'Available Tools';
        
        const toolsList = document.createElement('div');
        toolsList.className = 'agent-tools-list';
        
        // Get available tools
        const tools = window.AgentManager.getAvailableTools();
        
        // Add each tool
        tools.forEach(tool => {
            const toolItem = document.createElement('div');
            toolItem.className = 'agent-tool-item';
            
            const toolHeader = document.createElement('div');
            toolHeader.className = 'agent-tool-header';
            
            const toolName = document.createElement('h5');
            toolName.className = 'agent-tool-name';
            toolName.textContent = tool.name;
            
            const toolToggle = document.createElement('button');
            toolToggle.className = 'agent-tool-toggle';
            toolToggle.innerHTML = '▼';
            toolToggle.setAttribute('aria-label', `Toggle ${tool.name} details`);
            
            toolHeader.appendChild(toolName);
            toolHeader.appendChild(toolToggle);
            
            const toolContent = document.createElement('div');
            toolContent.className = 'agent-tool-content';
            toolContent.style.display = 'none';
            
            const toolDescription = document.createElement('p');
            toolDescription.className = 'agent-tool-description';
            toolDescription.textContent = tool.description;
            
            const toolParameters = document.createElement('div');
            toolParameters.className = 'agent-tool-parameters';
            
            if (tool.parameters && tool.parameters.length > 0) {
                const paramsTitle = document.createElement('h6');
                paramsTitle.textContent = 'Parameters:';
                toolParameters.appendChild(paramsTitle);
                
                const paramsList = document.createElement('ul');
                paramsList.className = 'agent-tool-params-list';
                
                tool.parameters.forEach(param => {
                    const paramItem = document.createElement('li');
                    paramItem.className = 'agent-tool-param-item';
                    
                    const paramName = document.createElement('span');
                    paramName.className = 'agent-tool-param-name';
                    paramName.textContent = param.name;
                    
                    const paramDesc = document.createElement('span');
                    paramDesc.className = 'agent-tool-param-desc';
                    paramDesc.textContent = ` - ${param.description}`;
                    
                    if (param.required) {
                        const requiredBadge = document.createElement('span');
                        requiredBadge.className = 'agent-tool-param-required';
                        requiredBadge.textContent = ' (required)';
                        paramDesc.appendChild(requiredBadge);
                    } else if (param.default) {
                        const defaultValue = document.createElement('span');
                        defaultValue.className = 'agent-tool-param-default';
                        defaultValue.textContent = ` (default: ${param.default})`;
                        paramDesc.appendChild(defaultValue);
                    }
                    
                    paramItem.appendChild(paramName);
                    paramItem.appendChild(paramDesc);
                    paramsList.appendChild(paramItem);
                });
                
                toolParameters.appendChild(paramsList);
            }
            
            const toolExample = document.createElement('div');
            toolExample.className = 'agent-tool-example';
            
            const exampleTitle = document.createElement('h6');
            exampleTitle.textContent = 'Example:';
            
            const exampleCode = document.createElement('code');
            exampleCode.className = 'agent-tool-example-code';
            exampleCode.textContent = tool.example;
            
            const copyButton = document.createElement('button');
            copyButton.className = 'agent-tool-copy-button';
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(tool.example)
                    .then(() => {
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy:', err);
                    });
            });
            
            toolExample.appendChild(exampleTitle);
            toolExample.appendChild(exampleCode);
            toolExample.appendChild(copyButton);
            
            toolContent.appendChild(toolDescription);
            toolContent.appendChild(toolParameters);
            toolContent.appendChild(toolExample);
            
            toolItem.appendChild(toolHeader);
            toolItem.appendChild(toolContent);
            
            // Toggle tool content visibility
            toolHeader.addEventListener('click', () => {
                const isVisible = toolContent.style.display !== 'none';
                toolContent.style.display = isVisible ? 'none' : 'block';
                toolToggle.innerHTML = isVisible ? '▼' : '▲';
            });
            
            toolsList.appendChild(toolItem);
        });
        
        toolsSection.appendChild(toolsTitle);
        toolsSection.appendChild(toolsList);
        
        // Add usage instructions
        const usageSection = document.createElement('div');
        usageSection.className = 'agent-usage-section';
        
        const usageTitle = document.createElement('h4');
        usageTitle.textContent = 'How to Use';
        
        const usageInstructions = document.createElement('div');
        usageInstructions.className = 'agent-usage-instructions';
        usageInstructions.innerHTML = `
            <p>To use agent tools in your conversation, include tool calls in your messages using the following syntax:</p>
            <pre><code>{{tool_name(param1="value1", param2="value2")}}</code></pre>
            <p>For example, to search the web:</p>
            <pre><code>{{search(query="latest AI developments")}}</code></pre>
            <p>The AI will process these tool calls and include the results in its response.</p>
        `;
        
        usageSection.appendChild(usageTitle);
        usageSection.appendChild(usageInstructions);
        
        // Add all sections to content
        content.appendChild(toggleSection);
        content.appendChild(toolsSection);
        content.appendChild(usageSection);
        
        // Add the header and content to the panel
        panel.appendChild(header);
        panel.appendChild(content);
        
        // Add the panel to the app container
        appContainer.appendChild(panel);
        
        // Create the agent execution indicator
        this.createAgentExecutionIndicator();
    },
    
    // Create the agent execution indicator
    createAgentExecutionIndicator() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'agent-execution-indicator';
        indicator.id = 'agent-execution-indicator';
        indicator.style.display = 'none';
        
        const spinner = document.createElement('div');
        spinner.className = 'agent-execution-spinner';
        
        const message = document.createElement('div');
        message.className = 'agent-execution-message';
        message.id = 'agent-execution-message';
        message.textContent = 'Agent working...';
        
        indicator.appendChild(spinner);
        indicator.appendChild(message);
        
        appContainer.appendChild(indicator);
    },
    
    // Show the agent execution indicator
    showAgentExecutionIndicator(details) {
        const indicator = document.getElementById('agent-execution-indicator');
        const message = document.getElementById('agent-execution-message');
        
        if (indicator && message) {
            // Set message based on details
            if (details && details.toolName) {
                message.textContent = `Executing ${details.toolName}...`;
            } else {
                message.textContent = 'Agent working...';
            }
            
            // Show indicator
            indicator.style.display = 'flex';
        }
    },
    
    // Hide the agent execution indicator
    hideAgentExecutionIndicator() {
        const indicator = document.getElementById('agent-execution-indicator');
        
        if (indicator) {
            indicator.style.display = 'none';
        }
    },
    
    // Toggle the agent panel
    toggleAgentPanel() {
        const panel = document.getElementById('agent-panel');
        if (panel) {
            panel.classList.toggle('visible');
        }
    }
};

// Export the Agent UI
window.AgentUI = AgentUI;