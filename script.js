// Chapters Data - loaded from JSON
let chaptersData = [];
let displayedChapters = 6; // Initially show 6 chapters
let filteredChapters = [];

// Load chapters from JSON file
async function loadChaptersData() {
  try {
    const response = await fetch("assests/chapters.json");
    const data = await response.json();
    chaptersData = data.chapters;
    filteredChapters = [...chaptersData];
    renderChapters();
  } catch (error) {
    console.error("Error loading chapters:", error);
  }
}

// Initialize page
function init() {
  loadTheme();
  setupEventListeners();
  loadChaptersData();
}

// Render chapters
function renderChapters() {
  const grid = document.getElementById("chaptersGrid");
  const noResults = document.getElementById("noResults");
  const loadMoreBtn = document.getElementById("loadMoreContainer");

  grid.innerHTML = "";

  if (filteredChapters.length === 0) {
    noResults.style.display = "block";
    loadMoreBtn.style.display = "none";
    return;
  }

  noResults.style.display = "none";

  const chaptersToShow = filteredChapters.slice(0, displayedChapters);

  chaptersToShow.forEach((chapter) => {
    const card = document.createElement("div");
    card.className = "chapter-card";
    card.innerHTML = `
                    <div class="chapter-number">${chapter.number}</div>
                    <h3 class="chapter-title">${chapter.title} - ${chapter.subtitle}</h3>
                    <p class="chapter-description">${chapter.description}</p>
                    <button class="read-button" onclick="goToChapter(${chapter.id})">پڑھیں</button>
                `;
    grid.appendChild(card);
  });

  // Show/hide load more button
  if (filteredChapters.length > displayedChapters) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
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

  if (query === "") {
    filteredChapters = [...chaptersData];
  } else {
    filteredChapters = chaptersData.filter((chapter) => {
      return (
        chapter.title.toLowerCase().includes(query) ||
        chapter.subtitle.toLowerCase().includes(query) ||
        chapter.description.toLowerCase().includes(query) ||
        chapter.number.toLowerCase().includes(query)
      );
    });
  }

  displayedChapters = 6;
  renderChapters();
}

// Theme toggle
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Update button icon
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeToggle = document.getElementById("themeToggle");
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

// Setup event listeners
function setupEventListeners() {
  const searchBar = document.getElementById("searchBar");
  const desktopSearchBar = document.getElementById("desktopSearchBar");
  const searchIconBtn = document.getElementById("searchIconBtn");
  const searchDropdown = document.getElementById("searchDropdown");
  const themeToggle = document.getElementById("themeToggle");

  // guard missing elements
  if (searchIconBtn && searchDropdown && searchBar) {
    // Search icon click to toggle search dropdown on mobile
    // helper to position inline overlay search under the icon
    function positionInlineSearch() {
      if (!desktopSearchBar || !searchIconBtn) return;
      // ensure it's visible to measure
      desktopSearchBar.style.left = "";
      desktopSearchBar.style.right = "";

      const nav = document.querySelector("nav");
      const navRect = nav
        ? nav.getBoundingClientRect()
        : { left: 0, width: window.innerWidth };
      const iconRect = searchIconBtn.getBoundingClientRect();

      // overlay width (may be set by CSS); if zero, assume 180
      let overlayWidth = desktopSearchBar.offsetWidth || 180;

      // compute left relative to nav
      let left =
        iconRect.left + iconRect.width / 2 - overlayWidth / 2 - navRect.left;

      // clamp within nav bounds
      const minLeft = 8;
      const maxLeft = Math.max(8, navRect.width - overlayWidth - 8);
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      desktopSearchBar.style.left = `${left}px`;
    }

    searchIconBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // On small screens show an inline overlay search (desktopSearchBar)
      if (window.innerWidth <= 768 && desktopSearchBar) {
        if (desktopSearchBar.classList.contains("show-inline")) {
          desktopSearchBar.classList.remove("show-inline");
          desktopSearchBar.style.left = "";
        } else {
          desktopSearchBar.classList.add("show-inline");
          // position after it becomes visible
          requestAnimationFrame(() => {
            positionInlineSearch();
            desktopSearchBar.focus();
          });
        }
        return;
      }

      // fallback: toggle mobile dropdown if present
      if (searchDropdown) {
        if (searchDropdown.style.display === "block") {
          searchDropdown.style.display = "none";
        } else {
          searchDropdown.style.display = "block";
          searchBar.focus();
        }
      }
    });

    // Reposition or hide the inline search on resize
    window.addEventListener("resize", () => {
      if (
        desktopSearchBar &&
        desktopSearchBar.classList.contains("show-inline")
      ) {
        // if moved to desktop width, hide
        if (window.innerWidth > 768) {
          desktopSearchBar.classList.remove("show-inline");
          desktopSearchBar.style.left = "";
        } else {
          positionInlineSearch();
        }
      }
    });

    // Search with debounce (mobile dropdown)
    let searchTimeout;
    searchBar.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length > 0) {
        searchDropdown.style.display = "block";
      } else {
        searchDropdown.style.display = "none";
      }

      searchTimeout = setTimeout(() => {
        handleSearch(e.target.value);
      }, 300);
    });

    // Desktop inline search (if present)
    if (desktopSearchBar) {
      let desktopTimeout;
      desktopSearchBar.addEventListener("input", (e) => {
        clearTimeout(desktopTimeout);
        desktopTimeout = setTimeout(() => {
          handleSearch(e.target.value);
        }, 300);
      });
    }

    // Hide search dropdown when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".search-container") &&
        !e.target.closest(".search-dropdown")
      ) {
        if (window.innerWidth <= 768) {
          searchDropdown.style.display = "none";
        }
      }
    });
  }

  // Theme toggle
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  // Floating back-to-top button
  window.addEventListener("scroll", toggleFloatingButton);
}

// Toggle floating back-to-top button visibility
function toggleFloatingButton() {
  const button = document.getElementById("floatingBackToTop");
  if (window.scrollY > 300) {
    button.classList.add("show");
  } else {
    button.classList.remove("show");
  }
}

// Navigation functions
function scrollToChapters() {
  document.getElementById("chapters").scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToChapter(id) {
  // Redirect to chapter page
  window.location.href = `post-${id}.html`;
}

// Form submission
function handleSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Here you would typically send this data to a server
  alert(`شکریہ ${name}! آپ کا پیغام موصول ہو گیا ہے۔`);

  // Reset form
  event.target.reset();
}

// Initialize when page loads
window.addEventListener("DOMContentLoaded", init);
