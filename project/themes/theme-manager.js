// Theme Manager
// Handles theme switching, customization, and persistence

// Define preset themes
const PRESET_THEMES = {
    // Dark theme (default)
    'dark': {
        name: 'Dark',
        description: 'Default dark theme',
        colors: {
            'background-color': '#1e1e1e',
            'text-color': '#ffffff',
            'input-background': '#2d2d2d',
            'user-message-color': '#2b5278',
            'assistant-message-color': '#2d2d2d',
            'button-color': '#4a90e2',
            'accent-color': '#4caf50',
            'accent-color-rgb': '76, 175, 80',
            'danger-color': '#f44336',
            'border-color': '#444444',
            'text-muted': '#888888'
        },
        fonts: {
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            'font-size': '14px',
            'line-height': '1.5'
        },
        layout: 'comfortable'
    },
    
    // Light theme
    'light': {
        name: 'Light',
        description: 'Clean light theme',
        colors: {
            'background-color': '#f5f5f5',
            'text-color': '#333333',
            'input-background': '#ffffff',
            'user-message-color': '#e3f2fd',
            'assistant-message-color': '#ffffff',
            'button-color': '#2196f3',
            'accent-color': '#4caf50',
            'accent-color-rgb': '76, 175, 80',
            'danger-color': '#f44336',
            'border-color': '#dddddd',
            'text-muted': '#666666'
        },
        fonts: {
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            'font-size': '14px',
            'line-height': '1.5'
        },
        layout: 'comfortable'
    },
    
    // High Contrast theme
    'high-contrast': {
        name: 'High Contrast',
        description: 'High contrast theme for better accessibility',
        colors: {
            'background-color': '#000000',
            'text-color': '#ffffff',
            'input-background': '#222222',
            'user-message-color': '#003366',
            'assistant-message-color': '#222222',
            'button-color': '#ffcc00',
            'accent-color': '#00ff00',
            'accent-color-rgb': '0, 255, 0',
            'danger-color': '#ff0000',
            'border-color': '#ffffff',
            'text-muted': '#cccccc'
        },
        fonts: {
            'font-family': 'Arial, sans-serif',
            'font-size': '16px',
            'line-height': '1.6'
        },
        layout: 'comfortable'
    },
    
    // Solarized Dark theme
    'solarized-dark': {
        name: 'Solarized Dark',
        description: 'Solarized color scheme (dark variant)',
        colors: {
            'background-color': '#002b36',
            'text-color': '#839496',
            'input-background': '#073642',
            'user-message-color': '#073642',
            'assistant-message-color': '#002b36',
            'button-color': '#268bd2',
            'accent-color': '#859900',
            'accent-color-rgb': '133, 153, 0',
            'danger-color': '#dc322f',
            'border-color': '#586e75',
            'text-muted': '#657b83'
        },
        fonts: {
            'font-family': '"Menlo", "Monaco", "Consolas", monospace',
            'font-size': '14px',
            'line-height': '1.5'
        },
        layout: 'comfortable'
    },
    
    // Solarized Light theme
    'solarized-light': {
        name: 'Solarized Light',
        description: 'Solarized color scheme (light variant)',
        colors: {
            'background-color': '#fdf6e3',
            'text-color': '#657b83',
            'input-background': '#eee8d5',
            'user-message-color': '#eee8d5',
            'assistant-message-color': '#fdf6e3',
            'button-color': '#268bd2',
            'accent-color': '#859900',
            'accent-color-rgb': '133, 153, 0',
            'danger-color': '#dc322f',
            'border-color': '#93a1a1',
            'text-muted': '#839496'
        },
        fonts: {
            'font-family': '"Menlo", "Monaco", "Consolas", monospace',
            'font-size': '14px',
            'line-height': '1.5'
        },
        layout: 'comfortable'
    },
    
    // Nord theme
    'nord': {
        name: 'Nord',
        description: 'Arctic, north-bluish color palette',
        colors: {
            'background-color': '#2e3440',
            'text-color': '#d8dee9',
            'input-background': '#3b4252',
            'user-message-color': '#4c566a',
            'assistant-message-color': '#3b4252',
            'button-color': '#5e81ac',
            'accent-color': '#a3be8c',
            'accent-color-rgb': '163, 190, 140',
            'danger-color': '#bf616a',
            'border-color': '#4c566a',
            'text-muted': '#7b88a1'
        },
        fonts: {
            'font-family': '"Fira Code", "SF Mono", monospace',
            'font-size': '14px',
            'line-height': '1.5'
        },
        layout: 'comfortable'
    },
    
    // Dracula theme
    'dracula': {
        name: 'Dracula',
        description: 'Dark theme with vibrant colors',
        colors: {
            'background-color': '#282a36',
            'text-color': '#f8f8f2',
            'input-background': '#44475a',
            'user-message-color': '#44475a',
            'assistant-message-color': '#282a36',
            'button-color': '#6272a4',
            'accent-color': '#50fa7b',
            'accent-color-rgb': '80, 250, 123',
            'danger-color': '#ff5555',
            'border-color': '#6272a4',
            'text-muted': '#bd93f9'
        },
        fonts: {
            'font-family': '"Fira Code", "Cascadia Code", monospace',
            'font-size': '14px',
            'line-height': '1.5'
        },
        layout: 'comfortable'
    },
    
    // Compact Dark theme
    'compact-dark': {
        name: 'Compact Dark',
        description: 'Space-efficient dark theme',
        colors: {
            'background-color': '#1e1e1e',
            'text-color': '#ffffff',
            'input-background': '#2d2d2d',
            'user-message-color': '#2b5278',
            'assistant-message-color': '#2d2d2d',
            'button-color': '#4a90e2',
            'accent-color': '#4caf50',
            'accent-color-rgb': '76, 175, 80',
            'danger-color': '#f44336',
            'border-color': '#444444',
            'text-muted': '#888888'
        },
        fonts: {
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            'font-size': '13px',
            'line-height': '1.4'
        },
        layout: 'compact'
    },
    
    // Compact Light theme
    'compact-light': {
        name: 'Compact Light',
        description: 'Space-efficient light theme',
        colors: {
            'background-color': '#f5f5f5',
            'text-color': '#333333',
            'input-background': '#ffffff',
            'user-message-color': '#e3f2fd',
            'assistant-message-color': '#ffffff',
            'button-color': '#2196f3',
            'accent-color': '#4caf50',
            'accent-color-rgb': '76, 175, 80',
            'danger-color': '#f44336',
            'border-color': '#dddddd',
            'text-muted': '#666666'
        },
        fonts: {
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            'font-size': '13px',
            'line-height': '1.4'
        },
        layout: 'compact'
    },
    
    // Large Print theme
    'large-print': {
        name: 'Large Print',
        description: 'Larger text for better readability',
        colors: {
            'background-color': '#f5f5f5',
            'text-color': '#333333',
            'input-background': '#ffffff',
            'user-message-color': '#e3f2fd',
            'assistant-message-color': '#ffffff',
            'button-color': '#2196f3',
            'accent-color': '#4caf50',
            'accent-color-rgb': '76, 175, 80',
            'danger-color': '#f44336',
            'border-color': '#dddddd',
            'text-muted': '#666666'
        },
        fonts: {
            'font-family': 'Arial, sans-serif',
            'font-size': '18px',
            'line-height': '1.6'
        },
        layout: 'comfortable'
    }
};

// Font families available for selection
const FONT_FAMILIES = [
    {
        name: 'System Default',
        value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    {
        name: 'Arial',
        value: 'Arial, sans-serif'
    },
    {
        name: 'Georgia',
        value: 'Georgia, serif'
    },
    {
        name: 'Verdana',
        value: 'Verdana, sans-serif'
    },
    {
        name: 'Tahoma',
        value: 'Tahoma, sans-serif'
    },
    {
        name: 'Trebuchet MS',
        value: '"Trebuchet MS", sans-serif'
    },
    {
        name: 'Courier New',
        value: '"Courier New", monospace'
    },
    {
        name: 'Consolas',
        value: 'Consolas, monospace'
    },
    {
        name: 'Fira Code',
        value: '"Fira Code", monospace'
    },
    {
        name: 'Cascadia Code',
        value: '"Cascadia Code", monospace'
    }
];

// Font sizes available for selection
const FONT_SIZES = [
    { name: 'Small', value: '12px' },
    { name: 'Medium', value: '14px' },
    { name: 'Large', value: '16px' },
    { name: 'X-Large', value: '18px' },
    { name: 'XX-Large', value: '20px' }
];

// Layout options
const LAYOUT_OPTIONS = [
    { name: 'Comfortable', value: 'comfortable' },
    { name: 'Compact', value: 'compact' }
];

// Theme Manager object
const ThemeManager = {
    // Current theme
    currentTheme: null,
    
    // Initialize the theme manager
    init() {
        // Load saved theme or use default
        this.loadSavedTheme();
        
        // Apply the current theme
        this.applyTheme();
    },
    
    // Get all preset themes
    getPresetThemes() {
        return PRESET_THEMES;
    },
    
    // Get font families
    getFontFamilies() {
        return FONT_FAMILIES;
    },
    
    // Get font sizes
    getFontSizes() {
        return FONT_SIZES;
    },
    
    // Get layout options
    getLayoutOptions() {
        return LAYOUT_OPTIONS;
    },
    
    // Load saved theme from localStorage
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('lms_chat_theme');
            if (savedTheme) {
                this.currentTheme = JSON.parse(savedTheme);
            } else {
                // Use default dark theme
                this.currentTheme = { ...PRESET_THEMES['dark'] };
            }
        } catch (error) {
            console.error('Error loading saved theme:', error);
            // Use default dark theme as fallback
            this.currentTheme = { ...PRESET_THEMES['dark'] };
        }
    },
    
    // Save current theme to localStorage
    saveTheme() {
        try {
            localStorage.setItem('lms_chat_theme', JSON.stringify(this.currentTheme));
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    },
    
    // Apply the current theme to the document
    applyTheme() {
        // Apply colors
        this.applyColors();
        
        // Apply fonts
        this.applyFonts();
        
        // Apply layout
        this.applyLayout();
    },
    
    // Apply color variables to the document
    applyColors() {
        const root = document.documentElement;
        
        // Set each color variable
        for (const [key, value] of Object.entries(this.currentTheme.colors)) {
            root.style.setProperty(`--${key}`, value);
        }
    },
    
    // Apply font variables to the document
    applyFonts() {
        const root = document.documentElement;
        
        // Set each font variable
        for (const [key, value] of Object.entries(this.currentTheme.fonts)) {
            root.style.setProperty(`--${key}`, value);
        }
        
        // Apply font family and size directly to body
        document.body.style.fontFamily = this.currentTheme.fonts['font-family'];
        document.body.style.fontSize = this.currentTheme.fonts['font-size'];
        document.body.style.lineHeight = this.currentTheme.fonts['line-height'];
    },
    
    // Apply layout class to the document
    applyLayout() {
        // Remove existing layout classes
        document.body.classList.remove('layout-comfortable', 'layout-compact');
        
        // Add the current layout class
        document.body.classList.add(`layout-${this.currentTheme.layout}`);
    },
    
    // Switch to a preset theme
    switchToPresetTheme(themeKey) {
        if (PRESET_THEMES[themeKey]) {
            this.currentTheme = { ...PRESET_THEMES[themeKey] };
            this.applyTheme();
            this.saveTheme();
            return true;
        }
        return false;
    },
    
    // Update a specific color
    updateColor(colorKey, value) {
        if (this.currentTheme.colors[colorKey] !== undefined) {
            this.currentTheme.colors[colorKey] = value;
            this.applyTheme();
            this.saveTheme();
            return true;
        }
        return false;
    },
    
    // Update font family
    updateFontFamily(value) {
        this.currentTheme.fonts['font-family'] = value;
        this.applyTheme();
        this.saveTheme();
    },
    
    // Update font size
    updateFontSize(value) {
        this.currentTheme.fonts['font-size'] = value;
        
        // Adjust line height based on font size
        const fontSize = parseInt(value);
        if (fontSize <= 14) {
            this.currentTheme.fonts['line-height'] = '1.4';
        } else if (fontSize <= 16) {
            this.currentTheme.fonts['line-height'] = '1.5';
        } else {
            this.currentTheme.fonts['line-height'] = '1.6';
        }
        
        this.applyTheme();
        this.saveTheme();
    },
    
    // Update layout
    updateLayout(value) {
        this.currentTheme.layout = value;
        this.applyTheme();
        this.saveTheme();
    },
    
    // Create a custom theme based on the current theme
    createCustomTheme(name) {
        const customTheme = { ...this.currentTheme };
        customTheme.name = name || 'Custom Theme';
        customTheme.description = 'User-created custom theme';
        
        // Save as current theme
        this.currentTheme = customTheme;
        this.applyTheme();
        this.saveTheme();
        
        return customTheme;
    },
    
    // Reset to default theme
    resetToDefault() {
        this.currentTheme = { ...PRESET_THEMES['dark'] };
        this.applyTheme();
        this.saveTheme();
    }
};

// Export the theme manager
window.ThemeManager = ThemeManager;