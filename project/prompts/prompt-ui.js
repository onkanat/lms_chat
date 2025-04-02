// Prompt Library UI
// Handles the user interface for the prompt library

const PromptUI = {
    // Initialize the prompt library UI
    init() {
        // Create UI elements
        this.createPromptButton();
        this.createPromptPanel();
        
        // Set up event listeners
        this.setupEventListeners();
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Listen for prompt selection
        document.addEventListener('prompt-selected', (event) => {
            const { promptId, variables } = event.detail;
            this.insertPrompt(promptId, variables);
        });
    },
    
    // Create the prompt library button
    createPromptButton() {
        const inputContainer = document.getElementById('input-container');
        if (!inputContainer) return;
        
        // Find the send button to insert before it
        const sendButton = document.getElementById('send-button');
        if (!sendButton) return;
        
        const promptButton = document.createElement('button');
        promptButton.id = 'prompt-library-button';
        promptButton.className = 'prompt-library-button';
        promptButton.innerHTML = '📋';
        promptButton.title = 'Prompt Library';
        promptButton.setAttribute('aria-label', 'Open Prompt Library');
        promptButton.addEventListener('click', () => {
            this.togglePromptPanel();
        });
        
        // Insert before the send button
        inputContainer.insertBefore(promptButton, sendButton);
    },
    
    // Create the prompt library panel
    createPromptPanel() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // Create the panel
        const panel = document.createElement('div');
        panel.className = 'prompt-panel';
        panel.id = 'prompt-panel';
        panel.setAttribute('aria-label', 'Prompt Library');
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('tabindex', '-1');
        
        // Create the panel header
        const header = document.createElement('div');
        header.className = 'prompt-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Prompt Library';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-panel-button';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close Prompt Library');
        closeButton.addEventListener('click', () => {
            this.togglePromptPanel();
        });
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create the panel content
        const content = document.createElement('div');
        content.className = 'prompt-panel-content';
        
        // Create the category tabs
        const tabs = document.createElement('div');
        tabs.className = 'prompt-category-tabs';
        tabs.setAttribute('role', 'tablist');
        
        // Get categories
        const categories = window.PromptLibrary.getCategories();
        
        // Create a tab for each category
        categories.forEach((category, index) => {
            const tab = document.createElement('button');
            tab.className = 'prompt-category-tab';
            tab.textContent = category.name;
            tab.dataset.category = category.id;
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            tab.setAttribute('aria-controls', `prompt-category-${category.id}`);
            tab.id = `tab-${category.id}`;
            
            tab.addEventListener('click', () => {
                this.selectCategory(category.id);
            });
            
            tabs.appendChild(tab);
        });
        
        // Create the prompt list container
        const promptListContainer = document.createElement('div');
        promptListContainer.className = 'prompt-list-container';
        
        // Create a section for each category
        categories.forEach((category, index) => {
            const section = document.createElement('div');
            section.className = 'prompt-category-section';
            section.id = `prompt-category-${category.id}`;
            section.setAttribute('role', 'tabpanel');
            section.setAttribute('aria-labelledby', `tab-${category.id}`);
            
            if (index !== 0) {
                section.style.display = 'none';
            }
            
            // Add prompts for this category
            const prompts = window.PromptLibrary.getPromptsByCategory(category.id);
            
            if (prompts.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'prompt-empty-message';
                emptyMessage.textContent = 'No prompts in this category';
                section.appendChild(emptyMessage);
            } else {
                prompts.forEach(prompt => {
                    const promptItem = this.createPromptItem(prompt, category.id);
                    section.appendChild(promptItem);
                });
            }
            
            promptListContainer.appendChild(section);
        });
        
        // Add custom prompt actions for the custom category
        if (categories.find(c => c.id === 'custom')) {
            const customActions = document.createElement('div');
            customActions.className = 'custom-prompt-actions';
            
            const addButton = document.createElement('button');
            addButton.className = 'add-custom-prompt-button';
            addButton.textContent = '+ Add Custom Prompt';
            addButton.addEventListener('click', () => {
                this.showAddCustomPromptForm();
            });
            
            const importExportDiv = document.createElement('div');
            importExportDiv.className = 'import-export-actions';
            
            const importButton = document.createElement('button');
            importButton.className = 'import-prompts-button';
            importButton.textContent = 'Import';
            importButton.addEventListener('click', () => {
                this.importPrompts();
            });
            
            const exportButton = document.createElement('button');
            exportButton.className = 'export-prompts-button';
            exportButton.textContent = 'Export';
            exportButton.addEventListener('click', () => {
                this.exportPrompts();
            });
            
            importExportDiv.appendChild(importButton);
            importExportDiv.appendChild(exportButton);
            
            customActions.appendChild(addButton);
            customActions.appendChild(importExportDiv);
            
            promptListContainer.appendChild(customActions);
        }
        
        // Add the tabs and prompt list to the content
        content.appendChild(tabs);
        content.appendChild(promptListContainer);
        
        // Add the header and content to the panel
        panel.appendChild(header);
        panel.appendChild(content);
        
        // Add the panel to the app container
        appContainer.appendChild(panel);
        
        // Create the form for adding/editing custom prompts
        this.createCustomPromptForm();
    },
    
    // Create a prompt item
    createPromptItem(prompt, categoryId) {
        const item = document.createElement('div');
        item.className = 'prompt-item';
        item.dataset.id = prompt.id;
        
        const header = document.createElement('div');
        header.className = 'prompt-item-header';
        
        const title = document.createElement('h4');
        title.className = 'prompt-item-title';
        title.textContent = prompt.name;
        
        const description = document.createElement('div');
        description.className = 'prompt-item-description';
        description.textContent = prompt.description;
        
        header.appendChild(title);
        
        // Add edit/delete buttons for custom prompts
        if (categoryId === 'custom') {
            const actions = document.createElement('div');
            actions.className = 'prompt-item-actions';
            
            const editButton = document.createElement('button');
            editButton.className = 'prompt-edit-button';
            editButton.innerHTML = '✏️';
            editButton.title = 'Edit prompt';
            editButton.setAttribute('aria-label', 'Edit prompt');
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditCustomPromptForm(prompt.id);
            });
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'prompt-delete-button';
            deleteButton.innerHTML = '🗑️';
            deleteButton.title = 'Delete prompt';
            deleteButton.setAttribute('aria-label', 'Delete prompt');
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Delete prompt "${prompt.name}"?`)) {
                    window.PromptLibrary.deleteCustomPrompt(prompt.id);
                    item.remove();
                    
                    // Check if there are no more custom prompts
                    const customSection = document.getElementById('prompt-category-custom');
                    if (customSection && window.PromptLibrary.getPromptsByCategory('custom').length === 0) {
                        const emptyMessage = document.createElement('div');
                        emptyMessage.className = 'prompt-empty-message';
                        emptyMessage.textContent = 'No prompts in this category';
                        customSection.appendChild(emptyMessage);
                    }
                }
            });
            
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);
            
            header.appendChild(actions);
        }
        
        // Create the prompt content
        const content = document.createElement('div');
        content.className = 'prompt-item-content';
        
        const promptText = document.createElement('div');
        promptText.className = 'prompt-text';
        promptText.textContent = prompt.prompt;
        
        content.appendChild(description);
        content.appendChild(promptText);
        
        // Create the variable form if the prompt has variables
        if (prompt.variables && prompt.variables.length > 0) {
            const variableForm = document.createElement('form');
            variableForm.className = 'prompt-variable-form';
            
            prompt.variables.forEach(variable => {
                const formGroup = document.createElement('div');
                formGroup.className = 'prompt-form-group';
                
                const label = document.createElement('label');
                label.textContent = variable.description || variable.name;
                label.htmlFor = `var-${prompt.id}-${variable.name}`;
                
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `var-${prompt.id}-${variable.name}`;
                input.name = variable.name;
                input.value = variable.default || '';
                input.placeholder = variable.default || '';
                
                formGroup.appendChild(label);
                formGroup.appendChild(input);
                
                variableForm.appendChild(formGroup);
            });
            
            content.appendChild(variableForm);
        }
        
        // Create the use prompt button
        const useButton = document.createElement('button');
        useButton.className = 'use-prompt-button';
        useButton.textContent = 'Use Prompt';
        useButton.addEventListener('click', () => {
            // Collect variable values if any
            const variables = {};
            if (prompt.variables && prompt.variables.length > 0) {
                prompt.variables.forEach(variable => {
                    const input = content.querySelector(`#var-${prompt.id}-${variable.name}`);
                    if (input) {
                        variables[variable.name] = input.value || variable.default || '';
                    }
                });
            }
            
            // Dispatch event with prompt ID and variables
            document.dispatchEvent(new CustomEvent('prompt-selected', {
                detail: {
                    promptId: prompt.id,
                    variables
                }
            }));
            
            // Close the panel
            this.togglePromptPanel();
        });
        
        content.appendChild(useButton);
        
        // Add the header and content to the item
        item.appendChild(header);
        item.appendChild(content);
        
        // Toggle content visibility when clicking the header
        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
        
        // Initially hide the content
        content.style.display = 'none';
        
        return item;
    },
    
    // Create the form for adding/editing custom prompts
    createCustomPromptForm() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // Create the form container
        const formContainer = document.createElement('div');
        formContainer.className = 'custom-prompt-form-container';
        formContainer.id = 'custom-prompt-form-container';
        formContainer.style.display = 'none';
        formContainer.setAttribute('role', 'dialog');
        formContainer.setAttribute('aria-modal', 'true');
        formContainer.setAttribute('aria-labelledby', 'custom-prompt-form-title');
        
        // Create the form header
        const header = document.createElement('div');
        header.className = 'custom-prompt-form-header';
        
        const title = document.createElement('h3');
        title.id = 'custom-prompt-form-title';
        title.textContent = 'Add Custom Prompt';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-panel-button';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close form');
        closeButton.addEventListener('click', () => {
            formContainer.style.display = 'none';
        });
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create the form
        const form = document.createElement('form');
        form.className = 'custom-prompt-form';
        form.id = 'custom-prompt-form';
        
        // Prompt ID (hidden)
        const promptIdInput = document.createElement('input');
        promptIdInput.type = 'hidden';
        promptIdInput.id = 'custom-prompt-id';
        promptIdInput.name = 'id';
        
        // Prompt name
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Prompt Name';
        nameLabel.htmlFor = 'custom-prompt-name';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'custom-prompt-name';
        nameInput.name = 'name';
        nameInput.required = true;
        
        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);
        
        // Prompt description
        const descGroup = document.createElement('div');
        descGroup.className = 'form-group';
        
        const descLabel = document.createElement('label');
        descLabel.textContent = 'Description';
        descLabel.htmlFor = 'custom-prompt-description';
        
        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.id = 'custom-prompt-description';
        descInput.name = 'description';
        
        descGroup.appendChild(descLabel);
        descGroup.appendChild(descInput);
        
        // Prompt text
        const promptGroup = document.createElement('div');
        promptGroup.className = 'form-group';
        
        const promptLabel = document.createElement('label');
        promptLabel.textContent = 'Prompt Text';
        promptLabel.htmlFor = 'custom-prompt-text';
        
        const promptInput = document.createElement('textarea');
        promptInput.id = 'custom-prompt-text';
        promptInput.name = 'prompt';
        promptInput.rows = 5;
        promptInput.required = true;
        
        const promptHelp = document.createElement('div');
        promptHelp.className = 'form-help';
        promptHelp.innerHTML = 'Use {variable_name} for variables that can be filled in when using the prompt.';
        
        promptGroup.appendChild(promptLabel);
        promptGroup.appendChild(promptInput);
        promptGroup.appendChild(promptHelp);
        
        // Variables section
        const variablesSection = document.createElement('div');
        variablesSection.className = 'variables-section';
        
        const variablesTitle = document.createElement('h4');
        variablesTitle.textContent = 'Variables';
        
        const variablesList = document.createElement('div');
        variablesList.className = 'variables-list';
        variablesList.id = 'variables-list';
        
        const addVariableButton = document.createElement('button');
        addVariableButton.type = 'button';
        addVariableButton.className = 'add-variable-button';
        addVariableButton.textContent = '+ Add Variable';
        addVariableButton.addEventListener('click', () => {
            this.addVariableField();
        });
        
        variablesSection.appendChild(variablesTitle);
        variablesSection.appendChild(variablesList);
        variablesSection.appendChild(addVariableButton);
        
        // Form actions
        const formActions = document.createElement('div');
        formActions.className = 'form-actions';
        
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            formContainer.style.display = 'none';
        });
        
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'save-button';
        saveButton.textContent = 'Save Prompt';
        
        formActions.appendChild(cancelButton);
        formActions.appendChild(saveButton);
        
        // Add all elements to the form
        form.appendChild(promptIdInput);
        form.appendChild(nameGroup);
        form.appendChild(descGroup);
        form.appendChild(promptGroup);
        form.appendChild(variablesSection);
        form.appendChild(formActions);
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomPrompt();
        });
        
        // Add the header and form to the container
        formContainer.appendChild(header);
        formContainer.appendChild(form);
        
        // Add the form container to the app container
        appContainer.appendChild(formContainer);
    },
    
    // Add a variable field to the custom prompt form
    addVariableField(variable = null) {
        const variablesList = document.getElementById('variables-list');
        if (!variablesList) return;
        
        const variableField = document.createElement('div');
        variableField.className = 'variable-field';
        
        // Variable name
        const nameGroup = document.createElement('div');
        nameGroup.className = 'variable-name-group';
        
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'variable-name';
        nameInput.name = 'variable-name[]';
        nameInput.required = true;
        nameInput.value = variable ? variable.name : '';
        
        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);
        
        // Variable description
        const descGroup = document.createElement('div');
        descGroup.className = 'variable-desc-group';
        
        const descLabel = document.createElement('label');
        descLabel.textContent = 'Description';
        
        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.className = 'variable-description';
        descInput.name = 'variable-description[]';
        descInput.value = variable ? variable.description : '';
        
        descGroup.appendChild(descLabel);
        descGroup.appendChild(descInput);
        
        // Variable default value
        const defaultGroup = document.createElement('div');
        defaultGroup.className = 'variable-default-group';
        
        const defaultLabel = document.createElement('label');
        defaultLabel.textContent = 'Default';
        
        const defaultInput = document.createElement('input');
        defaultInput.type = 'text';
        defaultInput.className = 'variable-default';
        defaultInput.name = 'variable-default[]';
        defaultInput.value = variable ? variable.default : '';
        
        defaultGroup.appendChild(defaultLabel);
        defaultGroup.appendChild(defaultInput);
        
        // Remove button
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-variable-button';
        removeButton.innerHTML = '×';
        removeButton.title = 'Remove variable';
        removeButton.addEventListener('click', () => {
            variableField.remove();
        });
        
        // Add all elements to the variable field
        variableField.appendChild(nameGroup);
        variableField.appendChild(descGroup);
        variableField.appendChild(defaultGroup);
        variableField.appendChild(removeButton);
        
        // Add the variable field to the variables list
        variablesList.appendChild(variableField);
    },
    
    // Show the form for adding a custom prompt
    showAddCustomPromptForm() {
        const formContainer = document.getElementById('custom-prompt-form-container');
        const form = document.getElementById('custom-prompt-form');
        const title = document.getElementById('custom-prompt-form-title');
        
        if (!formContainer || !form || !title) return;
        
        // Set form title
        title.textContent = 'Add Custom Prompt';
        
        // Reset form
        form.reset();
        document.getElementById('custom-prompt-id').value = '';
        
        // Clear variables
        const variablesList = document.getElementById('variables-list');
        if (variablesList) {
            variablesList.innerHTML = '';
        }
        
        // Show the form
        formContainer.style.display = 'block';
    },
    
    // Show the form for editing a custom prompt
    showEditCustomPromptForm(promptId) {
        const formContainer = document.getElementById('custom-prompt-form-container');
        const form = document.getElementById('custom-prompt-form');
        const title = document.getElementById('custom-prompt-form-title');
        
        if (!formContainer || !form || !title) return;
        
        // Get the prompt
        const prompt = window.PromptLibrary.getPromptById(promptId);
        if (!prompt) return;
        
        // Set form title
        title.textContent = 'Edit Custom Prompt';
        
        // Reset form
        form.reset();
        
        // Set form values
        document.getElementById('custom-prompt-id').value = promptId;
        document.getElementById('custom-prompt-name').value = prompt.name;
        document.getElementById('custom-prompt-description').value = prompt.description;
        document.getElementById('custom-prompt-text').value = prompt.prompt;
        
        // Clear variables
        const variablesList = document.getElementById('variables-list');
        if (variablesList) {
            variablesList.innerHTML = '';
            
            // Add variable fields
            if (prompt.variables && prompt.variables.length > 0) {
                prompt.variables.forEach(variable => {
                    this.addVariableField(variable);
                });
            }
        }
        
        // Show the form
        formContainer.style.display = 'block';
    },
    
    // Save a custom prompt
    saveCustomPrompt() {
        const form = document.getElementById('custom-prompt-form');
        if (!form) return;
        
        // Get form values
        const promptId = document.getElementById('custom-prompt-id').value;
        const name = document.getElementById('custom-prompt-name').value;
        const description = document.getElementById('custom-prompt-description').value;
        const promptText = document.getElementById('custom-prompt-text').value;
        
        // Get variables
        const variables = [];
        const variableNames = form.querySelectorAll('.variable-name');
        const variableDescs = form.querySelectorAll('.variable-description');
        const variableDefaults = form.querySelectorAll('.variable-default');
        
        for (let i = 0; i < variableNames.length; i++) {
            if (variableNames[i].value) {
                variables.push({
                    name: variableNames[i].value,
                    description: variableDescs[i].value,
                    default: variableDefaults[i].value
                });
            }
        }
        
        // Create prompt object
        const prompt = {
            name,
            description,
            prompt: promptText,
            variables
        };
        
        // Add or update the prompt
        if (promptId) {
            window.PromptLibrary.updateCustomPrompt(promptId, prompt);
        } else {
            window.PromptLibrary.addCustomPrompt(prompt);
        }
        
        // Hide the form
        const formContainer = document.getElementById('custom-prompt-form-container');
        if (formContainer) {
            formContainer.style.display = 'none';
        }
        
        // Update the custom prompts list
        this.selectCategory('custom');
    },
    
    // Select a category
    selectCategory(categoryId) {
        // Update tabs
        const tabs = document.querySelectorAll('.prompt-category-tab');
        tabs.forEach(tab => {
            tab.setAttribute('aria-selected', tab.dataset.category === categoryId ? 'true' : 'false');
        });
        
        // Update sections
        const sections = document.querySelectorAll('.prompt-category-section');
        sections.forEach(section => {
            section.style.display = section.id === `prompt-category-${categoryId}` ? 'block' : 'none';
        });
        
        // If it's the custom category, refresh the list
        if (categoryId === 'custom') {
            const customSection = document.getElementById('prompt-category-custom');
            if (customSection) {
                // Clear the section
                while (customSection.firstChild) {
                    customSection.removeChild(customSection.firstChild);
                }
                
                // Add prompts for this category
                const prompts = window.PromptLibrary.getPromptsByCategory('custom');
                
                if (prompts.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'prompt-empty-message';
                    emptyMessage.textContent = 'No prompts in this category';
                    customSection.appendChild(emptyMessage);
                } else {
                    prompts.forEach(prompt => {
                        const promptItem = this.createPromptItem(prompt, 'custom');
                        customSection.appendChild(promptItem);
                    });
                }
            }
        }
    },
    
    // Toggle the prompt panel
    togglePromptPanel() {
        const panel = document.getElementById('prompt-panel');
        if (panel) {
            panel.classList.toggle('visible');
            
            // Set focus to the panel when opened
            if (panel.classList.contains('visible')) {
                panel.focus();
            }
        }
    },
    
    // Insert a prompt into the chat input
    insertPrompt(promptId, variables = {}) {
        const userInput = document.getElementById('user-input');
        if (!userInput) return;
        
        // Process the prompt template
        const processedPrompt = window.PromptLibrary.processPromptTemplate(promptId, variables);
        if (!processedPrompt) return;
        
        // Insert the prompt into the input
        userInput.value = processedPrompt;
        
        // Focus the input
        userInput.focus();
    },
    
    // Import prompts
    importPrompts() {
        // Create a file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length === 0) return;
            
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const jsonData = event.target.result;
                const success = window.PromptLibrary.importCustomPrompts(jsonData);
                
                if (success) {
                    alert('Prompts imported successfully');
                    this.selectCategory('custom');
                } else {
                    alert('Failed to import prompts. Please check the file format.');
                }
            };
            
            reader.readAsText(file);
            
            // Remove the file input
            document.body.removeChild(fileInput);
        });
        
        // Add the file input to the body and click it
        document.body.appendChild(fileInput);
        fileInput.click();
    },
    
    // Export prompts
    exportPrompts() {
        const jsonData = window.PromptLibrary.exportCustomPrompts();
        
        // Create a blob and download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom_prompts.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Export the Prompt UI
window.PromptUI = PromptUI;