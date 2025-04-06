document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const bars = document.querySelectorAll('.bar');
            
            // Animate the hamburger icon to an X
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'rotate(0) translate(0)';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'rotate(0) translate(0)';
            }
        });
    }

    // File upload functionality for all file inputs
    const fileInputs = document.querySelectorAll('.file-input');
    
    fileInputs.forEach(fileInput => {
        if (!fileInput) return;
        
        const fileUpload = fileInput.closest('.file-upload');
        const fileUploadText = fileUpload?.querySelector('.file-upload-text');

        fileInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                if (fileUploadText) {
                    fileUploadText.textContent = fileName;
                }
                
                // Add a selected class to the file upload container
                if (fileUpload) {
                    fileUpload.classList.add('selected');
                }

                // If there's a preview element, show the image preview
                const previewElement = document.getElementById(`${this.id}-preview`);
                if (previewElement && this.files[0].type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewElement.src = e.target.result;
                        previewElement.style.display = 'block';
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            }
        });
    });

    // Copy to clipboard functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        if (!button) return;
        
        button.addEventListener('click', function() {
            const textToCopy = this.dataset.target ? 
                document.getElementById(this.dataset.target).value : 
                this.dataset.text;
                
            if (!textToCopy) return;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Change the button text/icon to indicate copied
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                // Revert back after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });

    // Form submissions
    initFormSubmissions();
});

// Function to show and hide error messages
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.style.display = 'flex';
        errorElement.querySelector('span').textContent = message;
    }
}

function hideError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Initialize form submissions
function initFormSubmissions() {
    // Agreement Summary form
    const agreementSummaryForm = document.getElementById('agreement-summary-form');
    if (agreementSummaryForm) {
        agreementSummaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = this.querySelector('input[type="file"]');
            if (!fileInput || !fileInput.files.length) {
                showError('Please select a file to upload');
                return;
            }
            
            const file = fileInput.files[0];
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
                showError('Please upload a PDF or DOCX file');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
            submitButton.disabled = true;
            
            // Clear any existing error
            hideError();
            
            // Simulate file processing (in a real app, this would be an API call)
            setTimeout(() => {
                // Display summary result (mock data)
                const summaryResult = document.getElementById('summary-result');
                if (summaryResult) {
                    summaryResult.style.display = 'block';
                    
                    // Generate mock summary text based on filename
                    const summaryText = generateMockSummary(file.name);
                    document.getElementById('summary-text').textContent = summaryText;
                }
                
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Compare Agreements form
    const compareAgreementsForm = document.getElementById('compare-agreements-form');
    if (compareAgreementsForm) {
        compareAgreementsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const originalFileInput = this.querySelector('#original-file');
            const revisedFileInput = this.querySelector('#revised-file');
            
            if (!originalFileInput || !originalFileInput.files.length) {
                showError('Please select an original file to compare');
                return;
            }
            
            if (!revisedFileInput || !revisedFileInput.files.length) {
                showError('Please select a revised file to compare');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="loading-spinner"></span> Comparing...';
            submitButton.disabled = true;
            
            // Clear any existing error
            hideError();
            
            // Simulate comparison (in a real app, this would be an API call)
            setTimeout(() => {
                // Display comparison results
                const comparisonResult = document.getElementById('comparison-result');
                if (comparisonResult) {
                    comparisonResult.style.display = 'block';
                    
                    // Generate mock differences (pre-defined for demo)
                    const differencesContainer = document.getElementById('differences-container');
                    if (differencesContainer) {
                        differencesContainer.innerHTML = generateMockDifferences();
                    }
                }
                
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 2500);
        });
    }

    // Document Translation form
    const documentTranslationForm = document.getElementById('document-translation-form');
    if (documentTranslationForm) {
        documentTranslationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = this.querySelector('input[type="file"]');
            if (!fileInput || !fileInput.files.length) {
                showError('Please select a file to translate');
                return;
            }
            
            const sourceLanguage = document.getElementById('source-language').value;
            const targetLanguage = document.getElementById('target-language').value;
            
            if (sourceLanguage === targetLanguage) {
                showError('Source and target languages cannot be the same');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
            submitButton.disabled = true;
            
            // Clear any existing error
            hideError();
            
            // Hide form and show progress
            documentTranslationForm.style.display = 'none';
            const progressElement = document.getElementById('translation-progress');
            if (progressElement) {
                progressElement.style.display = 'block';
                
                // Simulate translation progress
                simulateTranslationProgress();
            }
        });
    }

    // Image to Text handling
    const extractTextBtn = document.getElementById('extract-text-btn');
    if (extractTextBtn) {
        extractTextBtn.addEventListener('click', function() {
            const imageInput = document.getElementById('image-file');
            
            if (!imageInput || !imageInput.files.length) {
                showError('Please select an image to extract text from');
                return;
            }
            
            const file = imageInput.files[0];
            if (!file.type.startsWith('image/')) {
                showError('Please upload a valid image file');
                return;
            }
            
            // Show loading state
            const originalButtonText = this.innerHTML;
            this.innerHTML = '<span class="loading-spinner"></span> Processing...';
            this.disabled = true;
            
            // Clear any existing error
            hideError();
            
            // Simulate OCR processing (in a real app, this would be an API call)
            setTimeout(() => {
                // Display extracted text result
                const extractedResult = document.getElementById('extracted-result');
                if (extractedResult) {
                    extractedResult.style.display = 'block';
                    
                    // Generate mock extracted text
                    const extractedText = generateMockExtractedText(file.name);
                    document.getElementById('extracted-text').value = extractedText;
                    
                    // Set random confidence score
                    const confidenceScore = document.getElementById('confidence-score');
                    const score = Math.floor(Math.random() * 20) + 80; // Random between 80-99
                    confidenceScore.textContent = `${score}%`;
                    
                    // Adjust color based on score
                    if (score >= 90) {
                        confidenceScore.className = 'confidence-score-value high';
                    } else if (score >= 80) {
                        confidenceScore.className = 'confidence-score-value medium';
                    } else {
                        confidenceScore.className = 'confidence-score-value';
                    }
                }
                
                // Reset button state
                this.innerHTML = originalButtonText;
                this.disabled = false;
            }, 2000);
        });
    }
}

// Helper function to generate mock summary for demo
function generateMockSummary(filename) {
    return `AGREEMENT SUMMARY

Document: ${filename}
Date Analyzed: ${new Date().toLocaleDateString()}

KEY POINTS:
1. This agreement is between Alpha Corporation ("Provider") and Beta Inc. ("Client") for professional services.
2. Term: 12 months from the effective date with automatic renewal
3. Payment Terms: Net 30 days from invoice date
4. Confidentiality: All information shared during the engagement is considered confidential for 3 years
5. Termination: Either party may terminate with 30 days written notice

KEY OBLIGATIONS:
- Provider must deliver services according to the Statement of Work
- Client must pay fees on time and provide necessary materials and access
- Both parties must maintain confidentiality of shared information

RISK ASSESSMENT:
- Medium risk provision: Non-compete clause extends to 24 months post-termination
- High risk provision: Unlimited liability for breach of confidentiality

RECOMMENDATIONS:
- Review the non-compete duration and geographic scope
- Consider adding a liability cap for confidentiality breaches
- Clarify intellectual property ownership provisions`;
}

// Helper function to generate mock differences for agreement comparison
function generateMockDifferences() {
    return `
    <div class="difference-item addition">
        <div class="difference-marker">+</div>
        <div class="difference-content">
            <p><strong>Section 5.3:</strong> The Client shall acknowledge receipt of deliverables in writing within five (5) business days.</p>
        </div>
    </div>
    
    <div class="difference-item deletion">
        <div class="difference-marker">-</div>
        <div class="difference-content">
            <p><strong>Section 7.1:</strong> Either party may terminate this Agreement with thirty (30) days written notice.</p>
        </div>
    </div>
    
    <div class="difference-item deletion">
        <div class="difference-marker">-</div>
        <div class="difference-content">
            <p><strong>Section 8.2:</strong> The total liability shall not exceed the total amount paid by Client in the preceding six (6) months.</p>
        </div>
    </div>
    
    <div class="difference-item addition">
        <div class="difference-marker">+</div>
        <div class="difference-content">
            <p><strong>Section 8.2:</strong> The total liability shall not exceed the total amount paid by Client in the preceding twelve (12) months.</p>
        </div>
    </div>
    
    <div class="difference-item modification">
        <div class="difference-marker">~</div>
        <div class="difference-content">
            <p><strong>Section 10.4:</strong> Changed from "New York law shall govern" to "California law shall govern"</p>
        </div>
    </div>`;
}

// Helper function to generate mock extracted text from image
function generateMockExtractedText(filename) {
    return `CONFIDENTIALITY AGREEMENT

THIS CONFIDENTIALITY AGREEMENT (the "Agreement") is made and entered into as of [Date], by and between [Party A], located at [Address] and [Party B], located at [Address].

WHEREAS, the parties wish to explore a potential business relationship (the "Purpose");

WHEREAS, in connection with the Purpose, each party may disclose to the other certain confidential and proprietary information; and

WHEREAS, the parties wish to establish terms governing the disclosure and use of such information.

NOW, THEREFORE, in consideration of the foregoing and the mutual covenants contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by one party (the "Disclosing Party") to the other party (the "Receiving Party"), either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary" or some similar designation, or that should reasonably be understood to be confidential given the nature of the information and the circumstances of disclosure.

2. OBLIGATIONS
The Receiving Party shall:
(a) maintain the confidentiality of the Disclosing Party's Confidential Information;
(b) not disclose such Confidential Information to any third party without prior written consent from the Disclosing Party;
(c) not use such Confidential Information for any purpose except for the Purpose; and
(d) take reasonable measures to protect the secrecy of and avoid disclosure and unauthorized use of the Confidential Information.

3. TERM
This Agreement shall remain in effect for a period of [Duration] from the date first written above.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

[PARTY A]                                       [PARTY B]

____________________                      ____________________
By:                                                     By:
Title:                                                  Title:`;
}

// Function to simulate translation progress
function simulateTranslationProgress() {
    let progress = 0;
    const progressBar = document.querySelector('.progress-bar-inner');
    const progressPercentage = document.getElementById('progress-percentage');
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Show success instead of progress
            setTimeout(() => {
                document.getElementById('translation-progress').style.display = 'none';
                document.getElementById('translation-success').style.display = 'block';
            }, 500);
        }
        
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${progress}%`;
    }, 400);
} 