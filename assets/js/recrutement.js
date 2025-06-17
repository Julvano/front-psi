// Variables globales
let uploadedFiles = {
    cv: null,
    lettre: null,
    diplomes: [],
    references: null,
    portfolio: null,
    photo: null
};

let captchaResult = 10; // Valeur par défaut pour 7 + 3

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeFileUploads();
    initializeValidation();
    generateCaptcha();
    initializeProgressIndicator();
});

// Initialisation du formulaire
function initializeForm() {
    const form = document.getElementById('candidatureForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Masquer tous les messages d'erreur au départ
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.style.display = 'none');
}

// Initialisation des uploads de fichiers
function initializeFileUploads() {
    // Upload CV
    setupFileUpload('cv', 'cvUpload', 'cvFile', 'cvPreview', 'cvFileName', 'cvFileSize', 5 * 1024 * 1024, ['.pdf']);

    // Upload Lettre de motivation
    setupFileUpload('lettre', 'lettreUpload', 'lettreFile', 'lettrePreview', 'lettreFileName', 'lettreFileSize', 3 * 1024 * 1024, ['.pdf']);

    // Upload Diplômes (multiple)
    setupFileUpload('diplomes', 'diplomesUpload', 'diplomesFile', 'diplomesPreview', null, null, 5 * 1024 * 1024, ['.pdf'], true);

    // Upload Références
    setupFileUpload('references', 'referencesUpload', 'referencesFile', 'referencesPreview', null, null, 3 * 1024 * 1024, ['.pdf']);

    // Upload Portfolio
    setupFileUpload('portfolio', 'portfolioUpload', 'portfolioFile', 'portfolioPreview', null, null, 10 * 1024 * 1024, ['.pdf', '.zip']);

    // Upload Photo
    setupFileUpload('photo', 'photoUpload', 'photoFile', 'photoPreview', null, null, 2 * 1024 * 1024, ['.jpg', '.jpeg', '.png']);
}

// Configuration d'un upload de fichier
function setupFileUpload(type, zoneId, inputId, previewId, fileNameId, fileSizeId, maxSize, allowedTypes, multiple = false) {
    const uploadZone = document.getElementById(zoneId);
    const fileInput = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!uploadZone || !fileInput) return;

    // Click sur la zone d'upload
    uploadZone.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFileSelection(type, files, maxSize, allowedTypes, multiple, preview, fileNameId, fileSizeId);
    });

    // Sélection de fichier
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        handleFileSelection(type, files, maxSize, allowedTypes, multiple, preview, fileNameId, fileSizeId);
    });
}

// Gestion de la sélection de fichiers
function handleFileSelection(type, files, maxSize, allowedTypes, multiple, preview, fileNameId, fileSizeId) {
    if (files.length === 0) return;

    for (let file of files) {
        // Vérifier la taille
        if (file.size > maxSize) {
            showError(`Le fichier ${file.name} est trop volumineux. Taille maximale: ${formatFileSize(maxSize)}`);
            continue;
        }

        // Vérifier le type
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            showError(`Type de fichier non autorisé pour ${file.name}. Types acceptés: ${allowedTypes.join(', ')}`);
            continue;
        }

        // Stocker le fichier
        if (multiple && type === 'diplomes') {
            if (uploadedFiles.diplomes.length < 3) {
                uploadedFiles.diplomes.push(file);
                addFileToPreview(file, 'diplomesPreview', type);
            } else {
                showError('Maximum 3 fichiers de diplômes autorisés');
            }
        } else {
            uploadedFiles[type] = file;
            if (preview) {
                showFilePreview(file, preview, fileNameId, fileSizeId);
            }
        }
    }

    updateProgress();
}

// Affichage de la prévisualisation d'un fichier
function showFilePreview(file, preview, fileNameId, fileSizeId) {
    if (fileNameId && fileSizeId) {
        document.getElementById(fileNameId).textContent = file.name;
        document.getElementById(fileSizeId).textContent = formatFileSize(file.size);
    }
    preview.style.display = 'block';
}

// Ajout d'un fichier à la prévisualisation multiple
function addFileToPreview(file, previewId, type) {
    const preview = document.getElementById(previewId);
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-preview-item';
    fileDiv.innerHTML = `
<div class="file-info">
    <i class="fas fa-file-pdf text-danger me-2"></i>
    <span>${file.name}</span>
    <small class="text-muted d-block">${formatFileSize(file.size)}</small>
</div>
<button type="button" class="btn btn-sm btn-outline-danger" onclick="removeMultipleFile('${type}', '${file.name}', this)">
    <i class="fas fa-trash"></i>
</button>
`;
    preview.appendChild(fileDiv);
}

// Suppression d'un fichier
function removeFile(type) {
    uploadedFiles[type] = null;
    const preview = document.getElementById(type + 'Preview');
    if (preview) {
        preview.style.display = 'none';
    }

    // Réinitialiser l'input file
    const fileInput = document.getElementById(type + 'File');
    if (fileInput) {
        fileInput.value = '';
    }

    updateProgress();
}

// Suppression d'un fichier multiple
function removeMultipleFile(type, fileName, buttonElement) {
    if (type === 'diplomes') {
        uploadedFiles.diplomes = uploadedFiles.diplomes.filter(file => file.name !== fileName);
        buttonElement.parentElement.remove();
    }
    updateProgress();
}

// Formatage de la taille de fichier
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Génération du captcha
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaResult = num1 + num2;

    document.getElementById('captchaQuestion').textContent = `${num1} + ${num2}`;
    document.getElementById('captchaAnswer').value = '';
    document.getElementById('captchaError').style.display = 'none';
}

// Validation du formulaire
function initializeValidation() {
    // Validation en temps réel
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) {
                validateField(field);
            }
            updateProgress();
        });
    });

    // Validation email
    const emailField = document.querySelector('input[name="email"]');
    if (emailField) {
        emailField.addEventListener('input', validateEmail);
    }

    // Validation téléphone
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        field.addEventListener('input', validatePhone);
    });
}

// Validation d'un champ
function validateField(field) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    let isValid = true;

    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        showFieldError(field, errorDiv, 'Ce champ est obligatoire');
    } else if (field.hasAttribute('minlength') && field.value.length < field.getAttribute('minlength')) {
        isValid = false;
        showFieldError(field, errorDiv, `Minimum ${field.getAttribute('minlength')} caractères requis`);
    } else {
        hideFieldError(field, errorDiv);
    }

    return isValid;
}

// Validation email
function validateEmail() {
    const emailField = document.querySelector('input[name="email"]');
    const errorDiv = emailField.parentNode.querySelector('.error-message');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailField.value && !emailRegex.test(emailField.value)) {
        showFieldError(emailField, errorDiv, 'Veuillez saisir un email valide');
        return false;
    } else {
        hideFieldError(emailField, errorDiv);
        return true;
    }
}

// Validation téléphone
function validatePhone() {
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        if (field.value && field.value.length > 4) {
            // Validation basique pour les numéros béninois
            const phoneRegex = /^\+229\s?\d{8}$/;
            const errorDiv = field.parentNode.querySelector('.error-message');

            if (!phoneRegex.test(field.value)) {
                if (errorDiv) {
                    showFieldError(field, errorDiv, 'Format: +229 XXXXXXXX');
                }
            } else {
                if (errorDiv) {
                    hideFieldError(field, errorDiv);
                }
            }
        }
    });
}

// Affichage d'erreur sur un champ
function showFieldError(field, errorDiv, message) {
    field.classList.add('is-invalid');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Masquage d'erreur sur un champ
function hideFieldError(field, errorDiv) {
    field.classList.remove('is-invalid');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Gestion de la soumission du formulaire
function handleFormSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
        submitForm();
    }
}

// Validation complète du formulaire
function validateForm() {
    let isValid = true;

    // Validation des champs obligatoires
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validation des fichiers obligatoires
    if (!uploadedFiles.cv) {
        showError('Le CV est obligatoire');
        isValid = false;
    }

    if (!uploadedFiles.lettre) {
        showError('La lettre de motivation est obligatoire');
        isValid = false;
    }

    // Validation du captcha
    const captchaAnswer = document.getElementById('captchaAnswer').value;
    if (parseInt(captchaAnswer) !== captchaResult) {
        document.getElementById('captchaError').style.display = 'block';
        isValid = false;
    }

    // Validation des consentements
    const consent1 = document.getElementById('consent1').checked;
    const consent3 = document.getElementById('consent3').checked;

    if (!consent1 || !consent3) {
        showError('Vous devez accepter les consentements obligatoires');
        isValid = false;
    }

    return isValid;
}

// Soumission du formulaire
function submitForm() {
    // Afficher un indicateur de chargement
    showLoadingIndicator();

    // Simuler l'envoi (remplacer par votre logique d'envoi)
    setTimeout(() => {
        hideLoadingIndicator();
        showSuccessModal();
    }, 2000);
}

// Affichage du modal de succès
function showSuccessModal() {
    // Générer un numéro de candidature
    const candidatureNumber = 'CAND-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    document.getElementById('numeroCandidature').textContent = candidatureNumber;

    // Date de soumission
    const now = new Date();
    document.getElementById('dateSoumission').textContent = now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR');

    // Afficher le modal
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}

// Prévisualisation de la candidature
function previewCandidature() {
    const formData = new FormData(document.getElementById('candidatureForm'));
    let previewHtml = '<div class="preview-content">';

    // Section informations personnelles
    previewHtml += '<h4><i class="fas fa-user me-2"></i>Informations personnelles</h4>';
    previewHtml += `<p><strong>Nom:</strong> ${formData.get('civilite') || ''} ${formData.get('nom') || ''} ${formData.get('prenom') || ''}</p>`;
    previewHtml += `<p><strong>Email:</strong> ${formData.get('email') || ''}</p>`;
    previewHtml += `<p><strong>Téléphone:</strong> ${formData.get('telephone1') || ''}</p>`;
    previewHtml += `<p><strong>Adresse:</strong> ${formData.get('adresse') || ''}, ${formData.get('ville') || ''}</p>`;

    // Section professionnelle
    previewHtml += '<h4 class="mt-4"><i class="fas fa-graduation-cap me-2"></i>Informations professionnelles</h4>';
    previewHtml += `<p><strong>Niveau d'études:</strong> ${formData.get('niveauEtudes') || 'Non spécifié'}</p>`;
    previewHtml += `<p><strong>Expérience:</strong> ${formData.get('experience') || 'Non spécifié'}</p>`;
    previewHtml += `<p><strong>Poste actuel:</strong> ${formData.get('posteActuel') || 'Non spécifié'}</p>`;

    // Motivation
    previewHtml += '<h4 class="mt-4"><i class="fas fa-heart me-2"></i>Motivation</h4>';
    previewHtml += `<p>${formData.get('motivation') || ''}</p>`;

    // Fichiers uploadés
    previewHtml += '<h4 class="mt-4"><i class="fas fa-file me-2"></i>Documents joints</h4>';
    previewHtml += '<ul>';
    if (uploadedFiles.cv) previewHtml += `<li>CV: ${uploadedFiles.cv.name}</li>`;
    if (uploadedFiles.lettre) previewHtml += `<li>Lettre de motivation: ${uploadedFiles.lettre.name}</li>`;
    if (uploadedFiles.diplomes.length > 0) {
        previewHtml += '<li>Diplômes: ' + uploadedFiles.diplomes.map(f => f.name).join(', ') + '</li>';
    }
    previewHtml += '</ul>';

    previewHtml += '</div>';

    document.getElementById('previewContent').innerHTML = previewHtml;

    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    modal.show();
}

// Sauvegarde en brouillon
function saveDraft() {
    const formData = new FormData(document.getElementById('candidatureForm'));
    const draftData = {};

    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }

    // Sauvegarder dans le localStorage (si supporté)
    try {
        localStorage.setItem('candidature_draft', JSON.stringify(draftData));
        showSuccess('Brouillon sauvegardé avec succès');
    } catch (e) {
        // Fallback si localStorage n'est pas disponible
        showSuccess('Brouillon sauvegardé localement');
    }
}

// Annulation de la candidature
function cancelCandidature() {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.')) {
        document.getElementById('candidatureForm').reset();
        uploadedFiles = {
            cv: null,
            lettre: null,
            diplomes: [],
            references: null,
            portfolio: null,
            photo: null
        };

        // Masquer toutes les prévisualisations
        const previews = document.querySelectorAll('.file-preview');
        previews.forEach(preview => preview.style.display = 'none');

        // Vider les prévisualisations multiples
        document.getElementById('diplomesPreview').innerHTML = '';

        updateProgress();
        showSuccess('Formulaire réinitialisé');
    }
}

// Indicateur de progression
function initializeProgressIndicator() {
    // Afficher l'indicateur après 2 secondes
    setTimeout(() => {
        document.getElementById('progressIndicator').style.display = 'block';
        updateProgress();
    }, 2000);
}

// Mise à jour de la progression
function updateProgress() {
    const totalFields = 15; // Nombre approximatif de champs importants
    let completedFields = 0;

    // Vérifier les champs obligatoires
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        if (field.value.trim()) completedFields++;
    });

    // Vérifier les fichiers
    if (uploadedFiles.cv) completedFields++;
    if (uploadedFiles.lettre) completedFields++;

    const percentage = Math.round((completedFields / totalFields) * 100);

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar && progressText) {
        progressBar.style.width = percentage + '%';
        progressText.textContent = percentage + '% complété';

        // Changer la couleur selon le pourcentage
        progressBar.className = 'progress-bar';
        if (percentage < 30) {
            progressBar.classList.add('bg-danger');
        } else if (percentage < 70) {
            progressBar.classList.add('bg-warning');
        } else {
            progressBar.classList.add('bg-success');
        }
    }
}

// FAQ
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('.fa-chevron-down');

    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        answer.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Utilitaires
function showError(message) {
    // Créer ou utiliser une div d'alerte
    let alertDiv = document.querySelector('.alert-danger');
    if (!alertDiv) {
        alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
    <i class="fas fa-exclamation-triangle me-2"></i>
    <span class="alert-message"></span>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
`;
        document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
    }

    alertDiv.querySelector('.alert-message').textContent = message;
    alertDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    // Auto-masquer après 5 secondes
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    let alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
<i class="fas fa-check-circle me-2"></i>
<span>${message}</span>
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
`;

    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);

    // Auto-masquer après 3 secondes
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

function showLoadingIndicator() {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
    }
}

function hideLoadingIndicator() {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Envoyer la candidature';
    }
}