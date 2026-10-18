/**
 * World Explorer - Core Application Logic
 * Author: Bashir Ahmed (github.com/bashirahmed-Developer)
 */

(function () {
  'use strict';

  // ==========================================
  // Application State
  // ==========================================
  const state = {
    allCountries: [],
    filteredCountries: [],
    favorites: JSON.parse(localStorage.getItem('world_explorer_favs') || '[]'),
    theme: localStorage.getItem('world_explorer_theme') || 'dark',
    currentView: 'cards', // 'cards' | 'map' | 'quiz' | 'favorites'
    selectedRegion: 'all',
    selectedSubregion: 'all',
    searchQuery: '',
    sortBy: 'name-asc',
    leafletMap: null,
    markersGroup: null,
    quiz: {
      score: 0,
      total: 0,
      currentCountry: null,
      answered: false
    }
  };

  // ==========================================
  // DOM Elements
  // ==========================================
  const DOM = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    brandHomeBtn: document.getElementById('brandHomeBtn'),
    viewCardsBtn: document.getElementById('viewCardsBtn'),
    viewMapBtn: document.getElementById('viewMapBtn'),
    viewQuizBtn: document.getElementById('viewQuizBtn'),
    viewFavoritesBtn: document.getElementById('viewFavoritesBtn'),
    favCount: document.getElementById('favCount'),
    
    // Stats
    totalCountriesStat: document.getElementById('totalCountriesStat'),
    totalPopulationStat: document.getElementById('totalPopulationStat'),
    totalContinentsStat: document.getElementById('totalContinentsStat'),
    
    // Filters & Search
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    sortSelect: document.getElementById('sortSelect'),
    subregionSelect: document.getElementById('subregionSelect'),
    regionTagsContainer: document.getElementById('regionTagsContainer'),
    
    // Sections
    heroSection: document.getElementById('heroSection'),
    controlsSection: document.getElementById('controlsSection'),
    resultsMeta: document.getElementById('resultsMeta'),
    displayedCount: document.getElementById('displayedCount'),
    totalAvailableCount: document.getElementById('totalAvailableCount'),
    activeFilterBadgeContainer: document.getElementById('activeFilterBadgeContainer'),
    countriesGrid: document.getElementById('countriesGrid'),
    mapViewContainer: document.getElementById('mapViewContainer'),
    quizSection: document.getElementById('quizSection'),
    
    // Country Modal
    countryModal: document.getElementById('countryModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalHeroBg: document.getElementById('modalHeroBg'),
    modalHeroThumb: document.getElementById('modalHeroThumb'),
    modalCountryName: document.getElementById('modalCountryName'),
    modalOfficialName: document.getElementById('modalOfficialName'),
    modalCapital: document.getElementById('modalCapital'),
    modalPopulation: document.getElementById('modalPopulation'),
    modalRegion: document.getElementById('modalRegion'),
    modalSubregion: document.getElementById('modalSubregion'),
    modalArea: document.getElementById('modalArea'),
    modalCurrencies: document.getElementById('modalCurrencies'),
    modalLanguages: document.getElementById('modalLanguages'),
    modalTimezones: document.getElementById('modalTimezones'),
    modalBordersWrapper: document.getElementById('modalBordersWrapper'),
    modalGoogleMapsLink: document.getElementById('modalGoogleMapsLink'),
    modalWikiLink: document.getElementById('modalWikiLink'),
    modalFavToggleBtn: document.getElementById('modalFavToggleBtn'),
    
    // Compare Modal
    openCompareBtn: document.getElementById('openCompareBtn'),
    compareModal: document.getElementById('compareModal'),
    compareCloseBtn: document.getElementById('compareCloseBtn'),
    compareCountrySelect1: document.getElementById('compareCountrySelect1'),
    compareCountrySelect2: document.getElementById('compareCountrySelect2'),
    compareDetailsContainer: document.getElementById('compareDetailsContainer'),
    
    // Quiz Elements
    quizScore: document.getElementById('quizScore'),
    quizTotal: document.getElementById('quizTotal'),
    quizFlagImg: document.getElementById('quizFlagImg'),
    quizQuestionText: document.getElementById('quizQuestionText'),
    quizOptionsGrid: document.getElementById('quizOptionsGrid'),
    nextQuizBtn: document.getElementById('nextQuizBtn'),
    
    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  // ==========================================
  // Helper Utilities
  // ==========================================
  function formatNumber(num) {
    if (num === undefined || num === null) return 'N/A';
    return new Intl.NumberFormat().format(num);
  }

  function formatCompactNumber(num) {
    if (!num) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  }

  function showToast(message, icon = 'fa-circle-info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  // ==========================================
  // Theme Management
  // ==========================================
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('world_explorer_theme', theme);
    if (theme === 'light') {
      DOM.themeIcon.className = 'fa-solid fa-moon';
      DOM.themeToggleBtn.title = 'Switch to Dark Mode';
    } else {
      DOM.themeIcon.className = 'fa-solid fa-sun';
      DOM.themeToggleBtn.title = 'Switch to Light Mode';
    }
  }

  DOM.themeToggleBtn.addEventListener('click', () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} theme`, newTheme === 'dark' ? 'fa-moon' : 'fa-sun');
  });

  // ==========================================
  // Data Fetching & Normalization (All 250 Nations)
  // ==========================================
  function normalizeCountriesData(rawData) {
    return rawData.map(c => {
      const cca2 = (c.cca2 || '').toLowerCase();
      const commonName = c.name?.common || 'Unknown';
      const officialName = c.name?.official || commonName;

      let cap = [];
      if (Array.isArray(c.capital)) {
        cap = c.capital;
      } else if (typeof c.capital === 'string' && c.capital) {
        cap = [c.capital];
      }

      let currs = null;
      if (c.currencies && typeof c.currencies === 'object') {
        currs = c.currencies;
      }

      return {
        name: {
          common: commonName,
          official: officialName
        },
        capital: cap,
        region: c.region || 'World',
        subregion: c.subregion || '',
        population: typeof c.population === 'number' ? c.population : 0,
        area: typeof c.area === 'number' ? c.area : 0,
        flags: {
          png: `https://flagcdn.com/w320/${cca2}.png`,
          svg: `https://flagcdn.com/${cca2}.svg`,
          alt: `Flag of ${commonName}`
        },
        currencies: currs,
        languages: (c.languages && typeof c.languages === 'object') ? c.languages : null,
        borders: Array.isArray(c.borders) ? c.borders : [],
        cca2: c.cca2 || '',
        cca3: c.cca3 || '',
        latlng: Array.isArray(c.latlng) ? c.latlng : [],
        timezones: Array.isArray(c.timezones) ? c.timezones : [],
        maps: {
          googleMaps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(commonName)}`
        }
      };
    });
  }

  async function fetchCountryData() {
    const DATA_URL = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';

    // 1. Try local storage cache for instant 0ms startup
    try {
      const cached = localStorage.getItem('world_explorer_full_countries_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 200) {
          state.allCountries = parsed;
          populateGlobalStats(parsed);
          populateSubregions(parsed);
          populateCompareDropdowns(parsed);
          applyFiltersAndSort();
          // Silently refresh in background
          refreshCountriesInBackground(DATA_URL);
          return;
        }
      }
    } catch (e) {
      console.warn('Cache lookup failed', e);
    }

    // 2. Fetch full global countries dataset
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(DATA_URL, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rawData = await response.json();

      if (Array.isArray(rawData) && rawData.length > 0) {
        const normalized = normalizeCountriesData(rawData);
        state.allCountries = normalized;
        try {
          localStorage.setItem('world_explorer_full_countries_v1', JSON.stringify(normalized));
        } catch (e) {}

        populateGlobalStats(normalized);
        populateSubregions(normalized);
        populateCompareDropdowns(normalized);
        applyFiltersAndSort();
        showToast(`Loaded all ${normalized.length} nations worldwide!`, 'fa-globe');
        return;
      }
      throw new Error('Invalid data payload');
    } catch (err) {
      console.warn('Network dataset unavailable. Using bundled offline dataset.', err);
      if (typeof FALLBACK_COUNTRIES !== 'undefined' && FALLBACK_COUNTRIES.length > 0) {
        state.allCountries = FALLBACK_COUNTRIES;
        populateGlobalStats(FALLBACK_COUNTRIES);
        populateSubregions(FALLBACK_COUNTRIES);
        populateCompareDropdowns(FALLBACK_COUNTRIES);
        applyFiltersAndSort();
        showToast('Running on verified offline data cache.', 'fa-wifi');
      } else {
        DOM.countriesGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h3>Unable to load country data</h3>
            <p>Please check your internet connection or try refreshing the page.</p>
            <button class="reset-btn" onclick="location.reload()">Retry Connection</button>
          </div>
        `;
      }
    }
  }

  async function refreshCountriesInBackground(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const raw = await res.json();
      if (Array.isArray(raw) && raw.length > 200) {
        const norm = normalizeCountriesData(raw);
        state.allCountries = norm;
        localStorage.setItem('world_explorer_full_countries_v1', JSON.stringify(norm));
        populateGlobalStats(norm);
        populateSubregions(norm);
        populateCompareDropdowns(norm);
      }
    } catch (e) {}
  }

  // Populate Global Stats Header
  function populateGlobalStats(countries) {
    DOM.totalCountriesStat.textContent = countries.length;
    
    const totalPop = countries.reduce((acc, c) => acc + (c.population || 0), 0);
    DOM.totalPopulationStat.textContent = formatCompactNumber(totalPop);
    
    const regions = new Set(countries.map(c => c.region).filter(Boolean));
    DOM.totalContinentsStat.textContent = regions.size;
  }

  // Populate Subregions filter
  function populateSubregions(countries) {
    const subregions = [...new Set(countries.map(c => c.subregion).filter(Boolean))].sort();
    DOM.subregionSelect.innerHTML = '<option value="all">All Subregions</option>';
    subregions.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = sub;
      DOM.subregionSelect.appendChild(opt);
    });
  }

  // ==========================================
  // Filtering & Sorting
  // ==========================================
  function applyFiltersAndSort() {
    let list = [...state.allCountries];

    // Filter by Favorites View
    if (state.currentView === 'favorites') {
      list = list.filter(c => state.favorites.includes(c.cca3));
    }

    // Filter by Region
    if (state.selectedRegion !== 'all') {
      list = list.filter(c => c.region && c.region.toLowerCase() === state.selectedRegion.toLowerCase());
    }

    // Filter by Subregion
    if (state.selectedSubregion !== 'all') {
      list = list.filter(c => c.subregion === state.selectedSubregion);
    }

    // Filter by Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(c => {
        const nameCommon = c.name?.common?.toLowerCase() || '';
        const nameOfficial = c.name?.official?.toLowerCase() || '';
        const capital = (c.capital || []).join(' ').toLowerCase();
        const cca2 = (c.cca2 || '').toLowerCase();
        const cca3 = (c.cca3 || '').toLowerCase();
        
        // Match currencies if present
        const currs = c.currencies ? Object.keys(c.currencies).join(' ').toLowerCase() : '';
        
        return nameCommon.includes(q) || nameOfficial.includes(q) || capital.includes(q) || cca2 === q || cca3 === q || currs.includes(q);
      });
    }

    // Sorting
    list.sort((a, b) => {
      const nameA = (a.name?.common || '').toLowerCase();
      const nameB = (b.name?.common || '').toLowerCase();
      const popA = a.population || 0;
      const popB = b.population || 0;
      const areaA = a.area || 0;
      const areaB = b.area || 0;

      switch (state.sortBy) {
        case 'name-asc': return nameA.localeCompare(nameB);
        case 'name-desc': return nameB.localeCompare(nameA);
        case 'pop-desc': return popB - popA;
        case 'pop-asc': return popA - popB;
        case 'area-desc': return areaB - areaA;
        default: return 0;
      }
    });

    state.filteredCountries = list;
    renderCountriesGrid(list);
    updateResultsMeta(list.length);
  }

  function updateResultsMeta(count) {
    DOM.displayedCount.textContent = count;
    DOM.totalAvailableCount.textContent = state.allCountries.length;

    let badgeText = '';
    if (state.currentView === 'favorites') {
      badgeText = `❤️ Favorites (${count})`;
    } else if (state.selectedRegion !== 'all') {
      badgeText = `Region: ${state.selectedRegion}`;
    }

    if (badgeText) {
      DOM.activeFilterBadgeContainer.innerHTML = `<span class="active-filter-badge">${badgeText}</span>`;
    } else {
      DOM.activeFilterBadgeContainer.innerHTML = '';
    }
  }

  // ==========================================
  // Render Countries Grid
  // ==========================================
  function renderCountriesGrid(countries) {
    if (!countries.length) {
      DOM.countriesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No countries matched your criteria</h3>
          <p>Try clearing your search terms or selecting a different region.</p>
          <button class="reset-btn" id="resetFiltersBtn">Reset All Filters</button>
        </div>
      `;
      document.getElementById('resetFiltersBtn')?.addEventListener('click', resetAllFilters);
      return;
    }

    const fragment = document.createDocumentFragment();

    countries.forEach(country => {
      const card = document.createElement('div');
      card.className = 'country-card';
      card.setAttribute('tabindex', '0');

      const isFav = state.favorites.includes(country.cca3);
      const flagSrc = country.flags?.png || country.flags?.svg || '';
      const flagAlt = country.flags?.alt || `${country.name?.common} Flag`;
      const commonName = country.name?.common || 'Unknown';
      const capitalName = (country.capital && country.capital[0]) ? country.capital[0] : 'N/A';
      const populationFmt = formatNumber(country.population);
      const regionName = country.region || 'World';

      card.innerHTML = `
        <div class="card-flag-wrapper">
          <img class="card-flag" src="${flagSrc}" alt="${flagAlt}" loading="lazy">
          <button class="card-fav-btn ${isFav ? 'favorited' : ''}" data-cca3="${country.cca3}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Favorite ${commonName}">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <span class="card-region-badge">${regionName}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${commonName}</h3>
          <div class="card-info-list">
            <div class="card-info-item">
              <span class="label">Capital:</span>
              <span>${capitalName}</span>
            </div>
            <div class="card-info-item">
              <span class="label">Population:</span>
              <span>${populationFmt}</span>
            </div>
            <div class="card-info-item">
              <span class="label">Area:</span>
              <span>${formatNumber(country.area)} km²</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="card-action-btn view-details-btn">
              <i class="fa-solid fa-circle-info"></i> Details
            </button>
            <button class="card-action-btn map-jump-btn" title="View on map">
              <i class="fa-solid fa-compass"></i> Map
            </button>
          </div>
        </div>
      `;

      // Event listeners for card interactions
      card.addEventListener('click', (e) => {
        // Prevent trigger if fav button was clicked
        if (e.target.closest('.card-fav-btn')) return;
        if (e.target.closest('.map-jump-btn')) {
          jumpToCountryMap(country);
          return;
        }
        openCountryModal(country);
      });

      // Fav button click
      const favBtn = card.querySelector('.card-fav-btn');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(country.cca3);
      });

      fragment.appendChild(card);
    });

    DOM.countriesGrid.innerHTML = '';
    DOM.countriesGrid.appendChild(fragment);
  }

  // ==========================================
  // Favorites System
  // ==========================================
  function toggleFavorite(cca3) {
    if (!cca3) return;
    const country = state.allCountries.find(c => c.cca3 === cca3);
    const countryName = country?.name?.common || 'Country';

    if (state.favorites.includes(cca3)) {
      state.favorites = state.favorites.filter(id => id !== cca3);
      showToast(`Removed ${countryName} from favorites`, 'fa-heart-crack');
    } else {
      state.favorites.push(cca3);
      showToast(`Added ${countryName} to favorites ❤️`, 'fa-heart');
    }

    localStorage.setItem('world_explorer_favs', JSON.stringify(state.favorites));
    updateFavoritesCounter();
    applyFiltersAndSort();
    updateModalFavButtonState(cca3);
  }

  function updateFavoritesCounter() {
    DOM.favCount.textContent = state.favorites.length;
  }

  function updateModalFavButtonState(cca3) {
    const isFav = state.favorites.includes(cca3);
    if (isFav) {
      DOM.modalFavToggleBtn.innerHTML = '<i class="fa-solid fa-heart text-red-500"></i> Favorited';
      DOM.modalFavToggleBtn.classList.add('favorited');
    } else {
      DOM.modalFavToggleBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Favorites';
      DOM.modalFavToggleBtn.classList.remove('favorited');
    }
  }

  // ==========================================
  // Detailed Country Modal
  // ==========================================
  function openCountryModal(country) {
    if (!country) return;

    const flagUrl = country.flags?.svg || country.flags?.png || '';
    DOM.modalHeroBg.src = flagUrl;
    DOM.modalHeroThumb.src = flagUrl;
    DOM.modalHeroThumb.alt = `${country.name?.common} Flag`;

    DOM.modalCountryName.textContent = country.name?.common || 'Unknown';
    DOM.modalOfficialName.textContent = country.name?.official || '';

    DOM.modalCapital.textContent = (country.capital && country.capital.length > 0) ? country.capital.join(', ') : 'N/A';
    DOM.modalPopulation.textContent = formatNumber(country.population);
    DOM.modalRegion.textContent = country.region || 'N/A';
    DOM.modalSubregion.textContent = country.subregion || 'N/A';
    DOM.modalArea.textContent = country.area ? `${formatNumber(country.area)} km²` : 'N/A';

    // Currencies
    if (country.currencies) {
      const currStr = Object.values(country.currencies)
        .map(curr => `${curr.name} (${curr.symbol || ''})`)
        .join(', ');
      DOM.modalCurrencies.textContent = currStr || 'N/A';
    } else {
      DOM.modalCurrencies.textContent = 'N/A';
    }

    // Languages
    if (country.languages) {
      DOM.modalLanguages.textContent = Object.values(country.languages).join(', ');
    } else {
      DOM.modalLanguages.textContent = 'N/A';
    }

    // Timezones
    DOM.modalTimezones.textContent = (country.timezones && country.timezones.length > 0) ? country.timezones.slice(0, 3).join(', ') : 'UTC';

    // Neighboring Border Countries
    DOM.modalBordersWrapper.innerHTML = '';
    if (country.borders && country.borders.length > 0) {
      country.borders.forEach(borderCode => {
        const neighbor = state.allCountries.find(c => c.cca3 === borderCode);
        const neighborName = neighbor ? neighbor.name?.common : borderCode;
        const chip = document.createElement('button');
        chip.className = 'border-chip';
        chip.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${neighborName}`;
        chip.addEventListener('click', () => {
          if (neighbor) openCountryModal(neighbor);
        });
        DOM.modalBordersWrapper.appendChild(chip);
      });
    } else {
      DOM.modalBordersWrapper.innerHTML = '<span style="color: var(--text-muted); font-size: 0.9rem;">Island nation or has no direct land borders.</span>';
    }

    // External Action Links
    const mapsLink = country.maps?.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name?.common || '')}`;
    DOM.modalGoogleMapsLink.href = mapsLink;

    const wikiLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name?.common || '')}`;
    DOM.modalWikiLink.href = wikiLink;

    // Fav button inside modal
    updateModalFavButtonState(country.cca3);
    DOM.modalFavToggleBtn.onclick = () => toggleFavorite(country.cca3);

    // Open Modal
    DOM.countryModal.classList.add('open');
    const modalDialog = DOM.countryModal.querySelector('.modal-dialog');
    if (modalDialog) modalDialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeCountryModal() {
    DOM.countryModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  DOM.modalCloseBtn.addEventListener('click', closeCountryModal);
  DOM.countryModal.addEventListener('click', (e) => {
    if (e.target === DOM.countryModal) closeCountryModal();
  });

  // ==========================================
  // Leaflet Interactive World Map
  // ==========================================
  function initLeafletMap() {
    if (state.leafletMap) return;

    // Center on globe
    state.leafletMap = L.map('worldMap', {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10
    });

    // High quality OpenStreetMap tiles (100% free, no API key required, no watermark)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(state.leafletMap);

    state.markersGroup = L.layerGroup().addTo(state.leafletMap);
    renderMapMarkers();
  }

  function renderMapMarkers() {
    if (!state.leafletMap || !state.markersGroup) return;
    state.markersGroup.clearLayers();

    state.allCountries.forEach(country => {
      if (country.latlng && country.latlng.length === 2) {
        const [lat, lng] = country.latlng;
        const marker = L.circleMarker([lat, lng], {
          radius: 6,
          fillColor: '#3b82f6',
          color: '#ffffff',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85
        });

        const flagImg = country.flags?.png || '';
        const popupContent = `
          <div style="font-family: inherit; font-size: 0.9rem; text-align: center; min-width: 130px;">
            <img src="${flagImg}" alt="" style="width: 50px; height: 32px; object-fit: cover; border-radius: 4px; margin-bottom: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <div style="font-weight: 700; color: #111827;">${country.name?.common}</div>
            <div style="font-size: 0.75rem; color: #6b7280;">Pop: ${formatNumber(country.population)}</div>
            <button id="marker-btn-${country.cca3}" style="margin-top: 6px; padding: 3px 8px; font-size: 0.75rem; background: #3b82f6; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">View Details</button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`marker-btn-${country.cca3}`);
          if (btn) {
            btn.onclick = () => openCountryModal(country);
          }
        });

        state.markersGroup.addLayer(marker);
      }
    });
  }

  function jumpToCountryMap(country) {
    switchView('map');
    if (country.latlng && state.leafletMap) {
      setTimeout(() => {
        state.leafletMap.flyTo(country.latlng, 5, { duration: 1.5 });
      }, 300);
    }
  }

  // ==========================================
  // Country Comparison Tool
  // ==========================================
  function populateCompareDropdowns(countries) {
    const sorted = [...countries].sort((a, b) => (a.name?.common || '').localeCompare(b.name?.common || ''));
    DOM.compareCountrySelect1.innerHTML = '';
    DOM.compareCountrySelect2.innerHTML = '';

    sorted.forEach(c => {
      const opt1 = document.createElement('option');
      opt1.value = c.cca3;
      opt1.textContent = c.name?.common;
      DOM.compareCountrySelect1.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = c.cca3;
      opt2.textContent = c.name?.common;
      DOM.compareCountrySelect2.appendChild(opt2);
    });

    // Pick two default interesting countries (e.g. Pakistan and Japan or USA)
    DOM.compareCountrySelect1.value = sorted.find(c => c.cca3 === 'PAK')?.cca3 || sorted[0]?.cca3;
    DOM.compareCountrySelect2.value = sorted.find(c => c.cca3 === 'JPN')?.cca3 || sorted[1]?.cca3;
  }

  function renderComparison() {
    const cca3_1 = DOM.compareCountrySelect1.value;
    const cca3_2 = DOM.compareCountrySelect2.value;

    const c1 = state.allCountries.find(c => c.cca3 === cca3_1);
    const c2 = state.allCountries.find(c => c.cca3 === cca3_2);

    if (!c1 || !c2) return;

    const maxPop = Math.max(c1.population || 1, c2.population || 1);
    const maxArea = Math.max(c1.area || 1, c2.area || 1);

    const c1PopPct = Math.round(((c1.population || 0) / maxPop) * 100);
    const c2PopPct = Math.round(((c2.population || 0) / maxPop) * 100);

    const c1AreaPct = Math.round(((c1.area || 0) / maxArea) * 100);
    const c2AreaPct = Math.round(((c2.area || 0) / maxArea) * 100);

    DOM.compareDetailsContainer.innerHTML = `
      <div class="compare-card">
        <img class="compare-flag" src="${c1.flags?.png || ''}" alt="${c1.name?.common}">
        <h4 style="font-size: 1.3rem; font-weight: 800;">${c1.name?.common}</h4>
        <div style="font-size: 0.9rem; color: var(--text-secondary);">Capital: <strong>${c1.capital ? c1.capital[0] : 'N/A'}</strong></div>
        <div style="font-size: 0.9rem; color: var(--text-secondary);">Region: <strong>${c1.region}</strong></div>

        <div class="compare-bar-group">
          <div class="compare-bar-label">
            <span>Population</span>
            <strong>${formatNumber(c1.population)}</strong>
          </div>
          <div class="compare-progress-bg">
            <div class="compare-progress-fill" style="width: ${c1PopPct}%"></div>
          </div>
        </div>

        <div class="compare-bar-group">
          <div class="compare-bar-label">
            <span>Land Area</span>
            <strong>${formatNumber(c1.area)} km²</strong>
          </div>
          <div class="compare-progress-bg">
            <div class="compare-progress-fill" style="width: ${c1AreaPct}%"></div>
          </div>
        </div>
      </div>

      <div class="compare-card">
        <img class="compare-flag" src="${c2.flags?.png || ''}" alt="${c2.name?.common}">
        <h4 style="font-size: 1.3rem; font-weight: 800;">${c2.name?.common}</h4>
        <div style="font-size: 0.9rem; color: var(--text-secondary);">Capital: <strong>${c2.capital ? c2.capital[0] : 'N/A'}</strong></div>
        <div style="font-size: 0.9rem; color: var(--text-secondary);">Region: <strong>${c2.region}</strong></div>

        <div class="compare-bar-group">
          <div class="compare-bar-label">
            <span>Population</span>
            <strong>${formatNumber(c2.population)}</strong>
          </div>
          <div class="compare-progress-bg">
            <div class="compare-progress-fill" style="width: ${c2PopPct}%"></div>
          </div>
        </div>

        <div class="compare-bar-group">
          <div class="compare-bar-label">
            <span>Land Area</span>
            <strong>${formatNumber(c2.area)} km²</strong>
          </div>
          <div class="compare-progress-bg">
            <div class="compare-progress-fill" style="width: ${c2AreaPct}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  DOM.openCompareBtn.addEventListener('click', () => {
    DOM.compareModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderComparison();
  });

  DOM.compareCloseBtn.addEventListener('click', () => {
    DOM.compareModal.classList.remove('open');
    document.body.style.overflow = '';
  });

  DOM.compareCountrySelect1.addEventListener('change', renderComparison);
  DOM.compareCountrySelect2.addEventListener('change', renderComparison);

  // ==========================================
  // Geography Quiz Game
  // ==========================================
  function startNewQuizQuestion() {
    if (!state.allCountries.length) return;

    state.quiz.answered = false;
    DOM.nextQuizBtn.style.display = 'none';

    // Pick 1 target country
    const targetIndex = Math.floor(Math.random() * state.allCountries.length);
    const target = state.allCountries[targetIndex];
    state.quiz.currentCountry = target;

    // Pick 3 random distractors
    const distractors = [];
    while (distractors.length < 3) {
      const idx = Math.floor(Math.random() * state.allCountries.length);
      const cand = state.allCountries[idx];
      if (cand.cca3 !== target.cca3 && !distractors.some(d => d.cca3 === cand.cca3)) {
        distractors.push(cand);
      }
    }

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    DOM.quizFlagImg.src = target.flags?.png || target.flags?.svg || '';
    DOM.quizQuestionText.textContent = `Which country flies this flag?`;

    DOM.quizOptionsGrid.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.textContent = opt.name?.common || 'Unknown';
      btn.addEventListener('click', () => handleQuizAnswer(opt, btn, options));
      DOM.quizOptionsGrid.appendChild(btn);
    });
  }

  function handleQuizAnswer(chosenCountry, clickedBtn, allOptions) {
    if (state.quiz.answered) return;
    state.quiz.answered = true;
    state.quiz.total++;

    const isCorrect = chosenCountry.cca3 === state.quiz.currentCountry.cca3;

    if (isCorrect) {
      state.quiz.score++;
      clickedBtn.classList.add('correct');
      showToast('Correct! Great geography knowledge! 🎉', 'fa-check');
    } else {
      clickedBtn.classList.add('incorrect');
      showToast(`Incorrect. That flag belongs to ${state.quiz.currentCountry.name?.common}.`, 'fa-xmark');
      // Highlight the correct one
      const allButtons = DOM.quizOptionsGrid.querySelectorAll('.quiz-btn');
      allButtons.forEach(b => {
        if (b.textContent === state.quiz.currentCountry.name?.common) {
          b.classList.add('correct');
        }
      });
    }

    DOM.quizScore.textContent = state.quiz.score;
    DOM.quizTotal.textContent = state.quiz.total;
    DOM.nextQuizBtn.style.display = 'inline-flex';
  }

  DOM.nextQuizBtn.addEventListener('click', startNewQuizQuestion);

  // ==========================================
  // Navigation & View Switching
  // ==========================================
  function switchView(viewName) {
    state.currentView = viewName;

    // Update active nav button
    [DOM.viewCardsBtn, DOM.viewMapBtn, DOM.viewQuizBtn, DOM.viewFavoritesBtn].forEach(b => b.classList.remove('active'));

    // Hide all view panels
    DOM.countriesGrid.style.display = 'grid';
    DOM.mapViewContainer.classList.remove('active');
    DOM.quizSection.classList.remove('active');
    DOM.controlsSection.style.display = 'block';
    DOM.resultsMeta.style.display = 'flex';

    if (viewName === 'cards') {
      DOM.viewCardsBtn.classList.add('active');
      applyFiltersAndSort();
    } else if (viewName === 'favorites') {
      DOM.viewFavoritesBtn.classList.add('active');
      applyFiltersAndSort();
    } else if (viewName === 'map') {
      DOM.viewMapBtn.classList.add('active');
      DOM.countriesGrid.style.display = 'none';
      DOM.resultsMeta.style.display = 'none';
      DOM.controlsSection.style.display = 'none';
      DOM.mapViewContainer.classList.add('active');
      initLeafletMap();
      renderMapMarkers();
      setTimeout(() => {
        if (state.leafletMap) state.leafletMap.invalidateSize();
      }, 100);
      setTimeout(() => {
        if (state.leafletMap) state.leafletMap.invalidateSize();
      }, 350);
    } else if (viewName === 'quiz') {
      DOM.viewQuizBtn.classList.add('active');
      DOM.countriesGrid.style.display = 'none';
      DOM.resultsMeta.style.display = 'none';
      DOM.controlsSection.style.display = 'none';
      DOM.quizSection.classList.add('active');
      startNewQuizQuestion();
    }
  }

  DOM.viewCardsBtn.addEventListener('click', () => switchView('cards'));
  DOM.viewMapBtn.addEventListener('click', () => switchView('map'));
  DOM.viewQuizBtn.addEventListener('click', () => switchView('quiz'));
  DOM.viewFavoritesBtn.addEventListener('click', () => switchView('favorites'));
  DOM.brandHomeBtn.addEventListener('click', () => {
    resetAllFilters();
    switchView('cards');
  });

  // ==========================================
  // Search & Filter Event Listeners
  // ==========================================
  // Debounce search
  let searchTimeout;
  DOM.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const val = e.target.value;
    DOM.searchClearBtn.style.display = val.trim().length > 0 ? 'flex' : 'none';
    searchTimeout = setTimeout(() => {
      state.searchQuery = val;
      applyFiltersAndSort();
    }, 200);
  });

  // Ensure 'x' click stops propagation, clears search, hides 'x', and focuses input
  DOM.searchClearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    DOM.searchInput.value = '';
    DOM.searchClearBtn.style.display = 'none';
    state.searchQuery = '';
    DOM.searchInput.focus();
    applyFiltersAndSort();
  });

  // Clear search on Escape key
  DOM.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.searchInput.value) {
      DOM.searchInput.value = '';
      DOM.searchClearBtn.style.display = 'none';
      state.searchQuery = '';
      applyFiltersAndSort();
    }
  });

  // Region pills click
  DOM.regionTagsContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.region-pill');
    if (!pill) return;

    DOM.regionTagsContainer.querySelectorAll('.region-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    state.selectedRegion = pill.getAttribute('data-region');
    applyFiltersAndSort();
  });

  // Subregion dropdown
  DOM.subregionSelect.addEventListener('change', (e) => {
    state.selectedSubregion = e.target.value;
    applyFiltersAndSort();
  });

  // Sort dropdown
  DOM.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    applyFiltersAndSort();
  });

  function resetAllFilters() {
    state.selectedRegion = 'all';
    state.selectedSubregion = 'all';
    state.searchQuery = '';
    state.sortBy = 'name-asc';

    DOM.searchInput.value = '';
    DOM.searchClearBtn.style.display = 'none';
    DOM.sortSelect.value = 'name-asc';
    DOM.subregionSelect.value = 'all';

    DOM.regionTagsContainer.querySelectorAll('.region-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-region') === 'all');
    });

    applyFiltersAndSort();
  }

  // Keyboard shortcut: Esc closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCountryModal();
      DOM.compareModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ==========================================
  // App Initialization
  // ==========================================
  function init() {
    applyTheme(state.theme);
    updateFavoritesCounter();
    fetchCountryData();
  }

  init();

})();
