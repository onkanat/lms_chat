// Theme UI
// Handles the UI for theme customization

const ThemeUI = {
    // Initialize the theme UI
    init() {
        this.createThemePanel();
        this.setupEventListeners();
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Add theme toggle button to the header
        this.createThemeToggle();
    },
    
    // Create the theme toggle button
    createThemeToggle() {
        const serverUrlContainer = document.getElementById('server-url-container');
        if (!serverUrlContainer) return;
        
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🎨';
        themeToggle.title = 'Customize Theme';
        themeToggle.addEventListener('click', () => {
            this.toggleThemePanel();
        });
        
        serverUrlContainer.appendChild(themeToggle);
    },
    
    // Create the theme panel
    createThemePanel() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // Create the theme panel
        const themePanel = document.createElement('div');
        themePanel.id = 'theme-panel';
        themePanel.className = 'theme-panel';
        
        // Create the panel header
        const panelHeader = document.createElement('div');
        panelHeader.className = 'theme-panel-header';
        
        // Create the panel title
        const panelTitle = document.createElement('h3');
        panelTitle.textContent = 'Theme Customization';
        
        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-panel-button';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', () => {
            this.toggleThemePanel();
        });
        
        panelHeader.appendChild(panelTitle);
        panelHeader.appendChild(closeButton);
        
        // Create the panel content
        const panelContent = document.createElement('div');
        panelContent.className = 'theme-panel-content';
        
        // Create the preset themes section
        const presetSection = document.createElement('div');
        presetSection.className = 'theme-section';
        
        const presetTitle = document.createElement('h4');
        presetTitle.textContent = 'Preset Themes';
        
        const presetGrid = document.createElement('div');
        presetGrid.className = 'preset-theme-grid';
        
        // Add preset theme buttons
        const presetThemes = window.ThemeManager.getPresetThemes();
        for (const [key, theme] of Object.entries(presetThemes)) {
            const presetButton = document.createElement('button');
            presetButton.className = 'preset-theme-button';
            presetButton.dataset.theme = key;
            presetButton.title = theme.description;
            
            // Create a color swatch
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = theme.colors['background-color'];
            colorSwatch.style.borderColor = theme.colors['border-color'];
            
            // Create a small indicator for the text color
            const textColorIndicator = document.createElement('div');
            textColorIndicator.className = 'text-color-indicator';
            textColorIndicator.style.backgroundColor = theme.colors['text-color'];
            
            // Create a small indicator for the accent color
            const accentColorIndicator = document.createElement('div');
            accentColorIndicator.className = 'accent-color-indicator';
            accentColorIndicator.style.backgroundColor = theme.colors['accent-color'];
            
            colorSwatch.appendChild(textColorIndicator);
            colorSwatch.appendChild(accentColorIndicator);
            
            const themeName = document.createElement('span');
            themeName.textContent = theme.name;
            
            presetButton.appendChild(colorSwatch);
            presetButton.appendChild(themeName);
            
            presetButton.addEventListener('click', () => {
                window.ThemeManager.switchToPresetTheme(key);
                this.updateActiveThemeButton();
            });
            
            presetGrid.appendChild(presetButton);
        }
        
        presetSection.appendChild(presetTitle);
        presetSection.appendChild(presetGrid);
        
        // Create the color customization section
        const colorSection = document.createElement('div');
        colorSection.className = 'theme-section';
        
        const colorTitle = document.createElement('h4');
        colorTitle.textContent = 'Color Customization';
        
        const colorGrid = document.createElement('div');
        colorGrid.className = 'color-customization-grid';
        
        // Add color pickers for main colors
        const mainColors = [
            { key: 'background-color', label: 'Background' },
            { key: 'text-color', label: 'Text' },
            { key: 'input-background', label: 'Input Background' },
            { key: 'user-message-color', label: 'User Message' },
            { key: 'assistant-message-color', label: 'Assistant Message' },
            { key: 'accent-color', label: 'Accent' },
            { key: 'button-color', label: 'Button' },
            { key: 'border-color', label: 'Border' }
        ];
        
        mainColors.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            
            const colorLabel = document.createElement('label');
            colorLabel.textContent = color.label;
            
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.className = 'color-picker';
            colorPicker.dataset.colorKey = color.key;
            colorPicker.value = window.ThemeManager.currentTheme.colors[color.key];
            
            colorPicker.addEventListener('input', (e) => {
                window.ThemeManager.updateColor(color.key, e.target.value);
                
                // Special handling for accent-color-rgb
                if (color.key === 'accent-color') {
                    const hex = e.target.value;
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    window.ThemeManager.updateColor('accent-color-rgb', `${r}, ${g}, ${b}`);
                }
            });
            
            colorItem.appendChild(colorLabel);
            colorItem.appendChild(colorPicker);
            
            colorGrid.appendChild(colorItem);
        });
        
        colorSection.appendChild(colorTitle);
        colorSection.appendChild(colorGrid);
        
        // Create the font customization section
        const fontSection = document.createElement('div');
        fontSection.className = 'theme-section';
        
        const fontTitle = document.createElement('h4');
        fontTitle.textContent = 'Font Customization';
        
        // Font family selector
        const fontFamilyGroup = document.createElement('div');
        fontFamilyGroup.className = 'form-group';
        
        const fontFamilyLabel = document.createElement('label');
        fontFamilyLabel.textContent = 'Font Family';
        
        const fontFamilySelect = document.createElement('select');
        fontFamilySelect.id = 'font-family-select';
        
        // Add font family options
        const fontFamilies = window.ThemeManager.getFontFamilies();
        fontFamilies.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.name;
            option.style.fontFamily = font.value;
            fontFamilySelect.appendChild(option);
        });
        
        // Set the current font family
        const currentFontFamily = window.ThemeManager.currentTheme.fonts['font-family'];
        for (let i = 0; i < fontFamilySelect.options.length; i++) {
            if (fontFamilySelect.options[i].value === currentFontFamily) {
                fontFamilySelect.selectedIndex = i;
                break;
            }
        }
        
        fontFamilySelect.addEventListener('change', (e) => {
            window.ThemeManager.updateFontFamily(e.target.value);
        });
        
        fontFamilyGroup.appendChild(fontFamilyLabel);
        fontFamilyGroup.appendChild(fontFamilySelect);
        
        // Font size selector
        const fontSizeGroup = document.createElement('div');
        fontSizeGroup.className = 'form-group';
        
        const fontSizeLabel = document.createElement('label');
        fontSizeLabel.textContent = 'Font Size';
        
        const fontSizeSelect = document.createElement('select');
        fontSizeSelect.id = 'font-size-select';
        
        // Add font size options
        const fontSizes = window.ThemeManager.getFontSizes();
        fontSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size.value;
            option.textContent = size.name;
            fontSizeSelect.appendChild(option);
        });
        
        // Set the current font size
        const currentFontSize = window.ThemeManager.currentTheme.fonts['font-size'];
        for (let i = 0; i < fontSizeSelect.options.length; i++) {
            if (fontSizeSelect.options[i].value === currentFontSize) {
                fontSizeSelect.selectedIndex = i;
                break;
            }
        }
        
        fontSizeSelect.addEventListener('change', (e) => {
            window.ThemeManager.updateFontSize(e.target.value);
        });
        
        fontSizeGroup.appendChild(fontSizeLabel);
        fontSizeGroup.appendChild(fontSizeSelect);
        
        // Layout selector
        const layoutGroup = document.createElement('div');
        layoutGroup.className = 'form-group';
        
        const layoutLabel = document.createElement('label');
        layoutLabel.textContent = 'Layout Density';
        
        const layoutSelect = document.createElement('select');
        layoutSelect.id = 'layout-select';
        
        // Add layout options
        const layoutOptions = window.ThemeManager.getLayoutOptions();
        layoutOptions.forEach(layout => {
            const option = document.createElement('option');
            option.value = layout.value;
            option.textContent = layout.name;
            layoutSelect.appendChild(option);
        });
        
        // Set the current layout
        const currentLayout = window.ThemeManager.currentTheme.layout;
        for (let i = 0; i < layoutSelect.options.length; i++) {
            if (layoutSelect.options[i].value === currentLayout) {
                layoutSelect.selectedIndex = i;
                break;
            }
        }
        
        layoutSelect.addEventListener('change', (e) => {
            window.ThemeManager.updateLayout(e.target.value);
        });
        
        layoutGroup.appendChild(layoutLabel);
        layoutGroup.appendChild(layoutSelect);
        
        fontSection.appendChild(fontTitle);
        fontSection.appendChild(fontFamilyGroup);
        fontSection.appendChild(fontSizeGroup);
        fontSection.appendChild(layoutGroup);
        
        // Create the actions section
        const actionsSection = document.createElement('div');
        actionsSection.className = 'theme-section theme-actions';
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.className = 'theme-reset-button';
        resetButton.textContent = 'Reset to Default';
        resetButton.addEventListener('click', () => {
            if (confirm('Reset to default theme? This will discard all customizations.')) {
                window.ThemeManager.resetToDefault();
                this.updateColorPickers();
                this.updateFontSelectors();
                this.updateActiveThemeButton();
            }
        });
        
        // Save as custom theme button
        const saveButton = document.createElement('button');
        saveButton.className = 'theme-save-button';
        saveButton.textContent = 'Save as Custom Theme';
        saveButton.addEventListener('click', () => {
            const name = prompt('Enter a name for your custom theme:');
            if (name) {
                window.ThemeManager.createCustomTheme(name);
                alert(`Theme "${name}" saved!`);
            }
        });
        
        actionsSection.appendChild(resetButton);
        actionsSection.appendChild(saveButton);
        
        // Add all sections to the panel content
        panelContent.appendChild(presetSection);
        panelContent.appendChild(colorSection);
        panelContent.appendChild(fontSection);
        panelContent.appendChild(actionsSection);
        
        // Add the panel header and content to the panel
        themePanel.appendChild(panelHeader);
        themePanel.appendChild(panelContent);
        
        // Add the panel to the app container
        appContainer.appendChild(themePanel);
        
        // Mark the active theme button
        this.updateActiveThemeButton();
    },
    
    // Toggle the theme panel
    toggleThemePanel() {
        const panel = document.getElementById('theme-panel');
        if (panel) {
            panel.classList.toggle('visible');
            
            // Update color pickers when panel is shown
            if (panel.classList.contains('visible')) {
                this.updateColorPickers();
                this.updateFontSelectors();
                this.updateActiveThemeButton();
            }
        }
    },
    
    // Update color pickers to match current theme
    updateColorPickers() {
        const colorPickers = document.querySelectorAll('.color-picker');
        colorPickers.forEach(picker => {
            const colorKey = picker.dataset.colorKey;
            picker.value = window.ThemeManager.currentTheme.colors[colorKey];
        });
    },
    
    // Update font selectors to match current theme
    updateFontSelectors() {
        const fontFamilySelect = document.getElementById('font-family-select');
        const fontSizeSelect = document.getElementById('font-size-select');
        const layoutSelect = document.getElementById('layout-select');
        
        if (fontFamilySelect) {
            const currentFontFamily = window.ThemeManager.currentTheme.fonts['font-family'];
            for (let i = 0; i < fontFamilySelect.options.length; i++) {
                if (fontFamilySelect.options[i].value === currentFontFamily) {
                    fontFamilySelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        if (fontSizeSelect) {
            const currentFontSize = window.ThemeManager.currentTheme.fonts['font-size'];
            for (let i = 0; i < fontSizeSelect.options.length; i++) {
                if (fontSizeSelect.options[i].value === currentFontSize) {
                    fontSizeSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        if (layoutSelect) {
            const currentLayout = window.ThemeManager.currentTheme.layout;
            for (let i = 0; i < layoutSelect.options.length; i++) {
                if (layoutSelect.options[i].value === currentLayout) {
                    layoutSelect.selectedIndex = i;
                    break;
                }
            }
        }
    },
    
    // Update active theme button
    updateActiveThemeButton() {
        const presetButtons = document.querySelectorAll('.preset-theme-button');
        presetButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Find the button for the current theme and mark it as active
        const currentThemeName = window.ThemeManager.currentTheme.name;
        const presetThemes = window.ThemeManager.getPresetThemes();
        
        for (const [key, theme] of Object.entries(presetThemes)) {
            if (theme.name === currentThemeName) {
                const button = document.querySelector(`.preset-theme-button[data-theme="${key}"]`);
                if (button) {
                    button.classList.add('active');
                }
                break;
            }
        }
    }
};

// Export the theme UI
window.ThemeUI = ThemeUI;