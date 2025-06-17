// Formation data
const formations = [{
    id: 1,
    title: "Conduite d'Engins de Chantier",
    category: "btp",
    duration: "2-mois",
    location: "cotonou",
    price: "Sur devis",
    startDate: "15 Juillet 2024",
    description: "Formation complète pour la conduite d'engins de chantier avec certification internationale reconnue.",
    level: "Débutant",
    certification: "Certification internationale",
    popular: true
}, {
    id: 2,
    title: "Soudure à l'Arc et MIG",
    category: "industrie",
    duration: "6-semaines",
    location: "porto-novo",
    price: "250 000 FCFA",
    startDate: "1er Août 2024",
    description: "Maîtrisez les techniques de soudure à l'arc et MIG avec des équipements professionnels.",
    level: "Intermédiaire",
    certification: "Certificat professionnel",
    popular: true
}, {
    id: 3,
    title: "Gestion de Projet BTP",
    category: "btp",
    duration: "3-mois",
    location: "parakou",
    price: "400 000 FCFA",
    startDate: "10 Septembre 2024",
    description: "Apprenez à gérer efficacement les projets BTP de A à Z avec les outils modernes.",
    level: "Avancé",
    certification: "Formation diplômante",
    popular: false
}, {
    id: 4,
    title: "Maintenance Électromécanique",
    category: "industrie",
    duration: "4-mois",
    location: "cotonou",
    price: "500 000 FCFA",
    startDate: "5 Août 2024",
    description: "Formation complète en maintenance d'équipements électromécaniques industriels.",
    level: "Avancé",
    certification: "Certificat technique",
    popular: true
}, {
    id: 5,
    title: "Secrétariat de Direction",
    category: "services",
    duration: "3-mois",
    location: "abomey",
    price: "200 000 FCFA",
    startDate: "20 Juillet 2024",
    description: "Développez vos compétences en secrétariat avec la maîtrise des outils bureautiques.",
    level: "Débutant",
    certification: "Certification bureautique",
    popular: false
}, {
    id: 6,
    title: "Sécurité et Hygiène au Travail",
    category: "securite",
    duration: "1-mois",
    location: "cotonou",
    price: "150 000 FCFA",
    startDate: "1er Juillet 2024",
    description: "Formation HSE complète pour devenir responsable sécurité en entreprise.",
    level: "Intermédiaire",
    certification: "Certification HSE",
    popular: true
}, {
    id: 7,
    title: "Conduite Poids Lourds",
    category: "transport",
    duration: "6-semaines",
    location: "porto-novo",
    price: "300 000 FCFA",
    startDate: "15 Août 2024",
    description: "Obtenez votre permis poids lourds avec formation pratique sur véhicules récents.",
    level: "Débutant",
    certification: "Permis C+E",
    popular: false
}, {
    id: 8,
    title: "Comptabilité Générale",
    category: "services",
    duration: "4-mois",
    location: "parakou",
    price: "350 000 FCFA",
    startDate: "1er Septembre 2024",
    description: "Maîtrisez la comptabilité générale et les logiciels comptables professionnels.",
    level: "Intermédiaire",
    certification: "Diplôme comptable",
    popular: false
}, {
    id: 9,
    title: "Électricité Bâtiment",
    category: "btp",
    duration: "2-mois",
    location: "cotonou",
    price: "280 000 FCFA",
    startDate: "25 Juillet 2024",
    description: "Formation en installation électrique dans le bâtiment avec habilitation.",
    level: "Intermédiaire",
    certification: "Habilitation électrique",
    popular: false
}, {
    id: 10,
    title: "Informatique Bureautique",
    category: "services",
    duration: "6-semaines",
    location: "bohicon",
    price: "120 000 FCFA",
    startDate: "10 Juillet 2024",
    description: "Maîtrisez Word, Excel, PowerPoint et Internet pour le monde professionnel.",
    level: "Débutant",
    certification: "Certification Microsoft",
    popular: false
}, {
    id: 11,
    title: "Agent de Sécurité",
    category: "securite",
    duration: "1-mois",
    location: "lokossa",
    price: "100 000 FCFA",
    startDate: "5 Juillet 2024",
    description: "Formation complète pour devenir agent de sécurité certifié.",
    level: "Débutant",
    certification: "Carte professionnelle",
    popular: false
}, {
    id: 12,
    title: "Maçonnerie Moderne",
    category: "btp",
    duration: "3-mois",
    location: "natitingou",
    price: "250 000 FCFA",
    startDate: "1er Août 2024",
    description: "Techniques modernes de maçonnerie avec les nouveaux matériaux de construction.",
    level: "Débutant",
    certification: "Certification technique",
    popular: false
}];

// Global variables
let currentPage = 1;
let itemsPerPage = 6;
let filteredFormations = [...formations];
let currentFilter = 'all';

// DOM Elements
const formationsGrid = document.getElementById('formationsGrid');
const popularFormations = document.getElementById('popularFormations');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchForm = document.getElementById('searchForm');
const contactForm = document.getElementById('contactForm');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const loadingSpinner = document.querySelector('.loading-spinner');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadFormations();
    loadPopularFormations();
    initializeEventListeners();
    initializeAnimations();
});

// Event Listeners
function initializeEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(this);
            filterFormations(filter);
        });
    });

    // Search form
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });

    // Contact form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
    });

    // Load more button
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        loadFormations(false);
    });

    // Scroll to top
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Load formations
function loadFormations(reset = true) {
    if (reset) {
        currentPage = 1;
        formationsGrid.innerHTML = '';
    }

    showLoading();

    // Simulate API call delay
    setTimeout(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const formationsToShow = filteredFormations.slice(startIndex, endIndex);

        formationsToShow.forEach(formation => {
            const formationCard = createFormationCard(formation);
            formationsGrid.appendChild(formationCard);
        });

        // Hide load more button if no more formations
        if (endIndex >= filteredFormations.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        hideLoading();

        // Animate new cards
        const newCards = formationsGrid.querySelectorAll('.formation-card:not(.visible)');
        newCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }, 500);
}

// Load popular formations
function loadPopularFormations() {
    const popular = formations.filter(f => f.popular).slice(0, 4);
    popular.forEach(formation => {
        const formationCard = createFormationCard(formation);
        popularFormations.appendChild(formationCard);
    });
}

// Create formation card
function createFormationCard(formation) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';

    const categoryBadge = getCategoryBadge(formation.category);
    const locationName = getLocationName(formation.location);
    const durationText = getDurationText(formation.duration);

    col.innerHTML = `
    <div class="formation-card fade-in" data-category="${formation.category}">
        <div class="formation-badge ${categoryBadge.class}">${categoryBadge.text}</div>
        <h3 class="formation-title">${formation.title}</h3>
        <div class="formation-details">
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>${durationText}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${locationName}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-money-bill-wave"></i>
                <span>${formation.price}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${formation.startDate}</span>
            </div>
        </div>
        <p class="formation-description">${formation.description}</p>
        <div class="formation-details mb-3">
            <div class="detail-item">
                <i class="fas fa-signal"></i>
                <span>Niveau: ${formation.level}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-certificate"></i>
                <span>${formation.certification}</span>
            </div>
        </div>
        <div class="formation-actions">
            <button class="btn btn-outline-primary-custom" onclick="registerForFormation(${formation.id})">
                <i class="fas fa-info-circle me-2"></i>Plus d'infos
            </button>
            <a href="inscription_f.html">
                <button class="btn btn-primary-custom">
                    <i class="fas fa-user-plus me-2"></i>S'inscrire
                </button>
            </a>
        </div>
    </div>
`;

    return col;
}


// Helper functions
function getCategoryBadge(category) {
    const badges = {
        'btp': {
            class: 'badge-btp',
            text: 'BTP & Construction'
        },
        'industrie': {
            class: 'badge-industrie',
            text: 'Industrie'
        },
        'transport': {
            class: 'badge-transport',
            text: 'Transport'
        },
        'services': {
            class: 'badge-services',
            text: 'Services'
        },
        'securite': {
            class: 'badge-securite',
            text: 'Sécurité'
        }
    };
    return badges[category] || {
        class: '',
        text: category
    };
}

function getLocationName(location) {
    const locations = {
        'cotonou': 'Cotonou',
        'porto-novo': 'Porto-Novo',
        'parakou': 'Parakou',
        'abomey': 'Abomey',
        'bohicon': 'Bohicon',
        'kandi': 'Kandi',
        'natitingou': 'Natitingou',
        'ouidah': 'Ouidah',
        'lokossa': 'Lokossa',
        'djougou': 'Djougou'
    };
    return locations[location] || location;
}

function getDurationText(duration) {
    const durations = {
        '1-mois': '1 mois',
        '6-semaines': '6 semaines',
        '2-mois': '2 mois',
        '3-mois': '3 mois',
        '4-mois': '4 mois'
    };
    return durations[duration] || duration;
}

// Filter functions
function setActiveFilter(activeBtn) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function filterFormations(filter) {
    currentFilter = filter;

    if (filter === 'all') {
        filteredFormations = [...formations];
    } else {
        filteredFormations = formations.filter(f => f.category === filter);
    }

    loadFormations(true);
}

// Search function
function performSearch() {
    const typeFormation = document.getElementById('typeFormation').value;
    const ville = document.getElementById('ville').value;
    const duree = document.getElementById('duree').value;

    let searchResults = [...formations];

    if (typeFormation) {
        searchResults = searchResults.filter(f => f.category === typeFormation);
    }

    if (ville) {
        searchResults = searchResults.filter(f => f.location === ville);
    }

    if (duree) {
        searchResults = searchResults.filter(f => f.duration === duree);
    }

    filteredFormations = searchResults;
    loadFormations(true);

    // Update filter buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    if (typeFormation) {
        const targetBtn = document.querySelector(`[data-filter="${typeFormation}"]`);
        if (targetBtn) targetBtn.classList.add('active');
    } else {
        document.querySelector('[data-filter="all"]').classList.add('active');
    }

    // Scroll to results
    document.getElementById('formationsGrid').scrollIntoView({
        behavior: 'smooth'
    });
}

function registerForFormation(formationId) {
    const formation = formations.find(f => f.id === formationId);
    if (formation) {
        // Pre-fill contact form
        document.getElementById('formation').value = formation.title.toLowerCase().replace(/\s+/g, '-');

        // Scroll to contact form
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth'
        });

        // Focus on first input
        setTimeout(() => {
            document.getElementById('nom').focus();
        }, 500);
    }
}

// Contact form submission
function submitContactForm() {
    const formData = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        telephone: document.getElementById('telephone').value,
        email: document.getElementById('email').value,
        formation: document.getElementById('formation').value,
        message: document.getElementById('message').value
    };

    // Basic validation
    if (!formData.nom || !formData.prenom || !formData.telephone || !formData.email) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }

    // Simulate form submission
    alert('Votre demande a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.');
    contactForm.reset();
}

// Loading functions
function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Animations
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

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Initialize floating buttons visibility
window.addEventListener('load', function() {
    scrollTopBtn.style.display = 'none';
});