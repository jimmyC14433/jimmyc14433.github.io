document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link-cyber');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // 2. Header Scroll Effect
    const header = document.getElementById('cyber-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Active Link Scroll Spy
    const sections = document.querySelectorAll('section[id], footer[id]');
    const updateActiveNav = () => {
        let current = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                const id = section.getAttribute('id');
                if (id) current = id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // 4. Matrix Decryption Effect
    const decryptElements = document.querySelectorAll('[data-decrypt]');
    
    function decryptText(element) {
        const originalText = element.getAttribute('data-decrypt') || element.textContent;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*()";
        let iterations = 0;
        
        // Save original text as attribute if not already present
        if (!element.getAttribute('data-decrypt')) {
            element.setAttribute('data-decrypt', originalText);
        }

        const interval = setInterval(() => {
            element.textContent = originalText.split("")
                .map((char, index) => {
                    if (char === " ") return " ";
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
                element.textContent = originalText; // Ensure perfect ending
            }
            
            iterations += 1 / 3;
        }, 30);
    }

    // Trigger decryption on load
    setTimeout(() => {
        decryptElements.forEach(el => decryptText(el));
    }, 500);

    // Dynamic decryption on hover
    decryptElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            // Only trigger if not currently decrypting
            if (el.textContent === el.getAttribute('data-decrypt')) {
                decryptText(el);
            }
        });
    });

    // 5. Copy to Clipboard Utility
    const copyCards = document.querySelectorAll('[data-copy]');
    const toast = document.getElementById('toast-msg');
    const toastText = document.getElementById('toast-text');

    copyCards.forEach(card => {
        card.addEventListener('click', () => {
            const textToCopy = card.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show custom toast notification
                if (toast && toastText) {
                    toastText.textContent = `Copiado: ${textToCopy}`;
                    toast.classList.add('active');
                    
                    setTimeout(() => {
                        toast.classList.remove('active');
                    }, 2500);
                }
            }).catch(err => {
                console.error('Error al copiar: ', err);
            });
        });
    });

    // 6. Credly Badges Dynamic Loader
    const credlyContainer = document.getElementById('credly-badges-grid');
    const credlyCounter = document.getElementById('credly-badge-count');

    function formatDate(dateString) {
        try {
            if (!dateString) return '';
            const parts = dateString.split('-');
            if (parts.length === 3) {
                const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                const m = parseInt(parts[1], 10) - 1;
                return `Emitida: ${parseInt(parts[2], 10)} ${months[m] || parts[1]} ${parts[0]}`;
            }
            return `Emitida: ${dateString}`;
        } catch (e) {
            return `Emitida: ${dateString}`;
        }
    }

    function renderCredlyBadges(badges) {
        if (!credlyContainer) return;
        
        if (credlyCounter) {
            credlyCounter.textContent = `${badges.length} Insignias Verificadas`;
        }

        credlyContainer.dataset.infiniteInit = "false";
        credlyContainer.innerHTML = badges.map(badge => {
            const dateStr = badge.issued_at_date ? formatDate(badge.issued_at_date) : '';
            return `
                <div class="credly-card glass-card">
                    <div class="credly-badge-img-wrapper">
                        <img src="${badge.image_url}" alt="${badge.name}" class="credly-badge-img" loading="lazy">
                    </div>
                    <div class="credly-card-content">
                        <div class="credly-issuer">
                            <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i>
                            <span>${badge.issuer_name || 'Credly Issuer'}</span>
                        </div>
                        <h4 class="credly-badge-name" title="${badge.name}">${badge.name}</h4>
                        <div class="credly-date">${dateStr}</div>
                    </div>
                    <span class="badge-status-pill">
                        <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i>
                        Credencial Verificada
                    </span>
                </div>
            `;
        }).join('');

        if (window.lucide) {
            window.lucide.createIcons();
        }

        setupInfiniteCarousel('credly-badges-grid', 'credly-prev', 'credly-next', 3800);
    }

    // 7. Infinite Loop Carousels Engine
    function setupInfiniteCarousel(containerId, prevBtnId, nextBtnId, autoDelay = 4000) {
        const container = document.getElementById(containerId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!container) return;

        // Prevent double init on same content
        if (container.dataset.infiniteInit === "true") return;
        container.dataset.infiniteInit = "true";

        const originalCards = Array.from(container.children);
        if (originalCards.length === 0) return;

        // Triplicate children for seamless infinite wrap-around
        const fragmentPre = document.createDocumentFragment();
        const fragmentPost = document.createDocumentFragment();

        originalCards.forEach(card => {
            fragmentPre.appendChild(card.cloneNode(true));
            fragmentPost.appendChild(card.cloneNode(true));
        });

        container.insertBefore(fragmentPre, container.firstChild);
        container.appendChild(fragmentPost);

        if (window.lucide) {
            window.lucide.createIcons();
        }

        const getSingleSetWidth = () => container.scrollWidth / 3;

        const getStepWidth = () => {
            const firstCard = container.querySelector('.credly-card, .carousel-project-card');
            if (!firstCard) return 320;
            const style = window.getComputedStyle(container);
            const gap = parseFloat(style.gap) || 24;
            return firstCard.offsetWidth + gap;
        };

        // Position at the start of Set 1 (middle set)
        let singleSetWidth = getSingleSetWidth();
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = singleSetWidth;
        container.style.scrollBehavior = 'smooth';

        // Boundary adjustment
        let scrollTimeout = null;
        const adjustBoundary = () => {
            singleSetWidth = getSingleSetWidth();
            if (singleSetWidth <= 0) return;

            if (container.scrollLeft >= singleSetWidth * 2 - 25) {
                container.style.scrollBehavior = 'auto';
                container.scrollLeft -= singleSetWidth;
                container.style.scrollBehavior = 'smooth';
            } else if (container.scrollLeft <= 25) {
                container.style.scrollBehavior = 'auto';
                container.scrollLeft += singleSetWidth;
                container.style.scrollBehavior = 'smooth';
            }
        };

        container.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(adjustBoundary, 120);
        }, { passive: true });

        if ('onscrollend' in window) {
            container.addEventListener('scrollend', adjustBoundary);
        }

        const scrollNext = () => {
            adjustBoundary();
            const step = getStepWidth();
            container.scrollBy({ left: step, behavior: 'smooth' });
        };

        const scrollPrev = () => {
            adjustBoundary();
            const step = getStepWidth();
            container.scrollBy({ left: -step, behavior: 'smooth' });
        };

        let autoTimer = null;
        const startAuto = () => {
            stopAuto();
            if (autoDelay > 0) {
                autoTimer = setInterval(scrollNext, autoDelay);
            }
        };

        const stopAuto = () => {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                scrollNext();
                stopAuto();
                startAuto();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                scrollPrev();
                stopAuto();
                startAuto();
            });
        }

        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);
        container.addEventListener('touchstart', stopAuto, { passive: true });
        container.addEventListener('touchend', startAuto, { passive: true });

        // Start auto-scroll
        startAuto();
    }

    async function loadCredlyBadges() {
        if (!credlyContainer) return;

        try {
            const response = await fetch('credly-badges.json?v=' + Date.now());
            if (response.ok) {
                const badges = await response.json();
                if (Array.isArray(badges) && badges.length > 0) {
                    renderCredlyBadges(badges);
                    return;
                }
            }
        } catch (err) {
            console.log('Credly badges loaded from static markup, dynamic sync ready:', err);
        }

        // Fallback: initialize infinite carousel on static markup
        setupInfiniteCarousel('credly-badges-grid', 'credly-prev', 'credly-next', 3800);
    }

    loadCredlyBadges();

    // Initialize Projects & Achievements Infinite Carousel
    setupInfiniteCarousel('proyectos-track', 'proyectos-prev', 'proyectos-next', 4400);

    // Initialize Lucide Icons if available
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
