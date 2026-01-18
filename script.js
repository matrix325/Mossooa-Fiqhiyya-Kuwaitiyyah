// Chapters Data - loaded from JSON
let chaptersData = [];
let displayedChapters = 6;
let filteredChapters = [];
let currentLang = 'ur'; // Default language

// Detect language from URL parameter
function detectLanguageFromURL() {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang');
  
  if (langParam && (langParam === 'ar' || langParam === 'ur')) {
    return langParam;
  }
  
  // Fall back to localStorage
  return localStorage.getItem('language') || 'ur';
}

// Load chapters from JSON file based on language
async function loadChaptersData() {
  try {
    const dataPath = currentLang === 'ur' ? './data/ur/chapters.json' : './data/ar/chapters.json';
    const response = await fetch(dataPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    chaptersData = data.chapters;
    filteredChapters = [...chaptersData];
    // Clear error message if any
    const noResults = document.getElementById('noResults');
    if (noResults) {
      noResults.style.display = 'none';
    }
    renderChapters();
  } catch (error) {
    console.error('Error loading chapters:', error);
    // Show error message to user
    const noResults = document.getElementById('noResults');
    if (noResults) {
      const errorMsg = currentLang === 'ur' ? 'دریافت میں خرابی - براہ کرم دوبارہ کوشش کریں' : 'خطأ في التحميل - يرجى المحاولة لاحقا';
      noResults.textContent = errorMsg;
      noResults.style.display = 'block';
    }
  }
}

// Initialize page
function init() {
  loadTheme();
  currentLang = detectLanguageFromURL();
  setLanguage(currentLang);
  setupEventListeners();
  loadChaptersData();
  
  // Set initial language in dropdown
  const currentLangSpan = document.getElementById('currentLang');
  if (currentLangSpan) {
    currentLangSpan.textContent = currentLang === 'ur' ? 'اردو' : 'عربي';
  }
  
  // Set active option in dropdown
  document.querySelectorAll('.lang-option').forEach(option => {
    if (option.dataset.lang === currentLang) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

// Language switching
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  // Update HTML attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'rtl';
  
  // Toggle classes on <html> so CSS controls fonts/spacing (better for performance & caching)
  document.documentElement.classList.toggle('lang-ar', lang === 'ar');
  document.documentElement.classList.toggle('lang-ur', lang === 'ur');
  
  // Update all text elements
  updateLanguageUI();
  
  // Reload chapters
  displayedChapters = 6;
  loadChaptersData();
}

// Update UI text based on selected language
function updateLanguageUI() {
  const elements = document.querySelectorAll('[data-ur][data-ar]');
  elements.forEach(el => {
    const text = currentLang === 'ur' ? el.getAttribute('data-ur') : el.getAttribute('data-ar');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else if (el.tagName === 'BUTTON' && el.hasAttribute('title')) {
      el.title = text;
    } else {
      el.textContent = text;
    }
  });
  
  // Update placeholders
  const searchBars = document.querySelectorAll('.search-bar');
  searchBars.forEach(bar => {
    const placeholder = currentLang === 'ur' 
      ? bar.getAttribute('data-placeholder-ur') 
      : bar.getAttribute('data-placeholder-ar');
    if (placeholder) bar.placeholder = placeholder;
  });
}

// Render chapters
function renderChapters() {
  const grid = document.getElementById('chaptersGrid');
  const noResults = document.getElementById('noResults');
  const loadMoreBtn = document.getElementById('loadMoreContainer');

  grid.innerHTML = '';

  if (filteredChapters.length === 0) {
    noResults.style.display = 'block';
    loadMoreBtn.style.display = 'none';
    return;
  }

  noResults.style.display = 'none';

  const chaptersToShow = filteredChapters.slice(0, displayedChapters);

  chaptersToShow.forEach(chapter => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    
    const readBtnText = currentLang === 'ur' ? 'پڑھیں' : 'اقرأ';
    
    card.innerHTML = `
      <h3 class="chapter-title">${chapter.title}</h3>
      <p class="chapter-description">${chapter.description}</p>
      <button class="read-button" onclick="goToChapter(${chapter.id})">${readBtnText}</button>
    `;
    grid.appendChild(card);
  });

  if (filteredChapters.length > displayedChapters) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

// Load more chapters
function loadMoreChapters() {
  displayedChapters += 6;
  renderChapters();
}

// Search functionality
function handleSearch(query) {
  query = query.toLowerCase().trim();

  if (query === '') {
    filteredChapters = [...chaptersData];
  } else {
    filteredChapters = chaptersData.filter(chapter => {
      return (
        chapter.title.toLowerCase().includes(query) ||
        chapter.description.toLowerCase().includes(query)
      );
    });
  }

  displayedChapters = 6;
  renderChapters();
}

// Theme toggle
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Setup event listeners
function setupEventListeners() {
  const searchBar = document.getElementById('searchBar');
  const desktopSearchBar = document.getElementById('desktopSearchBar');
  const searchIconBtn = document.getElementById('searchIconBtn');
  const searchDropdown = document.getElementById('searchDropdown');
  const themeToggle = document.getElementById('themeToggle');
  const languageToggle = document.getElementById('languageToggle');
  const languageMenu = document.getElementById('languageMenu');

  // Language dropdown functionality
  if (languageToggle && languageMenu) {
    languageToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = languageMenu.classList.toggle('show');
      languageToggle.classList.toggle('active');
      // Update ARIA attribute
      languageToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-dropdown')) {
        languageMenu.classList.remove('show');
        languageToggle.classList.remove('active');
        // Update ARIA attribute
        languageToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Language option selection
    document.querySelectorAll('.lang-option').forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        setLanguage(lang);
        
        // Update UI and ARIA
        document.querySelectorAll('.lang-option').forEach(o => {
          o.classList.remove('active');
          o.setAttribute('aria-checked', 'false');
        });
        option.classList.add('active');
        option.setAttribute('aria-checked', 'true');
        
        // Update current language display
        const currentLangSpan = document.getElementById('currentLang');
        currentLangSpan.textContent = lang === 'ur' ? 'اردو' : 'عربي';
        
        // Close dropdown
        languageMenu.classList.remove('show');
        languageToggle.classList.remove('active');
        // Update ARIA attribute
        languageToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (searchIconBtn && searchDropdown && searchBar) {
    function positionInlineSearch() {
      if (!desktopSearchBar || !searchIconBtn) return;
      desktopSearchBar.style.left = '';
      desktopSearchBar.style.right = '';

      const nav = document.querySelector('nav');
      const navRect = nav ? nav.getBoundingClientRect() : { left: 0, width: window.innerWidth };
      const iconRect = searchIconBtn.getBoundingClientRect();

      let overlayWidth = desktopSearchBar.offsetWidth || 180;
      let left = iconRect.left + iconRect.width / 2 - overlayWidth / 2 - navRect.left;

      const minLeft = 8;
      const maxLeft = Math.max(8, navRect.width - overlayWidth - 8);
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      desktopSearchBar.style.left = `${left}px`;
    }

    searchIconBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (window.innerWidth <= 768 && desktopSearchBar) {
        if (desktopSearchBar.classList.contains('show-inline')) {
          desktopSearchBar.classList.remove('show-inline');
          desktopSearchBar.style.left = '';
        } else {
          desktopSearchBar.classList.add('show-inline');
          requestAnimationFrame(() => {
            positionInlineSearch();
            desktopSearchBar.focus();
          });
        }
        return;
      }

      if (searchDropdown) {
        if (searchDropdown.style.display === 'block') {
          searchDropdown.style.display = 'none';
        } else {
          searchDropdown.style.display = 'block';
          searchBar.focus();
        }
      }
    });

    window.addEventListener('resize', () => {
      if (desktopSearchBar && desktopSearchBar.classList.contains('show-inline')) {
        if (window.innerWidth > 768) {
          desktopSearchBar.classList.remove('show-inline');
          desktopSearchBar.style.left = '';
        } else {
          positionInlineSearch();
        }
      }
    });

    let searchTimeout;
    searchBar.addEventListener('input', e => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length > 0) {
        searchDropdown.style.display = 'block';
      } else {
        searchDropdown.style.display = 'none';
      }

      searchTimeout = setTimeout(() => {
        handleSearch(e.target.value);
      }, 300);
    });

    if (desktopSearchBar) {
      let desktopTimeout;
      desktopSearchBar.addEventListener('input', e => {
        clearTimeout(desktopTimeout);
        desktopTimeout = setTimeout(() => {
          handleSearch(e.target.value);
        }, 300);
      });
    }

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-container') && !e.target.closest('.search-dropdown')) {
        if (window.innerWidth <= 768) {
          searchDropdown.style.display = 'none';
        }
      }
    });
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  window.addEventListener('scroll', toggleFloatingButton);
}

// Toggle floating back-to-top button visibility
function toggleFloatingButton() {
  const button = document.getElementById('floatingBackToTop');
  if (window.scrollY > 300) {
    button.classList.add('show');
  } else {
    button.classList.remove('show');
  }
}

// Navigation functions
function scrollToChapters() {
  document.getElementById('chapters').scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToChapter(id) {
  window.location.href = `post-${id}.html?lang=${currentLang}`;
}

// Form submission
function handleSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const successMsg = currentLang === 'ur' 
    ? `شکریہ ${name}! آپ کا پیغام موصول ہو گیا ہے۔`
    : `شكراً ${name}! تم استلام رسالتك.`;
  
  alert(successMsg);
  event.target.reset();
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);