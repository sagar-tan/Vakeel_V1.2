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

    // Initialize form submissions
    initFormSubmissions();
});

// Function to initialize form submissions
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

    // Create Agreement Light form
    const createAgreementLightForm = document.getElementById('create-agreement-light-form');
    if (createAgreementLightForm) {
        createAgreementLightForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const templateType = document.querySelector('input[name="template"]:checked');
            if (!templateType) {
                showError('Please select a template type');
                return;
            }
            
            const party1Name = document.getElementById('party1-name').value;
            const party2Name = document.getElementById('party2-name');
            
            if (!party1Name) {
                showError('Please enter Party 1 name');
                return;
            }
            
            if (party2Name && !party2Name.value) {
                showError('Please enter Party 2 name');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="loading-spinner"></span> Generating...';
            submitButton.disabled = true;
            
            // Clear any existing error
            hideError();
            
            // Simulate agreement generation (in a real app, this would be an API call)
            setTimeout(() => {
                // Display success message
                const successMessage = document.getElementById('agreement-generated');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    
                    // Update template name in success message
                    const templateNameElement = document.getElementById('template-name');
                    if (templateNameElement) {
                        const templateName = getTemplateName(templateType.value);
                        templateNameElement.textContent = templateName;
                    }
                }
                
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Image to Text form
    const imageToTextForm = document.getElementById('image-to-text-form');
    if (imageToTextForm) {
        const extractButton = document.getElementById('extract-text-btn');
        if (extractButton) {
            extractButton.addEventListener('click', function() {
                const fileInput = document.getElementById('image-file');
                if (!fileInput || !fileInput.files.length) {
                    showError('Please select an image to extract text from');
                    return;
                }
                
                const file = fileInput.files[0];
                if (!file.type.startsWith('image/')) {
                    showError('Please upload a valid image file');
                    return;
                }
                
                // Show loading state
                const originalButtonText = this.innerHTML;
                this.innerHTML = '<span class="loading-spinner"></span> Extracting...';
                this.disabled = true;
                
                // Clear any existing error
                hideError();
                
                // Simulate text extraction (in a real app, this would use Tesseract.js or an API)
                setTimeout(() => {
                    // Display extracted text result
                    const extractedResult = document.getElementById('extracted-result');
                    if (extractedResult) {
                        extractedResult.style.display = 'block';
                        
                        // Generate mock extracted text
                        const mockTexts = {
                            invoice: `INVOICE #12345
                            
Date: April 5, 2023
Due Date: May 5, 2023

BILL TO:
Acme Corporation
123 Business St.
Business City, BZ 12345

DESCRIPTION                   QTY    RATE    AMOUNT
Website Development           1      $5,000  $5,000
Content Writing              10      $100    $1,000
SEO Optimization              1      $750    $750

                                    SUBTOTAL: $6,750
                                    TAX (8%): $540
                                    TOTAL: $7,290`,
                            contract: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of April 5, 2023 ("Effective Date") by and between:

PROVIDER: Smith Consultants, LLC with offices at 456 Provider Lane, Provider City, PC 67890 ("Provider")

CLIENT: Johnson Enterprises, Inc. with offices at 789 Client Avenue, Client City, CL 54321 ("Client")

1. SERVICES
Provider shall provide the following services to Client: strategic business consulting, market analysis, and growth strategy development.

2. TERM
This Agreement shall commence on the Effective Date and continue for a period of twelve (12) months.`,
                            receipt: `RECEIPT

Store: TechGadgets
Date: April 5, 2023
Time: 14:32:45

Item                   Qty    Price    Total
------------------------------------------
Smartphone Case         1     $29.99   $29.99
Screen Protector       2     $12.50   $25.00
USB-C Cable            1     $15.99   $15.99
------------------------------------------
                      Subtotal: $70.98
                      Tax (6%): $4.26
                      TOTAL: $75.24

Payment Method: Credit Card
Card: VISA ****1234

Thank you for your purchase!`
                        };
                        
                        // Get a random mock text for the demo
                        const mockTextKeys = Object.keys(mockTexts);
                        const randomKey = mockTextKeys[Math.floor(Math.random() * mockTextKeys.length)];
                        const extractedText = mockTexts[randomKey];
                        
                        // Update extracted text and confidence
                        document.getElementById('extracted-text').value = extractedText;
                        
                        // Generate a random confidence score between 80-98%
                        const confidence = Math.floor(Math.random() * (98 - 80 + 1)) + 80;
                        document.getElementById('confidence-score').textContent = `${confidence}%`;
                    }
                    
                    // Reset button state
                    this.innerHTML = originalButtonText;
                    this.disabled = false;
                }, 2000);
            });
        }
    }
}

// Helper functions

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Hide error message
function hideError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Get template name based on value
function getTemplateName(templateValue) {
    const templateNames = {
        'nda': 'Non-Disclosure Agreement',
        'service': 'Service Agreement',
        'employment': 'Employment Contract'
    };
    
    return templateNames[templateValue] || 'Agreement';
}

// Generate mock summary for Agreement Summary
function generateMockSummary(filename) {
    return `## Agreement Summary for ${filename}

### Key Points
- This agreement is between Company ABC and Client XYZ
- Term: 12 months with automatic renewal
- Payment terms: Net 30 days
- Governing law: State of California

### Important Clauses
1. **Liability**: Limited to the value of services provided
2. **Termination**: 30-day written notice required
3. **Confidentiality**: All shared information to remain confidential for 5 years
4. **Intellectual Property**: All IP developed during the project belongs to Client XYZ

### Obligations
- Company must deliver monthly reports
- Client must provide access to necessary systems
- Both parties must maintain insurance coverage

### Recommendations
- Review the termination clause as it contains significant penalties
- Consider negotiating the payment terms to Net 15
- The indemnification clause is unusually broad and may need revision`;
}

// Generate mock differences for Compare Agreements
function generateMockDifferences() {
    return `
        <div class="difference addition">
            <div class="difference-header">
                <i class="fas fa-plus-circle"></i>
                <span class="section">Section 3.4: Payment Terms</span>
            </div>
            <div class="difference-content">
                <p class="addition-text">All invoices shall be paid within fifteen (15) days of receipt.</p>
            </div>
        </div>
        
        <div class="difference deletion">
            <div class="difference-header">
                <i class="fas fa-minus-circle"></i>
                <span class="section">Section 3.4: Payment Terms</span>
            </div>
            <div class="difference-content">
                <p class="deletion-text">All invoices shall be paid within thirty (30) days of receipt.</p>
            </div>
        </div>
        
        <div class="difference modification">
            <div class="difference-header">
                <i class="fas fa-pen"></i>
                <span class="section">Section 5.2: Termination</span>
            </div>
            <div class="difference-content">
                <p class="deletion-text">This agreement may be terminated with 30 days written notice.</p>
                <p class="addition-text">This agreement may be terminated with 60 days written notice and payment of a $1,000 termination fee.</p>
            </div>
        </div>
        
        <div class="difference addition">
            <div class="difference-header">
                <i class="fas fa-plus-circle"></i>
                <span class="section">Section 7.1: Confidentiality</span>
            </div>
            <div class="difference-content">
                <p class="addition-text">The obligations of confidentiality shall survive termination of this Agreement for a period of five (5) years.</p>
            </div>
        </div>
        
        <div class="difference modification">
            <div class="difference-header">
                <i class="fas fa-pen"></i>
                <span class="section">Section 9.3: Governing Law</span>
            </div>
            <div class="difference-content">
                <p class="deletion-text">This Agreement shall be governed by the laws of the State of New York.</p>
                <p class="addition-text">This Agreement shall be governed by the laws of the State of California.</p>
            </div>
        </div>
    `;
} 