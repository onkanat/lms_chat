// Model Templates
// This file contains templates for different LLM models to optimize their performance

// Template structure:
// - systemPrompt: Default system message that works well with this model
// - messageFormat: How to format messages (if special formatting is needed)
// - stopTokens: Array of tokens that should signal the end of generation
// - requiresSpecialHandling: Boolean indicating if this model needs special handling

const MODEL_TEMPLATES = {
    // Default template (used when no specific template is found)
    "default": {
        name: "Default Template",
        description: "Standard OpenAI-compatible chat format",
        systemPrompt: "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
        messageFormat: null, // No special formatting needed
        stopTokens: [],
        requiresSpecialHandling: false
    },
    
    // Llama 2 Chat models
    "llama-2-chat": {
        name: "Llama 2 Chat",
        description: "Meta's Llama 2 chat models",
        systemPrompt: "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
        messageFormat: {
            system: "<s>[INST] <<SYS>>\n{message}\n<</SYS>>\n\n",
            user: "{message} [/INST]",
            assistant: " {message} </s><s>[INST] "
        },
        stopTokens: ["</s>"],
        requiresSpecialHandling: true
    },
    
    // Mistral Instruct models
    "mistral-instruct": {
        name: "Mistral Instruct",
        description: "Mistral AI's instruction-tuned models",
        systemPrompt: "You are Mistral AI's helpful assistant. You answer questions thoughtfully and accurately.",
        messageFormat: {
            system: "<s>[INST] {message}\n",
            user: "{message} [/INST]",
            assistant: " {message} </s>"
        },
        stopTokens: ["</s>"],
        requiresSpecialHandling: true
    },
    
    // Mixtral models
    "mixtral-instruct": {
        name: "Mixtral Instruct",
        description: "Mistral AI's Mixtral models",
        systemPrompt: "You are Mixtral, a helpful and honest AI assistant developed by Mistral AI.",
        messageFormat: {
            system: "<s>[INST] {message}\n",
            user: "{message} [/INST]",
            assistant: " {message} </s>"
        },
        stopTokens: ["</s>"],
        requiresSpecialHandling: true
    },
    
    // Vicuna models
    "vicuna": {
        name: "Vicuna",
        description: "Vicuna models from LMSYS",
        systemPrompt: "You are Vicuna, a helpful AI assistant developed by LMSYS.",
        messageFormat: {
            system: "SYSTEM: {message}\n",
            user: "USER: {message}",
            assistant: "ASSISTANT: {message}"
        },
        stopTokens: [],
        requiresSpecialHandling: true
    },
    
    // Claude models
    "claude": {
        name: "Claude",
        description: "Anthropic's Claude models",
        systemPrompt: "You are Claude, a helpful AI assistant developed by Anthropic.",
        messageFormat: {
            system: "Human: <system>\n{message}\n</system>\n\n",
            user: "Human: {message}",
            assistant: "Assistant: {message}"
        },
        stopTokens: [],
        requiresSpecialHandling: true
    },
    
    // Phi models
    "phi": {
        name: "Phi",
        description: "Microsoft's Phi models",
        systemPrompt: "You are Phi, a helpful AI assistant developed by Microsoft.",
        messageFormat: {
            system: "<|system|>\n{message}\n",
            user: "<|user|>\n{message}",
            assistant: "<|assistant|>\n{message}"
        },
        stopTokens: ["<|end|>"],
        requiresSpecialHandling: true
    },
    
    // Gemma models
    "gemma-instruct": {
        name: "Gemma Instruct",
        description: "Google's Gemma instruction-tuned models",
        systemPrompt: "You are Gemma, a helpful AI assistant developed by Google.",
        messageFormat: {
            system: "<start_of_turn>system\n{message}<end_of_turn>\n",
            user: "<start_of_turn>user\n{message}<end_of_turn>\n",
            assistant: "<start_of_turn>model\n{message}<end_of_turn>\n"
        },
        stopTokens: ["<end_of_turn>"],
        requiresSpecialHandling: true
    },
    
    // Qwen models
    "qwen": {
        name: "Qwen",
        description: "Alibaba Cloud's Qwen models",
        systemPrompt: "You are Qwen, a helpful AI assistant developed by Alibaba Cloud.",
        messageFormat: null, // Uses standard format
        stopTokens: [],
        requiresSpecialHandling: false
    },
    
    // Yi models
    "yi-chat": {
        name: "Yi Chat",
        description: "01.AI's Yi chat models",
        systemPrompt: "You are Yi, a helpful AI assistant developed by 01.AI.",
        messageFormat: {
            system: "<|im_start|>system\n{message}<|im_end|>\n",
            user: "<|im_start|>user\n{message}<|im_end|>\n",
            assistant: "<|im_start|>assistant\n{message}<|im_end|>\n"
        },
        stopTokens: ["<|im_end|>"],
        requiresSpecialHandling: true
    },
    
    // Falcon models
    "falcon-instruct": {
        name: "Falcon Instruct",
        description: "TII's Falcon instruction-tuned models",
        systemPrompt: "You are a helpful AI assistant.",
        messageFormat: {
            system: "System: {message}\n",
            user: "User: {message}",
            assistant: "Assistant: {message}"
        },
        stopTokens: [],
        requiresSpecialHandling: true
    },
    
    // OpenChat models
    "openchat": {
        name: "OpenChat",
        description: "OpenChat models",
        systemPrompt: "You are OpenChat, a helpful assistant.",
        messageFormat: {
            system: "<|system|>\n{message}\n",
            user: "<|user|>\n{message}",
            assistant: "<|assistant|>\n{message}"
        },
        stopTokens: ["<|end|>"],
        requiresSpecialHandling: true
    }
};

// Helper function to find the appropriate template for a model
function findTemplateForModel(modelName) {
    modelName = modelName.toLowerCase();
    
    // Check for exact matches first
    if (MODEL_TEMPLATES[modelName]) {
        return MODEL_TEMPLATES[modelName];
    }
    
    // Check for partial matches
    for (const templateKey in MODEL_TEMPLATES) {
        if (templateKey === 'default') continue;
        
        if (modelName.includes(templateKey)) {
            return MODEL_TEMPLATES[templateKey];
        }
    }
    
    // Special case handling for common model families
    if (modelName.includes('llama') && modelName.includes('chat')) {
        return MODEL_TEMPLATES['llama-2-chat'];
    }
    
    if (modelName.includes('mistral') && !modelName.includes('mixtral')) {
        return MODEL_TEMPLATES['mistral-instruct'];
    }
    
    if (modelName.includes('mixtral')) {
        return MODEL_TEMPLATES['mixtral-instruct'];
    }
    
    if (modelName.includes('vicuna')) {
        return MODEL_TEMPLATES['vicuna'];
    }
    
    if (modelName.includes('claude')) {
        return MODEL_TEMPLATES['claude'];
    }
    
    if (modelName.includes('phi')) {
        return MODEL_TEMPLATES['phi'];
    }
    
    if (modelName.includes('gemma')) {
        return MODEL_TEMPLATES['gemma-instruct'];
    }
    
    if (modelName.includes('qwen')) {
        return MODEL_TEMPLATES['qwen'];
    }
    
    if (modelName.includes('yi')) {
        return MODEL_TEMPLATES['yi-chat'];
    }
    
    if (modelName.includes('falcon')) {
        return MODEL_TEMPLATES['falcon-instruct'];
    }
    
    if (modelName.includes('openchat')) {
        return MODEL_TEMPLATES['openchat'];
    }
    
    // Default template as fallback
    return MODEL_TEMPLATES['default'];
}

// Format a message according to the template
function formatMessage(role, content, template) {
    if (!template.requiresSpecialHandling || !template.messageFormat) {
        // No special formatting needed
        return { role, content };
    }
    
    // Apply special formatting
    if (role === 'system' && template.messageFormat.system) {
        return { 
            role, 
            content: template.messageFormat.system.replace('{message}', content)
        };
    }
    
    if (role === 'user' && template.messageFormat.user) {
        return { 
            role, 
            content: template.messageFormat.user.replace('{message}', content)
        };
    }
    
    if (role === 'assistant' && template.messageFormat.assistant) {
        return { 
            role, 
            content: template.messageFormat.assistant.replace('{message}', content)
        };
    }
    
    // Fallback to standard format
    return { role, content };
}

// Format an entire conversation according to the template
function formatConversation(messages, template) {
    if (!template.requiresSpecialHandling) {
        // No special formatting needed
        return messages;
    }
    
    return messages.map(msg => formatMessage(msg.role, msg.content, template));
}

// Get the system prompt for a model
function getSystemPromptForModel(modelName) {
    const template = findTemplateForModel(modelName);
    return template.systemPrompt;
}

// Get stop tokens for a model
function getStopTokensForModel(modelName) {
    const template = findTemplateForModel(modelName);
    return template.stopTokens || [];
}

// Export the module
window.ModelTemplates = {
    templates: MODEL_TEMPLATES,
    findTemplateForModel,
    formatMessage,
    formatConversation,
    getSystemPromptForModel,
    getStopTokensForModel
};