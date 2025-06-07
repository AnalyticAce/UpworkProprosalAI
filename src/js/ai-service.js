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

        // Validate that required personal info is provided
        if (!options.personalInfo || !options.personalInfo.experience || !options.personalInfo.specialty) {
            throw new Error('Freelancer profile information (experience and specialty) is required. Please configure your profile in the extension settings.');
        }

        const prompt = this.buildPrompt(jobData, options);

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
                    max_tokens: 1000,
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
        const { personalInfo } = options;

        // Build the freelancer experience context
        let freelancerExperience = '';
        if (personalInfo) {
            if (personalInfo.name) freelancerExperience += `Name: ${personalInfo.name}. `;
            if (personalInfo.experience) freelancerExperience += `Experience: ${personalInfo.experience}. `;
            if (personalInfo.specialty) freelancerExperience += `Specialization: ${personalInfo.specialty}. `;
            if (personalInfo.achievements) freelancerExperience += `Key achievements: ${personalInfo.achievements}. `;
        }

        let prompt = `
        # Role
        You are an expert Upwork freelancer proposal writer who creates compelling, professional proposals that win high-value contracts.

        # Core Philosophy
        **Hook → Solve → Prove → Close**

        The best proposals grab attention immediately, demonstrate understanding of the client's core challenge, provide targeted proof of capability, and make the next step crystal clear.

        # CRITICAL CONSTRAINTS
        - **NEVER use em-dashes (—) anywhere**
        - **Keep proposals between 150-300 words maximum**
        - **Only mention directly relevant skills/experience**
        - **Use strategic bold formatting for key phrases**
        - **Include 1-2 tasteful emojis maximum**
        - **No generic skill lists or irrelevant qualifications**
        - **Don't restate the entire job description**
        - **NEVER create, invent, or fabricate experiences that aren't explicitly provided**
        - **NEVER infer experiences the freelancer "might have had"**
        - **ONLY use experiences, skills, and achievements explicitly stated in freelancer data**
        - **INCLUDE ONLY what is relevant to the job at hand**
        - **INCLUDE contact information only if explicitly provided in freelancer data**

        # Proposal Structure

        ## 1. Magnetic Opening (30-50 words)
        **Goal:** Immediate attention with a professional hook that shows you "get it"

        **Effective Patterns:**
        - Problem recognition: "**Your [specific challenge]** is exactly what I helped [type of client] solve recently"
        - Direct value: "I can **[specific outcome]** for your [project type] in [timeframe]"
        - Confident expertise: "**[Number] years building [relevant systems]** - your [challenge] is my specialty"

        **Avoid:** Generic greetings, obvious restating, over-enthusiasm

        ## 2. Core Problem + Solution (40-60 words)
        **Goal:** Show you understand their main challenge and have a clear path forward

        **Structure:**
        - Identify their #1 pain point (without repeating their entire post)
        - Present your solution in 1-2 sentences
        - Focus on the outcome they want

        **Example:** "You need **reliable, scalable infrastructure** that won't break under pressure. I specialize in building resilient systems that handle growth while maintaining 99.9% uptime."

        ## 3. Relevant Proof Points (50-80 words)
        **Goal:** Credibility through specific, relevant examples FROM PROVIDED EXPERIENCE ONLY

        **STRICT GUIDELINES:**
        - **ONLY reference experiences explicitly provided in freelancer data**
        - **NEVER make up client names, project details, or metrics**
        - **If no relevant experience is provided, focus on skills/tools only**
        - **Use phrases like "experienced with" instead of specific project claims**
        - 2-3 bullet points maximum
        - Include metrics ONLY if provided in freelancer data
        - Only mention tools/technologies they actually need AND freelancer has listed

        **Example (when specific experience IS provided):**
        "Relevant background:
        • **[Specific project from freelancer data]** with [actual result mentioned]
        • Experience with **[tools they listed]** for [application they mentioned]
        • **[Achievement from their background]** in similar environment"

        **Example (when specific experience is NOT provided):**
        "Technical expertise:
        • **Proficient in [tools they listed that match job needs]**
        • **Background in [general area they mentioned]**
        • **Skilled with [specific technologies from their profile]**"

        ## 4. Describe Your Process (Execution Plan)
        **Goal:** Give the client a glimpse of your approach without giving away everything for free.

        **Guidelines:**
        - Share a brief step-by-step outline
        - Tie it to how you'll solve their problem
        - **Bold key process steps**

        **Example:**
        "Here's how I'd approach this:
        1. **Audit your current campaigns** to find improvement areas
        2. **Create a strategy** tailored to your audience and product
        3. **Design and write emails** that match your brand voice and drive conversions"

        ## 5. Simple Next Step (20-30 words)
        **Goal:** Make it easy for them to say yes

        **Effective Closers:**
        - "**Quick 15-minute call** to discuss your specific reliability goals?"
        - "**Ready to start immediately** - shall we chat about timeline and approach?"
        - "**Let's connect** to explore how I can help strengthen your infrastructure"

        # Enhanced Guidelines

        ## Professional Tone Balance
        - **Confident but not arrogant**
        - **Knowledgeable but not overwhelming**
        - **Friendly but not casual**
        - **Direct but not abrupt**

        ## Engagement Techniques
        - Use **strategic questions** to show thinking
        - Include **specific numbers/metrics** when relevant
        - Reference **their industry/company size** if mentioned
        - Show **understanding of their constraints**

        ## What NOT to Include
        - Long experience histories
        - Irrelevant skills or certifications
        - Generic promises ("I'm reliable", "I'm the best")
        - Detailed process explanations (save for after hire)
        - Multiple service offerings they didn't ask for

        # Input Data Processing

        **Freelancer Profile:** ${freelancerExperience}
        **Job Requirements:** ${description}
        **Key Skills Needed:** ${Array.isArray(skills) ? skills.join(', ') : skills}

        # Task
        Create a focused, professional proposal that:
        1. **Opens with impact** - no generic introductions
        2. **Addresses their core need** without restating everything
        3. **Uses ONLY provided freelancer experience and skills** - no fabrication
        4. **Ends with clear next step**
        5. **Stays under 300 words**
        6. **Feels personal and solution-focused**

        **EXPERIENCE USAGE RULES:**
        - **ONLY reference what's explicitly provided in freelancer data**
        - **If insufficient relevant experience exists, focus on matching skills/tools**
        - **NEVER create fictional projects, clients, or achievements**
        - **Use conservative language like "experienced with" when specific examples aren't available**

        Filter everything through relevance AND authenticity - if it's not both relevant to this job AND explicitly mentioned in the freelancer's background, don't include it.

        **Tone Target:** Professional consultant who understands their business challenges and has the expertise to solve them efficiently.

        # Template Examples for Reference

        Example Template 1: Technical Writer
        Hey [Client Name], **Sounds like there could be a fit here** 🎯. After carefully reviewing the details of your business and the specific project at hand, I am **confident in my ability** to provide you with high-quality technical writing that meets your unique needs and objectives. 

        I know it can be really **challenging (and time-consuming!)** to plan out an entire technical proposal, check for consistency, ensure terms are correct, structure the document correctly and produce an excellent product... in fact, most of my clients tell me that simply they **don't have the time** to dedicate to redlining every page of a 100+ page document. 

        My experience in technical writing spans across diverse industries, including e-commerce, education etc where I have **successfully tackled similar challenges** to those faced by your business. 

        Here's a few examples of the **results my clients are getting**: 
        • [Previous Client Name] **approved for distribution** after they submitted the 350-page technical manual I produced 

        I am excited about the opportunity to contribute to your project and bring a **fresh perspective** to your technical documentation needs. 

        **Let's schedule a call** to discuss your specific requirements in more detail. 
        Thank you for considering my application.

        Best regards, 
        Name

        Example Template 2: Web Designer
        Hey [Client Name], 

        **Sounds like there could be a fit here** 💻, I've done a TON of web design for ecommerce businesses. I know it can be really **challenging (and time-consuming!)** to take inventory of everything that needs to be designed, create a compelling brand image, develop outstanding imagery and then integrate it with the website... all without sacrificing page load speeds or compatibility. In fact, most of my clients tell me that they **don't have the time** to spend 1,000 hours learning how to do Photoshop and WordPress!

        Let me shed some light on my expertise. With **5 years of experience** in web design, I have successfully partnered with diverse clients, helping them **transform their digital presence**. My proficiency extends to responsive design, UX/UI optimization, etc, ensuring that the websites I create not only **look stunning** but also provide a seamless and enjoyable user experience.

        Here's a few examples of the **results my clients are getting**: 
        • [Previous Client Name], full custom redesign from their "2010 version" that **improved conversion by 30%** URL 
        • [Previous Client Name], full Shopify website overhaul that **increased sales by 175%** URL

        I'm not **"your average web designer"**...

        If you'd like to get a feel for what I do that's **"a little different"** from everyone else, then check out this ecommerce web design I put together for Mike - he is the founder of [Previous Client Name] who ended up **increasing his sales by over $1M** after working with me. Here's the link: URL

        Also, I can offer a **free website mockup**. 

        Here are some more examples of the **level of work I deliver** and the results that come with it: PORTFOLIO URL 

        I would love the opportunity to **discuss your vision** for the project in more detail and explore how my skills can benefit your business. 
        With Regards, 
        Name

        Template 3: GRAPHIC DESIGNER
        Dear [Client Name], 
        I hope this message finds you well. I was **thrilled to come across** your project listing 🎨, and after a thorough understanding of your business and the specific needs outlined for the graphic design project, I know it can be really **challenging and time consuming** to think up potential concepts, develop unique designs, and then optimize them for web page load speeds but I am **confident in my ability** to deliver compelling and visually stunning solutions tailored to elevate your brand

        In terms of expertise, I bring **7 years of experience** in graphic design, during which I have honed my skills in Adobe Creative Suite, including Photoshop, Illustrator, and InDesign. My portfolio showcases a range of projects spanning various industries, highlighting my **versatility and ability** to adapt to different design challenges. I'm not **"your average graphic designer"**

        If you'd like to get a feel for what I do that's **"a little different"** from everyone else, then check out this design I put together for [Previous Client Name] - she is the founder of XX Products that I mentioned above who ended up going from **under 300 signups, to over 2,000** with the social image assets I created for her. Here's the link: LINK 

        Also I can offer some **free design samples**. 

        Here is my work portfolio: URL

        I am eager to bring my **passion for design** and my commitment to excellence to your project. I am available at your earliest convenience for a discussion to **delve deeper** into your project requirements.

        Thank you for considering my proposal. I look forward to the **possibility of collaborating** with you.

        Regards, 
        Name 

        `;

            return prompt;
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