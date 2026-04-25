document.addEventListener('DOMContentLoaded', () => {
    // 1. BRAND CAROUSEL (Home)
    if (document.getElementById('brandCarousel')) initBrandCarousel();
    
    // 2. FILTERS (Home)
    if (document.querySelector('[data-filter-group="home"]')) initHomeFilters();

    // 3. FILTERS & SEARCH (Cars)
    if (document.querySelector('[data-filter-group="cars"]')) {
        initCarsFilters();
        initSearchInput();
    }

    // 4. MODAL LOGIC (Cars)
    setupModal();

    // 5. GLOBAL ANIMATIONS
    setupAnimations();
});

function initBrandCarousel() {
    const brands = [
        { name: 'Bugatti', img: 'Bugatti logo.png' }, { name: 'Ferrari', img: 'Ferrari logo.png' },
        { name: 'Lamborghini', img: 'Lamborghini logo.png' }, { name: 'Aston Martin', img: 'Aston Martin logo.png' },
        { name: 'Maserati', img: 'Maserati logo.png' }, { name: 'McLaren', img: 'McLaren logo.png' },
        { name: 'Audi', img: 'Audi logo.png' }, { name: 'Rolls-Royce', img: 'Rolls Royce logo.png' },
        { name: 'Bentley', img: 'Bentley logo.png' }, { name: 'Lexus', img: 'Lexus logo.png' },
        { name: 'Porsche', img: 'Porsche logo.png' }, { name: 'BMW', img: 'Bmw logo.png' },
        { name: 'Mercedes', img: 'Mercedes logo.png' }, { name: 'Tesla', img: 'Tesla logo.png' },
    ];
    const carousel = document.getElementById('brandCarousel');
    carousel.innerHTML = '';
    brands.forEach(brand => {
        const item = document.createElement('div');
        item.className = 'brand-item animate-item';
        item.innerHTML = `<img class="brand-logo-img" src="${brand.img}" alt="${brand.name}" loading="lazy"><span class="brand-name">${brand.name}</span>`;
        carousel.appendChild(item);
    });
    brands.forEach(brand => {
        const item = document.createElement('div');
        item.className = 'brand-item animate-item';
        item.innerHTML = `<img class="brand-logo-img" src="${brand.img}" alt="${brand.name}" loading="lazy"><span class="brand-name">${brand.name}</span>`;
        carousel.appendChild(item);
    });
}

function initHomeFilters() {
    const filterGroup = document.querySelector('[data-filter-group="home"]');
    if (!filterGroup) return;
    const buttons = filterGroup.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#fleetGrid .fleet-card');
    const noResults = document.getElementById('noResultsHome');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            let visibleCount = 0;
            cards.forEach(card => {
                const types = card.getAttribute('data-type') || '';
                const shouldShow = filter === 'all' || types.includes(filter);
                if (shouldShow) { card.classList.remove('hidden-card'); visibleCount++; } else { card.classList.add('hidden-card'); }
            });
            if (noResults) noResults.classList.toggle('show', visibleCount === 0);
        });
    });
}

function initCarsFilters() {
    const filterGroup = document.querySelector('[data-filter-group="cars"]');
    if (!filterGroup) return;
    const buttons = filterGroup.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#carsGrid .car-detail-card');
    const noResults = document.getElementById('noResultsCars');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            let visibleCount = 0;
            cards.forEach(card => {
                const types = card.getAttribute('data-type') || '';
                const shouldShow = filter === 'all' || types.includes(filter);
                if (shouldShow) { card.classList.remove('hidden-card'); visibleCount++; } else { card.classList.add('hidden-card'); }
            });
            if (noResults) noResults.classList.toggle('show', visibleCount === 0);
        });
    });
}

function initSearchInput() {
    const input = document.getElementById('carSearchInput');
    if (input) {
        input.addEventListener('input', searchCars);
        input.addEventListener('keydown', function(e) { if (e.key === 'Enter') searchCars(); });
    }
}

function searchCars() {
    const query = document.getElementById('carSearchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('#carsGrid .car-detail-card');
    const noResults = document.getElementById('noResultsCars');
    const activeFilter = document.querySelector('[data-filter-group="cars"] .filter-btn.active');
    const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    let visibleCount = 0;
    cards.forEach(card => {
        const name = card.querySelector('.car-detail-info h3').textContent.toLowerCase();
        const types = card.getAttribute('data-type') || '';
        const matchFilter = filter === 'all' || types.includes(filter);
        const matchSearch = query === '' || name.includes(query);
        if (matchFilter && matchSearch) { card.classList.remove('hidden-card'); visibleCount++; } else { card.classList.add('hidden-card'); }
    });
    if (noResults) noResults.classList.toggle('show', visibleCount === 0);
}

function setupModal() {
    const modal = document.getElementById('rentalModal');
    if (!modal) return;
    
    document.querySelectorAll('.btn-rent').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.car-detail-card');
            const carName = card.getAttribute('data-name') || card.querySelector('.car-detail-info h3').textContent;
            const carPrice = card.getAttribute('data-price') || card.querySelector('.car-price-tag').textContent;
            const carImg = card.getAttribute('data-img') || card.querySelector('.car-detail-img').src;
            document.getElementById('modalCarName').textContent = carName;
            document.getElementById('modalCarPrice').textContent = carPrice;
            document.getElementById('modalCarImg').src = carImg;
            document.getElementById('rentalCarInput').value = carName;
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('rentalStart').setAttribute('min', today);
            document.getElementById('rentalEnd').setAttribute('min', today);
            document.getElementById('modalResponse').className = 'modal-response';
            document.getElementById('modalResponse').style.display = 'none';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    document.getElementById('modalCarInfo').parentElement.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    modal.addEventListener('click', function(e) { if (e.target === this) { this.classList.remove('active'); document.body.style.overflow = ''; } });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && modal.classList.contains('active')) { modal.classList.remove('active'); document.body.style.overflow = ''; } });

    const form = document.getElementById('rentalForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const response = document.getElementById('modalResponse');
        const submitBtn = this.querySelector('.modal-submit');
        submitBtn.textContent = '⏳ Envoi en cours...';
        submitBtn.disabled = true;
        try {
            const formData = new FormData(this);
            const res = await fetch(this.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
            if (res.ok) {
                response.className = 'modal-response success';
                response.textContent = '🎉 Réservation envoyée avec succès !';
                this.reset();
                setTimeout(() => { modal.classList.remove('active'); document.body.style.overflow = ''; }, 3000);
            } else { throw new Error('Erreur'); }
        } catch (err) {
            response.className = 'modal-response error';
            response.textContent = '❌ Erreur lors de l\'envoi.';
        } finally {
            submitBtn.innerHTML = '🔑 Confirmer la réservation';
            submitBtn.disabled = false;
        }
    });
}

function isInViewport(el, threshold = 0.1) {
    const rect = el.getBoundingClientRect();
    const wh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < wh * (1 - threshold) && rect.bottom > wh * threshold;
}

function setupAnimations() {
    function animateOnScroll() {
        document.querySelectorAll('.animate-item, .animate-left').forEach(el => el.classList.toggle('visible', isInViewport(el)));
        
        // Hero specific
        const h = document.getElementById('heroTitle');
        if (h) {
            const parent = h.parentElement;
            if (isInViewport(parent, 0.2)) {
                h.classList.add('visible');
                document.getElementById('heroSubtitle').classList.add('visible');
                document.getElementById('heroImage').classList.add('visible');
                document.querySelector('.hero-image').classList.add('visible-shadow');
            } else {
                h.classList.remove('visible');
                document.getElementById('heroSubtitle').classList.remove('visible');
                document.getElementById('heroImage').classList.remove('visible');
                document.querySelector('.hero-image').classList.remove('visible-shadow');
            }
        }

        // Page Hero specific
        const ph = document.querySelector('.page-hero h1');
        if (ph) {
            if (isInViewport(ph.parentElement, 0.2)) {
                ph.classList.add('visible');
                ph.parentElement.querySelector('p').classList.add('visible');
                ph.parentElement.querySelector('.hero-badge').classList.add('visible');
            } else {
                ph.classList.remove('visible');
                ph.parentElement.querySelector('p').classList.remove('visible');
                if (ph.parentElement.querySelector('.hero-badge')) ph.parentElement.querySelector('.hero-badge').classList.remove('visible');
            }
        }

        // App Mockups
        const am = document.getElementById('appMockups');
        if (am && isInViewport(am, 0.1)) {
            document.querySelectorAll('.phone').forEach(p => p.classList.add('visible'));
            document.getElementById('appText').classList.add('visible');
        } else if (am) {
            document.querySelectorAll('.phone').forEach(p => p.classList.remove('visible'));
            document.getElementById('appText').classList.remove('visible');
        }

        // Delays
        document.querySelectorAll('.fleet-card.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.04) + 's');
        document.querySelectorAll('.stat-card.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.04) + 's');
        document.querySelectorAll('.team-card.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.04) + 's');
        document.querySelectorAll('.value-card.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.04) + 's');
        document.querySelectorAll('.feature-card.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.04) + 's');
        document.querySelectorAll('.car-detail-card.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.03) + 's');
        document.querySelectorAll('.feature-detail-card.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.04) + 's');
        document.querySelectorAll('.timeline-item.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.06) + 's');
        document.querySelectorAll('.faq-item.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.03) + 's');
        document.querySelectorAll('.brand-item.visible').forEach((c, idx) => c.style.transitionDelay = (idx * 0.02) + 's');
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                document.getElementById('scrollProgress').style.width = ((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100) + '%';
                animateOnScroll();
                document.getElementById('backToTop').classList.toggle('visible', window.pageYOffset > 300);
                document.getElementById('navbar').classList.toggle('scrolled', window.pageYOffset > 50);
                // Counters
                document.querySelectorAll('.stat-number[data-count]').forEach(el => {
                    if (isInViewport(el) && !el.dataset.animated) {
                        el.dataset.animated = 'true';
                        const target = parseInt(el.dataset.count), duration = 1500, start = performance.now();
                        function update(now) { const p = Math.min((now - start) / duration, 1), eased = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(eased * target).toLocaleString('fr-FR'); if (p < 1) requestAnimationFrame(update); }
                        requestAnimationFrame(update);
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // FAQ
    document.querySelectorAll('.faq-question').forEach(el => {
        el.addEventListener('click', function() {
            const item = this.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const response = document.getElementById('responseMessage');
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = '⏳ Envoi en cours...';
            submitBtn.disabled = true;
            try {
                const formData = new FormData(this);
                const res = await fetch(this.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                if (res.ok) {
                    response.className = 'success';
                    response.textContent = '🎉 Message envoyé avec succès !';
                    this.reset();
                } else { throw new Error('Erreur'); }
            } catch (err) {
                response.className = 'error';
                response.textContent = '❌ Erreur lors de l\'envoi.';
            } finally {
                submitBtn.innerHTML = '📩 Envoyer le message';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Mobile Menu
    window.toggleMobileMenu = function() { document.getElementById('mobileNav').classList.toggle('open'); }

    // Trigger initial
    setTimeout(animateOnScroll, 100);
}