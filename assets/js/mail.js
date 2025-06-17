        // Form handling
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('.btn-contact');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Message envoyé avec succès ! Nous vous recontacterons dans les plus brefs délais.');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });

        // Form validation
        const requiredFields = document.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#009B4D';
                }
            });
        });

        // Email validation
        const emailField = document.getElementById('email');
        emailField.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
            } else if (this.value) {
                this.style.borderColor = '#009B4D';
            }
        });

        // Phone validation (basic)
        const phoneField = document.getElementById('phone');
        phoneField.addEventListener('blur', function() {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
            if (this.value && !phoneRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
            } else if (this.value) {
                this.style.borderColor = '#009B4D';
            }
        });