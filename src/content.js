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
        // Create floating panel
        const panel = document.createElement('div');
        panel.id = 'upwork-job-extractor';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 85vh;
                background: white;
                border: 2px solid #14a800;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                overflow: hidden;
            ">
                <div style="
                    background: #14a800;
                    color: white;
                    padding: 15px;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span>📋 Skills, Client & Description</span>
                    <button id="close-extractor" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                    ">×</button>
                </div>
                <div style="
                    padding: 15px;
                    max-height: 50vh;
                    overflow-y: auto;
                    font-size: 13px;
                    line-height: 1.4;
                    color: #333 !important;
                    background: white;
                ">
                    ${this.generateJobDataHTML()}
                </div>
                <div style="
                    padding: 15px;
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                ">
                    <button id="copy-job-data" style="
                        background: #14a800;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        width: 100%;
                        font-weight: bold;
                    ">📋 Copy Extracted Data</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('close-extractor').addEventListener('click', () => {
            panel.remove();
        });
        
        document.getElementById('copy-job-data').addEventListener('click', () => {
            this.copyJobData();
        });
    }

    generateJobDataHTML() {
        return `
            <div style="margin-bottom: 15px;">
                <strong style="color: #14a800; display: block; margin-bottom: 5px;">🛠️ Skills Required:</strong>
                <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; color: #333 !important; font-size: 13px;">
                    ${this.jobData.skills.map(skill => 
                        `<span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; font-size: 12px; color: #1976d2 !important;">${skill}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong style="color: #14a800; display: block; margin-bottom: 5px;">👤 Client Info:</strong>
                <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; font-size: 13px; color: #333 !important;">
                    <div style="margin-bottom: 5px; color: #333 !important;"><strong style="color: #333 !important;">Location:</strong> ${this.jobData.clientInfo.location}</div>
                    <div style="margin-bottom: 5px; color: #333 !important;"><strong style="color: #333 !important;">Rating:</strong> ${this.jobData.clientInfo.rating}</div>
                    <div style="margin-bottom: 5px; color: #333 !important;"><strong style="color: #333 !important;">Total Spent:</strong> ${this.jobData.clientInfo.totalSpent}</div>
                    <div style="margin-bottom: 5px; color: #333 !important;"><strong style="color: #333 !important;">Jobs Posted:</strong> ${this.jobData.clientInfo.jobsPosted}</div>
                    <div style="color: #333 !important;"><strong style="color: #333 !important;">Payment Verified:</strong> ${this.jobData.clientInfo.paymentVerified}</div>
                </div>
            </div>
            
            <details style="margin-bottom: 15px;" open>
                <summary style="color: #14a800; font-weight: bold; cursor: pointer; margin-bottom: 8px; font-size: 14px;">📄 Job Description</summary>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto; font-size: 13px; line-height: 1.4; color: #333 !important; border: 1px solid #e0e0e0;">
                    ${this.jobData.description}
                </div>
            </details>
            
            <div style="margin-top: 15px;">
                <button id="generate-proposal-btn" style="
                    background: #1976d2;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    width: 100%;
                    font-weight: bold;
                ">✨ Generate AI Proposal</button>
            </div>
            
            <div id="proposal-container" style="display: none; margin-top: 15px;">
                <strong style="color: #14a800; display: block; margin-bottom: 5px;">✍️ Generated Proposal:</strong>
                <div style="font-size: 11px; color: #666; margin-bottom: 5px; font-style: italic;">
                    Bold text is shown formatted here. Copy button preserves formatting when pasted in rich text editors.
                </div>
                <div id="proposal-content" style="
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 4px;
                    max-height: 300px;
                    overflow-y: auto;
                    font-size: 13px;
                    line-height: 1.6;
                    color: #333 !important;
                    border: 1px solid #e0e0e0;
                    white-space: pre-wrap;
                ">
                    <div id="proposal-loader" style="text-align: center; padding: 20px; display: none;">
                        Generating proposal... <br>
                        <div style="display: inline-block; margin-top: 10px; width: 20px; height: 20px; border: 3px solid rgba(20, 168, 0, 0.3); border-radius: 50%; border-top-color: #14a800; animation: spin 1s ease-in-out infinite;"></div>
                        <style>
                            @keyframes spin { to { transform: rotate(360deg); } }
                        </style>
                    </div>
                    <div id="proposal-text" style="font-family: inherit; line-height: 1.6;"></div>
                </div>
                <button id="copy-proposal" style="
                    background: #14a800;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    width: 100%;
                    font-weight: bold;
                    margin-top: 10px;
                ">📋 Copy Proposal (Plain Text)</button>
                <!-- Settings options removed -->
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
                // Get freelancer profile from storage via background script
                const profileResponse = await new Promise(resolve => {
                    browserAPI.runtime.sendMessage({
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
                const response = await browserAPI.runtime.sendMessage({
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
            const originalText = button.textContent;
            button.textContent = '✅ Copied!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#14a800';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard. Please copy manually from the console.');
            console.log('Job Data:', textData);
        });
    }
}

// browserAPI is already defined in browser-polyfill.js which is loaded first
// No need to redefine it here

// Initialize the extractor when the page loads
function initializeExtractor() {
    // Wait for the page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => new UpworkJobExtractor(), 1000);
        });
    } else {
        setTimeout(() => new UpworkJobExtractor(), 1000);
    }
}

// Start the extractor
initializeExtractor();
