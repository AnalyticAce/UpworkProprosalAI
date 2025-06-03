// Upwork Job Data Extractor
class UpworkJobExtractor {
    constructor() {
        this.jobData = {};
        this.extractJobData();
        this.createUI();
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
                width: 380px;
                max-height: 70vh;
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
        `;
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
