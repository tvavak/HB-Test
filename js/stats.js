document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter');
    let started = false;

    function startCounting(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 secondes
                    const steps = 50; // Nombre d'étapes
                    const stepDuration = duration / steps;
                    let current = 0;
                    
                    const updateCounter = () => {
                        const increment = target / steps;
                        current += increment;
                        
                        if (current < target) {
                            counter.textContent = Math.round(current);
                            setTimeout(updateCounter, stepDuration);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                });
                observer.unobserve(entry.target);
            }
        });
    }

    const observer = new IntersectionObserver(startCounting, {
        root: null,
        threshold: 0.3
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
