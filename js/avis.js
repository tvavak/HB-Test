document.addEventListener('DOMContentLoaded', function() {
    // Gestion du système de notation
    const ratingStars = document.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('avisNote');

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
            note: document.getElementById('avisNote').value,
            type: document.getElementById('avisType').value,
            message: document.getElementById('avisMessage').value,
            date: new Date().toISOString()
        };

        // Ici, vous pouvez ajouter le code pour envoyer les données à votre backend
        console.log('Avis soumis:', formData);

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
});
