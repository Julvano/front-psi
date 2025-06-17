// Variables globales
let formFields = [];
let currentStep = 0;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeAnimations();
    initializeScrollEffects();
    initializeFileUpload();
});

// Initialisation du formulaire
function initializeForm() {
    const form = document.getElementById('inscriptionForm');
    formFields = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));

    // Écouteurs d'événements pour la validation en temps réel
    formFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', validateField);
    });

    // Affichage conditionnel des champs
    setupConditionalFields();

    // Soumission du formulaire
    form.addEventListener('submit', handleFormSubmit);

    // Mise à jour de la barre de progression
    updateProgressBar();
}

// Configuration des champs conditionnels
function setupConditionalFields() {
    // Niveau d'études - Autre
    const niveauEtudes = document.getElementById('niveauEtudes');
    const autreNiveauDiv = document.getElementById('autreNiveauDiv');
    const autreNiveau = document.getElementById('autreNiveau');

    niveauEtudes.addEventListener('change', function() {
        if (this.value === 'autre') {
            autreNiveauDiv.style.display = 'block';
            autreNiveau.setAttribute('required', 'required');
        } else {
            autreNiveauDiv.style.display = 'none';
            autreNiveau.removeAttribute('required');
            autreNiveau.value = '';
        }
        updateProgressBar();
    });

    // Expérience professionnelle
    const experienceRadios = document.querySelectorAll('input[name="experiencePro"]');
    const detailExperienceDiv = document.getElementById('detailExperienceDiv');
    const detailExperience = document.getElementById('detailExperience');

    experienceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'oui') {
                detailExperienceDiv.style.display = 'block';
                detailExperience.setAttribute('required', 'required');
            } else {
                detailExperienceDiv.style.display = 'none';
                detailExperience.removeAttribute('required');
                detailExperience.value = '';
            }
            updateProgressBar();
        });
    });
}

// Validation d'un champ
function validateField(event) {
    const field = event.target;
    const isValid = field.checkValidity();

    field.classList.remove('is-valid', 'is-invalid');

    if (field.value.trim() !== '') {
        if (isValid) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
        }
    }

    // Validations spécifiques
    if (field.type === 'email') {
        validateEmail(field);
    } else if (field.type === 'tel') {
        validatePhone(field);
    }

    updateProgressBar();
}

// Validation email
function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(field.value);

    field.classList.remove('is-valid', 'is-invalid');
    if (field.value.trim() !== '') {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }
}

// Validation téléphone
function validatePhone(field) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    const isValid = phoneRegex.test(field.value);

    field.classList.remove('is-valid', 'is-invalid');
    if (field.value.trim() !== '') {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }
}

// Mise à jour de la barre de progression
function updateProgressBar() {
    const allFields = document.querySelectorAll('#inscriptionForm input, #inscriptionForm select, #inscriptionForm textarea');
    const requiredFields = Array.from(allFields).filter(field => field.hasAttribute('required'));
    const completedFields = requiredFields.filter(field => {
        if (field.type === 'radio') {
            return document.querySelector(`input[name="${field.name}"]:checked`);
        } else if (field.type === 'checkbox') {
            return field.checked;
        } else {
            return field.value.trim() !== '';
        }
    });

    const progress = (completedFields.length / requiredFields.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Gestion de la soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const isValid = form.checkValidity();

    form.classList.add('was-validated');

    if (isValid) {
        // Simulation de l'envoi
        showLoadingState();

        setTimeout(() => {
            hideLoadingState();
            showConfirmationModal();
        }, 2000);
    } else {
        // Scroll vers le premier champ invalide
        const firstInvalidField = form.querySelector('.is-invalid, :invalid');
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            firstInvalidField.focus();
        }
    }
}

// État de chargement
function showLoadingState() {
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
    submitBtn.disabled = true;
}

function hideLoadingState() {
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Valider l\'inscription';
    submitBtn.disabled = false;
}

// Affichage de la modal de confirmation
function showConfirmationModal() {
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}

// Initialisation des animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Effets de scroll
function initializeScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Gestion de l'upload de fichiers
function initializeFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');

    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateFileSize(this);
            updateProgressBar();
        });
    });
}

// Validation de la taille des fichiers
function validateFileSize(input) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const file = input.files[0];

    if (file && file.size > maxSize) {
        alert('Le fichier est trop volumineux. Taille maximum autorisée : 5MB');
        input.value = '';
        return false;
    }
    return true;
}

// Fonction utilitaire pour formater les données
function formatFormData() {
    const formData = new FormData(document.getElementById('inscriptionForm'));
    const data = {};

    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    return data;
}

// Sauvegarde automatique (optionnel)
function autoSave() {
    const formData = formatFormData();
    // Ici, vous pourriez sauvegarder en local ou envoyer au serveur
    console.log('Sauvegarde automatique:', formData);
}

// Sauvegarde toutes les 30 secondes
setInterval(autoSave, 30000);