/* ==========================================================================
   ELITE RENTALS DUBAI - APPLICATION JAVASCRIPT
   Interactivity, Currency Conversion, Live Booking Calculator, Search & Filters
   ========================================================================== */

(function () {
  'use strict';

  // --- Currency Configuration ---
  const CURRENCY_RATES = {
    AED: { symbol: 'AED', rate: 1.0, format: (val) => `AED ${Math.round(val).toLocaleString()}` },
    USD: { symbol: '$', rate: 0.2723, format: (val) => `$${Math.round(val * 0.2723).toLocaleString()}` },
    EUR: { symbol: '€', rate: 0.2520, format: (val) => `€${Math.round(val * 0.2520).toLocaleString()}` },
    GBP: { symbol: '£', rate: 0.2155, format: (val) => `£${Math.round(val * 0.2155).toLocaleString()}` }
  };

  let currentCurrency = localStorage.getItem('erd_currency') || 'AED';
  let activeYachtForModal = null;
  let currentGuestCount = 2;

  // --- DOM Elements ---
  const currencyBtn = document.getElementById('currency-btn');
  const currencyMenu = document.getElementById('currency-menu');
  const currencyDisplay = document.getElementById('current-currency-display');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const bookingModal = document.getElementById('booking-modal');
  const bookingModalClose = document.getElementById('booking-modal-close');

  // --- Initialize App ---
  document.addEventListener('DOMContentLoaded', () => {
    initCurrencySwitcher();
    initCharterTypeSwitch();
    initGuestSteppers();
    initFleetRendering();
    initCarouselScrollArrows();
    initSearchFilter();
    initFAQAccordion();
    initMobileDrawer();
    initBookingCalculator();
  });

  // ==========================================================================
  // 1. CURRENCY SWITCHER
  // ==========================================================================
  function initCurrencySwitcher() {
    if (currencyDisplay) currencyDisplay.textContent = currentCurrency;

    if (currencyBtn && currencyMenu) {
      currencyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currencyMenu.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!currencyMenu.contains(e.target) && e.target !== currencyBtn) {
          currencyMenu.classList.remove('open');
        }
      });

      const options = currencyMenu.querySelectorAll('.currency-option');
      options.forEach((opt) => {
        opt.addEventListener('click', () => {
          const selected = opt.getAttribute('data-curr');
          if (selected && CURRENCY_RATES[selected]) {
            currentCurrency = selected;
            localStorage.setItem('erd_currency', currentCurrency);
            if (currencyDisplay) currencyDisplay.textContent = currentCurrency;
            currencyMenu.classList.remove('open');
            options.forEach(o => o.classList.toggle('active', o === opt));
            updateAllDisplayedPrices();
          }
        });
      });
    }
  }

  function formatPrice(aedAmount) {
    const config = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.AED;
    return config.format(aedAmount);
  }

  function updateAllDisplayedPrices() {
    document.querySelectorAll('[data-aed-price]').forEach((el) => {
      const aed = parseFloat(el.getAttribute('data-aed-price')) || 0;
      el.textContent = formatPrice(aed);
    });

    if (activeYachtForModal) {
      recalculateModalTotal();
    }
  }

  // ==========================================================================
  // 2. CHARTER TYPE & SEARCH PILL
  // ==========================================================================
  function initCharterTypeSwitch() {
    const typeButtons = document.querySelectorAll('.charter-type-btn');
    typeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  function initGuestSteppers() {
    const decBtn = document.getElementById('guest-dec-btn');
    const incBtn = document.getElementById('guest-inc-btn');
    const countDisplay = document.getElementById('guest-count-display');

    if (decBtn && incBtn && countDisplay) {
      decBtn.addEventListener('click', () => {
        if (currentGuestCount > 1) {
          currentGuestCount--;
          countDisplay.textContent = currentGuestCount;
        }
      });
      incBtn.addEventListener('click', () => {
        if (currentGuestCount < 100) {
          currentGuestCount++;
          countDisplay.textContent = currentGuestCount;
        }
      });
    }
  }

  function initSearchFilter() {
    const searchBtn = document.getElementById('btn-search-fleet');
    const priceFilter = document.getElementById('search-price-filter');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const targetPriceVal = priceFilter ? parseInt(priceFilter.value, 10) : 0;
        
        // Filter fleet cards
        const allCards = document.querySelectorAll('.yacht-card');
        let matchedCount = 0;

        allCards.forEach((card) => {
          const cardPrice = parseInt(card.getAttribute('data-price-aed'), 10) || 0;
          const cardCap = parseInt(card.getAttribute('data-guest-cap'), 10) || 100;
          
          let matchesPrice = true;
          if (targetPriceVal === 1) matchesPrice = cardPrice < 1000;
          else if (targetPriceVal === 2) matchesPrice = cardPrice >= 1000 && cardPrice <= 2500;
          else if (targetPriceVal === 3) matchesPrice = cardPrice > 2500 && cardPrice <= 5000;
          else if (targetPriceVal === 4) matchesPrice = cardPrice > 5000 && cardPrice <= 10000;
          else if (targetPriceVal === 5) matchesPrice = cardPrice > 10000;

          const matchesGuests = cardCap >= currentGuestCount;

          if (matchesPrice && matchesGuests) {
            card.style.display = '';
            matchedCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Smooth scroll down to first fleet section
        const fleetSection = document.getElementById('fleet-section');
        if (fleetSection) {
          fleetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // ==========================================================================
  // 3. FLEET RENDERING & CARD CAROUSELS
  // ==========================================================================
  function initFleetRendering() {
    if (typeof YACHTS_DATA === 'undefined' || !Array.isArray(YACHTS_DATA)) {
      console.warn('YACHTS_DATA is not available.');
      return;
    }

    const categories = [
      { id: 'comfort', containerId: 'track-comfort' },
      { id: 'comfort-plus', containerId: 'track-comfort-plus' },
      { id: 'business', containerId: 'track-business' },
      { id: 'first-class', containerId: 'track-first-class' },
      { id: 'exclusive', containerId: 'track-exclusive' }
    ];

    categories.forEach(({ id, containerId }) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const filteredYachts = YACHTS_DATA.filter(y => y.categorySlug === id);
      container.innerHTML = '';

      filteredYachts.forEach((yacht) => {
        const card = createYachtCard(yacht);
        container.appendChild(card);
      });
    });
  }

  function createYachtCard(yacht) {
    const card = document.createElement('div');
    card.className = 'yacht-card';
    card.setAttribute('data-id', yacht.id);
    card.setAttribute('data-price-aed', yacht.priceAED);
    card.setAttribute('data-guest-cap', yacht.guestCapacity);

    let currentPhotoIdx = 0;
    const gallery = (yacht.gallery && yacht.gallery.length > 0) ? yacht.gallery : [yacht.coverImage];

    card.innerHTML = `
      <div class="yacht-media-container">
        <img src="${gallery[0]}" alt="${yacht.name}" class="yacht-img" loading="lazy">
        
        <button type="button" class="card-nav-arrow prev" aria-label="Previous Photo">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5l-5 5 5 5"></path></svg>
        </button>
        <button type="button" class="card-nav-arrow next" aria-label="Next Photo">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 5l5 5-5 5"></path></svg>
        </button>

        <div class="card-dots">
          ${gallery.map((_, i) => `<span class="card-dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
        </div>

        <button type="button" class="yacht-share-btn" title="Share ${yacht.name}">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v13M7 8l5-5 5 5M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/></svg>
        </button>

        <span class="yacht-photo-count">${yacht.photosCount} photos</span>
      </div>

      <div class="yacht-info-wrap">
        <div class="yacht-name-row">
          <h4 class="yacht-card-title">${yacht.name}</h4>
          <span class="yacht-card-cat">${yacht.category}</span>
        </div>
        <p class="yacht-card-specs">${yacht.length} · ${yacht.guests}</p>
        
        <div class="yacht-card-price-row">
          <span class="yacht-price-text">
            <span class="from-label">from</span> 
            <span class="yacht-price-val" data-aed-price="${yacht.priceAED}">${formatPrice(yacht.priceAED)}</span> 
            <small style="color:var(--gray);font-weight:600">/ hour</small>
          </span>
          <span class="yacht-vat-note">· VAT excluded</span>
        </div>

        <div class="yacht-card-actions">
          <button type="button" class="btn-card-quote" data-quote-btn="${yacht.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.52 3.48A11.87 11.87 0 0 0 12 0a11.94 11.94 0 0 0-10.3 17.94L0 24l6.24-1.63A11.93 11.93 0 0 0 12 23.94c6.63 0 12-5.37 12-12a11.87 11.87 0 0 0-3.48-8.46zM12 22.02a10.06 10.06 0 0 1-5.14-1.4l-.37-.22-3.7.97.99-3.61-.24-.37A10.05 10.05 0 1 1 22.05 12 10 10 0 0 1 12 22.02z"/></svg>
            Quick Quote
          </button>
          <button type="button" class="btn-card-details" data-details-btn="${yacht.id}">
            Details
          </button>
        </div>
      </div>
    `;

    // Photo Nav handlers
    const imgEl = card.querySelector('.yacht-img');
    const dots = card.querySelectorAll('.card-dot');
    const prevBtn = card.querySelector('.card-nav-arrow.prev');
    const nextBtn = card.querySelector('.card-nav-arrow.next');

    function updateCardPhoto(newIdx) {
      currentPhotoIdx = (newIdx + gallery.length) % gallery.length;
      imgEl.src = gallery[currentPhotoIdx];
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentPhotoIdx);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCardPhoto(currentPhotoIdx - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCardPhoto(currentPhotoIdx + 1);
      });
    }

    // Share button
    const shareBtn = card.querySelector('.yacht-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navigator.share) {
          navigator.share({
            title: yacht.name,
            text: `Check out ${yacht.name} on Elite Rentals Dubai!`,
            url: window.location.href
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert(`Link to ${yacht.name} copied to clipboard!`);
        }
      });
    }

    // Modal buttons
    const quoteBtn = card.querySelector(`[data-quote-btn="${yacht.id}"]`);
    const detailsBtn = card.querySelector(`[data-details-btn="${yacht.id}"]`);
    
    [quoteBtn, detailsBtn].forEach(b => {
      if (b) {
        b.addEventListener('click', () => openBookingModal(yacht));
      }
    });

    return card;
  }

  function initCarouselScrollArrows() {
    document.querySelectorAll('.carousel-arrow-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTrackId = btn.getAttribute('data-target-track');
        const track = document.getElementById(targetTrackId);
        if (!track) return;

        const isNext = btn.classList.contains('next');
        const scrollAmount = track.clientWidth * 0.75;
        track.scrollBy({
          left: isNext ? scrollAmount : -scrollAmount,
          behavior: 'smooth'
        });
      });
    });
  }

  // ==========================================================================
  // 4. BOOKING CALCULATOR & MODAL
  // ==========================================================================
  function openBookingModal(yacht) {
    activeYachtForModal = yacht;
    if (!bookingModal) return;

    // Populate modal fields
    const titleEl = document.getElementById('modal-yacht-name');
    const imgEl = document.getElementById('modal-gallery-img');
    const lengthEl = document.getElementById('modal-yacht-length');
    const capEl = document.getElementById('modal-yacht-capacity');
    const descEl = document.getElementById('modal-yacht-description');

    if (titleEl) titleEl.textContent = yacht.name;
    if (imgEl) imgEl.src = yacht.coverImage;
    if (lengthEl) lengthEl.textContent = `Length: ${yacht.length}`;
    if (capEl) capEl.textContent = `Guests: up to ${yacht.guestCapacity}`;
    if (descEl) descEl.textContent = yacht.description;

    // Set today's date in picker
    const dateInput = document.getElementById('modal-charter-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
      dateInput.min = today;
    }

    // Reset duration to 3 hours
    const durationInput = document.getElementById('modal-charter-duration');
    if (durationInput) durationInput.value = '3';

    // Reset checkboxes
    document.querySelectorAll('.addon-check').forEach(c => c.checked = false);

    recalculateModalTotal();

    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';
      activeYachtForModal = null;
    }
  }

  function initBookingCalculator() {
    if (bookingModalClose) {
      bookingModalClose.addEventListener('click', closeBookingModal);
    }

    if (bookingModal) {
      bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeBookingModal();
      });
    }

    // Listen to changes in duration, guests, add-ons
    const durationInput = document.getElementById('modal-charter-duration');
    const guestsInput = document.getElementById('modal-charter-guests');
    const addonChecks = document.querySelectorAll('.addon-check');

    if (durationInput) durationInput.addEventListener('change', recalculateModalTotal);
    if (guestsInput) guestsInput.addEventListener('change', recalculateModalTotal);
    addonChecks.forEach(ch => ch.addEventListener('change', recalculateModalTotal));

    // WhatsApp action button
    const waBtn = document.getElementById('btn-modal-whatsapp-submit');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        if (!activeYachtForModal) return;

        const dateInput = document.getElementById('modal-charter-date');
        const durInput = document.getElementById('modal-charter-duration');
        const guestInput = document.getElementById('modal-charter-guests');
        const totalEl = document.getElementById('modal-calc-total');

        const date = dateInput ? dateInput.value : 'Soon';
        const hours = durInput ? durInput.value : '3';
        const guests = guestInput ? guestInput.value : '2';
        const totalText = totalEl ? totalEl.textContent : '';

        // Collect add-ons
        const selectedAddons = [];
        addonChecks.forEach(ch => {
          if (ch.checked) selectedAddons.push(ch.value);
        });
        const addonText = selectedAddons.length > 0 ? ` with ${selectedAddons.join(', ')}` : '';

        const msg = encodeURIComponent(
          `Hi Elite Rentals Dubai! I'd like to book ${activeYachtForModal.name} for ${hours} hours on ${date} for ${guests} guests${addonText}. Estimated Quote: ${totalText}. Is this yacht available?`
        );

        window.open(`https://wa.me/971504258131?text=${msg}`, '_blank');
      });
    }
  }

  function recalculateModalTotal() {
    if (!activeYachtForModal) return;

    const durInput = document.getElementById('modal-charter-duration');
    const hours = durInput ? parseInt(durInput.value, 10) || 1 : 1;

    let baseRateAED = activeYachtForModal.priceAED * hours;

    // Addons
    let addonsAED = 0;
    document.querySelectorAll('.addon-check:checked').forEach((ch) => {
      addonsAED += parseInt(ch.getAttribute('data-price-aed'), 10) || 0;
    });

    const totalAED = baseRateAED + addonsAED;
    const totalEl = document.getElementById('modal-calc-total');
    if (totalEl) {
      totalEl.textContent = formatPrice(totalAED);
    }
  }

  // ==========================================================================
  // 5. FAQ ACCORDION
  // ==========================================================================
  function initFAQAccordion() {
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach((card) => {
      const btn = card.querySelector('.faq-question-btn');
      const pane = card.querySelector('.faq-answer-pane');

      if (btn && pane) {
        btn.addEventListener('click', () => {
          const isOpen = card.classList.contains('active');

          // Close others
          faqCards.forEach(c => {
            c.classList.remove('active');
            const p = c.querySelector('.faq-answer-pane');
            if (p) p.style.maxHeight = null;
          });

          if (!isOpen) {
            card.classList.add('active');
            pane.style.maxHeight = pane.scrollHeight + 30 + 'px';
          }
        });
      }
    });

    // Open first FAQ by default
    if (faqCards.length > 0) {
      const firstCard = faqCards[0];
      const firstPane = firstCard.querySelector('.faq-answer-pane');
      firstCard.classList.add('active');
      if (firstPane) firstPane.style.maxHeight = firstPane.scrollHeight + 30 + 'px';
    }
  }

  // ==========================================================================
  // 6. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  function initMobileDrawer() {
    if (mobileMenuToggle && mobileDrawer) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    if (mobileDrawerClose && mobileDrawer) {
      mobileDrawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    if (mobileDrawer) {
      mobileDrawer.addEventListener('click', (e) => {
        if (e.target === mobileDrawer) {
          mobileDrawer.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    // Close on navigation link click
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer) {
          mobileDrawer.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

})();
