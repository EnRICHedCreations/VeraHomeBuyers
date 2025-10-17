// Vera HomeBuyers - Main JavaScript

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Initialize contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm();
    }
});

// Contact Form (Seller Leads)
function initContactForm() {
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="inline-block animate-spin">⏳</span> Processing...';
        submitButton.disabled = true;

        // Collect form data
        const leadData = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            propertyAddress: document.getElementById('propertyAddress').value,
            situation: document.getElementById('situation').value,
            dateSubmitted: new Date().toISOString(),
            status: 'new',
            type: 'seller-lead'
        };

        // Validate
        if (!VeraUtils.validateEmail(leadData.email)) {
            VeraUtils.showErrorMessage('Please enter a valid email address');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            return;
        }

        if (!VeraUtils.validatePhone(leadData.phone)) {
            VeraUtils.showErrorMessage('Please enter a valid phone number');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            return;
        }

        try {
            console.log('Submitting seller lead:', leadData);

            // Load existing leads and add new one
            const existingLeads = await CloudStorage.loadData('VeraSellerLeads', []);
            existingLeads.push(leadData);
            await CloudStorage.saveData('VeraSellerLeads', existingLeads);

            console.log('Seller lead saved successfully!');
            VeraUtils.showSuccessMessage('✅ Thank you! We\'ll contact you within 24 hours with your guaranteed cash offer.');

            // Reset form
            this.reset();
        } catch (error) {
            console.error('Error submitting lead:', error);
            VeraUtils.showErrorMessage('There was an error submitting your request. Please call us directly at (941) 587-3856.');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}
