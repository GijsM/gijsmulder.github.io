document.addEventListener('DOMContentLoaded', function() {

    const navLinks = document.querySelectorAll('nav ul li a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksUl = document.querySelector('.nav-links');
    const navLinksLi = document.querySelectorAll('.nav-links li');
    const backToTopButton = document.getElementById('back-to-top');

    // Hamburger Menu Toggle
    const navSlide = () => {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            navLinksUl.classList.toggle('nav-active');

            // Update ARIA attribute for accessibility
            const isExpanded = navLinksUl.classList.contains('nav-active');
            hamburger.setAttribute('aria-expanded', isExpanded);

            // Animate Links
            navLinksLi.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Hamburger Animation
            hamburger.classList.toggle('toggle');
        });
    };

    // Close menu when a link is clicked (for mobile)
    const closeMenuOnLinkClick = () => {
        navLinksLi.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksUl.classList.contains('nav-active')) {
                    navLinksUl.classList.remove('nav-active');
                    hamburger.classList.remove('toggle');
                    hamburger.setAttribute('aria-expanded', 'false');
                    navLinksLi.forEach(linkItem => linkItem.style.animation = '');
                }
            });
        });
    };

    // Smooth scrolling for navigation links
    for (const link of navLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    }

    const sections = document.querySelectorAll('section');

    // --- Consolidated Scroll Handler for Performance ---
    const handleScroll = () => {
        // Back to Top Button Logic
        if (window.scrollY > 300) { // Show button after scrolling 300px
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }

        // Active Nav Link Logic
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 75) { // 75px offset for header height
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for better scroll performance

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Keyframes for nav link fade-in animation needs to be in CSS.
    // We'll add it dynamically if not present for robustness, but it's better in CSS.
    if (!document.styleSheets[0].cssRules.length || ![...document.styleSheets[0].cssRules].some(r => r.name === 'navLinkFade')) {
        const styleSheet = document.styleSheets[0];
        const keyframes = `@keyframes navLinkFade { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0px); } }`;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }

    // Initialize navigation features
    navSlide();
    handleScroll(); // Run once on load to set initial state
    closeMenuOnLinkClick();

    // Scrolling Animation (Fade-in)
    const sectionsToAnimate = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once it has appeared
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(section => {
        section.classList.add('fade-in'); // Add initial fade-in class
        observer.observe(section);
    });

    // Staggered Fade-in for Cards
    const cardsToAnimate = document.querySelectorAll('.fade-in-card');

    const cardObserverOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('appear');
                observer.unobserve(card); // Stop observing once it has appeared
            }
        });
    }, cardObserverOptions);

    cardsToAnimate.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`; // Stagger delay
        cardObserver.observe(card);
    });

    // --- Interactive Gradient on Cards ---
    const interactiveCards = document.querySelectorAll('.expertise-card, .portfolio-card, .testimonial-card');

    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
