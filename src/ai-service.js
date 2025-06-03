/**
 * AI Service for Upwork Proposal Generator
 * Uses OpenAI GPT-3.5/4 to generate tailored proposals based on job details
 */

class AIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo'; // Default model
    }

    /**
     * Set the OpenAI API key
     * @param {string} apiKey - The OpenAI API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Set the model to use
     * @param {string} model - The model name (e.g., 'gpt-3.5-turbo', 'gpt-4')
     */
    setModel(model) {
        this.model = model;
    }

    /**
     * Check if the API key is configured
     * @returns {boolean} True if the API key is set, false otherwise
     */
    isConfigured() {
        return Boolean(this.apiKey && this.apiKey.startsWith('sk-'));
    }

    /**
     * Generate a proposal based on job data
     * @param {Object} jobData - Object containing job description, skills, and client info
     * @param {Object} options - Options for proposal generation (tone, length, etc)
     * @returns {Promise<string>} The generated proposal
     */
    async generateProposal(jobData, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI API key is not configured');
        }

        // Default options
        const defaultOptions = {
            tone: 'professional', // professional, conversational, enthusiastic
            length: 'medium',     // short, medium, long
            includePortfolio: true,
            includeQuestions: true,
            personalInfo: {}      // freelancer's info like experience, specialty, etc.
        };

        const mergedOptions = { ...defaultOptions, ...options };
        const prompt = this.buildPrompt(jobData, mergedOptions);

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert freelance proposal writer who creates personalized, compelling proposals for Upwork jobs.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: this.getMaxTokensForLength(mergedOptions.length),
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            // Redact API key from error message for security
            const redactedError = this.redactApiKey(error.message);
            console.error('Error calling OpenAI API:', redactedError);
            
            // Make sure we don't include API key in error messages shown to users
            const safeErrorMessage = this.redactApiKey(error.message);
            throw new Error(`Failed to generate proposal: ${safeErrorMessage}`);
        }
    }

    /**
     * Build the prompt for the OpenAI API
     * @param {Object} jobData - Job data object
     * @param {Object} options - Generation options
     * @returns {string} The formatted prompt
     */
    buildPrompt(jobData, options) {
        const { description, skills, clientInfo } = jobData;
        const { tone, includePortfolio, includeQuestions, personalInfo } = options;

        // Build the freelancer context
        let freelancerContext = '';
        if (personalInfo) {
            if (personalInfo.name) freelancerContext += `My name is ${personalInfo.name}. `;
            if (personalInfo.experience) freelancerContext += `I have ${personalInfo.experience} of experience. `;
            if (personalInfo.specialty) freelancerContext += `I specialize in ${personalInfo.specialty}. `;
            if (personalInfo.achievements) freelancerContext += `Some of my achievements include: ${personalInfo.achievements}. `;
        }

        // Build the prompt
        let prompt = `
Please write a compelling Upwork proposal for the following job:

JOB DESCRIPTION:
${description}

REQUIRED SKILLS:
${Array.isArray(skills) ? skills.join(', ') : skills}

CLIENT INFORMATION:
- Location: ${clientInfo.location}
- Rating: ${clientInfo.rating}
- Total Spent: ${clientInfo.totalSpent}
- Jobs Posted: ${clientInfo.jobsPosted}
- Payment Verified: ${clientInfo.paymentVerified}

FREELANCER CONTEXT:
${freelancerContext || 'I am an experienced freelancer looking to create a compelling proposal for this job.'}

INSTRUCTIONS:
1. Write a ${tone} proposal that addresses the client's specific needs mentioned in the job description
2. Highlight my relevant skills and experience that match the required skills
3. Make the proposal ${options.length}-length (not too verbose, focus on value)
${includePortfolio ? '4. Include a brief mention of relevant past work or portfolio items' : ''}
${includeQuestions ? '5. Include 1-2 thoughtful questions that show engagement with the project' : ''}
6. Close with a clear call to action

Format the proposal in a clean, professional way with appropriate paragraphs and white space.
Do not use any generic placeholders like [YOUR EXPERIENCE] - create a complete, ready-to-use proposal.
`;

        return prompt;
    }

    /**
     * Get the appropriate max tokens based on the desired length
     * @param {string} length - 'short', 'medium', or 'long'
     * @returns {number} The max tokens value
     */
    getMaxTokensForLength(length) {
        switch (length) {
            case 'short': return 500;
            case 'medium': return 1000;
            case 'long': return 2000;
            default: return 1000;
        }
    }

    /**
     * Get the API key from storage
     * @returns {Promise<string>} The API key
     */
    static async getApiKeyFromStorage() {
        return new Promise((resolve) => {
            // Get the API based on environment
            let api;
            if (typeof browserAPI !== 'undefined') {
                api = browserAPI;
            } else if (typeof chrome !== 'undefined') {
                api = chrome;
            } else if (typeof self !== 'undefined' && typeof self.chrome !== 'undefined') {
                api = self.chrome;
            } else {
                console.error('No browser API available');
                throw new Error('Browser API not available');
            }
            
            api.storage.sync.get(['openaiApiKey'], (result) => {
                resolve(result.openaiApiKey || '');
            });
        });
    }

    /**
     * Save the API key to storage
     * @param {string} apiKey - The API key to save
     * @returns {Promise<void>}
     */
    static async saveApiKeyToStorage(apiKey) {
        return new Promise((resolve) => {
            // Get the API based on environment
            let api;
            if (typeof browserAPI !== 'undefined') {
                api = browserAPI;
            } else if (typeof chrome !== 'undefined') {
                api = chrome;
            } else if (typeof self !== 'undefined' && typeof self.chrome !== 'undefined') {
                api = self.chrome;
            } else {
                console.error('No browser API available');
                throw new Error('Browser API not available');
            }
            
            api.storage.sync.set({ 'openaiApiKey': apiKey }, resolve);
        });
    }

    /**
     * Load the API key from .env or storage
     * @returns {Promise<string>} The API key
     */
    static async loadApiKey() {
        // First try to get from chrome storage
        const storedKey = await AIService.getApiKeyFromStorage();
        if (storedKey) return storedKey;
        
        // If not in storage, try to get from env (this is only for development)
        try {
            // This would only work if somehow the extension had access to env vars
            // which is generally not the case for browser extensions
            return process.env.OPENAI_API_KEY;
        } catch (e) {
            // Expected in browser context
            return '';
        }
    }

    /**
     * Redact API key from error messages for security
     * @param {string} text - Text that might contain API key
     * @returns {string} - Redacted text safe for logging
     */
    redactApiKey(text) {
        if (!text) return text;
        
        // Pattern for OpenAI API keys
        const apiKeyPattern = /sk-[a-zA-Z0-9]{20,}/g;
        
        // Replace with redacted version
        return text.toString().replace(apiKeyPattern, key => {
            // Show only first 3 and last 4 characters
            return `${key.substring(0, 5)}...${key.substring(key.length - 4)}`;
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined') {
    module.exports = AIService;
}