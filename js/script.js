// ====== Modal Functions ======
function openInquiry(productName) {
    const modal = document.getElementById('inquiryModal');
    document.getElementById('inquiryProduct').textContent = productName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInquiry() {
    const modal = document.getElementById('inquiryModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.getElementById('inquiryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeInquiry();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeInquiry();
    }
});

// ====== Inquiry Form Submission ======
document.getElementById('inquiryForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const message = formData.get('message');
    const product = document.getElementById('inquiryProduct').textContent;

    // Show success message
    showNotification('success', `Thank you ${name}! Your inquiry for "${product}" has been received. We will contact you shortly at ${phone} or ${email}.`);

    // Reset form and close modal
    this.reset();
    closeInquiry();
});

// ====== Contact Form Submission ======
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');

    // Show success message
    showNotification('success', `Thank you ${name}! Your message has been sent successfully. We'll get back to you at ${email} shortly.`);

    // Reset form
    this.reset();
});

// ====== Notification System ======
function showNotification(type, message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
        color: white;
        padding: 18px 25px;
        border-radius: 12px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 400px;
        animation: slideIn 0.4s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            flex: 1;
        }
        .notification-content i {
            font-size: 1.3rem;
            margin-top: 2px;
        }
        .notification-content span {
            font-size: 0.95rem;
            line-height: 1.5;
        }
        .notification-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }
        .notification-close:hover {
            background: rgba(255,255,255,0.3);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ====== Smooth Scrolling ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ====== Navbar Scroll Effect ======
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ====== Counter Animation ======
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ====== Intersection Observer for Animations ======
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animations to elements
document.querySelectorAll('.product-card, .feature-card, .contact-card, .about-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Trigger counter animation when hero stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ====== Parallax Effect for Hero ======
document.addEventListener('mousemove', function(e) {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ====== Add loading animation ======
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Animate hero elements sequentially
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-buttons, .hero-stats');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// ====== Typing effect for hero subtitle (optional) ======
function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ====== Product card hover effect enhancement ======
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.product-overlay')?.classList.add('visible');
    });

    card.addEventListener('mouseleave', function() {
        this.querySelector('.product-overlay')?.classList.remove('visible');
    });
});

// ====== Form input focus effects ======
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// ====== Initialize ======
console.log('KUMARBROTHS Website Loaded Successfully');
