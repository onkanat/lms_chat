// Accessibility Improvements
// Enhances the application with accessibility features

const Accessibility = {
    // Settings
    settings: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        keyboardNavigation: true,
        screenReader: false
    },
    
    // Initialize accessibility features
    init() {
        console.log('Initializing Accessibility features...');
        
        // Load saved settings
        this.loadSettings();
        
        // Apply settings
        this.applySettings();
        
        // Set up keyboard navigation
        this.setupKeyboardNavigation();
        
        // Add screen reader announcements
        this.setupScreenReaderAnnouncements();
        
        // Create accessibility panel
        this.createAccessibilityPanel();
        
        console.log('Accessibility features initialized successfully');
    },
    
    // Load settings from localStorage
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('lms_chat_accessibility');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.error('Error loading accessibility settings:', error);
        }
    },
    
    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('lms_chat_accessibility', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving accessibility settings:', error);
        }
    },
    
    // Apply accessibility settings
    applySettings() {
        // Apply high contrast mode
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        // Apply large text
        if (this.settings.largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
        
        // Apply reduced motion
        if (this.settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
        
        // Apply keyboard navigation
        if (this.settings.keyboardNavigation) {
            document.body.classList.add('keyboard-navigation');
        } else {
            document.body.classList.remove('keyboard-navigation');
        }
        
        // Apply screen reader optimizations
        if (this.settings.screenReader) {
            document.body.classList.add('screen-reader');
        } else {
            document.body.classList.remove('screen-reader');
        }
    },
    
    // Set up keyboard navigation
    setupKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only process if keyboard navigation is enabled
            if (!this.settings.keyboardNavigation) return;
            
            // Escape key to close panels
            if (e.key === 'Escape') {
                // Close any open panels
                const panels = [
                    document.getElementById('prompt-panel'),
                    document.getElementById('theme-panel'),
                    document.getElementById('conversation-panel'),
                    document.getElementById('rag-panel'),
                    document.getElementById('rag-enhanced-panel'),
                    document.getElementById('accessibility-panel'),
                    document.getElementById('custom-prompt-form-container'),
                    document.getElementById('agent-panel')
                ];
                
                for (const panel of panels) {
                    if (panel && (panel.classList.contains('visible') || panel.style.display === 'block')) {
                        // Close the panel
                        if (panel.classList.contains('visible')) {
                            panel.classList.remove('visible');
                        } else {
                            panel.style.display = 'none';
                        }
                        
                        e.preventDefault();
                        return;
                    }
                }
            }
            
            // Check for macOS (Command key) or other OS (Alt key)
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modKey = isMac ? e.metaKey : e.altKey;
            
            // Mod+A to open accessibility panel
            if (modKey && e.key === 'a') {
                this.toggleAccessibilityPanel();
                e.preventDefault();
            }
            
            // Mod+P to open prompt library
            if (modKey && e.key === 'l') {
                const promptPanel = document.getElementById('prompt-panel');
                if (promptPanel) {
                    promptPanel.classList.toggle('visible');
                    if (promptPanel.classList.contains('visible')) {
                        promptPanel.focus();
                    }
                }
                e.preventDefault();
            }
            
            // Mod+T to open theme panel
            if (modKey && e.key === 't') {
                const themePanel = document.getElementById('theme-panel');
                if (themePanel) {
                    themePanel.classList.toggle('visible');
                }
                e.preventDefault();
            }
            
            // Mod+C to open conversation panel
            if (modKey && e.key === 'c') {
                const conversationPanel = document.getElementById('conversation-panel');
                if (conversationPanel) {
                    conversationPanel.classList.toggle('visible');
                }
                e.preventDefault();
            }
            
            // Mod+R to open RAG panel
            if (modKey && e.key === 'r') {
                const ragPanel = document.getElementById('rag-panel');
                if (ragPanel) {
                    ragPanel.classList.toggle('visible');
                }
                e.preventDefault();
            }
            
            // Mod+E to open enhanced RAG panel
            if (modKey && e.key === 'e') {
                const ragEnhancedPanel = document.getElementById('rag-enhanced-panel');
                if (ragEnhancedPanel) {
                    ragEnhancedPanel.classList.toggle('visible');
                }
                e.preventDefault();
            }
            
            // Mod+S to focus the send button
            if (modKey && e.key === 's') {
                const sendButton = document.getElementById('send-button');
                if (sendButton) {
                    sendButton.focus();
                }
                e.preventDefault();
            }
            
            // Mod+I to focus the input field
            if (modKey && e.key === 'i') {
                const userInput = document.getElementById('user-input');
                if (userInput) {
                    userInput.focus();
                }
                e.preventDefault();
            }
            
            // Mod+M to toggle the model dropdown
            if (modKey && e.key === 'm') {
                const modelSelect = document.getElementById('model-select');
                if (modelSelect) {
                    modelSelect.focus();
                    modelSelect.click();
                }
                e.preventDefault();
            }
            
            // Mod+G to open agent panel
            if (modKey && e.key === 'g') {
                const agentPanel = document.getElementById('agent-panel');
                if (agentPanel) {
                    agentPanel.classList.toggle('visible');
                }
                e.preventDefault();
            }
        });
        
        // Add focus indicators to all focusable elements
        this.addFocusIndicators();
    },
    
    // Add focus indicators to all focusable elements
    addFocusIndicators() {
        // Add a class to the body when using keyboard navigation
        document.addEventListener('keydown', () => {
            document.body.classList.add('using-keyboard');
        });
        
        // Remove the class when using mouse
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
    },
    
    // Set up screen reader announcements
    setupScreenReaderAnnouncements() {
        // Create a live region for screen reader announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'screen-reader-announcer';
        document.body.appendChild(liveRegion);
        
        // Function to announce messages to screen readers
        window.announceToScreenReader = (message) => {
            const announcer = document.getElementById('screen-reader-announcer');
            if (announcer) {
                announcer.textContent = message;
                
                // Clear after a delay to allow for multiple announcements
                setTimeout(() => {
                    announcer.textContent = '';
                }, 3000);
            }
        };
        
        // Listen for message additions
        document.addEventListener('message-added', (event) => {
            if (this.settings.screenReader) {
                const messages = document.querySelectorAll('.message');
                if (messages.length > 0) {
                    const lastMessage = messages[messages.length - 1];
                    const role = lastMessage.classList.contains('user-message') ? 'User' : 'Assistant';
                    const content = lastMessage.querySelector('.message-content').textContent;
                    window.announceToScreenReader(`${role} message: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
                }
            }
        });
    },
    
    // Create the accessibility panel
    createAccessibilityPanel() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // Create the panel
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.id = 'accessibility-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-labelledby', 'accessibility-panel-title');
        panel.setAttribute('aria-modal', 'true');
        
        // Create the panel header
        const header = document.createElement('div');
        header.className = 'accessibility-panel-header';
        
        const title = document.createElement('h3');
        title.id = 'accessibility-panel-title';
        title.textContent = 'Accessibility Settings';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-panel-button';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close accessibility settings');
        closeButton.addEventListener('click', () => {
            this.toggleAccessibilityPanel();
        });
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create the panel content
        const content = document.createElement('div');
        content.className = 'accessibility-panel-content';
        
        // High contrast mode
        const highContrastGroup = this.createSettingGroup(
            'high-contrast',
            'High Contrast Mode',
            'Increases contrast for better visibility',
            this.settings.highContrast,
            (checked) => {
                this.settings.highContrast = checked;
                this.saveSettings();
                this.applySettings();
            }
        );
        
        // Large text
        const largeTextGroup = this.createSettingGroup(
            'large-text',
            'Large Text',
            'Increases text size throughout the application',
            this.settings.largeText,
            (checked) => {
                this.settings.largeText = checked;
                this.saveSettings();
                this.applySettings();
            }
        );
        
        // Reduced motion
        const reducedMotionGroup = this.createSettingGroup(
            'reduced-motion',
            'Reduced Motion',
            'Reduces or eliminates animations and transitions',
            this.settings.reducedMotion,
            (checked) => {
                this.settings.reducedMotion = checked;
                this.saveSettings();
                this.applySettings();
            }
        );
        
        // Keyboard navigation
        const keyboardNavigationGroup = this.createSettingGroup(
            'keyboard-navigation',
            'Keyboard Navigation',
            'Enables keyboard shortcuts and focus indicators',
            this.settings.keyboardNavigation,
            (checked) => {
                this.settings.keyboardNavigation = checked;
                this.saveSettings();
                this.applySettings();
            }
        );
        
        // Screen reader optimizations
        const screenReaderGroup = this.createSettingGroup(
            'screen-reader',
            'Screen Reader Optimizations',
            'Enhances compatibility with screen readers',
            this.settings.screenReader,
            (checked) => {
                this.settings.screenReader = checked;
                this.saveSettings();
                this.applySettings();
            }
        );
        
        // Add settings groups to content
        content.appendChild(highContrastGroup);
        content.appendChild(largeTextGroup);
        content.appendChild(reducedMotionGroup);
        content.appendChild(keyboardNavigationGroup);
        content.appendChild(screenReaderGroup);
        
        // Add keyboard shortcuts section
        const shortcutsSection = document.createElement('div');
        shortcutsSection.className = 'accessibility-shortcuts-section';
        
        const shortcutsTitle = document.createElement('h4');
        shortcutsTitle.textContent = 'Keyboard Shortcuts';
        
        const shortcutsList = document.createElement('ul');
        shortcutsList.className = 'accessibility-shortcuts-list';
        
        // Detect if user is on macOS
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modKey = isMac ? '⌘' : 'Alt';
        const optKey = isMac ? '⌥' : 'Shift';
        
        const shortcuts = [
            { key: `${modKey}+A`, description: 'Open accessibility settings' },
            { key: `${modKey}+L`, description: 'Open prompt library' },
            { key: `${modKey}+T`, description: 'Open theme settings' },
            { key: `${modKey}+C`, description: 'Open conversation manager' },
            { key: `${modKey}+R`, description: 'Open RAG panel' },
            { key: `${modKey}+E`, description: 'Open enhanced RAG panel' },
            { key: `${modKey}+G`, description: 'Open agent panel' },
            { key: `${modKey}+S`, description: 'Focus send button' },
            { key: `${modKey}+I`, description: 'Focus input field' },
            { key: `${modKey}+M`, description: 'Focus model selector' },
            { key: 'Escape', description: 'Close open panels' },
            { key: 'Enter', description: 'Send message (when input is focused)' }
        ];
        
        shortcuts.forEach(shortcut => {
            const shortcutItem = document.createElement('li');
            
            const shortcutKey = document.createElement('span');
            shortcutKey.className = 'shortcut-key';
            shortcutKey.textContent = shortcut.key;
            
            const shortcutDesc = document.createElement('span');
            shortcutDesc.className = 'shortcut-description';
            shortcutDesc.textContent = shortcut.description;
            
            shortcutItem.appendChild(shortcutKey);
            shortcutItem.appendChild(shortcutDesc);
            
            shortcutsList.appendChild(shortcutItem);
        });
        
        shortcutsSection.appendChild(shortcutsTitle);
        shortcutsSection.appendChild(shortcutsList);
        
        content.appendChild(shortcutsSection);
        
        // Add the header and content to the panel
        panel.appendChild(header);
        panel.appendChild(content);
        
        // Add the panel to the app container
        appContainer.appendChild(panel);
        
        // Create the accessibility toggle button
        this.createAccessibilityToggle();
    },
    
    // Create a setting group with a toggle switch
    createSettingGroup(id, title, description, checked, onChange) {
        const group = document.createElement('div');
        group.className = 'accessibility-setting-group';
        
        const header = document.createElement('div');
        header.className = 'accessibility-setting-header';
        
        const titleElement = document.createElement('h4');
        titleElement.textContent = title;
        
        const toggle = document.createElement('label');
        toggle.className = 'accessibility-toggle';
        toggle.setAttribute('for', `accessibility-${id}`);
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `accessibility-${id}`;
        input.checked = checked;
        input.addEventListener('change', () => {
            onChange(input.checked);
        });
        
        const slider = document.createElement('span');
        slider.className = 'accessibility-toggle-slider';
        
        toggle.appendChild(input);
        toggle.appendChild(slider);
        
        header.appendChild(titleElement);
        header.appendChild(toggle);
        
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'accessibility-setting-description';
        descriptionElement.textContent = description;
        
        group.appendChild(header);
        group.appendChild(descriptionElement);
        
        return group;
    },
    
    // Create the accessibility toggle button
    createAccessibilityToggle() {
        const serverUrlContainer = document.getElementById('server-url-container');
        if (!serverUrlContainer) return;
        
        const accessibilityToggle = document.createElement('button');
        accessibilityToggle.id = 'accessibility-toggle';
        accessibilityToggle.className = 'accessibility-toggle-button';
        accessibilityToggle.innerHTML = '♿';
        accessibilityToggle.title = 'Accessibility Settings';
        accessibilityToggle.setAttribute('aria-label', 'Open Accessibility Settings');
        accessibilityToggle.addEventListener('click', () => {
            this.toggleAccessibilityPanel();
        });
        
        serverUrlContainer.appendChild(accessibilityToggle);
    },
    
    // Toggle the accessibility panel
    toggleAccessibilityPanel() {
        const panel = document.getElementById('accessibility-panel');
        if (panel) {
            panel.classList.toggle('visible');
            
            // Set focus to the panel when opened
            if (panel.classList.contains('visible')) {
                panel.focus();
                
                // Announce to screen readers
                if (this.settings.screenReader) {
                    window.announceToScreenReader('Accessibility settings panel opened');
                }
            }
        }
    }
};

// Export the Accessibility object
window.Accessibility = Accessibility;