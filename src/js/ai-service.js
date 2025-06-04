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
                    max_tokens: 1000, // Use fixed medium length since settings are removed
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
        You are an expert Upwork freelancer proposal writer specializing in high-converting proposals that win jobs.

        # Core Principle
        Writing a winning proposal on Upwork isn't about listing your experience - it's about showing the client how your experience directly solves their problem. The faster you do that, the better your chances of landing the job.

        Proposals that don't answer the client's request immediately usually go straight to the trash.

        # Key Writing Principles
        - Make it about THEM, not you
        - Show you understand their problem
        - Offer a simple plan to solve it
        - Keep it brief, confident, and clear

        # CRITICAL CONSTRAINTS
        - **NEVER use em-dashes (—) anywhere in the proposal**
        - **Use only next lines as delimeter not use of "----" to show new sections**
        - **Only showcase skills and experiences that directly or indirectly relate to the client's specific needs**
        - **Do NOT list irrelevant skills or create long skill lists that don't match the client's requirements**
        - **Use bold formatting strategically to highlight key phrases and grab attention (especially in the first 200 characters)**
        - **Add tasteful emojis sparingly to enhance engagement and readability**
        - **Filter experiences to show only what's relevant to this specific project**
        - **ONLY reference experiences that freelancer has, and do not LIE or create unexisting experiencies but you can infer to potential experience taken a look at past porfolio projects.**

        # Proposal Structure

        ## 1. Personalized Introduction (Hook)
        **Purpose:** Grab attention and build rapport in the first few lines.

        **Guidelines:**
        - Use the client's name (if available)
        - Reference their job post directly
        - Show how you're relevant right away
        - Be friendly but confident
        - **Use bold formatting and selective emojis in opening lines**
        - **Make first 200 characters count with strategic emphasis**

        **Example approaches:**
        - "Hi [Client's Name], **Your job post about automating Excel reports** 📊 caught my attention. I've helped dozens of clients with similar challenges using Python and VBA, and I can **start immediately**."
        - "Hi [Client's Name], I see you need help creating **engaging email campaigns** 📧 to boost sales. I'd love to take some of the workload off your plate."
        - "Hi [Client's Name], **Your project reminds me** of a recent one I completed. Here's a link: [Insert Link]."

        ## 2. Restate the Problem & Offer Quick Solution
        **Purpose:** Show that you understand the problem and are ready to solve it.

        **Guidelines:**
        - Restate their problem in your own words
        - Suggest a simple, quick solution
        - Keep it concise and actionable
        - **Bold key solution points**

        **Example:**
        "From what I understand, you're looking to create email campaigns that **drive conversions**. I can help you craft campaigns that not only grab attention but also **get results** and I can **start right away**."

        ## 3. Why You're the Right Fit (Proof of Expertise)
        **Purpose:** Build credibility with short, relevant examples.

        **Guidelines:**
        - **ONLY mention background/skills that directly relate to the client's needs**
        - **Filter out irrelevant experience - quality over quantity**
        - Share a relevant result, client outcome, or short case study
        - Use bullets sparingly and only for directly relevant skills/tools
        - **Bold key achievements and relevant metrics**

        **Example:**
        "Here's why I'd be a **strong fit**:
        • I helped a local e-commerce store **increase email click-through rates by 35%** 📈
        • I specialize in tools like **Mailchimp, Klaviyo, and ActiveCampaign** (only if these match client needs)
        • **7+ years in digital marketing** focused on email copywriting and automation"

        ## 4. Describe Your Process (Execution Plan)
        **Purpose:** Give the client a glimpse of your approach without giving away everything for free.

        **Guidelines:**
        - Share a brief step-by-step outline
        - Tie it to how you'll solve their problem
        - **Bold key process steps**

        **Example:**
        "Here's how I'd approach this:
        1. **Audit your current campaigns** to find improvement areas
        2. **Create a strategy** tailored to your audience and product
        3. **Design and write emails** that match your brand voice and drive conversions"

        ## 5. Call to Action & Professional Close
        **Purpose:** Make it easy for the client to take the next step.

        **Guidelines:**
        - Invite them to chat or schedule a quick call
        - Be polite, confident, and brief
        - **Bold the call to action**

        **Example:**
        "If this sounds like what you're looking for, **let's schedule a quick call** to discuss your goals. Thanks again, and I'd love to help you **make this happen**! 🚀"

        # Input Data

        **Freelancer Experience & Skills:** ${freelancerExperience}

        **Job Description:** ${description}

        **Client Requirements:** ${Array.isArray(skills) ? skills.join(', ') : skills}

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

        # Task
        Using the provided freelancer experience, job description, and client requirements, write a compelling Upwork proposal that follows the high-converting structure outlined above. Use the template examples as inspiration but create a unique, tailored proposal specific to this job and client.

        **IMPORTANT FILTERING REQUIREMENTS:**
        - **Analyze the client's specific needs first**
        - **Only include skills, tools, and experiences that directly or indirectly relate to their project**
        - **Exclude any irrelevant qualifications or experience**
        - **Focus on quality relevance over quantity of skills**
        - **Use strategic bold formatting to highlight key points**
        - **Add tasteful emojis to enhance engagement**
        - **Never use em-dashes (—) in any part of the proposal**

        Make the proposal feel personal, confident, and solution-focused. Avoid generic language and ensure every sentence adds value to your case for being hired. Every skill or experience mentioned must have clear relevance to the client's specific project needs.`;

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