        // Chapters Data (30+ chapters)
        const chaptersData = [
            { id: 1, number: "باب 1", title: "پہلا دن", subtitle: "تعارف", description: "یہ کہانی کی شروعات ہے جہاں ہمارا ہیرو اپنے سفر کا آغاز کرتا ہے۔ نئی امیدوں اور خوابوں کے ساتھ۔" },
            { id: 2, number: "باب 2", title: "سفر کا آغاز", subtitle: "تیاریاں", description: "اہم فیصلے اور تیاریاں جو سفر کو ممکن بناتی ہیں۔ ہر قدم سوچ سمجھ کر اٹھایا جاتا ہے۔" },
            { id: 3, number: "باب 3", title: "پہاڑوں کے پار", subtitle: "مہم جوئی", description: "پہاڑوں کو عبور کرنا ایک بڑا چیلنج تھا۔ مشکلات کا سامنا کرتے ہوئے آگے بڑھنا۔" },
            { id: 4, number: "باب 4", title: "گمشدہ راز", subtitle: "پراسرار ملاقات", description: "ایک پراسرار شخص سے ملاقات جو کہانی کا رخ بدل دیتی ہے۔ راز کھلنے شروع ہوتے ہیں۔" },
            { id: 5, number: "باب 5", title: "فیصلہ کا لمحہ", subtitle: "انتخاب", description: "زندگی کا سب سے اہم فیصلہ کرنے کا وقت آ گیا ہے۔ کیا راستہ چنا جائے؟" },
            { id: 6, number: "باب 6", title: "اختتام", subtitle: "نئی شروعات", description: "ایک سفر کا خاتمہ لیکن نئے سفر کی ابتدا۔ ہر اختتام ایک نئی شروعات ہے۔" },
            { id: 30, number: "باب 30", title: "ابدیت", subtitle: "سفر جاری ہے", description: "یہ سفر کبھی ختم نہیں ہوتا۔ زندگی ایک مسلسل سفر ہے۔" }
        ];

        let displayedChapters = 6; // Initially show 6 chapters
        let filteredChapters = [...chaptersData];

        // Initialize page
        function init() {
            loadTheme();
            renderChapters();
            setupEventListeners();
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
                    return chapter.title.toLowerCase().includes(query) ||
                           chapter.subtitle.toLowerCase().includes(query) ||
                           chapter.description.toLowerCase().includes(query) ||
                           chapter.number.toLowerCase().includes(query);
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
            
            // Update button icon
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
            const themeToggle = document.getElementById('themeToggle');
            
            // Search with debounce
            let searchTimeout;
            searchBar.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    handleSearch(e.target.value);
                }, 300);
            });
            
            // Theme toggle
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Navigation functions
        function scrollToChapters() {
            document.getElementById('chapters').scrollIntoView({ behavior: 'smooth' });
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function goToChapter(id) {
            // Redirect to chapter page
            window.location.href = `post-${id}.html`;
        }

        // Form submission
        function handleSubmit(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to a server
            alert(`شکریہ ${name}! آپ کا پیغام موصول ہو گیا ہے۔`);
            
            // Reset form
            event.target.reset();
        }

        // Initialize when page loads
        window.addEventListener('DOMContentLoaded', init); 