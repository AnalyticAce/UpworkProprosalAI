# Upwork Proposal AI - Job Data Extractor

A Chrome extension that automatically extracts job details from Upwork job pages to help freelancers create better proposals.

## 📁 Project Structure

```
UpworkProprosalAi/
├── src/                    # Source code
│   ├── ai-service.js      # OpenAI API integration for proposal generation
│   ├── background.js      # Background script for API communication
│   ├── content.js         # Content script for job extraction
│   ├── popup.html         # Extension popup interface
│   ├── popup.js           # Popup functionality script
│   ├── options.html       # Settings page
│   └── options.js         # Settings functionality script
├── assets/                # Static assets
│   └── icons/            # Extension icons (16px, 48px, 128px)
├── docs/                  # Documentation
│   ├── README.md         # Detailed project documentation
│   ├── INSTALLATION.md   # Installation guide
│   └── COMPLETION_SUMMARY.md # Project completion status
├── tests/                 # Test files and samples
│   └── sample-job-page.html # Sample Upwork page for testing
├── scripts/               # Build and utility scripts
│   └── create-icons.js   # Icon generation script
├── manifest.json          # Chrome extension manifest
├── .env                   # Environment variables (for development only)
└── .gitignore            # Git ignore rules
```

## 🚀 Quick Start

1. **Read the Documentation**: Check `docs/README.md` for detailed information
2. **Installation**: Follow the guide in `docs/INSTALLATION.md`
3. **Status**: See `docs/COMPLETION_SUMMARY.md` for current completion status

## ✨ Features

- 📝 Auto-extract job skills, client info, and descriptions
- 👤 Display client insights and ratings
- 📋 One-click copy to clipboard
- 🎨 Clean, non-intrusive UI
- ⚡ Instant extraction on Upwork job pages
- ✨ AI-powered proposal generation using OpenAI GPT-3.5/4
- 🔧 Customizable freelancer profile for personalized proposals
- 🔒 Secure API key storage in browser

## 📖 Documentation

For complete documentation, installation instructions, and usage guides, please see the `docs/` directory:

- [📖 Full Documentation](docs/README.md)
- [🛠️ Installation Guide](docs/INSTALLATION.md)
- [✅ Completion Status](docs/COMPLETION_SUMMARY.md)

## 🤖 OpenAI Integration Setup

To use the AI proposal generation feature:

1. Get your API key from [OpenAI's platform](https://platform.openai.com/account/api-keys)
2. Open the extension options page (right-click the extension icon > Options)
3. Enter your API key in the settings page
4. Configure your freelancer profile details
5. Save your settings

**Note**: Your OpenAI API key is stored securely in your browser's local storage and is only used for generating proposals.

---

**Status**: ✅ Ready for Production  
**Version**: 1.0.0  
**Last Updated**: June 3, 2025
