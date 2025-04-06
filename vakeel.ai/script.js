// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Vakeel.ai landing page loaded');
    
    // Audience tab switching
    const audienceOptions = document.querySelectorAll('.audience-option');
    
    audienceOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all options
            audienceOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update content based on selected audience
            if (option.textContent.includes('consumers')) {
                document.querySelector('.value-proposition').textContent = 
                    'Say goodbye to expensive legal consultation, long waits for appointments, and confusing legal texts.';
            } else if (option.textContent.includes('lawyers')) {
                document.querySelector('.value-proposition').textContent = 
                    'Enhance your practice with AI assistance, streamline routine tasks, and serve more clients efficiently.';
            }
        });
    });
    
    // Try for Free Button click handler with transition animation
    const tryForFreeBtn = document.getElementById('tryForFreeBtn');
    if (tryForFreeBtn) {
        tryForFreeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create overlay for smooth transition
            const transitionOverlay = document.createElement('div');
            transitionOverlay.classList.add('transition-overlay');
            document.body.appendChild(transitionOverlay);
            
            // Add transition message
            const transitionMessage = document.createElement('div');
            transitionMessage.classList.add('transition-message');
            transitionMessage.innerHTML = `
                <div class="transition-logo">
                    <span class="logo-icon">△</span>
                    <span class="logo-text">Vakeel.ai</span>
                </div>
                <p>Loading your Legal Assistant...</p>
                <div class="transition-loader"></div>
            `;
            transitionOverlay.appendChild(transitionMessage);
            
            // Animate overlay
            setTimeout(() => {
                transitionOverlay.classList.add('active');
                
                // Navigate to the assistant app after animation
                setTimeout(() => {
                    window.location.href = '../index.html?from=landing';
                }, 1500);
            }, 100);
        });
    }
    
    // CTA button animation
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('mouseenter', () => {
        ctaButton.style.transform = 'translateY(-2px)';
    });
    
    ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = 'translateY(0)';
    });
    
    // Add pulse animation to award badge
    const awardBadge = document.querySelector('.award-badge');
    
    if (awardBadge) {
        setInterval(() => {
            awardBadge.classList.add('pulse');
            
            setTimeout(() => {
                awardBadge.classList.remove('pulse');
            }, 1000);
        }, 5000);
    }
    
    // Scroll animations for the "Who is Vakeel.ai for?", "Advantages", and "FAQ" sections
    const whoForSection = document.querySelector('.who-for-section');
    const userCards = document.querySelectorAll('.user-card');
    const advantagesSection = document.querySelector('.advantages-section');
    const advantageCards = document.querySelectorAll('.advantage-card');
    const faqSection = document.querySelector('.faq-section');
    
    // Check if elements are in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll animations
    function handleScrollAnimations() {
        // Check if who-for-section is in viewport
        if (whoForSection && isInViewport(whoForSection)) {
            whoForSection.classList.add('visible');
            
            // Add visible class to user cards with a delay
            userCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 200 * index);
            });
        }
        
        // Check if advantages-section is in viewport
        if (advantagesSection && isInViewport(advantagesSection)) {
            advantagesSection.classList.add('visible');
            
            // Add visible class to advantage cards with a cascade delay
            advantageCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 150 * index);
            });
        }
        
        // Check if faq-section is in viewport
        if (faqSection && isInViewport(faqSection)) {
            faqSection.classList.add('visible');
        }
    }
    
    // Initial check for elements in viewport
    handleScrollAnimations();
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Sign In Modal Functionality
    const signInBtn = document.getElementById('signInBtn');
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const roleButtons = document.querySelectorAll('.role-button');
    const continueBtn = document.getElementById('continueBtn');
    const signUpForm = document.querySelector('.sign-up-form');

    // Show sign in modal when sign in button is clicked
    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signInModal.classList.add('active');
    });

    // Handle role selection
    let selectedRole = null;
    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected state from all buttons
            roleButtons.forEach(btn => {
                btn.classList.remove('selected');
            });

            // Add selected state to clicked button
            button.classList.add('selected');
            selectedRole = button.querySelector('span:nth-child(2)').textContent;
        });
    });

    // Handle continue button click - transition to sign up page
    continueBtn.addEventListener('click', () => {
        if (selectedRole) {
            console.log('Selected role:', selectedRole);
            // Hide sign in modal and show sign up modal
            signInModal.classList.remove('active');
            signUpModal.classList.add('active');
        } else {
            alert('Please select a role to continue');
        }
    });

    // Handle sign up form submission
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('.email-input').value;
        if (email) {
            console.log('Sign up with email:', email);
            alert('Sign up link sent to your email!');
        } else {
            alert('Please enter a valid email address');
        }
    });

    // Handle auth button clicks
    const authButtons = document.querySelectorAll('.auth-btn');
    authButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.classList.contains('google-btn') ? 'Google' : 'Apple';
            console.log(`Sign in with ${provider}`);
            alert(`Signing in with ${provider}...`);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === signInModal) {
            signInModal.classList.remove('active');
        }
        if (e.target === signUpModal) {
            signUpModal.classList.remove('active');
        }
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                width += 1;
                progressFill.style.width = width + '%';
            }
        }, 50);
    }

    // FAQ toggle functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question) => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // Check if this item is already active
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach((item) => {
                item.classList.remove('active');
            });
            
            // If it wasn't active before, make it active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Make the first FAQ item active by default
    const firstFaqItem = document.querySelector('.faq-item');
    if (firstFaqItem) {
        firstFaqItem.classList.add('active');
    }
}); 