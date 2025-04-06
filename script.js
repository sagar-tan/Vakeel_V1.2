document.addEventListener('DOMContentLoaded', () => {
    // API Key and URL for Gemini API from chat.js
    const API_KEY = 'AIzaSyAbwmmaX_ML4uYUo6WoClOluHFa2D4yVf8'; 
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    
    // DOM Elements
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    
    // Current active mode
    let currentMode = 'new-chat';
    
    // Chat history storage (in-memory for current session)
    let sessionHistory = [];
    
    // Chat conversations storage (for persistent history across sessions)
    let allConversations = [];

    // Check if user arrived from landing page
    function checkReferrer() {
        // Check if arrived from Try for Free button using URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const fromLanding = urlParams.get('from') === 'landing' || 
                           document.referrer.includes('vakeel.ai') || 
                           sessionStorage.getItem('fromLanding');
        
        if (fromLanding) {
            // Save in session storage to remember across page refreshes
            sessionStorage.setItem('fromLanding', 'true');
            
            // Clear chat history and show a special welcome message
            clearChatHistory();
            
            // Add a special welcome message for users from the landing page
            const welcomeMessage = "Welcome to Vakeel.ai's Legal Assistant! I'm ready to help with your legal questions. Try asking me about legal documents, contracts, or any legal concerns you have.";
            addAssistantMessage(welcomeMessage);
            
            // Add a subtle entrance animation to the chat
            chatHistory.style.animation = 'fadeIn 1s ease';
        }
    }

    // Base prompts for different legal modes
    const basePrompts = {
        // For new chat sessions
        'new-chat': `You are a professional legal consultant beginning a new consultation session.
        Start by understanding the user's legal needs and provide a structured, helpful response.
        Explain relevant legal concepts clearly and suggest possible next steps or considerations.
        Always include appropriate disclaimers that your responses are for informational purposes only and not legal advice.
        Be thorough but concise in your initial assessment.`,
        
        // For document creation assistance
        'create-docs': `You are a professional legal consultant specializing in document creation and drafting.
        Help the user create or understand legal documents by explaining their purpose, typical contents, and important considerations.
        When appropriate, provide template language or structural guidance for the requested document type.
        Always emphasize that any templates or language suggestions should be reviewed by a qualified attorney before use.
        Include appropriate disclaimers that your assistance is for informational purposes only and not legal advice.`,
        
        // For document analysis
        'analyse-docs': `You are a professional legal consultant specializing in document analysis and review.
        Analyze the document or document description provided by the user with attention to legal implications, potential issues, and important considerations.
        Explain legal terminology that may be unfamiliar to the user.
        When appropriate, suggest areas that might need further review or revision.
        Always include appropriate disclaimers that your analysis is for informational purposes only and not legal advice.`
    };

    // Initialize
    initializeApp();

    function initializeApp() {
        // Load conversation history from localStorage
        loadConversations();
        
        // Check if user came from landing page
        checkReferrer();
        
        // Set event listeners
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleUserMessage();
            }
        });

        sendBtn.addEventListener('click', handleUserMessage);

        // Sidebar button events
        sidebarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                sidebarBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Set current mode based on button id
                currentMode = btn.id.replace('-btn', '');
                
                // Handle mode change
                handleModeChange(currentMode);
            });
        });

        // Set New Chat as the default active mode
        document.getElementById('new-chat-btn').classList.add('active');
        
        // Display welcome message for new chat
        handleModeChange('new-chat');
    }

    // Load all conversations from localStorage
    function loadConversations() {
        const savedConversations = localStorage.getItem('legalAssistantConversations');
        if (savedConversations) {
            allConversations = JSON.parse(savedConversations);
        }
    }

    // Save all conversations to localStorage
    function saveConversations() {
        localStorage.setItem('legalAssistantConversations', JSON.stringify(allConversations));
    }

    function handleModeChange(mode) {
        // Clear chat history
        clearChatHistory();
        
        // Add appropriate welcome message based on mode
        let welcomeMessage = '';
        switch(mode) {
            case 'new-chat':
                welcomeMessage = "What legal assistance do you need today?";
                // Start a new conversation
                sessionHistory = [];
                break;
            case 'history':
                welcomeMessage = "Here are your previous conversations:";
                displayConversationHistory();
                return; // Skip adding a welcome message, as the history will be displayed
            case 'create-docs':
                welcomeMessage = "What type of legal document would you like to create? Please describe your needs, and after our conversation, you can generate the document.";
                // Start a new conversation
                sessionHistory = [];
                // Show generate document button container if hidden
                showGenerateDocButton();
                break;
            case 'analyse-docs':
                // Display document analysis features instead of a welcome message
                displayDocumentFeatures();
                return; // Skip adding a welcome message
            default:
                welcomeMessage = "What legal assistance do you need today?";
                // Start a new conversation
                sessionHistory = [];
                // Set mode to new-chat for any unrecognized mode
                currentMode = 'new-chat';
        }
        
        // Add assistant message
        addAssistantMessage(welcomeMessage);
    }

    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addUserMessage(message);
        
        // Save to session history
        sessionHistory.push({ role: 'user', content: message });
        
        // Clear input
        userInput.value = '';
        
        // Disable input while processing
        userInput.disabled = true;
        sendBtn.disabled = true;
        
        // Process query based on current mode
        processQuery(message, currentMode);
    }

    async function processQuery(message, mode) {
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Create the appropriate prompt based on the mode
            const prompt = `${basePrompts[mode] || basePrompts['new-chat']}\n\nUser question: ${message}`;
            
            // Generate response using Gemini API
            const response = await generateResponse(prompt);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Handle the response based on the mode
            if (mode === 'history') {
                // If in history mode, the message display is handled by the displayConversationHistory function
                // Just redisplay the conversation history after any interaction
                displayConversationHistory();
            } else {
                // Add assistant message with cleaned markdown
                addAssistantMessage(cleanMarkdown(response));
                
                // Save to session history
                sessionHistory.push({ role: 'assistant', content: response });
                
                // Save conversation to history if it has at least one exchange
                if (sessionHistory.length >= 2) {
                    saveCurrentConversation(mode);
                }
                
                // If in create-docs mode, make sure the generate button is visible
                if (mode === 'create-docs') {
                    showGenerateDocButton();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Display error message
            addAssistantMessage('Sorry, I encountered an error processing your request. Please try again.');
            addSystemMessage('There was an issue connecting to the Gemini API. Please check your connection and try again.');
        } finally {
            // Re-enable input
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    // Save current conversation to history
    function saveCurrentConversation(mode) {
        // Extract the first user message as the topic (truncated)
        const firstUserMessage = sessionHistory.find(msg => msg.role === 'user')?.content || 'Conversation';
        const topic = firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + '...' : firstUserMessage;
        
        // Create conversation object
        const conversation = {
            id: Date.now(), // Use timestamp as unique ID
            date: new Date().toISOString().split('T')[0],
            topic: `${mode}: ${topic}`,
            messages: [...sessionHistory] // Copy the session history
        };
        
        // Add to conversations array
        allConversations.unshift(conversation); // Add to beginning
        
        // Limit to 20 conversations
        if (allConversations.length > 20) {
            allConversations = allConversations.slice(0, 20);
        }
        
        // Save to localStorage
        saveConversations();
    }

    // Display all saved conversations
    function displayConversationHistory() {
        clearChatHistory();
        
        if (allConversations.length === 0) {
            addAssistantMessage("No conversation history found.");
            return;
        }
        
        // Create a container for the history
        const historyContainer = document.createElement('div');
        historyContainer.classList.add('history-container');
        
        // Add title
        const titleElement = document.createElement('div');
        titleElement.classList.add('history-title');
        titleElement.innerHTML = `<h3>Conversation History</h3>`;
        historyContainer.appendChild(titleElement);
        
        // Add each conversation as a clickable element
        allConversations.forEach(conversation => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <strong>${conversation.date}</strong>
                    <span>${conversation.topic}</span>
                </div>
            `;
            
            // Add click event to load the conversation
            historyItem.addEventListener('click', () => {
                loadConversation(conversation);
            });
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the parent click
                deleteConversation(conversation.id);
            });
            
            historyItem.appendChild(deleteBtn);
            historyContainer.appendChild(historyItem);
        });
        
        // Add to chat history
        chatHistory.appendChild(historyContainer);
    }

    // Load a specific conversation
    function loadConversation(conversation) {
        // Set as current session history
        sessionHistory = [...conversation.messages];
        
        // Clear chat history display
        clearChatHistory();
        
        // Display conversation title
        const titleElement = document.createElement('div');
        titleElement.classList.add('conversation-title');
        titleElement.innerHTML = `<h3>${conversation.topic}</h3><span>${conversation.date}</span>`;
        chatHistory.appendChild(titleElement);
        
        // Display all messages
        sessionHistory.forEach(msg => {
            if (msg.role === 'user') {
                addUserMessage(msg.content);
            } else {
                addAssistantMessage(msg.content);
            }
        });
        
        // Switch to appropriate mode based on conversation topic
        const modeMatch = conversation.topic.match(/^(new-chat|create-docs|analyse-docs):/);
        if (modeMatch) {
            const mode = modeMatch[1];
            currentMode = mode;
            
            // Update sidebar button active state
            sidebarBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.id === `${mode}-btn`) {
                    btn.classList.add('active');
                }
            });
        }
    }

    // Delete a conversation
    function deleteConversation(id) {
        // Filter out the conversation with the given id
        allConversations = allConversations.filter(convo => convo.id !== id);
        
        // Save to localStorage
        saveConversations();
        
        // Redisplay conversation history
        displayConversationHistory();
    }

    // Generate response using Gemini API - from chat.js
    async function generateResponse(prompt) {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate response');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Clean markdown - from chat.js
    function cleanMarkdown(text) {
        return text
            .replace(/#{1,6}\s?/g, '')
            .replace(/\*\*/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    function displayLocalSessionHistory() {
        // Backward compatibility - redirects to the new history display
        displayConversationHistory();
    }

    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'user');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = `<p>${formatMessage(message)}</p>`;
        
        messageElement.appendChild(messageContent);
        chatHistory.appendChild(messageElement);
        
        scrollToBottom();
    }

    function addAssistantMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'assistant');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = `<p>${formatMessage(message)}</p>`;
        
        messageElement.appendChild(messageContent);
        chatHistory.appendChild(messageElement);
        
        scrollToBottom();
    }

    function addSystemMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'system');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = `<p>${formatMessage(message)}</p>`;
        
        messageElement.appendChild(messageContent);
        chatHistory.appendChild(messageElement);
        
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('chat-message', 'assistant', 'typing-indicator');
        typingElement.id = 'typing-indicator';
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = `<p>Thinking <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></p>`;
        
        typingElement.appendChild(messageContent);
        chatHistory.appendChild(typingElement);
        
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    function clearChatHistory() {
        chatHistory.innerHTML = '';
    }

    function formatMessage(message) {
        // Simple formatter to break text into paragraphs and add links
        if (!message) return '';
        
        let formattedText = message
            // Convert line breaks to <br> tags
            .replace(/\n/g, '<br>')
            // Make URLs clickable
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
            
        return formattedText;
    }

    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Functions for document generation
    function showGenerateDocButton() {
        // Check if button already exists
        if (document.getElementById('generate-doc-btn')) {
            return;
        }
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'doc-button-container';
        buttonContainer.classList.add('doc-button-container');
        
        // Create button
        const generateButton = document.createElement('button');
        generateButton.id = 'generate-doc-btn';
        generateButton.classList.add('generate-doc-btn');
        generateButton.innerHTML = '<i class="fas fa-file-export"></i> Generate Document';
        generateButton.addEventListener('click', generateLegalDocument);
        
        // Add button to container
        buttonContainer.appendChild(generateButton);
        
        // Add container to chat history
        chatHistory.appendChild(buttonContainer);
        
        // Scroll to bottom to show the button
        scrollToBottom();
    }
    
    async function generateLegalDocument() {
        // Display a system message indicating document generation is in progress
        addSystemMessage('Generating your legal document. Please wait...');
        
        // Disable the generate button while processing
        const generateButton = document.getElementById('generate-doc-btn');
        if (generateButton) {
            generateButton.disabled = true;
            generateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        }
        
        try {
            // Create prompt that includes the entire conversation
            let conversationText = sessionHistory.map(msg => {
                return `${msg.role.toUpperCase()}: ${msg.content}`;
            }).join('\n\n');
            
            // Add instructions for document generation
            const documentPrompt = `
            You are a professional legal document generator. Based on the following conversation, 
            create a well-formatted legal document. The document should include:
            
            1. A proper title
            2. All necessary sections with appropriate headings
            3. Required legal clauses and provisions
            4. Any information from the conversation that should be included
            5. Placeholder text in [brackets] for any missing information that needs to be filled in
            6. A disclaimer at the bottom stating this is a draft document for review purposes only
            
            Here's the conversation:
            
            ${conversationText}
            
            Generate only the document itself, without any additional explanation.
            Format the document for clear readability.
            `;
            
            // Generate document using Gemini API
            const documentContent = await generateResponse(documentPrompt);
            
            // Display the document in a special format
            displayGeneratedDocument(documentContent);
            
        } catch (error) {
            console.error('Error generating document:', error);
            addSystemMessage('Sorry, there was an error generating your document. Please try again.');
        } finally {
            // Re-enable the generate button
            if (generateButton) {
                generateButton.disabled = false;
                generateButton.innerHTML = '<i class="fas fa-file-export"></i> Generate Document';
            }
        }
    }
    
    function displayGeneratedDocument(documentContent) {
        // Clear chat history to display the document
        clearChatHistory();
        
        // Create document container
        const documentContainer = document.createElement('div');
        documentContainer.classList.add('legal-document-container');
        
        // Add document header
        const documentHeader = document.createElement('div');
        documentHeader.classList.add('document-header');
        documentHeader.innerHTML = `
            <h2>Generated Legal Document</h2>
            <p class="document-timestamp">Generated on ${new Date().toLocaleString()}</p>
        `;
        documentContainer.appendChild(documentHeader);
        
        // Create document image container
        const documentImageContainer = document.createElement('div');
        documentImageContainer.classList.add('document-image-container');
        
        // Add sample image
        const sampleImage = document.createElement('img');
        sampleImage.src = 'sample image.jpg';
        sampleImage.alt = 'Legal Document Template';
        sampleImage.classList.add('document-template-image');
        documentImageContainer.appendChild(sampleImage);
        
        documentContainer.appendChild(documentImageContainer);
        
        // Create document content area
        const documentContent_container = document.createElement('div');
        documentContent_container.classList.add('document-content');
        
        // Format document content with proper spacing and styling
        documentContent_container.innerHTML = documentContent
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
            .replace(/\*([^*]+)\*/g, '<em>$1</em>'); // Italic text
        
        documentContainer.appendChild(documentContent_container);
        
        // Add action buttons
        const actionButtons = document.createElement('div');
        actionButtons.classList.add('document-actions');
        
        // Print button
        const printButton = document.createElement('button');
        printButton.classList.add('doc-action-btn', 'print-btn');
        printButton.innerHTML = '<i class="fas fa-print"></i> Print Document';
        printButton.addEventListener('click', () => {
            printDocument(documentContent);
        });
        
        // Return to chat button
        const returnButton = document.createElement('button');
        returnButton.classList.add('doc-action-btn', 'return-btn');
        returnButton.innerHTML = '<i class="fas fa-arrow-left"></i> Return to Chat';
        returnButton.addEventListener('click', () => {
            // Show the chat history again with the conversation
            clearChatHistory();
            
            // Display all messages
            sessionHistory.forEach(msg => {
                if (msg.role === 'user') {
                    addUserMessage(msg.content);
                } else {
                    addAssistantMessage(msg.content);
                }
            });
            
            // Show the generate document button again
            showGenerateDocButton();
        });
        
        actionButtons.appendChild(printButton);
        actionButtons.appendChild(returnButton);
        
        documentContainer.appendChild(actionButtons);
        
        // Add to chat history area
        chatHistory.appendChild(documentContainer);
        
        // Save this document to history as a special type
        saveDocumentToHistory(documentContent);
    }
    
    function printDocument(content) {
        // Create a new window for printing
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        
        // Add content to the new window
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Legal Document</title>
                <style>
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        line-height: 1.5;
                        padding: 40px;
                        color: #000;
                        background: #fff;
                    }
                    .document-content {
                        margin-top: 30px;
                    }
                    h1, h2, h3, h4 {
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 20px;
                    }
                    .footer {
                        margin-top: 40px;
                        border-top: 1px solid #ccc;
                        padding-top: 20px;
                        font-size: 0.8em;
                        color: #666;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        button {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Legal Document</h1>
                    <p>Generated on ${new Date().toLocaleString()}</p>
                </div>
                <div class="document-content">
                    ${content.replace(/\n/g, '<br>')}
                </div>
                <div class="footer">
                    <p>This document is a draft and should be reviewed by a qualified attorney before use.</p>
                </div>
                <button onclick="window.print(); window.close();" style="margin-top: 20px; padding: 10px;">
                    Print Document
                </button>
            </body>
            </html>
        `);
        
        // Focus on the new window
        printWindow.focus();
    }
    
    function saveDocumentToHistory(documentContent) {
        // Create a document object
        const document = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            topic: 'Generated Legal Document',
            type: 'document',
            content: documentContent,
            messages: [...sessionHistory] // Copy the session history that generated this document
        };
        
        // Add to conversations array
        allConversations.unshift(document);
        
        // Save to localStorage
        saveConversations();
    }

    // Function to display document analysis features
    function displayDocumentFeatures() {
        // Clear chat history first
        clearChatHistory();
        
        // Create container for feature cards
        const featuresContainer = document.createElement('div');
        featuresContainer.classList.add('doc-features-container');
        
        // Add title
        const featuresTitle = document.createElement('div');
        featuresTitle.classList.add('doc-features-title');
        featuresTitle.innerHTML = `
            <h2>Document Analysis Tools</h2>
            <p>Select a tool to analyze or process your documents</p>
        `;
        featuresContainer.appendChild(featuresTitle);
        
        // Create grid for feature cards
        const featuresGrid = document.createElement('div');
        featuresGrid.classList.add('doc-features-grid');
        
        // Define features
        const features = [
            {
                id: 'agreement-summary',
                title: 'Agreement Summary',
                description: 'Extract key information and generate concise summaries of complex agreements',
                icon: 'file-alt',
                color: 'blue'
            },
            {
                id: 'compare-agreements',
                title: 'Compare Agreements',
                description: 'Analyze differences between multiple versions of agreements to identify changes',
                icon: 'code-branch',
                color: 'green'
            },
            {
                id: 'document-translation',
                title: 'Document Translation',
                description: 'Translate legal documents into multiple languages while preserving formatting',
                icon: 'globe',
                color: 'red'
            },
            {
                id: 'image-to-text',
                title: 'Image to Text',
                description: 'Extract text from images and scanned documents for easier management',
                icon: 'image',
                color: 'indigo'
            }
        ];
        
        // Add each feature card
        features.forEach(feature => {
            const featureCard = document.createElement('div');
            featureCard.classList.add('doc-feature-card');
            featureCard.dataset.feature = feature.id;
            
            featureCard.innerHTML = `
                <div class="feature-icon ${feature.color}">
                    <i class="fas fa-${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            
            // Add click event
            featureCard.addEventListener('click', () => {
                loadDocumentFeature(feature.id);
            });
            
            featuresGrid.appendChild(featureCard);
        });
        
        featuresContainer.appendChild(featuresGrid);
        chatHistory.appendChild(featuresContainer);
    }
    
    // Function to load a specific document feature
    function loadDocumentFeature(featureId) {
        // Clear chat history
        clearChatHistory();
        
        // Show loading message
        addSystemMessage(`Loading ${featureId.replace('-', ' ')} feature...`);
        
        // Create iframe to load the feature
        const featureFrame = document.createElement('iframe');
        featureFrame.classList.add('doc-feature-frame');
        featureFrame.src = `vanilla-document-features/${featureId}.html`;
        featureFrame.title = featureId;
        
        // Add a back button container
        const backContainer = document.createElement('div');
        backContainer.classList.add('feature-back-container');
        
        const backButton = document.createElement('button');
        backButton.classList.add('feature-back-btn');
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Document Tools';
        
        // Add click event to back button
        backButton.addEventListener('click', () => {
            displayDocumentFeatures();
        });
        
        backContainer.appendChild(backButton);
        
        // Remove loading message and add the iframe and back button
        setTimeout(() => {
            clearChatHistory();
            chatHistory.appendChild(backContainer);
            chatHistory.appendChild(featureFrame);
            
            // Auto-resize the iframe based on content after it loads
            featureFrame.onload = function() {
                try {
                    // Set initial height based on content
                    this.style.height = this.contentWindow.document.body.scrollHeight + 20 + 'px';
                    
                    // Try to adjust iframe styling to match parent
                    const frameDoc = this.contentWindow.document;
                    const frameBody = frameDoc.body;
                    
                    // Add custom styles to match our app's theme
                    const styleElem = frameDoc.createElement('style');
                    styleElem.textContent = `
                        body { background: transparent; }
                        .navbar, footer { display: none !important; }
                        .container { padding: 0 !important; }
                    `;
                    frameDoc.head.appendChild(styleElem);
                } catch (e) {
                    console.error('Error adjusting iframe:', e);
                }
            };
        }, 1000);
    }
}); 