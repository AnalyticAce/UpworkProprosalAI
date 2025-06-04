// Upwork Job Data Extractor
class UpworkJobExtractor {
    constructor() {
        this.jobData = {};
        this.extractJobData();
        this.createUI();
        this.setupProposalGeneration(); // Add this line to initialize the proposal generation functionality
    }

    extractJobData() {
        try {
            // Extract job description
            const descriptionElement = document.querySelector('[data-test="Description"]');
            this.jobData.description = this.extractTextFromElement(descriptionElement);

            // Extract skills
            this.jobData.skills = this.extractSkills();

            // Extract client information
            this.jobData.clientInfo = this.extractClientInfo();

            console.log('Extracted Job Data:', this.jobData);
        } catch (error) {
            console.error('Error extracting job data:', error);
        }
    }

    extractTextFromElement(element) {
        if (!element) return 'Not found';
        // Remove HTML tags and get clean text
        const text = element.textContent || element.innerText || '';
        return text.replace(/\s+/g, ' ').trim();
    }

    extractSkills() {
        const skills = [];
        const skillElements = document.querySelectorAll('[data-test="Skill"] .air3-line-clamp');
        
        skillElements.forEach(element => {
            const skillText = element.textContent.trim();
            if (skillText && !skills.includes(skillText)) {
                skills.push(skillText);
            }
        });

        return skills.length > 0 ? skills : ['No skills specified'];
    }

    extractClientInfo() {
        const clientInfo = {};
        
        // Client location
        const locationElement = document.querySelector('[data-qa="client-location"] strong');
        clientInfo.location = locationElement ? locationElement.textContent.trim() : 'Not specified';

        // Client rating
        const ratingElement = document.querySelector('.air3-rating-value-text');
        clientInfo.rating = ratingElement ? ratingElement.textContent.trim() : 'No rating';

        // Client spending
        const spendElement = document.querySelector('[data-qa="client-spend"] span');
        clientInfo.totalSpent = spendElement ? spendElement.textContent.trim() : 'Not specified';

        // Jobs posted
        const jobsElement = document.querySelector('[data-qa="client-job-posting-stats"] strong');
        clientInfo.jobsPosted = jobsElement ? jobsElement.textContent.trim() : 'Not specified';

        // Payment verification
        const paymentElement = document.querySelector('.payment-verified');
        clientInfo.paymentVerified = paymentElement ? 'Yes' : 'Not verified';

        return clientInfo;
    }

    createUI() {
        // Inject modern styles first
        this.injectStyles();
        
        // Create floating panel
        const panel = document.createElement('div');
        panel.id = 'upwork-job-extractor';
        panel.className = 'upwork-ai-panel';
        
        panel.innerHTML = `
            <div class="upwork-ai-container">
                <div class="upwork-ai-header">
                    <div class="upwork-ai-header-content">
                        <div class="upwork-ai-logo">
                            <span class="upwork-ai-icon">💼</span>
                            <span class="upwork-ai-title">Job Data Extractor</span>
                        </div>
                        <button id="close-extractor" class="upwork-ai-close-btn" aria-label="Close">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 0 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="upwork-ai-content">
                    ${this.generateJobDataHTML()}
                </div>
                
                <div class="upwork-ai-footer">
                    <button id="copy-job-data" class="upwork-ai-btn upwork-ai-btn-primary">
                        <span class="upwork-ai-btn-icon">📋</span>
                        Copy Extracted Data
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners with modern interactions
        this.setupEventListeners(panel);
        
        // Enhance copy proposal feedback
        setTimeout(() => this.enhanceCopyProposalFeedback(), 100);
    }
    
    enhanceCopyProposalFeedback() {
        // This method enhances the copy feedback experience
        // It can be used to add additional visual feedback when copying content
        console.log('Copy proposal feedback enhanced');
    }
    
    injectStyles() {
        // Check if styles are already injected
        if (document.getElementById('upwork-ai-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'upwork-ai-styles';
        styles.textContent = `
            /* Upwork AI Extension Styles */
            .upwork-ai-panel {
                --primary: #14a800;
                --primary-dark: #0d7d00;
                --primary-light: #e6f7e3;
                --white: #ffffff;
                --gray-50: #f9fafb;
                --gray-100: #f3f4f6;
                --gray-200: #e5e7eb;
                --gray-300: #d1d5db;
                --gray-700: #374151;
                --gray-800: #1f2937;
                --gray-900: #111827;
                --success: #38b000;
                --warning: #f77f00;
                --danger: #d62828;
                --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 420px !important;
                max-height: 85vh !important;
                z-index: 2147483647 !important;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
                font-size: 14px !important;
                line-height: 1.5 !important;
                color: var(--gray-800) !important;
                animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .upwork-ai-container {
                background: var(--white) !important;
                border-radius: 16px !important;
                box-shadow: var(--shadow-xl) !important;
                overflow: hidden !important;
                border: 1px solid var(--gray-200) !important;
                backdrop-filter: blur(8px) !important;
            }
            
            .upwork-ai-header {
                background: linear-gradient(135deg, var(--primary), var(--primary-dark)) !important;
                padding: 20px !important;
                position: relative !important;
            }
            
            .upwork-ai-header::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent) !important;
                pointer-events: none !important;
            }
            
            .upwork-ai-header-content {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                position: relative !important;
                z-index: 1 !important;
            }
            
            .upwork-ai-logo {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
            }
            
            .upwork-ai-icon {
                font-size: 24px !important;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)) !important;
            }
            
            .upwork-ai-title {
                color: var(--white) !important;
                font-weight: 600 !important;
                font-size: 18px !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
            }
            
            .upwork-ai-close-btn {
                background: rgba(255, 255, 255, 0.2) !important;
                border: none !important;
                border-radius: 8px !important;
                width: 32px !important;
                height: 32px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                color: var(--white) !important;
                transition: var(--transition) !important;
                backdrop-filter: blur(4px) !important;
            }
            
            .upwork-ai-close-btn:hover {
                background: rgba(255, 255, 255, 0.3) !important;
                transform: scale(1.05) !important;
            }
            
            .upwork-ai-content {
                padding: 24px !important;
                max-height: 50vh !important;
                overflow-y: auto !important;
                background: var(--white) !important;
            }
            
            .upwork-ai-content::-webkit-scrollbar {
                width: 6px !important;
            }
            
            .upwork-ai-content::-webkit-scrollbar-track {
                background: var(--gray-100) !important;
                border-radius: 3px !important;
            }
            
            .upwork-ai-content::-webkit-scrollbar-thumb {
                background: var(--gray-300) !important;
                border-radius: 3px !important;
            }
            
            .upwork-ai-content::-webkit-scrollbar-thumb:hover {
                background: var(--gray-400) !important;
            }
            
            .upwork-ai-footer {
                padding: 20px 24px !important;
                background: var(--gray-50) !important;
                border-top: 1px solid var(--gray-200) !important;
            }
            
            .upwork-ai-btn {
                width: 100% !important;
                padding: 12px 20px !important;
                border: none !important;
                border-radius: 10px !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                cursor: pointer !important;
                transition: var(--transition) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
                position: relative !important;
                overflow: hidden !important;
            }
            
            .upwork-ai-btn::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: -100% !important;
                width: 100% !important;
                height: 100% !important;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
                transition: left 0.5s !important;
            }
            
            .upwork-ai-btn:hover::before {
                left: 100% !important;
            }
            
            .upwork-ai-btn-primary {
                background: linear-gradient(135deg, var(--primary), var(--primary-dark)) !important;
                color: var(--white) !important;
                box-shadow: var(--shadow-md) !important;
            }
            
            .upwork-ai-btn-primary:hover {
                transform: translateY(-2px) !important;
                box-shadow: var(--shadow-lg) !important;
            }
            
            .upwork-ai-btn-primary:active {
                transform: translateY(0) !important;
            }
            
            .upwork-ai-btn-icon {
                font-size: 16px !important;
            }
            
            /* Section styles */
            .upwork-ai-section {
                margin-bottom: 24px !important;
            }
            
            .upwork-ai-section:last-child {
                margin-bottom: 0 !important;
            }
            
            .upwork-ai-section-title {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                color: var(--primary) !important;
                margin-bottom: 12px !important;
            }
            
            .upwork-ai-card {
                background: var(--gray-50) !important;
                border: 1px solid var(--gray-200) !important;
                border-radius: 12px !important;
                padding: 16px !important;
                transition: var(--transition) !important;
            }
            
            .upwork-ai-card:hover {
                border-color: var(--gray-300) !important;
                box-shadow: var(--shadow-sm) !important;
            }
            
            /* Responsive design */
            @media (max-width: 480px) {
                .upwork-ai-panel {
                    left: 10px !important;
                    right: 10px !important;
                    width: auto !important;
                }
            }
            
            /* Additional UI improvements */
            .upwork-ai-section .upwork-ai-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: var(--shadow-lg) !important;
            }
            
            .upwork-ai-section .upwork-ai-btn:active {
                transform: translateY(0) !important;
            }
            
            /* Skill tags hover effect */
            .upwork-ai-card span[style*="background: linear-gradient"]:hover {
                transform: scale(1.05) !important;
                transition: transform 0.2s ease !important;
            }
            
            /* Better focus states */
            .upwork-ai-btn:focus,
            .upwork-ai-close-btn:focus {
                outline: 2px solid var(--primary) !important;
                outline-offset: 2px !important;
            }
            
            /* Smooth scrollbar */
            .upwork-ai-content {
                scrollbar-width: thin !important;
                scrollbar-color: var(--gray-300) var(--gray-100) !important;
            }
            
            /* Loading animation improvements */
            #proposal-loader {
                background: linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%) !important;
                background-size: 200% 200% !important;
                animation: loadingShimmer 2s infinite !important;
            }
            
            @keyframes loadingShimmer {
                0% { background-position: -200% -200%; }
                100% { background-position: 200% 200%; }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    setupEventListeners(panel) {
        const closeBtn = document.getElementById('close-extractor');
        const copyBtn = document.getElementById('copy-job-data');
        
        // Close button with animation
        closeBtn?.addEventListener('click', () => {
            panel.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => panel.remove(), 300);
        });
        
        // Copy button with enhanced feedback
        copyBtn?.addEventListener('click', () => {
            this.copyJobData();
        });
        
        // Add slide out animation
        const slideOutKeyframes = `
            @keyframes slideOutRight {
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.getElementById('upwork-ai-animations')) {
            const animationStyles = document.createElement('style');
            animationStyles.id = 'upwork-ai-animations';
            animationStyles.textContent = slideOutKeyframes;
            document.head.appendChild(animationStyles);
        }
    }

    generateJobDataHTML() {
        return `
            <div class="upwork-ai-section">
                <div class="upwork-ai-section-title">
                    <span>🛠️</span>
                    <span>Skills Required</span>
                </div>
                <div class="upwork-ai-card">
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${this.jobData.skills.map(skill => 
                            `<span style="
                                background: linear-gradient(135deg, var(--primary-light), #f0f8f0);
                                color: var(--primary-dark);
                                padding: 6px 12px;
                                border-radius: 20px;
                                font-size: 13px;
                                font-weight: 500;
                                border: 1px solid var(--primary);
                                display: inline-block;
                            ">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="upwork-ai-section">
                <div class="upwork-ai-section-title">
                    <span>👤</span>
                    <span>Client Information</span>
                </div>
                <div class="upwork-ai-card">
                    <div style="display: grid; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: var(--gray-700);">Location:</span>
                            <span style="color: var(--gray-800);">${this.jobData.clientInfo.location}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: var(--gray-700);">Rating:</span>
                            <span style="color: var(--gray-800);">${this.jobData.clientInfo.rating}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: var(--gray-700);">Total Spent:</span>
                            <span style="color: var(--gray-800);">${this.jobData.clientInfo.totalSpent}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: var(--gray-700);">Jobs Posted:</span>
                            <span style="color: var(--gray-800);">${this.jobData.clientInfo.jobsPosted}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: var(--gray-700);">Payment Verified:</span>
                            <span style="color: ${this.jobData.clientInfo.paymentVerified === 'Yes' ? 'var(--success)' : 'var(--warning)'}; font-weight: 500;">
                                ${this.jobData.clientInfo.paymentVerified}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="upwork-ai-section">
                <details style="all: initial; font-family: inherit;" open>
                    <summary style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        color: var(--primary);
                        margin-bottom: 12px;
                        cursor: pointer;
                        list-style: none;
                        outline: none;
                        transition: var(--transition);
                    ">
                        <span>📄</span>
                        <span>Job Description</span>
                    </summary>
                    <div class="upwork-ai-card" style="
                        max-height: 200px;
                        overflow-y: auto;
                        font-size: 14px;
                        line-height: 1.6;
                        color: var(--gray-800);
                        white-space: pre-wrap;
                    ">
                        ${this.jobData.description}
                    </div>
                </details>
            </div>
            
            <div class="upwork-ai-section">
                <button id="generate-proposal-btn" class="upwork-ai-btn" style="
                    background: linear-gradient(135deg, #1976d2, #1565c0);
                    color: var(--white);
                    box-shadow: var(--shadow-md);
                ">
                    <span style="font-size: 16px;">✨</span>
                    Generate AI Proposal
                </button>
            </div>
            
            <div id="proposal-container" style="display: none;" class="upwork-ai-section">
                <div class="upwork-ai-section-title">
                    <span>✍️</span>
                    <span>Generated Proposal</span>
                </div>
                <div style="
                    font-size: 12px;
                    color: var(--gray-600);
                    margin-bottom: 12px;
                    font-style: italic;
                    padding: 8px 12px;
                    background: var(--gray-100);
                    border-radius: 8px;
                    border-left: 3px solid var(--primary);
                ">
                    ℹ️ Bold text is shown formatted here. Copy button preserves formatting when pasted in rich text editors.
                </div>
                <div id="proposal-content" class="upwork-ai-card" style="
                    max-height: 300px;
                    overflow-y: auto;
                    font-size: 14px;
                    line-height: 1.6;
                    color: var(--gray-800);
                    white-space: pre-wrap;
                    min-height: 60px;
                ">
                    <div id="proposal-loader" style="
                        text-align: center;
                        padding: 40px 20px;
                        display: none;
                        color: var(--gray-600);
                    ">
                        <div style="
                            display: inline-block;
                            margin-bottom: 16px;
                            width: 32px;
                            height: 32px;
                            border: 3px solid var(--gray-200);
                            border-radius: 50%;
                            border-top-color: var(--primary);
                            animation: spin 1s ease-in-out infinite;
                        "></div>
                        <div>Generating proposal...</div>
                        <style>
                            @keyframes spin { to { transform: rotate(360deg); } }
                        </style>
                    </div>
                    <div id="proposal-text" style="font-family: inherit; line-height: 1.6;"></div>
                </div>
                <button id="copy-proposal" class="upwork-ai-btn upwork-ai-btn-primary" style="margin-top: 12px;">
                    <span class="upwork-ai-btn-icon">📋</span>
                    Copy Proposal
                </button>
            </div>
        `;
    }
    
    setupProposalGeneration() {
        const generateBtn = document.getElementById('generate-proposal-btn');
        if (!generateBtn) return;
        
        // Settings listeners removed
        
        generateBtn.addEventListener('click', async () => {
            // Show container and loader
            const container = document.getElementById('proposal-container');
            const loader = document.getElementById('proposal-loader');
            const textContainer = document.getElementById('proposal-text');
            
            if (!container || !loader || !textContainer) return;
            
            container.style.display = 'block';
            loader.style.display = 'block';
            textContainer.textContent = '';
            
            try {
                // Check if browser extension API is available
                if (!browserAPI && !window.browserAPI && !window.chrome && !window.browser) {
                    throw new Error('Browser extension API not available. Please reload the page.');
                }
                
                // Use the available API (prefer global browserAPI, then window variants)
                const api = browserAPI || window.browserAPI || window.chrome || window.browser;
                
                // Get freelancer profile from storage via background script
                const profileResponse = await new Promise(resolve => {
                    api.runtime.sendMessage({
                        action: 'getFreelancerProfile'
                    }, resolve);
                });
                
                // Check if profile data is configured
                if (!profileResponse.success || !profileResponse.profileData) {
                    throw new Error('Freelancer profile not configured. Please set up your profile in the extension settings.');
                }
                
                const profileData = profileResponse.profileData;
                
                // Validate that all required fields are present
                if (!profileData.freelancerExperience || !profileData.freelancerSpecialty) {
                    throw new Error('Please complete your freelancer profile (experience and specialty) in the extension settings before generating proposals.');
                }
                
                // Generate proposal using AI service with profile data
                const response = await api.runtime.sendMessage({
                    action: 'generateProposal',
                    jobData: this.jobData,
                    options: {
                        personalInfo: {
                            experience: profileData.freelancerExperience,
                            specialty: profileData.freelancerSpecialty,
                            achievements: profileData.freelancerAchievements || ''
                        }
                    }
                });
                
                // Hide loader and display proposal
                loader.style.display = 'none';
                
                if (response.error) {
                    let errorMessage = response.error;
                    
                    // Add helpful instruction for configuration errors
                    if (errorMessage.includes('not configured') || errorMessage.includes('required')) {
                        errorMessage += '\n\nTo configure your settings:\n1. Right-click the extension icon\n2. Select "Options"\n3. Fill in your API key and freelancer profile';
                    }
                    
                    textContainer.textContent = `Error: ${errorMessage}`;
                    textContainer.style.color = 'red';
                } else {
                    // Store original proposal text for copying
                    const originalProposal = response.proposal;
                    
                    // Convert markdown to HTML and display
                    const htmlProposal = this.convertMarkdownToHTML(response.proposal);
                    textContainer.innerHTML = htmlProposal;
                    textContainer.style.color = '#333';
                    
                    // Setup copy button with rich text (formatted HTML)
                    const copyBtn = document.getElementById('copy-proposal');
                    if (copyBtn) {
                        copyBtn.addEventListener('click', async () => {
                            try {
                                await this.copyFormattedText(htmlProposal, originalProposal);
                                const originalText = copyBtn.textContent;
                                copyBtn.textContent = '✅ Copied!';
                                copyBtn.style.background = '#28a745';
                                
                                setTimeout(() => {
                                    copyBtn.textContent = originalText;
                                    copyBtn.style.background = '#14a800';
                                }, 2000);
                            } catch (err) {
                                console.error('Failed to copy proposal: ', err);
                                // Fallback to plain text copy
                                navigator.clipboard.writeText(originalProposal);
                            }
                        });
                    }
                }
            } catch (error) {
                loader.style.display = 'none';
                let errorMessage = error.message;
                
                // Add helpful instruction for configuration errors
                if (errorMessage.includes('not configured') || errorMessage.includes('required')) {
                    errorMessage += '\n\nTo configure your settings:\n1. Right-click the extension icon\n2. Select "Options"\n3. Fill in your API key and freelancer profile';
                }
                
                textContainer.textContent = `Error: ${errorMessage}`;
                textContainer.style.color = 'red';
                console.error('Error generating proposal:', error);
            }
        });
    }
    
    /**
     * Convert markdown formatting to HTML for better display
     * @param {string} text - Text with markdown formatting
     * @returns {string} HTML formatted text
     */
    convertMarkdownToHTML(text) {
        if (!text) return '';
        
        let html = text;
        
        // First, temporarily replace **bold** with a placeholder to avoid conflicts
        const boldPlaceholder = '___BOLD_PLACEHOLDER___';
        const boldMatches = [];
        html = html.replace(/\*\*(.*?)\*\*/g, (match, content) => {
            boldMatches.push(content);
            return boldPlaceholder + (boldMatches.length - 1) + boldPlaceholder;
        });
        
        // Now convert remaining *italic* (single asterisks)
        html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
        
        // Restore **bold** with proper HTML tags
        html = html.replace(new RegExp(boldPlaceholder + '(\\d+)' + boldPlaceholder, 'g'), (match, index) => {
            return '<strong>' + boldMatches[parseInt(index)] + '</strong>';
        });
        
        // Convert ### Headers to <h3>
        html = html.replace(/^### (.+)$/gm, '<h3 style="margin: 10px 0 5px 0; color: #14a800; font-size: 14px;">$1</h3>');
        
        // Convert ## Headers to <h2>  
        html = html.replace(/^## (.+)$/gm, '<h2 style="margin: 15px 0 8px 0; color: #14a800; font-size: 16px;">$1</h2>');
        
        // Convert # Headers to <h1>
        html = html.replace(/^# (.+)$/gm, '<h1 style="margin: 20px 0 10px 0; color: #14a800; font-size: 18px;">$1</h1>');
        
        // Convert line breaks to <br> tags, but preserve paragraph spacing
        html = html.replace(/\n\n/g, '<br><br>');
        html = html.replace(/\n/g, '<br>');
        
        // Convert bullet points (• or - or *) to proper list items with better styling
        html = html.replace(/^[•\-\*]\s+(.+)$/gm, '<div style="margin: 5px 0; padding-left: 15px;">• $1</div>');
        
        // Convert numbered lists (1. 2. etc.)
        html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<div style="margin: 5px 0; padding-left: 15px;">$1. $2</div>');
        
        return html;
    }

    async copyFormattedText(htmlContent, plainTextFallback) {
        try {
            // Wrap HTML content in a proper HTML structure for rich text editors
            const wrappedHtml = `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">${htmlContent}</div>`;
            
            // Create a ClipboardItem with both HTML and plain text formats
            const htmlBlob = new Blob([wrappedHtml], { type: 'text/html' });
            const textBlob = new Blob([plainTextFallback], { type: 'text/plain' });
            
            const clipboardItem = new ClipboardItem({
                'text/html': htmlBlob,
                'text/plain': textBlob
            });
            
            await navigator.clipboard.write([clipboardItem]);
        } catch (error) {
            console.warn('Rich text copy failed, falling back to plain text:', error);
            // Fallback to plain text copy
            await navigator.clipboard.writeText(plainTextFallback);
        }
    }

    // Settings listeners function removed as it's no longer needed
    
    // Settings summary function removed as it's no longer needed
    
    copyJobData() {
        const textData = `
UPWORK JOB DETAILS
==================

🛠️ Skills Required:
${this.jobData.skills.map(skill => `• ${skill}`).join('\n')}

👤 Client Information:
• Location: ${this.jobData.clientInfo.location}
• Rating: ${this.jobData.clientInfo.rating}
• Total Spent: ${this.jobData.clientInfo.totalSpent}
• Jobs Posted: ${this.jobData.clientInfo.jobsPosted}
• Payment Verified: ${this.jobData.clientInfo.paymentVerified}

📄 Job Description:
${this.jobData.description}

==================
Generated by Upwork Proposal AI Extension
        `.trim();

        navigator.clipboard.writeText(textData).then(() => {
            const button = document.getElementById('copy-job-data');
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="upwork-ai-btn-icon">✅</span>Copied!';
            button.style.background = 'linear-gradient(135deg, var(--success), #2d8a00)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard. Please copy manually from the console.');
            console.log('Job Data:', textData);
        });
    }
}

// browserAPI is defined in browser-polyfill.js which is loaded first
// It provides a cross-browser compatible API for Chrome/Firefox/Edge extensions

// Initialize the extractor when the page loads
function initializeExtractor() {
    // Ensure browser API is available before initializing
    const checkAPI = () => {
        return (typeof browserAPI !== 'undefined' && browserAPI) || 
               (typeof window !== 'undefined' && (window.browserAPI || window.chrome || window.browser));
    };
    
    // Wait for the page to be fully loaded and API to be available
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Small delay to ensure all scripts are loaded
            setTimeout(() => {
                if (checkAPI()) {
                    new UpworkJobExtractor();
                } else {
                    console.warn('Upwork AI Extension: Browser API not available, retrying...');
                    setTimeout(() => checkAPI() && new UpworkJobExtractor(), 500);
                }
            }, 1000);
        });
    } else {
        setTimeout(() => {
            if (checkAPI()) {
                new UpworkJobExtractor();
            } else {
                console.warn('Upwork AI Extension: Browser API not available, retrying...');
                setTimeout(() => checkAPI() && new UpworkJobExtractor(), 500);
            }
        }, 1000);
    }
}

// Start the extractor
initializeExtractor();
