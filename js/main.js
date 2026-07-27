/* ===================================================
   NAVBAR & PROGRESS BAR
=================================================== */
const header = document.querySelector('.navbar-header');
const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollProgress = document.getElementById('scroll-progress');

// Navbar Scrolled Effect & Scroll Progress
window.addEventListener('scroll', () => {
    // Background handling
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scroll progress execution
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
        const progressPercentage = (window.scrollY / totalScroll) * 100;
        scrollProgress.style.width = `${progressPercentage}%`;
    }
});

// Mobile Responsive Hamburger Menu
hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when link is clicked & active link tracking
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    });
});

/* ===================================================
   SMOOTH SCROLL & ACTIVE LINK SYNC
=================================================== */
const sections = document.querySelectorAll('section[id]');

function activeMenuTracker() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120; // offset spacing for header
        const sectionId = current.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

        if (correspondingLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                correspondingLink.classList.add('active');
            } else {
                correspondingLink.classList.remove('active');
            }
        }
    });
}
window.addEventListener('scroll', activeMenuTracker);

/* ===================================================
   HERO TYPING EFFECT
=================================================== */
const typingTextElement = document.getElementById('typing-text');
const phrases = ["With Confidence.", "In Luxury Style.", "Smooth & Premium."];
let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function handleTyping() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingTextElement.textContent = currentPhrase.substring(0, characterIndex - 1);
        characterIndex--;
        typingSpeed = 50; // faster deletion
    } else {
        typingTextElement.textContent = currentPhrase.substring(0, characterIndex + 1);
        characterIndex++;
        typingSpeed = 150; // steady writing
    }

    if (!isDeleting && characterIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // hold time at full word
    } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // break time before new word
    }

    setTimeout(handleTyping, typingSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    if (typingTextElement) setTimeout(handleTyping, 1000);
});

/* ===================================================
   COUNTER ANIMATION (STATS)
=================================================== */
const statNumbers = document.querySelectorAll('.stat-number');

function runCounterAnimation() {
    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const count = parseInt(counter.innerText, 10);
        
        // Dynamic speed balancing based on magnitude
        const increment = target / 50; 

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(runCounterAnimation, 30);
        } else {
            counter.innerText = target;
        }
    });
}

/* ===================================================
   GALLERY LIGHTBOX SYSTEM
=================================================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightbox.setAttribute('aria-hidden', 'false');
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt;
    });
});

function closeLightboxInstance() {
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = "";
    lightboxCaption.textContent = "";
}

lightboxClose.addEventListener('click', closeLightboxInstance);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightboxInstance();
});

// Close via ESC Key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
        closeLightboxInstance();
    }
});

/* ===================================================
   TESTIMONIAL SLIDER
=================================================== */
const slides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
const sliderContainer = document.getElementById('testimonial-slider');
let currentSlideIndex = 0;
let autoSliderTimer;

function updateSlidePosition() {
    sliderContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlideIndex);
    });
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateSlidePosition();
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    updateSlidePosition();
}

function initAutoSlider() {
    autoSliderTimer = setInterval(nextSlide, 5000);
}

function resetSliderInterval() {
    clearInterval(autoSliderTimer);
    initAutoSlider();
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => { nextSlide(); resetSliderInterval(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetSliderInterval(); });
    initAutoSlider();
}

/* ===================================================
   CONTACT FORM VALIDATION
=================================================== */
const form = document.getElementById('booking-contact-form');
const fields = [
    { id: 'input-name', errorId: 'error-name', validator: val => val.trim().length > 0 },
    { id: 'input-email', errorId: 'error-email', validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
    { id: 'input-phone', errorId: 'error-phone', validator: val => /^\d{9,15}$/.test(val.replace(/[-+ ()]/g, '')) },
    { id: 'select-destination', errorId: 'error-destination', validator: val => val !== "" }
];

function validateField(fieldConfig) {
    const inputElement = document.getElementById(fieldConfig.id);
    const parent = inputElement.parentElement;
    const isValid = fieldConfig.validator(inputElement.value);

    if (!isValid) {
        parent.classList.add('invalid');
    } else {
        parent.classList.remove('invalid');
    }
    return isValid;
}

// Event Listeners for inline checking
fields.forEach(field => {
    const el = document.getElementById(field.id);
    el.addEventListener('blur', () => validateField(field));
    el.addEventListener('input', () => {
        if(el.parentElement.classList.contains('invalid')) validateField(field);
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isFormValid = true;

    fields.forEach(field => {
        const isValid = validateField(field);
        if (!isValid) isFormValid = false;
    });

    if (isFormValid) {
        alert('Permintaan reservasi tur premium Anda telah terkirim! Travel Designer kami akan segera menghubungi Anda dalam waktu maksimal 1x24 jam.');
        form.reset();
    }
});

/* ===================================================
   BACK TO TOP
=================================================== */
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===================================================
   INTERSECTION OBSERVER (ANIMATIONS & COUNTER INITIALIZATION)
=================================================== */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const generalObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger animation fade in
            entry.target.classList.add('anim-active');
            
            // Specialized condition for stats counter section
            if (entry.target.classList.contains('hero-stats')) {
                runCounterAnimation();
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Register targets to observe
document.querySelectorAll('.anim-fade-up').forEach(el => generalObserver.observe(el));
document.querySelectorAll('.anim-fade-left').forEach(el => generalObserver.observe(el));
document.querySelectorAll('.anim-fade-right').forEach(el => generalObserver.observe(el));
const statsSection = document.querySelector('.hero-stats');
if (statsSection) generalObserver.observe(statsSection);
