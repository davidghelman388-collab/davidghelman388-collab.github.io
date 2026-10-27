// Mobile menu toggle
const mobileMenuButton = document.getElementById('menu-btn');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    });
}

// Section fade-in system
function initializeSectionFadeIn() {
    const sections = document.querySelectorAll('section[data-animate]');
    if (sections.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        sections.forEach(section => section.classList.add('fade-in-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));
}

// The script may be loaded before or after DOMContentLoaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHomepage, { once: true });
} else {
    initializeHomepage();
}

function initializeHomepage() {
    initializeSectionFadeIn();
    initializeProjectCarousel();
}

function initializeProjectCarousel() {
    const track = document.getElementById('home-project-track');
    if (!track) return;

    const section = track.closest('section');
    const previous = section.querySelector('[data-project-scroll="-1"]');
    const next = section.querySelector('[data-project-scroll="1"]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateControls = () => {
        const maximum = track.scrollWidth - track.clientWidth;
        previous.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= maximum - 2;
    };

    const scroll = direction => {
        const card = track.firstElementChild;
        if (!card) return;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        track.scrollBy({
            left: direction * (card.getBoundingClientRect().width + gap),
            behavior: reducedMotion.matches ? 'instant' : 'smooth'
        });
    };

    previous.addEventListener('click', () => scroll(-1));
    next.addEventListener('click', () => scroll(1));
    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls, { passive: true });
    track.addEventListener('keydown', event => {
        if (event.target !== track) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            scroll(event.key === 'ArrowRight' ? 1 : -1);
        }
    });
    updateControls();
}
