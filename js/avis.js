document.addEventListener('DOMContentLoaded', function() {
    // Gestion du système de notation
    const ratingStars = document.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('avisNote');
    const avisContainer = document.querySelector('.avis-grid');

    // Fonction pour charger les avis existants
    function loadAvis() {
        const avis = JSON.parse(localStorage.getItem('avis') || '[]');
        avisContainer.innerHTML = ''; // Nettoyer le conteneur

        avis.forEach(avisItem => {
            const avisElement = createAvisElement(avisItem);
            avisContainer.appendChild(avisElement);
        });

        // Mettre à jour le nombre total d'avis
        updateAvisCount(avis.length);
    }

    // Fonction pour créer un élément d'avis
    function createAvisElement(avisItem) {
        const avisDiv = document.createElement('div');
        avisDiv.className = 'avis-card';
        avisDiv.innerHTML = `
            <div class="avis-header">
                <div class="avis-stars">
                    ${generateStars(avisItem.note)}
                </div>
                <div class="avis-date">${formatDate(avisItem.date)}</div>
            </div>
            <div class="avis-content">
                <h4 class="avis-author">${escapeHtml(avisItem.nom)}</h4>
                <p class="avis-type">${escapeHtml(avisItem.type)}</p>
                <p class="avis-text">${escapeHtml(avisItem.message)}</p>
            </div>
        `;
        return avisDiv;
    }

    // Fonction pour générer les étoiles
    function generateStars(rating) {
        return Array(5).fill(0).map((_, index) => 
            `<i class="${index < rating ? 'fas' : 'far'} fa-star"></i>`
        ).join('');
    }

    // Fonction pour formater la date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Fonction pour échapper les caractères HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Fonction pour mettre à jour le compteur d'avis
    function updateAvisCount(count) {
        const countElement = document.querySelector('.section-subtitle');
        if (countElement) {
            countElement.textContent = `${count} avis clients`;
        }
    }

    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            ratingInput.value = rating;
            
            // Mise à jour visuelle des étoiles
            ratingStars.forEach(s => {
                if (s.dataset.rating <= rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                    s.classList.add('active');
                } else {
                    s.classList.add('far');
                    s.classList.remove('fas');
                    s.classList.remove('active');
                }
            });
        });
    });

    // Gestion du formulaire
    const avisForm = document.getElementById('avisForm');
    const avisModal = new bootstrap.Modal(document.getElementById('avisModal'));
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    avisForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        // Récupération des données du formulaire
        const formData = {
            nom: document.getElementById('avisNom').value,
            email: document.getElementById('avisEmail').value,
            note: parseInt(document.getElementById('avisNote').value),
            type: document.getElementById('avisType').value,
            message: document.getElementById('avisMessage').value,
            date: new Date().toISOString()
        };

        // Sauvegarder l'avis
        const avis = JSON.parse(localStorage.getItem('avis') || '[]');
        avis.unshift(formData); // Ajouter le nouvel avis au début
        localStorage.setItem('avis', JSON.stringify(avis));

        // Recharger les avis
        loadAvis();

        // Réinitialisation du formulaire
        this.reset();
        this.classList.remove('was-validated');
        ratingStars.forEach(s => {
            s.classList.add('far');
            s.classList.remove('fas');
            s.classList.remove('active');
        });
        ratingInput.value = '0';

        // Fermer le modal d'avis et afficher la confirmation
        avisModal.hide();
        confirmationModal.show();
    });

    // Réinitialiser le formulaire quand le modal est fermé
    document.getElementById('avisModal').addEventListener('hidden.bs.modal', function() {
        avisForm.reset();
        avisForm.classList.remove('was-validated');
        ratingStars.forEach(s => {
            s.classList.add('far');
            s.classList.remove('fas');
            s.classList.remove('active');
        });
        ratingInput.value = '0';
    });

    // Charger les avis au chargement de la page
    loadAvis();
});
