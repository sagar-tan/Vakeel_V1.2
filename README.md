# Legal Assistant - Powered by Gemini AI

A sophisticated web application that functions as a legal assistant chatbot, leveraging Google's Gemini AI to provide informative legal responses.

## Features

- **New Chat**: Start a new conversation with context-aware responses
- **History**: View and restore your past conversations across browser sessions
- **Create Documents**: Generate legal documents based on your conversations
- **Analyze Documents**: Get analysis of legal documents

## Technical Details

- **Frontend**: HTML, CSS, and JavaScript
- **AI Integration**: Google Gemini 1.5 Flash API
- **Data Storage**: Local browser storage for conversation history
- **UI**: Clean, professional interface designed for legal queries

## How It Works

This application integrates the Gemini AI API to provide intelligent responses to legal queries. The system uses specialized prompts for different legal contexts:

1. New Chat - For beginning new consultation sessions
2. Create Documents - For legal document creation assistance
3. Analyze Documents - For legal document analysis

Each mode has a custom prompt that instructs the AI to respond appropriately for that specific legal context.

### History Feature

The application stores your conversations locally in your browser, allowing you to:
- View a list of past conversations organized by date and topic
- Restore any previous conversation to continue from where you left off
- Delete conversations you no longer need
- Conversations are automatically saved as you interact with the assistant

### Document Generation Feature

In the Create Documents tab, you can:
1. Have a conversation about the document you need
2. Click the "Generate Document" button that appears
3. View the generated document with proper formatting
4. Print or save the document
5. Return to your conversation to make adjustments if needed

The AI analyzes your conversation and creates a properly formatted legal document including:
- Document title and sections
- Essential legal clauses
- Information extracted from your conversation
- Placeholders for any missing information
- Legal disclaimers

The documents are saved to your conversation history for future reference.

## Running the Application

Since this is a standalone HTML/CSS/JavaScript application, you can run it in several ways:

1. **Direct File Opening**: Simply double-click the `index.html` file to open it in your web browser.

2. **Using a Local Server** (recommended for CORS handling):
   - Using Python:
     ```
     # For Python 3
     python -m http.server
     
     # For Python 2
     python -m SimpleHTTPServer
     ```
   - Using Node.js:
     ```
     # Install http-server globally
     npm install -g http-server
     
     # Run the server
     http-server
     ```
   - Then visit `http://localhost:8000` or `http://localhost:8080` in your browser.

## Important Notes

- **API Key**: The application uses the Gemini API key configured in script.js
- **Context Awareness**: Each mode provides specialized context to the AI for better responses
- **Disclaimer**: The responses provided are for informational purposes only and do not constitute legal advice
- **Privacy**: All conversations are stored locally on your device and are not sent to any server except for the Gemini API queries
- **Documents**: Generated documents should be reviewed by a qualified attorney before use

## Troubleshooting

If you experience issues:

1. Check that your internet connection is working
2. Verify that the API key is valid
3. Try using a local server to avoid CORS issues
4. Check the browser console (F12) for error messages
5. Clear browser data if history isn't loading correctly

## Credits

- Google Gemini AI for powering the responses
- Font Awesome for icons
- Google Fonts for typography 