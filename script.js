document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active nav link
        let current = '';
        const sections = document.querySelectorAll('section, header');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Form Submission (Prevent default for demo)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #00b4d8, #00e5ff)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                contactForm.reset();
            }, 3000);
        });
    }

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                
                // Lower inc to slow and higher to fast
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            
            // Start animation when scrolled into view
            const rect = counter.getBoundingClientRect();
            if(rect.top < window.innerHeight && counter.innerText === '0') {
                updateCount();
            }
        });
    };

    window.addEventListener('scroll', animateCounters);
    
    // Tilt effect for service cards
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // Load Reviews
    const loadReviews = async () => {
        const container = document.getElementById('publicReviewsContainer');
        if (!container) return; // Not on the page with reviews

        try {
            const res = await fetch('/api/reviews');
            const reviews = await res.json();
            
            if (reviews.length === 0) {
                container.innerHTML = '<div style="text-align: center; grid-column: 1 / -1; color: var(--text-secondary);">No reviews yet. Check back later!</div>';
                return;
            }

            container.innerHTML = '';
            reviews.forEach(review => {
                const icon = review.platform.toLowerCase() === 'youtube' ? 'fa-youtube' : (review.platform.toLowerCase() === 'facebook' ? 'fa-facebook' : 'fa-star');
                
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `
                    <div class="service-card glass-card" style="height: 100%; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: var(--primary-color);">
                            <i class="fab ${icon} fa-2x"></i>
                            <span style="font-size: 0.8rem; background: rgba(0, 229, 255, 0.1); padding: 5px 10px; border-radius: 20px;">${review.platform}</span>
                        </div>
                        <p style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 15px; font-style: italic; flex-grow: 1;">"${review.text || 'Excellent service!'}"</p>
                        ${review.imageUrl ? `<img src="${review.imageUrl}" alt="Review" style="width: 100%; max-height: 200px; object-fit: contain; border-radius: 8px; margin-bottom: 15px; border: 1px solid var(--glass-border); background: #000; cursor: zoom-in;" onclick="openLightbox(this.src)">` : ''}
                        <div style="display: flex; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 15px; margin-top: auto;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-dark); display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; margin-right: 15px;">
                                ${review.clientName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 style="font-family: var(--font-heading); margin: 0; font-size: 1rem;">${review.clientName}</h4>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(slide);
            });

            // Initialize Swiper after slides are added
            if (window.Swiper) {
                new Swiper('.reviews-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    autoplay: {
                        delay: 3500,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }
                });
            }
        } catch (err) {
            console.error('Failed to load reviews:', err);
            container.innerHTML = '<div style="text-align: center; width: 100%; color: red;">Failed to load reviews.</div>';
        }
    };
    
    loadReviews();

    // Load Settings dynamically
    const loadSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const settings = await res.json();
                
                // Update WhatsApp links
                const waLinks = document.querySelectorAll('a[href*="wa.me"]');
                waLinks.forEach(link => link.href = `https://wa.me/${settings.whatsappNumber}`);

                // Update Phone and Email texts
                const phoneText = document.querySelector('.fa-phone-alt').nextElementSibling.querySelector('p');
                if (phoneText) phoneText.innerText = settings.phoneNumber;
                
                const emailText = document.querySelector('.fa-envelope').nextElementSibling.querySelector('p');
                if (emailText) emailText.innerText = settings.email;

                // Update Logo
                if (settings.logoUrl) {
                    const navLogo = document.querySelector('.navbar .logo');
                    if (navLogo) navLogo.innerHTML = `<img src="${settings.logoUrl}" alt="Logo" style="max-height: 40px; margin-right: 10px;"> <span class="logo-text" style="color: white; font-size: 1.2rem;">Dilshan Manujaya</span>`;
                    
                    const footerLogo = document.querySelector('.footer-logo');
                    if (footerLogo) footerLogo.innerHTML = `<img src="${settings.logoUrl}" alt="Logo" style="max-height: 40px;"> <span class="logo-text" style="color: white; font-size: 1.2rem; margin-left: 10px;">Dilshan Manujaya</span>`;

                    const showcase = document.querySelector('.logo-showcase');
                    if (showcase) showcase.innerHTML = `<img src="${settings.logoUrl}" alt="Dilshan Manujaya" class="dm-logo" style="max-width: 80%; max-height: 80%; z-index: 10; border-radius: 50%; box-shadow: 0 0 20px rgba(0,229,255,0.5);">`;
                }

                // Update Social Links
                const socialLinks = document.querySelector('.social-links');
                if (socialLinks) {
                    // Update specific icons if they exist
                    const fb = socialLinks.querySelector('.fa-facebook-f');
                    if (fb && settings.facebook !== "#") fb.parentElement.href = settings.facebook;
                    
                    const yt = socialLinks.querySelector('.fa-youtube');
                    if (yt && settings.youtube !== "#") yt.parentElement.href = settings.youtube;

                    const li = socialLinks.querySelector('.fa-linkedin-in');
                    if (li && settings.linkedin !== "#") li.parentElement.href = settings.linkedin;

                    const ig = socialLinks.querySelector('.fa-instagram');
                    if (ig && settings.instagram !== "#") ig.parentElement.href = settings.instagram;
                }
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
        }
    };

    loadSettings();

    // Lightbox Logic
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const span = document.getElementsByClassName("modal-close")[0];

    window.openLightbox = function(src) {
        modal.style.display = "block";
        modalImg.src = src;
    }

    if (span) {
        span.onclick = function() { 
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Initialize Particles.js
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#00e5ff", "#00b4d8", "#03045e"]
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#00e5ff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1.5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.8
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 150,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
});

// Service Modals Logic (Outside DOMContentLoaded so it can be called from inline onclick)
const serviceModal = document.getElementById('serviceModal');
const modalFlowContainer = document.getElementById('modalFlowContainer');
let currentService = '';

const serviceDetails = {
    security: {
        icon: 'fa-user-shield',
        color: '#00e5ff',
        title: 'Page/Channel Growth & Security',
        desc: 'Learn how to professionally manage your digital assets, maximize your growth, and secure your platforms from any threats.',
        bullets: [
            'Page/Channel analysis & growth strategies',
            'Professional content management guidance',
            'Advanced page & profile security setup',
            'YouTube copyright & strike management'
        ],
        formTitle: 'Submit Your Inquiry',
        btnText: 'Get Service',
        fields: `
            <div class="form-group">
                <input type="text" id="pageLink" placeholder="Link to your Page or Channel" required>
            </div>
            <div class="form-group">
                <select id="issueType" required>
                    <option value="" disabled selected>Select Primary Reason</option>
                    <option value="growth">Need Help Growing Page/Channel</option>
                    <option value="security">Security Setup / Hacked Account</option>
                    <option value="copyright">YouTube Copyright Issues</option>
                    <option value="content">Content Management Advice</option>
                    <option value="other">Other Inquiry</option>
                </select>
            </div>
        `
    },
    boosting: {
        icon: 'fa-bullhorn',
        color: '#00b4d8',
        title: 'High-Conversion Ad Campaigns',
        desc: 'Stop wasting money on ineffective ads. We design, target, and manage highly optimized ad campaigns to skyrocket your sales and brand awareness.',
        bullets: [
            'Precision Audience Targeting',
            'Creative Ad Design & Copywriting',
            'Budget Optimization & High ROI'
        ],
        formTitle: 'Start Ad Campaign',
        fields: `
            <div class="form-group">
                <input type="text" id="pageLink" placeholder="Link to your Business Page" required>
            </div>
            <div class="form-group">
                <select id="budget" required>
                    <option value="" disabled selected>Select Estimated Budget</option>
                    <option value="10-50">$10 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-500">$100 - $500</option>
                    <option value="500+">$500+</option>
                </select>
            </div>
            <div class="form-group">
                <input type="text" id="targetAudience" placeholder="Target Audience (e.g., Sri Lanka, Age 18-35)" required>
            </div>
        `
    },
    website: {
        icon: 'fa-laptop-code',
        color: '#03045e',
        title: 'Premium Web Development',
        desc: 'Your website is your digital storefront. We build lightning-fast, beautifully designed, and SEO-optimized websites that convert visitors into loyal customers.',
        bullets: [
            'Custom Modern Design',
            'Mobile-Responsive & Lightning Fast',
            'E-Commerce & Custom Web Apps'
        ],
        formTitle: 'Request Website',
        fields: `
            <div class="form-group">
                <select id="websiteType" required>
                    <option value="" disabled selected>Select Website Type</option>
                    <option value="portfolio">Personal Portfolio / CV</option>
                    <option value="business">Business / Corporate Site</option>
                    <option value="ecommerce">E-Commerce / Online Store</option>
                    <option value="other">Custom Web Application</option>
                </select>
            </div>
            <div class="form-group">
                <input type="text" id="referenceSite" placeholder="Any reference website you like? (Optional)">
            </div>
        `
    }
};

window.openServiceModal = function(serviceType) {
    currentService = serviceType;
    const data = serviceDetails[serviceType];
    
    const step1HTML = `
        <div style="text-align: center; animation: fadeIn 0.3s ease;">
            <i class="fas ${data.icon} fa-4x" style="color: ${data.color}; margin-bottom: 20px;"></i>
            <h2 style="color: var(--primary-color); margin-bottom: 15px; font-family: var(--font-heading);">${data.title}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 25px; font-size: 1.05rem; line-height: 1.6;">${data.desc}</p>
            
            <div style="text-align: left; background: rgba(255, 255, 255, 0.03); padding: 25px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 30px;">
                <ul style="list-style: none; padding: 0; margin: 0; color: var(--text-primary);">
                    \${data.bullets.map(b => \`<li style="margin-bottom: 12px; display: flex; align-items: center;"><i class="fas fa-check-circle" style="color: \${data.color}; margin-right: 12px; font-size: 1.1rem;"></i> \${b}</li>\`).join('')}
                </ul>
            </div>
            
            <button type="button" class="btn btn-primary" onclick="showServiceForm()" style="width: 100%; padding: 15px; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(0, 229, 255, 0.2);">
                ${data.btnText || 'Continue to Request'} <i class="fas fa-arrow-right" style="margin-left: 10px;"></i>
            </button>
        </div>
    `;
    
    modalFlowContainer.innerHTML = step1HTML;
    serviceModal.style.display = 'flex';
    serviceModal.style.alignItems = 'center';
}

window.showServiceForm = function() {
    const data = serviceDetails[currentService];
    
    const step2HTML = `
        <div style="animation: fadeIn 0.3s ease;">
            <button type="button" onclick="openServiceModal('\${currentService}')" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; margin-bottom: 15px; font-size: 0.9rem; display: flex; align-items: center;">
                <i class="fas fa-arrow-left" style="margin-right: 8px;"></i> Back to details
            </button>
            <h2 style="margin-bottom: 25px; color: var(--primary-color); font-family: var(--font-heading);">\${data.formTitle}</h2>
            
            <form id="serviceForm" onsubmit="handleServiceSubmit(event)">
                <div class="form-group">
                    <input type="text" id="reqName" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="text" id="reqWhatsApp" placeholder="WhatsApp Number" required>
                </div>

                \${data.fields}
                
                <div class="form-group" style="margin-top: 20px;">
                    <textarea id="reqAdditional" rows="3" placeholder="Any additional details or specific requirements?"></textarea>
                </div>

                <button type="submit" class="btn btn-primary submit-btn" style="width: 100%; margin-top: 15px; padding: 15px; font-size: 1.1rem; display: flex; justify-content: center; align-items: center; gap: 10px;">
                    <span>Submit Inquiry</span> <i class="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    `;
    
    modalFlowContainer.innerHTML = step2HTML;
}

window.handleServiceSubmit = function(event) {
    event.preventDefault();
    
    // Step 3: Contact Details & Ticket Payment
    const step3HTML = `
        <div style="text-align: center; padding: 20px 10px; animation: fadeIn 0.3s ease;">
            <div style="width: 60px; height: 60px; background: rgba(0, 229, 255, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 2px solid var(--primary-color);">
                <i class="fas fa-check" style="color: var(--primary-color); font-size: 1.5rem;"></i>
            </div>
            <h2 style="color: white; margin-bottom: 10px;">Inquiry Received!</h2>
            <p style="color: var(--text-secondary); margin-bottom: 25px; font-size: 0.95rem; line-height: 1.5;">
                Please contact me directly on WhatsApp to discuss your requirements. I will provide you with a <strong>Ticket Number</strong>.
            </p>
            
            <a id="waContactBtn" href="https://wa.me/94719909299" target="_blank" class="btn btn-primary" style="display: inline-block; background: #25D366; color: #fff; margin-bottom: 30px; padding: 10px 20px;">
                <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>

            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: left;">
                <h3 style="color: var(--primary-color); margin-bottom: 15px; font-size: 1.1rem;"><i class="fas fa-ticket-alt"></i> Have a Ticket Number?</h3>
                <form onsubmit="handlePaymentSubmit(event)">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <input type="text" id="ticketNumber" placeholder="Enter Ticket Number" required style="text-align: center; font-weight: bold; letter-spacing: 2px;">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;">Proceed to Payment <i class="fas fa-credit-card"></i></button>
                </form>
            </div>
        </div>
    `;
    
    modalFlowContainer.innerHTML = step3HTML;

    // Dynamically set the WhatsApp number if Settings was loaded
    fetch('/api/settings').then(r=>r.json()).then(s => {
        if(s && s.whatsappNumber) {
            document.getElementById('waContactBtn').href = 'https://wa.me/' + s.whatsappNumber;
        }
    }).catch(e=>{});
}

window.handlePaymentSubmit = function(event) {
    event.preventDefault();
    const ticket = document.getElementById('ticketNumber').value;
    alert("Redirecting to secure payment gateway for Ticket ID: " + ticket + "\\n(Payment Gateway integration coming soon)");
}

window.closeServiceModal = function() {
    serviceModal.style.display = 'none';
}

window.addEventListener('click', function(event) {
    if (event.target == serviceModal) {
        closeServiceModal();
    }
});

// Auto-open modal based on URL query
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modalType = urlParams.get('modal');
    if (modalType && serviceDetails[modalType]) {
        setTimeout(() => {
            openServiceModal(modalType);
            // Since they came from the game "Request" button, skip straight to the form
            setTimeout(() => {
                showServiceForm();
            }, 300);
        }, 500);
    }
});
