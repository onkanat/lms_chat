// Prompt Library
// Manages a collection of prompt templates for quick access

// Define preset prompt categories and templates
const PRESET_PROMPTS = {
    // Writing category
    'writing': {
        name: 'Writing',
        description: 'Prompts for creative and professional writing',
        prompts: [
            {
                id: 'writing-essay',
                name: 'Essay Outline',
                description: 'Generate an outline for an academic essay',
                prompt: 'Create a detailed outline for a {length} essay about {topic}. Include an introduction, {num_points} main points with supporting evidence, and a conclusion.',
                variables: [
                    { name: 'topic', description: 'Essay topic', default: 'climate change' },
                    { name: 'length', description: 'Essay length', default: '5-page' },
                    { name: 'num_points', description: 'Number of main points', default: '3' }
                ]
            },
            {
                id: 'writing-blog',
                name: 'Blog Post',
                description: 'Generate a blog post on a specific topic',
                prompt: 'Write a {tone} blog post about {topic}. The target audience is {audience}. Include a catchy headline, {num_sections} sections with subheadings, and a call-to-action at the end.',
                variables: [
                    { name: 'topic', description: 'Blog topic', default: 'productivity tips' },
                    { name: 'tone', description: 'Writing tone', default: 'conversational' },
                    { name: 'audience', description: 'Target audience', default: 'young professionals' },
                    { name: 'num_sections', description: 'Number of sections', default: '3' }
                ]
            },
            {
                id: 'writing-story',
                name: 'Short Story',
                description: 'Generate a creative short story',
                prompt: 'Write a {genre} short story about {character} who {situation}. Set the story in {setting} and include themes of {theme}.',
                variables: [
                    { name: 'genre', description: 'Story genre', default: 'science fiction' },
                    { name: 'character', description: 'Main character', default: 'a time-traveling archaeologist' },
                    { name: 'situation', description: 'Character situation', default: 'discovers an ancient artifact with mysterious powers' },
                    { name: 'setting', description: 'Story setting', default: 'a futuristic city with ancient ruins' },
                    { name: 'theme', description: 'Story theme', default: 'discovery and responsibility' }
                ]
            }
        ]
    },
    
    // Programming category
    'programming': {
        name: 'Programming',
        description: 'Prompts for coding and software development',
        prompts: [
            {
                id: 'programming-function',
                name: 'Function Implementation',
                description: 'Generate code for a specific function',
                prompt: 'Write a {language} function that {functionality}. Include error handling, comments, and examples of how to use it.',
                variables: [
                    { name: 'language', description: 'Programming language', default: 'Python' },
                    { name: 'functionality', description: 'Function purpose', default: 'sorts a list of objects by a specific attribute' }
                ]
            },
            {
                id: 'programming-debug',
                name: 'Debug Code',
                description: 'Help debug a piece of code',
                prompt: 'The following {language} code has a bug:\n\n```{language}\n{code}\n```\n\nThe error I'm getting is: {error}\n\nPlease help me identify and fix the bug. Explain what's wrong and provide the corrected code.',
                variables: [
                    { name: 'language', description: 'Programming language', default: 'JavaScript' },
                    { name: 'code', description: 'Code with bug', default: 'function calculateSum(numbers) {\n  let sum;\n  for (let i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n  }\n  return sum;\n}' },
                    { name: 'error', description: 'Error message', default: 'NaN' }
                ]
            },
            {
                id: 'programming-algorithm',
                name: 'Algorithm Explanation',
                description: 'Explain an algorithm step by step',
                prompt: 'Explain how the {algorithm} algorithm works. Include:\n1. A simple explanation of the purpose\n2. Step-by-step breakdown of the algorithm\n3. Time and space complexity analysis\n4. Example implementation in {language}\n5. A simple example showing the algorithm in action',
                variables: [
                    { name: 'algorithm', description: 'Algorithm name', default: 'quicksort' },
                    { name: 'language', description: 'Programming language', default: 'Python' }
                ]
            }
        ]
    },
    
    // Education category
    'education': {
        name: 'Education',
        description: 'Prompts for learning and teaching',
        prompts: [
            {
                id: 'education-explain',
                name: 'Concept Explanation',
                description: 'Explain a concept at different levels',
                prompt: 'Explain {concept} in {num_levels} different ways:\n1. To a 5-year-old\n2. To a high school student\n3. To a college graduate\n4. To an expert in the field\n\nUse analogies and examples appropriate for each level.',
                variables: [
                    { name: 'concept', description: 'Concept to explain', default: 'quantum computing' },
                    { name: 'num_levels', description: 'Number of explanation levels', default: '4' }
                ]
            },
            {
                id: 'education-lesson',
                name: 'Lesson Plan',
                description: 'Create a lesson plan for teaching',
                prompt: 'Create a detailed {duration} lesson plan for teaching {subject} to {audience}. Include:\n1. Learning objectives\n2. Required materials\n3. Introduction activity\n4. Main content with teaching methods\n5. Practice activities\n6. Assessment strategy\n7. Conclusion and homework',
                variables: [
                    { name: 'subject', description: 'Subject to teach', default: 'photosynthesis' },
                    { name: 'audience', description: 'Target audience', default: 'middle school students' },
                    { name: 'duration', description: 'Lesson duration', default: '45-minute' }
                ]
            },
            {
                id: 'education-quiz',
                name: 'Quiz Generator',
                description: 'Generate quiz questions on a topic',
                prompt: 'Create a {difficulty} quiz about {topic} with {num_questions} questions. Include a mix of {question_types} questions. Provide the answers separately.',
                variables: [
                    { name: 'topic', description: 'Quiz topic', default: 'world history' },
                    { name: 'difficulty', description: 'Quiz difficulty', default: 'intermediate' },
                    { name: 'num_questions', description: 'Number of questions', default: '10' },
                    { name: 'question_types', description: 'Types of questions', default: 'multiple choice, true/false, and short answer' }
                ]
            }
        ]
    },
    
    // Business category
    'business': {
        name: 'Business',
        description: 'Prompts for business and professional tasks',
        prompts: [
            {
                id: 'business-email',
                name: 'Professional Email',
                description: 'Draft a professional email',
                prompt: 'Write a professional email to {recipient} about {topic}. The tone should be {tone} and the purpose is to {purpose}. Include a clear subject line, greeting, body, and signature.',
                variables: [
                    { name: 'recipient', description: 'Email recipient', default: 'a potential client' },
                    { name: 'topic', description: 'Email topic', default: 'a project proposal' },
                    { name: 'tone', description: 'Email tone', default: 'formal but friendly' },
                    { name: 'purpose', description: 'Email purpose', default: 'introduce our services and request a meeting' }
                ]
            },
            {
                id: 'business-plan',
                name: 'Business Plan Section',
                description: 'Generate a section of a business plan',
                prompt: 'Write the {section} section of a business plan for a {business_type}. Include all relevant details that would be expected in a professional business plan.',
                variables: [
                    { name: 'section', description: 'Business plan section', default: 'market analysis' },
                    { name: 'business_type', description: 'Type of business', default: 'mobile app startup' }
                ]
            },
            {
                id: 'business-swot',
                name: 'SWOT Analysis',
                description: 'Perform a SWOT analysis',
                prompt: 'Conduct a detailed SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for a {business_type} in the {industry} industry. For each category, provide at least {num_points} points with brief explanations.',
                variables: [
                    { name: 'business_type', description: 'Type of business', default: 'small retail store' },
                    { name: 'industry', description: 'Business industry', default: 'fashion' },
                    { name: 'num_points', description: 'Points per category', default: '3' }
                ]
            }
        ]
    },
    
    // Research category
    'research': {
        name: 'Research',
        description: 'Prompts for academic and general research',
        prompts: [
            {
                id: 'research-literature',
                name: 'Literature Review',
                description: 'Generate a literature review outline',
                prompt: 'Create an outline for a literature review on {topic} in the field of {field}. Include sections for introduction, methodology, key findings from existing research, gaps in the literature, and conclusion.',
                variables: [
                    { name: 'topic', description: 'Research topic', default: 'the effects of social media on mental health' },
                    { name: 'field', description: 'Academic field', default: 'psychology' }
                ]
            },
            {
                id: 'research-methodology',
                name: 'Research Methodology',
                description: 'Design a research methodology',
                prompt: 'Design a research methodology to study {research_question}. Include research approach, data collection methods, sampling strategy, data analysis techniques, and potential limitations.',
                variables: [
                    { name: 'research_question', description: 'Research question', default: 'how remote work affects employee productivity and well-being' }
                ]
            },
            {
                id: 'research-analysis',
                name: 'Data Analysis Plan',
                description: 'Create a plan for analyzing data',
                prompt: 'Create a comprehensive data analysis plan for a study on {topic}. The data collected includes {data_types}. Outline the statistical methods, tools, and steps you would use to analyze this data and answer the research questions.',
                variables: [
                    { name: 'topic', description: 'Research topic', default: 'consumer purchasing behavior' },
                    { name: 'data_types', description: 'Types of data collected', default: 'survey responses, purchase history, and demographic information' }
                ]
            }
        ]
    }
};

// Main Prompt Library object
const PromptLibrary = {
    // State
    categories: {},
    customPrompts: [],
    
    // Initialize the prompt library
    init() {
        console.log('Initializing Prompt Library...');
        
        // Load preset prompts
        this.loadPresetPrompts();
        
        // Load custom prompts from localStorage
        this.loadCustomPrompts();
        
        console.log('Prompt Library initialized successfully');
    },
    
    // Load preset prompts
    loadPresetPrompts() {
        this.categories = { ...PRESET_PROMPTS };
    },
    
    // Load custom prompts from localStorage
    loadCustomPrompts() {
        try {
            const savedPrompts = localStorage.getItem('lms_chat_custom_prompts');
            if (savedPrompts) {
                this.customPrompts = JSON.parse(savedPrompts);
                
                // Add custom category if it doesn't exist
                if (!this.categories.custom) {
                    this.categories.custom = {
                        name: 'Custom',
                        description: 'Your saved custom prompts',
                        prompts: []
                    };
                }
                
                // Add custom prompts to the custom category
                this.categories.custom.prompts = [...this.customPrompts];
            }
        } catch (error) {
            console.error('Error loading custom prompts:', error);
            this.customPrompts = [];
        }
    },
    
    // Save custom prompts to localStorage
    saveCustomPrompts() {
        try {
            localStorage.setItem('lms_chat_custom_prompts', JSON.stringify(this.customPrompts));
            
            // Update the custom category
            if (!this.categories.custom) {
                this.categories.custom = {
                    name: 'Custom',
                    description: 'Your saved custom prompts',
                    prompts: []
                };
            }
            
            this.categories.custom.prompts = [...this.customPrompts];
        } catch (error) {
            console.error('Error saving custom prompts:', error);
        }
    },
    
    // Get all categories
    getCategories() {
        return Object.keys(this.categories).map(key => ({
            id: key,
            name: this.categories[key].name,
            description: this.categories[key].description
        }));
    },
    
    // Get prompts for a category
    getPromptsByCategory(categoryId) {
        if (this.categories[categoryId]) {
            return this.categories[categoryId].prompts;
        }
        return [];
    },
    
    // Get a specific prompt by ID
    getPromptById(promptId) {
        for (const categoryId in this.categories) {
            const category = this.categories[categoryId];
            const prompt = category.prompts.find(p => p.id === promptId);
            if (prompt) {
                return prompt;
            }
        }
        return null;
    },
    
    // Add a custom prompt
    addCustomPrompt(prompt) {
        // Generate a unique ID
        const id = 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
        
        // Create the prompt object
        const newPrompt = {
            id,
            name: prompt.name,
            description: prompt.description,
            prompt: prompt.prompt,
            variables: prompt.variables || []
        };
        
        // Add to custom prompts
        this.customPrompts.push(newPrompt);
        
        // Save to localStorage
        this.saveCustomPrompts();
        
        return newPrompt;
    },
    
    // Update a custom prompt
    updateCustomPrompt(promptId, updatedPrompt) {
        // Find the prompt
        const index = this.customPrompts.findIndex(p => p.id === promptId);
        if (index === -1) {
            return false;
        }
        
        // Update the prompt
        this.customPrompts[index] = {
            ...this.customPrompts[index],
            name: updatedPrompt.name,
            description: updatedPrompt.description,
            prompt: updatedPrompt.prompt,
            variables: updatedPrompt.variables || []
        };
        
        // Save to localStorage
        this.saveCustomPrompts();
        
        return true;
    },
    
    // Delete a custom prompt
    deleteCustomPrompt(promptId) {
        // Find the prompt
        const index = this.customPrompts.findIndex(p => p.id === promptId);
        if (index === -1) {
            return false;
        }
        
        // Remove the prompt
        this.customPrompts.splice(index, 1);
        
        // Save to localStorage
        this.saveCustomPrompts();
        
        return true;
    },
    
    // Process a prompt template with variables
    processPromptTemplate(promptId, variables = {}) {
        // Get the prompt
        const prompt = this.getPromptById(promptId);
        if (!prompt) {
            return null;
        }
        
        // Start with the template
        let processedPrompt = prompt.prompt;
        
        // Replace variables
        prompt.variables.forEach(variable => {
            const value = variables[variable.name] || variable.default || '';
            processedPrompt = processedPrompt.replace(new RegExp(`{${variable.name}}`, 'g'), value);
        });
        
        return processedPrompt;
    },
    
    // Export all custom prompts
    exportCustomPrompts() {
        return JSON.stringify(this.customPrompts);
    },
    
    // Import custom prompts
    importCustomPrompts(jsonData) {
        try {
            const importedPrompts = JSON.parse(jsonData);
            
            // Validate the imported data
            if (!Array.isArray(importedPrompts)) {
                throw new Error('Invalid format: Expected an array of prompts');
            }
            
            // Add each imported prompt
            importedPrompts.forEach(prompt => {
                // Check if prompt already exists
                const existingIndex = this.customPrompts.findIndex(p => p.id === prompt.id);
                if (existingIndex !== -1) {
                    // Update existing prompt
                    this.customPrompts[existingIndex] = prompt;
                } else {
                    // Add new prompt
                    this.customPrompts.push(prompt);
                }
            });
            
            // Save to localStorage
            this.saveCustomPrompts();
            
            return true;
        } catch (error) {
            console.error('Error importing custom prompts:', error);
            return false;
        }
    }
};

// Export the Prompt Library
window.PromptLibrary = PromptLibrary;