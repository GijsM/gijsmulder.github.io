document.addEventListener('DOMContentLoaded', function() {

    const navLinks = document.querySelectorAll('nav ul li a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksUl = document.querySelector('.nav-links');
    const navLinksLi = document.querySelectorAll('.nav-links li');
    const backToTopButton = document.getElementById('back-to-top');
    const navUnderline = document.querySelector('.nav-underline');
    let isScrollingByClick = false; // Flag to prevent scroll handler interference during click-initiated scrolls

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
            
            // Immediately set active class and move underline for the clicked link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            moveUnderline(this);

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);            
            if (targetElement) {
                isScrollingByClick = true; // Set flag before initiating smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for fixed header
                    behavior: 'smooth'
                });

                // Reset flag after a duration slightly longer than smooth scroll
                // This allows handleScroll to take over once the scroll settles
                setTimeout(() => {
                    isScrollingByClick = false;
                    handleScroll(); // Re-evaluate active section after scroll settles
                }, 800); // Adjust this duration if scroll animation is longer/shorter
            }
        });
    }

    const sections = document.querySelectorAll('section');

    // --- Consolidated Scroll Handler for Performance ---
    const handleScroll = () => {
        if (isScrollingByClick) { // If scrolling due to a click, defer to the click handler's logic
            return;
        }

        let currentSectionId = '';
        let activeLink = null;

        // Back to Top Button Logic
        if (window.scrollY > 300) { // Show button after scrolling 300px
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
        
        // Determine the currently active section based on scroll position
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Use a slightly larger offset for determining active section to ensure it's truly in view
            if (window.scrollY >= sectionTop - 100) { 
                currentSectionId = section.getAttribute('id');
            }
        });
        // Find and set the active link based on scroll position
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
                activeLink = link;
            }
        });

        // Fallback to the first link if no section is active (e.g., at the very top)
        if (!activeLink && navLinks.length > 0) {
            activeLink = navLinks[0];
            activeLink.classList.add('active');
        }

        moveUnderline(activeLink);
    };

    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for better scroll performance

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        isScrollingByClick = true; // Set flag
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            isScrollingByClick = false;
            handleScroll(); // Re-evaluate after scroll settles
        }, 800);
    });
    // Keyframes for nav link fade-in animation needs to be in CSS.
    // We'll add it dynamically if not present for robustness, but it's better in CSS.
    if (!document.styleSheets[0].cssRules.length || ![...document.styleSheets[0].cssRules].some(r => r.name === 'navLinkFade')) {
        const styleSheet = document.styleSheets[0];
        const keyframes = `@keyframes navLinkFade { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0px); } }`;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }

    // --- Magic Line Navigation Logic ---
    function moveUnderline(target) {
        if (!target || !navUnderline) return;

        const targetLi = target.parentElement;
        if (targetLi) {
            navUnderline.style.width = `${targetLi.offsetWidth}px`;
            navUnderline.style.left = `${targetLi.offsetLeft}px`;
        }
    }

    // Add hover effects for the underline
    navLinks.forEach(link => {
        link.parentElement.addEventListener('mouseover', () => moveUnderline(link));
    });

    // When mouse leaves the nav, move underline back to the active link
    navLinksUl.addEventListener('mouseleave', () => { // Only move back if not currently scrolling by click
        if (!isScrollingByClick) {
            const activeLink = document.querySelector('.nav-links a.active');
            moveUnderline(activeLink);
        }
    });

    // Initialize navigation features
    navSlide();
    // Initial call to set underline position correctly on load
    // Use requestAnimationFrame for better timing after layout is stable
    requestAnimationFrame(() => {
        handleScroll();
    });
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

    // --- AJAX Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    async function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const submitButton = form.querySelector('button');

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
                formStatus.className = 'success';
                form.reset();
            } else {
                formStatus.textContent = 'Oops! There was a problem submitting your form. Please try again.';
                formStatus.className = 'error';
            }
        } catch (error) {
            formStatus.textContent = 'Oops! There was a network error. Please try again.';
            formStatus.className = 'error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    }

    contactForm.addEventListener('submit', handleFormSubmit);
});
