(function(){
    // Global state for audio
    window.audioManager = {
        audio: null,
        isPlaying: false,
        currentSrc: 'assets/audio/bg-music.mp3'
    };

    const doc = document.documentElement;
    const themeBtn = document.getElementById('themeToggle');
    const audioBtn = document.getElementById('audioToggle');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    // Initialize audio
    function initAudio() {
        // Check if audio already exists in global state
        if (!window.audioManager.audio) {
            window.audioManager.audio = new Audio(window.audioManager.currentSrc);
            window.audioManager.audio.loop = true;
            window.audioManager.audio.volume = 0.3;
            
            // Load saved audio state
            const savedAudioState = localStorage.getItem('audioPlaying');
            if (savedAudioState === 'true') {
                window.audioManager.isPlaying = true;
                playAudio();
            }
        }
        
        updateAudioButton();
    }

    // Play audio with error handling
    function playAudio() {
        if (!window.audioManager.audio) return;
        
        const playPromise = window.audioManager.audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    window.audioManager.isPlaying = true;
                    localStorage.setItem('audioPlaying', 'true');
                    updateAudioButton();
                })
                .catch(error => {
                    console.log('Audio play failed:', error);
                    window.audioManager.isPlaying = false;
                    localStorage.setItem('audioPlaying', 'false');
                    updateAudioButton();
                });
        }
    }

    // Pause audio
    function pauseAudio() {
        if (!window.audioManager.audio) return;
        
        window.audioManager.audio.pause();
        window.audioManager.isPlaying = false;
        localStorage.setItem('audioPlaying', 'false');
        updateAudioButton();
    }

    // Toggle audio
    function toggleAudio() {
        if (window.audioManager.isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    // Update audio button appearance
    function updateAudioButton() {
        if (!audioBtn) return;
        
        if (window.audioManager.isPlaying) {
            audioBtn.textContent = '🔊';
            audioBtn.setAttribute('aria-label', 'مکث موسیقی');
            audioBtn.style.background = 'var(--green)';
            audioBtn.style.color = 'white';
        } else {
            audioBtn.textContent = '🔇';
            audioBtn.setAttribute('aria-label', 'پخش موسیقی');
            audioBtn.style.background = '';
            audioBtn.style.color = '';
        }
    }

    // Load theme with smooth transition
    function loadTheme() {
        const saved = localStorage.getItem('theme');
        if(saved) {
            doc.setAttribute('data-theme', saved);
            if(themeBtn) {
                themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙';
            }
        }
        
        setTimeout(() => {
            doc.classList.add('theme-loaded');
        }, 300);
    }

    // Theme toggle with animation
    function toggleTheme() {
        const cur = doc.getAttribute('data-theme');
        const next = cur === 'dark' ? '' : 'dark';
        
        doc.classList.add('theme-transition');
        
        setTimeout(() => {
            if(next) {
                doc.setAttribute('data-theme', next);
            } else {
                doc.removeAttribute('data-theme');
            }
            localStorage.setItem('theme', next);
            
            if(themeBtn) {
                themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
                themeBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    themeBtn.style.transform = 'scale(1)';
                }, 200);
            }
            
            setTimeout(() => {
                doc.classList.remove('theme-transition');
            }, 300);
        }, 50);
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('mobile-visible');
        
        mobileMenuBtn.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
    }

    // Enhanced scroll reveal
    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'all 0.8s cubic-bezier(0.2, 0.9, 0.3, 1)';
                    
                    if(entry.target.classList.contains('service-card') || 
                       entry.target.classList.contains('proj')) {
                        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                        entry.target.style.transitionDelay = delay + 'ms';
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.anim-fade, .anim-slide-left, .anim-slide-right, .anim-zoom, .card, .proj, .gallery-item, .quote').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    // Form handling with enhanced UX
    function initForms() {
        const form = document.getElementById('contactForm');
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'در حال ارسال...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    const successMsg = document.createElement('div');
                    successMsg.style.cssText = `
                        background: linear-gradient(135deg, var(--green), var(--gold));
                        color: white;
                        padding: 15px;
                        border-radius: 10px;
                        margin-top: 15px;
                        text-align: center;
                        animation: fadeInUp 0.6s ease;
                    `;
                    successMsg.textContent = 'پیام شما با موفقیت ثبت شد! به زودی با شما تماس می‌گیریم.';
                    form.appendChild(successMsg);
                    
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    setTimeout(() => {
                        successMsg.remove();
                    }, 5000);
                }, 2000);
            });
        }
    }

    // Add CSS for theme transitions
    const style = document.createElement('style');
    style.textContent = `
        .theme-transition * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }
        
        .theme-loaded {
            transition: all 0.3s ease;
        }
        
        /* Improved mobile header */
        @media (max-width: 900px) {
            .header-inner {
                display: grid !important;
                grid-template-columns: auto 1fr auto;
                align-items: center;
                gap: 10px;
            }
            
            .brand {
                justify-self: start;
            }
            
            .header-actions {
                justify-self: end;
                display: flex;
                gap: 5px;
            }
            
            .mobile-menu-btn {
                justify-self: center;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        loadTheme();
        initAudio();
        initScrollReveal();
        initForms();
        
        // Event listeners
        if(themeBtn) {
            themeBtn.addEventListener('click', toggleTheme);
        }
        
        if(audioBtn) {
            audioBtn.addEventListener('click', toggleAudio);
            // Add touch event for mobile
            audioBtn.addEventListener('touchstart', toggleAudio);
        }
        
        if(mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                if(nav.classList.contains('mobile-visible')) {
                    toggleMobileMenu();
                }
            });
        });

        // Auto-play audio on user interaction (if previously playing)
        function attemptAutoPlay() {
            if (window.audioManager.isPlaying && window.audioManager.audio.paused) {
                playAudio();
            }
        }

        // Add event listeners for user interaction
        document.addEventListener('click', attemptAutoPlay, { once: true });
        document.addEventListener('touchstart', attemptAutoPlay, { once: true });
        document.addEventListener('keydown', attemptAutoPlay, { once: true });
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (window.audioManager.audio) {
            if (document.hidden) {
                // Page is hidden, pause audio
                if (!window.audioManager.audio.paused) {
                    window.audioManager.audio.pause();
                    // Store that we need to resume when visible again
                    window.audioManager.wasPlaying = true;
                }
            } else {
                // Page is visible again, resume if it was playing
                if (window.audioManager.wasPlaying && window.audioManager.isPlaying) {
                    playAudio();
                    window.audioManager.wasPlaying = false;
                }
            }
        }
    });


    // Error handling
    window.addEventListener('error', (e) => {
        console.error('Error:', e.error);
    });
})();

// فیلتر گالری نمونه‌کارها
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // تابع برای فیلتر کردن گالری
    function filterGallery(category) {
        galleryItems.forEach(item => {
            // ابتدا همه آیتم‌ها را مخفی می‌کنیم
            item.classList.add('fade-out');
            
            setTimeout(() => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                    item.classList.add('fade-in');
                    item.classList.remove('fade-out');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('fade-in');
                }
            }, 200);
        });
    }
    
    // اضافه کردن event listener برای تب‌ها
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // حذف کلاس active از همه دکمه‌ها
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // اضافه کردن کلاس active به دکمه کلیک شده
            this.classList.add('active');
            
            // فیلتر کردن گالری بر اساس دسته‌بندی
            const category = this.getAttribute('data-tab');
            filterGallery(category);
        });
    });
    
    // فعال کردن گالری همه به صورت پیش‌فرض
    filterGallery('all');
});

// اگر نیاز به modal برای نمایش بزرگتر عکس‌ها دارید، این کد را اضافه کنید:
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            // ایجاد modal برای نمایش عکس
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const modalImg = document.createElement('img');
            modalImg.src = imgSrc;
            modalImg.alt = imgAlt;
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 12px;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            `;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // انیمیشن باز شدن
            setTimeout(() => {
                modal.style.opacity = '1';
                modalImg.style.transform = 'scale(1)';
            }, 10);
            
            // بستن modal با کلیک
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(modal);
                    }, 300);
                }
            });
            
            // بستن modal با دکمه ESC
            document.addEventListener('keydown', function closeModal(e) {
                if (e.key === 'Escape') {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        if (modal.parentNode) {
                            document.body.removeChild(modal);
                        }
                    }, 300);
                    document.removeEventListener('keydown', closeModal);
                }
            });
        });
    });
});