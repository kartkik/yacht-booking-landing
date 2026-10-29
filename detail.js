/* ==========================================================================
   ELITE RENTALS KERALA - YACHT DETAIL PAGE CONTROLLER
   Matching https://dubaiyachtbooking.com/yachts/...
   ========================================================================== */

(function () {
  'use strict';

  // --- Currency Configuration ---
  const CURRENCY_RATES = {
    INR: { symbol: '₹', rate: 1.0, format: (val) => `₹${Math.round(val).toLocaleString('en-IN')}` },
    USD: { symbol: '$', rate: 0.012, format: (val) => `$${Math.round(val * 0.012).toLocaleString()}` },
    AED: { symbol: 'AED', rate: 0.044, format: (val) => `AED ${Math.round(val * 0.044).toLocaleString()}` },
    EUR: { symbol: '€', rate: 0.011, format: (val) => `€${Math.round(val * 0.011).toLocaleString()}` },
    GBP: { symbol: '£', rate: 0.0094, format: (val) => `£${Math.round(val * 0.0094).toLocaleString()}` }
  };

  function getCurrentCurrency() {
    return localStorage.getItem('erk_currency') || 'INR';
  }

  function formatPrice(inrVal) {
    const curr = getCurrentCurrency();
    const config = CURRENCY_RATES[curr] || CURRENCY_RATES.INR;
    return config.format(inrVal);
  }

  // --- State ---
  let activeYacht = null;
  let activeGallery = [];
  let currentLightboxIdx = 0;

  // --- Init on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    initDetailPage();
  });

  function initDetailPage() {
    if (typeof YACHTS_DATA === 'undefined' || !Array.isArray(YACHTS_DATA) || YACHTS_DATA.length === 0) {
      console.warn('YACHTS_DATA is not loaded.');
      return;
    }

    // Parse URL parameter ?id=...
    const urlParams = new URLSearchParams(window.location.search);
    const yachtId = urlParams.get('id');

    activeYacht = YACHTS_DATA.find(y => y.id === yachtId) || YACHTS_DATA[0];

    // Build rich gallery array (ensure at least 5 photos)
    const rawGallery = (activeYacht.gallery && activeYacht.gallery.length > 0)
      ? [...activeYacht.gallery]
      : [activeYacht.coverImage];

    // Pad gallery with authentic Kerala yacht photos if less than 5
    const fallbackPhotos = [
      "./assets/kochi-yacht-sunset.jpg",
      "./assets/kerala-yacht-salon.jpg",
      "./assets/kerala-yacht-dining.jpg",
      "./assets/hero-kerala-yacht.jpg",
      "./assets/bolgatty-marina-yacht.jpg",
      "./assets/vembanad-catamaran.jpg",
      "./assets/marari-coastal-yacht.jpg",
      "./assets/kumarakom-sunset-yacht.jpg",
      "./assets/alleppey-heritage-yacht.jpg",
      "./assets/arabian-sea-superyacht.jpg"
    ];

    activeGallery = [...rawGallery];
    let padIdx = 0;
    while (activeGallery.length < 5 && padIdx < fallbackPhotos.length) {
      const p = fallbackPhotos[padIdx++];
      if (!activeGallery.includes(p)) activeGallery.push(p);
    }

    renderYachtHeader();
    renderGallery();
    renderSpecsAndNarrative();
    renderRatesTable();
    renderCalculator();
    renderRelatedYachts();
    initLightbox();
    initShareButton();

    // Listen to currency changes from top navbar
    document.querySelectorAll('.currency-option, .mobile-curr-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          renderRatesTable();
          recalculateSidebarTotal();
        }, 50);
      });
    });
  }

  // 1. Render Header & Meta
  function renderYachtHeader() {
    document.title = `${activeYacht.name} | Rent in Kerala from ${formatPrice(activeYacht.priceINR)}/hr | Elite Rentals Kerala`;

    const breadcrumbCat = document.getElementById('breadcrumb-category');
    const breadcrumbName = document.getElementById('breadcrumb-yacht-name');
    const catBadge = document.getElementById('detail-category-badge');
    const titleEl = document.getElementById('detail-yacht-name');
    const metaLength = document.getElementById('detail-meta-length');
    const metaGuests = document.getElementById('detail-meta-guests');
    const metaDept = document.getElementById('detail-meta-departure');

    if (breadcrumbCat) breadcrumbCat.textContent = activeYacht.category;
    if (breadcrumbName) breadcrumbName.textContent = activeYacht.name;
    if (catBadge) catBadge.textContent = activeYacht.category;
    if (titleEl) titleEl.textContent = activeYacht.name;
    if (metaLength) metaLength.textContent = activeYacht.length;
    if (metaGuests) metaGuests.textContent = `Up to ${activeYacht.guestCapacity} Guests`;
    if (metaDept) {
      if (activeYacht.name.toLowerCase().includes('alleppey')) metaDept.textContent = 'Alleppey Backwaters';
      else if (activeYacht.name.toLowerCase().includes('vembanad') || activeYacht.name.toLowerCase().includes('kumarakom')) metaDept.textContent = 'Kumarakom & Vembanad Lake';
      else if (activeYacht.name.toLowerCase().includes('marari')) metaDept.textContent = 'Marari Beach Coastal Waters';
      else metaDept.textContent = 'Bolgatty Marina & Fort Kochi';
    }
  }

  // 2. Render Gallery
  function renderGallery() {
    for (let i = 0; i < 5; i++) {
      const img = document.getElementById(`gallery-img-${i}`);
      if (img && activeGallery[i]) {
        img.src = activeGallery[i];
        img.alt = `${activeYacht.name} - Photo ${i + 1}`;
      }
    }

    const countLabel = document.getElementById('gallery-photos-count-label');
    if (countLabel) {
      countLabel.textContent = `View all ${activeYacht.photosCount || 28} photos`;
    }

    // Attach click listeners to tiles to launch lightbox
    document.querySelectorAll('.gallery-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const idx = parseInt(tile.getAttribute('data-photo-idx'), 10) || 0;
        openLightbox(idx);
      });
    });
  }

  // 3. Render Specs & Narrative
  function renderSpecsAndNarrative() {
    const headingEl = document.getElementById('narrative-heading');
    const contentEl = document.getElementById('narrative-content');
    const specLength = document.getElementById('spec-length');
    const specGuests = document.getElementById('spec-guests');
    const specCabins = document.getElementById('spec-cabins');
    const specBaths = document.getElementById('spec-baths');
    const specSpeed = document.getElementById('spec-speed');
    const specBerth = document.getElementById('spec-berth');
    const faqCost = document.getElementById('faq-cost-ans');

    if (headingEl) headingEl.textContent = `The ${activeYacht.name} Experience`;
    if (contentEl) {
      contentEl.innerHTML = `
        <p>${activeYacht.description}</p>
        <p>
          Charter the ${activeYacht.name} with an experienced licensed captain, uniformed deck crew, chilled fresh tender coconuts, and instant confirmed availability via WhatsApp. From tranquil palm-fringed backwater canals to the open Arabian Sea sunset, every detail is handled with first-class hospitality.
        </p>
      `;
    }

    if (specLength) specLength.textContent = activeYacht.length;
    if (specGuests) specGuests.textContent = `${activeYacht.guestCapacity} Day Guests`;

    // Dynamic staterooms & bathrooms derived from length
    const lenM = parseInt(activeYacht.length, 10) || 20;
    const cabinsCount = lenM >= 35 ? '4-5 VIP Staterooms' : (lenM >= 25 ? '3 Luxury Staterooms' : '2 Staterooms');
    const bathsCount = lenM >= 35 ? '4 En-suite Bathrooms' : (lenM >= 25 ? '3 En-suite Bathrooms' : '2 Marine Heads');
    const speed = lenM >= 30 ? '26 Knots' : (lenM >= 20 ? '22 Knots' : '18 Knots');

    let berth = 'Bolgatty Marina Yacht Club, Kochi';
    if (activeYacht.name.toLowerCase().includes('alleppey')) berth = 'Punnamada Jetty, Alleppey';
    else if (activeYacht.name.toLowerCase().includes('vembanad') || activeYacht.name.toLowerCase().includes('kumarakom')) berth = 'Kumarakom Lake Jetty';
    else if (activeYacht.name.toLowerCase().includes('marari')) berth = 'Marari Coast Anchorage & Bolgatty';

    if (specCabins) specCabins.textContent = cabinsCount;
    if (specBaths) specBaths.textContent = bathsCount;
    if (specSpeed) specSpeed.textContent = speed;
    if (specBerth) specBerth.textContent = berth;

    if (faqCost) {
      const halfDay = Math.round(activeYacht.priceINR * 4 * 0.95);
      const fullDay = Math.round(activeYacht.priceINR * 8 * 0.85);
      faqCost.textContent = `The ${activeYacht.name} is available from ${formatPrice(activeYacht.priceINR)} per hour, ${formatPrice(halfDay)} for a 4-hour half day, and ${formatPrice(fullDay)} for an 8-hour full day charter. Captain, crew, fuel, and fresh refreshments are all included.`;
    }
  }

  // 4. Render Rates Table
  function renderRatesTable() {
    const hourlyRate = activeYacht.priceINR;
    const halfDay = Math.round(hourlyRate * 4 * 0.95);
    const fullDay = Math.round(hourlyRate * 8 * 0.85);
    const weekly = Math.round(hourlyRate * 42);

    const sidebarHourly = document.getElementById('sidebar-hourly-price');
    const rateHourly = document.getElementById('rate-hourly-display');
    const rateHalf = document.getElementById('rate-halfday-display');
    const rateFull = document.getElementById('rate-fullday-display');
    const rateWeek = document.getElementById('rate-weekly-display');

    if (sidebarHourly) sidebarHourly.textContent = formatPrice(hourlyRate);
    if (rateHourly) rateHourly.textContent = `${formatPrice(hourlyRate)} / hr`;
    if (rateHalf) rateHalf.textContent = formatPrice(halfDay);
    if (rateFull) rateFull.textContent = formatPrice(fullDay);
    if (rateWeek) rateWeek.textContent = formatPrice(weekly);

    // Update mini add-on labels in sidebar
    document.querySelectorAll('.addon-rate-inr').forEach(el => {
      const base = parseFloat(el.getAttribute('data-inr-price')) || 0;
      el.textContent = formatPrice(base);
    });
  }

  // 5. Render Calculator
  function renderCalculator() {
    const dateInput = document.getElementById('calc-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
      dateInput.min = today;
    }

    const durSelect = document.getElementById('calc-duration');
    const guestSelect = document.getElementById('calc-guests');
    const addonChecks = document.querySelectorAll('.sidebar-addon-check');

    if (durSelect) durSelect.addEventListener('change', recalculateSidebarTotal);
    if (guestSelect) guestSelect.addEventListener('change', recalculateSidebarTotal);
    addonChecks.forEach(ch => ch.addEventListener('change', recalculateSidebarTotal));

    // Submit WhatsApp
    const submitBtn = document.getElementById('btn-sidebar-whatsapp-submit');
    const mobileBarWa = document.getElementById('mobile-bar-wa-btn');

    function handleWhatsAppSubmit() {
      const date = dateInput ? dateInput.value : 'Soon';
      const dur = durSelect ? durSelect.value : '3';
      const guests = guestSelect ? guestSelect.value : '6';
      const totalAmountEl = document.getElementById('sidebar-calc-total');
      const totalText = totalAmountEl ? totalAmountEl.textContent : '';

      const addons = [];
      document.querySelectorAll('.sidebar-addon-check:checked').forEach(c => {
        addons.push(c.value);
      });
      const addonStr = addons.length > 0 ? ` with ${addons.join(', ')}` : '';

      const msg = encodeURIComponent(
        `Hi Anjali! I'd like to book ${activeYacht.name} for ${dur} hours on ${date} for ${guests} guests${addonStr}. Estimated Quote: ${totalText}. Is this yacht available?`
      );

      window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    }

    if (submitBtn) submitBtn.addEventListener('click', handleWhatsAppSubmit);
    if (mobileBarWa) mobileBarWa.addEventListener('click', handleWhatsAppSubmit);

    recalculateSidebarTotal();
  }

  function recalculateSidebarTotal() {
    if (!activeYacht) return;

    const durSelect = document.getElementById('calc-duration');
    const hours = durSelect ? parseInt(durSelect.value, 10) || 3 : 3;

    // Apply half-day / full-day discount factor
    let rateFactor = 1.0;
    if (hours >= 8) rateFactor = 0.85;
    else if (hours >= 4) rateFactor = 0.95;

    let baseRate = Math.round(activeYacht.priceINR * hours * rateFactor);

    let addonsTotal = 0;
    document.querySelectorAll('.sidebar-addon-check:checked').forEach(c => {
      addonsTotal += parseInt(c.getAttribute('data-price-inr'), 10) || 0;
    });

    const totalINR = baseRate + addonsTotal;
    const totalEl = document.getElementById('sidebar-calc-total');
    if (totalEl) totalEl.textContent = formatPrice(totalINR);

    const mobileBarText = document.getElementById('mobile-bar-quote-text');
    if (mobileBarText) {
      mobileBarText.textContent = `WhatsApp Quote (${formatPrice(totalINR)})`;
    }
  }

  // 6. Lightbox
  function initLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    const openBtn = document.getElementById('btn-open-lightbox');

    if (openBtn) {
      openBtn.addEventListener('click', () => openLightbox(0));
    }

    if (closeBtn && lightboxModal) {
      closeBtn.addEventListener('click', () => closeLightbox());
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIdx = (currentLightboxIdx - 1 + activeGallery.length) % activeGallery.length;
        updateLightboxContent();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIdx = (currentLightboxIdx + 1) % activeGallery.length;
        updateLightboxContent();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal || !lightboxModal.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') {
        currentLightboxIdx = (currentLightboxIdx - 1 + activeGallery.length) % activeGallery.length;
        updateLightboxContent();
      } else if (e.key === 'ArrowRight') {
        currentLightboxIdx = (currentLightboxIdx + 1) % activeGallery.length;
        updateLightboxContent();
      }
    });
  }

  function openLightbox(idx) {
    const lightboxModal = document.getElementById('lightbox-modal');
    if (!lightboxModal) return;
    currentLightboxIdx = idx >= 0 && idx < activeGallery.length ? idx : 0;
    updateLightboxContent();
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function updateLightboxContent() {
    const imgEl = document.getElementById('lightbox-img');
    const counterEl = document.getElementById('lightbox-counter');
    const captionEl = document.getElementById('lightbox-caption');

    if (imgEl && activeGallery[currentLightboxIdx]) {
      imgEl.src = activeGallery[currentLightboxIdx];
    }
    if (counterEl) {
      counterEl.textContent = `Photo ${currentLightboxIdx + 1} of ${activeGallery.length}`;
    }
    if (captionEl && activeYacht) {
      captionEl.textContent = `${activeYacht.name} — ${activeYacht.category}`;
    }
  }

  // 7. Render Related Yachts
  function renderRelatedYachts() {
    const container = document.getElementById('related-yachts-track');
    if (!container) return;

    // Pick 3 yachts different from active
    const related = YACHTS_DATA.filter(y => y.id !== activeYacht.id).slice(0, 3);
    container.innerHTML = '';

    related.forEach(yacht => {
      const card = document.createElement('div');
      card.className = 'yacht-card';
      card.style.flex = '0 0 320px';
      card.style.maxWidth = '340px';

      card.innerHTML = `
        <div class="yacht-media-container" style="cursor:pointer;" onclick="window.location.href='yacht-detail.html?id=${yacht.id}'">
          <img src="${yacht.coverImage}" alt="${yacht.name}" class="yacht-img" loading="lazy">
          <span class="yacht-photo-count">${yacht.photosCount || 28} photos</span>
        </div>
        <div class="yacht-info-wrap">
          <div class="yacht-name-row">
            <h4 class="yacht-card-title"><a href="yacht-detail.html?id=${yacht.id}" style="color:inherit; text-decoration:none;">${yacht.name}</a></h4>
            <span class="yacht-card-cat">${yacht.category}</span>
          </div>
          <p class="yacht-card-specs">${yacht.length} · ${yacht.guests}</p>
          <div class="yacht-card-price-row">
            <span class="yacht-price-text">
              <span class="from-label">from</span> 
              <span class="yacht-price-val" data-inr-price="${yacht.priceINR}">${formatPrice(yacht.priceINR)}</span> 
              <small style="color:var(--gray);font-weight:600">/ hour</small>
            </span>
            <span class="yacht-vat-note">· All taxes incl.</span>
          </div>
          <div class="yacht-card-actions">
            <a href="yacht-detail.html?id=${yacht.id}" class="btn-card-quote" style="text-align:center; text-decoration:none;">
              View Details
            </a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // 8. Share Action
  function initShareButton() {
    const shareBtn = document.getElementById('btn-share-yacht');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({
            title: activeYacht ? activeYacht.name : document.title,
            text: `Check out ${activeYacht ? activeYacht.name : 'this yacht'} on Elite Rentals Kerala!`,
            url: window.location.href
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Link to yacht details copied to clipboard!');
        }
      });
    }
  }

})();
