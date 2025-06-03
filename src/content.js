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
                <details style="margin-bottom: 10px;">
                    <summary style="color: #1976d2; font-weight: bold; cursor: pointer; font-size: 13px;">⚙️ AI Proposal Settings</summary>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 8px; border: 1px solid #e0e0e0;">
                        <div style="margin-bottom: 8px;">
                            <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #333;">Tone:</label>
                            <select id="proposal-tone" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #ddd; font-size: 12px;">
                                <option value="professional">Professional</option>
                                <option value="conversational">Conversational</option>
                                <option value="enthusiastic">Enthusiastic</option>
                                <option value="formal">Formal</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom: 8px;">
                            <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #333;">Length:</label>
                            <select id="proposal-length" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #ddd; font-size: 12px;">
                                <option value="short">Short (250-350 words)</option>
                                <option value="medium" selected>Medium (350-500 words)</option>
                                <option value="long">Long (500-700 words)</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom: 8px;">
                            <label style="display: flex; align-items: center; font-size: 12px; color: #333;">
                                <input type="checkbox" id="include-portfolio" checked style="margin-right: 5px;">
                                Include portfolio/past work
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 8px;">
                            <label style="display: flex; align-items: center; font-size: 12px; color: #333;">
                                <input type="checkbox" id="include-questions" checked style="margin-right: 5px;">
                                Include thoughtful questions
                            </label>
                        </div>
                    </div>
                </details>
                
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
                
                <div id="proposal-settings-summary" style="
                    font-size: 11px;
                    text-align: center;
                    margin-top: 5px;
                    color: #666;
                ">Professional tone · Medium length · With portfolio & questions</div>
            </div>
            
            <div id="proposal-container" style="display: none; margin-top: 15px;">
                <strong style="color: #14a800; display: block; margin-bottom: 5px;">✍️ Generated Proposal:</strong>
                <div id="proposal-content" style="
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 4px;
                    max-height: 300px;
                    overflow-y: auto;
                    font-size: 13px;
                    line-height: 1.4;
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
                    <div id="proposal-text"></div>
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
                ">📋 Copy Proposal</button>
                <p style="
                    font-size: 11px;
                    text-align: center;
                    margin-top: 8px;
                    color: #666;
                ">For more options, click on <strong>⚙️ AI Proposal Settings</strong> above</p>
            </div>
        `;
    }
    
    setupProposalGeneration() {
        const generateBtn = document.getElementById('generate-proposal-btn');
        if (!generateBtn) return;
        
        // Add listeners to update settings summary when options change
        this.setupSettingsListeners();
        
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
                // Get user selected settings from the UI
                const tone = document.getElementById('proposal-tone')?.value || 'professional';
                const length = document.getElementById('proposal-length')?.value || 'medium';
                const includePortfolio = document.getElementById('include-portfolio')?.checked ?? true;
                const includeQuestions = document.getElementById('include-questions')?.checked ?? true;
                
                // Get freelancer profile from storage via background script
                const profileResponse = await new Promise(resolve => {
                    browserAPI.runtime.sendMessage({
                        action: 'getFreelancerProfile'
                    }, resolve);
                });
                
                // Extract profile data from response or use defaults
                const profileData = profileResponse.success ? profileResponse.profileData : {
                    freelancerExperience: '5+ years',
                    freelancerSpecialty: 'full-stack development',
                    freelancerAchievements: ''
                };
                
                // Generate proposal using AI service with user-selected options
                const response = await browserAPI.runtime.sendMessage({
                    action: 'generateProposal',
                    jobData: this.jobData,
                    options: {
                        tone: tone,
                        length: length,
                        includePortfolio: includePortfolio,
                        includeQuestions: includeQuestions,
                        personalInfo: {
                            experience: profileData.freelancerExperience || '5+ years',
                            specialty: profileData.freelancerSpecialty || 'full-stack development',
                            achievements: profileData.freelancerAchievements || ''
                        }
                    }
                });
                
                // Hide loader and display proposal
                loader.style.display = 'none';
                
                if (response.error) {
                    textContainer.textContent = `Error: ${response.error}\n\nPlease make sure the OpenAI API key is correctly set up in the extension.`;
                    textContainer.style.color = 'red';
                } else {
                    textContainer.textContent = response.proposal;
                    textContainer.style.color = '#333';
                    
                    // Setup copy button
                    const copyBtn = document.getElementById('copy-proposal');
                    if (copyBtn) {
                        copyBtn.addEventListener('click', () => {
                            navigator.clipboard.writeText(response.proposal).then(() => {
                                const originalText = copyBtn.textContent;
                                copyBtn.textContent = '✅ Copied!';
                                copyBtn.style.background = '#28a745';
                                
                                setTimeout(() => {
                                    copyBtn.textContent = originalText;
                                    copyBtn.style.background = '#14a800';
                                }, 2000);
                            }).catch(err => {
                                console.error('Failed to copy proposal: ', err);
                            });
                        });
                    }
                }
            } catch (error) {
                loader.style.display = 'none';
                textContainer.textContent = `Error generating proposal: ${error.message}\n\nPlease make sure you have set up the OpenAI API key in the extension settings.`;
                textContainer.style.color = 'red';
                console.error('Error generating proposal:', error);
            }
        });
    }
    
    /**
     * Setup event listeners for proposal settings controls
     */
    setupSettingsListeners() {
        const toneSelect = document.getElementById('proposal-tone');
        const lengthSelect = document.getElementById('proposal-length');
        const portfolioCheckbox = document.getElementById('include-portfolio');
        const questionsCheckbox = document.getElementById('include-questions');
        
        // First update with current values
        this.updateSettingsSummary();
        
        // Add listeners to each control
        if (toneSelect) {
            toneSelect.addEventListener('change', () => this.updateSettingsSummary());
        }
        
        if (lengthSelect) {
            lengthSelect.addEventListener('change', () => this.updateSettingsSummary());
        }
        
        if (portfolioCheckbox) {
            portfolioCheckbox.addEventListener('change', () => this.updateSettingsSummary());
        }
        
        if (questionsCheckbox) {
            questionsCheckbox.addEventListener('change', () => this.updateSettingsSummary());
        }
    }
    
    /**
     * Update the proposal settings summary text
     */
    updateSettingsSummary() {
        const summaryElement = document.getElementById('proposal-settings-summary');
        if (!summaryElement) return;
        
        const tone = document.getElementById('proposal-tone')?.value || 'professional';
        const length = document.getElementById('proposal-length')?.value || 'medium';
        const includePortfolio = document.getElementById('include-portfolio')?.checked ?? true;
        const includeQuestions = document.getElementById('include-questions')?.checked ?? true;
        
        // Format tone for display (capitalize first letter)
        const formattedTone = tone.charAt(0).toUpperCase() + tone.slice(1).toLowerCase();
        
        // Build summary text
        let summaryText = `${formattedTone} tone · ${length.charAt(0).toUpperCase() + length.slice(1)} length`;
        
        if (includePortfolio && includeQuestions) {
            summaryText += ' · With portfolio & questions';
        } else if (includePortfolio) {
            summaryText += ' · With portfolio';
        } else if (includeQuestions) {
            summaryText += ' · With questions';
        } else {
            summaryText += ' · Basic proposal';
        }
        
        // Update the element
        summaryElement.textContent = summaryText;
    }
    
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
