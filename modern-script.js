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
    const sections = document.querySelectorAll('section, footer');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

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

    // Initialize Lucide Icons if available
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
