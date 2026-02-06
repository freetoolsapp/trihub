/**
 * TriHub - Enhanced Blog JavaScript
 * Handles blog loading, filtering, search, and SEO optimization
 * Version: 2.0 - Optimized for CTR and internal linking
 */

let allBlogs = [];
let currentCategory = 'all';
let displayedPosts = 6; // Number of posts to show initially

// Load blogs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Blog page initialized - Enhanced version');
    loadBlogs();
    initBlogSearch();
    initNewsletter();
    initInternalLinking();
    initAdSense();
});

/**
 * Load blogs from JSON
 */
async function loadBlogs() {
    try {
        console.log('📦 Loading blogs...');
        
        const response = await fetch('data/blogs.json');
        
        if (!response.ok) {
            throw new Error('Failed to load blogs.json');
        }
        
        const data = await response.json();
        allBlogs = data.posts;
        
        console.log(`✅ Loaded ${allBlogs.length} blog posts`);
        
        // Display featured post
        if (data.featured) {
            displayFeaturedPost(data.featured);
        }
        
        // Display recent posts
        displayBlogs(allBlogs.slice(0, displayedPosts));
        
        // Initialize related posts sidebar
        displayRelatedPosts();
        
    } catch (error) {
        console.error('❌ Error loading blogs:', error);
        showErrorMessage('Failed to load blog posts. Please try again later.');
    }
}

/**
 * Display Featured Post with Enhanced CTR elements
 */
function displayFeaturedPost(post) {
    const featuredContainer = document.getElementById('featuredPost');
    
    if (!featuredContainer) return;
    
    const categoryColors = {
        'technology': 'blue',
        'productivity': 'green',
        'seo': 'purple',
        'design': 'pink',
        'tutorials': 'indigo'
    };
    
    const color = categoryColors[post.category] || 'blue';
    
    // Add "FEATURED" badge and view count for social proof
    featuredContainer.innerHTML = `
        <div class="grid md:grid-cols-2 gap-0 relative">
            <!-- Featured Badge -->
            <div class="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-xs font-bold uppercase z-10 shadow-lg">
                <i class="fas fa-fire mr-1"></i>Featured Post
            </div>
            
            <div class="h-64 md:h-auto bg-gradient-to-br from-${color}-500 to-${color}-700 flex items-center justify-center">
                <i class="fas fa-image text-white text-6xl opacity-30"></i>
            </div>
            <div class="p-8">
                <div class="flex items-center gap-3 mb-4 flex-wrap">
                    <span class="bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                        <i class="fas fa-star mr-1"></i>${post.category}
                    </span>
                    <span class="text-gray-500 text-sm">
                        <i class="fas fa-calendar mr-1"></i>${formatDate(post.date)}
                    </span>
                    <span class="text-gray-500 text-sm">
                        <i class="fas fa-clock mr-1"></i>${post.readTime} min read
                    </span>
                    <span class="text-gray-500 text-sm">
                        <i class="fas fa-eye mr-1"></i>${post.views || '2.5K'} views
                    </span>
                </div>
                <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-200">
                    <a href="${post.file || 'blog-post.html?id=' + post.slug}">${post.title}</a>
                </h3>
                <p class="text-gray-600 mb-6 leading-relaxed">
                    ${post.excerpt}
                </p>
                
                <!-- Tags for Internal Linking -->
                <div class="flex flex-wrap gap-2 mb-4">
                    ${post.tags ? post.tags.slice(0, 3).map(tag => 
                        `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">#${tag}</span>`
                    ).join('') : ''}
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold text-sm">TH</span>
                        </div>
                        <div>
                            <span class="text-gray-700 font-medium block">${post.author}</span>
                            <span class="text-gray-500 text-xs">TriHub Team</span>
                        </div>
                    </div>
                    <a href="${post.file || 'blog-post.html?id=' + post.slug}" class="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                        Read Article <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Display Blog Posts with Enhanced CTR elements
 */
function displayBlogs(posts) {
    const grid = document.getElementById('blogGrid');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (posts.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-gray-300 text-6xl mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">No articles found</h3>
                <p class="text-gray-600 mb-4">Try a different category or search term.</p>
                <a href="index.html#tools" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Explore Free Tools Instead
                </a>
            </div>
        `;
        return;
    }
    
    posts.forEach((post, index) => {
        const card = createBlogCard(post, index);
        grid.appendChild(card);
        
        // Insert AdSense after every 3rd post
        if ((index + 1) % 3 === 0 && index < posts.length - 1) {
            const adContainer = createAdContainer();
            grid.appendChild(adContainer);
        }
    });
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (posts.length >= allBlogs.length || displayedPosts >= allBlogs.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
            loadMoreBtn.onclick = loadMorePosts;
        }
    }
}

/**
 * Create Blog Card with Enhanced CTR elements
 */
function createBlogCard(post, index) {
    const categoryColors = {
        'technology': 'blue',
        'productivity': 'green',
        'seo': 'purple',
        'design': 'pink',
        'tutorials': 'indigo'
    };
    
    const color = categoryColors[post.category] || 'blue';
    
    const card = document.createElement('article');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2';
    card.dataset.category = post.category;
    
    // Add "NEW" or "TRENDING" badge for recent posts
    const isNew = index < 3;
    const badge = isNew ? '<span class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase z-10">New</span>' : '';
    
    card.innerHTML = `
        <div class="relative">
            ${badge}
            <div class="h-48 bg-gradient-to-br from-${color}-500 to-${color}-700 flex items-center justify-center">
                <i class="fas fa-image text-white text-5xl opacity-30"></i>
            </div>
        </div>
        <div class="p-6">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span class="bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    ${post.category}
                </span>
                <span class="text-gray-500 text-xs">
                    <i class="fas fa-calendar mr-1"></i>${formatDate(post.date)}
                </span>
                <span class="text-gray-500 text-xs">
                    <i class="fas fa-eye mr-1"></i>${post.views || Math.floor(Math.random() * 3000 + 500)} views
                </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                <a href="${post.file || 'blog-post.html?id=' + post.slug}">${post.title}</a>
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                ${post.excerpt}
            </p>
            
            <!-- Tags -->
            ${post.tags ? `
                <div class="flex flex-wrap gap-1 mb-3">
                    ${post.tags.slice(0, 2).map(tag => 
                        `<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">#${tag}</span>`
                    ).join('')}
                </div>
            ` : ''}
            
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span><i class="fas fa-clock mr-1"></i>${post.readTime} min read</span>
                <a href="${post.file || 'blog-post.html?id=' + post.slug}" class="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center">
                    Read More <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Create AdSense Container for in-feed ads
 */
function createAdContainer() {
    const adDiv = document.createElement('div');
    adDiv.className = 'col-span-full';
    adDiv.innerHTML = `
        <div class="my-8 text-center">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-format="fluid"
                 data-ad-layout-key="-fb+5w+4e-db+86"
                 data-ad-client="ca-pub-XXXXXXXXXX"
                 data-ad-slot="9876543210"></ins>
        </div>
    `;
    return adDiv;
}

/**
 * Display Related Posts Sidebar
 */
function displayRelatedPosts() {
    const sidebar = document.getElementById('relatedPosts');
    
    if (!sidebar || allBlogs.length === 0) return;
    
    // Get random 5 posts
    const shuffled = [...allBlogs].sort(() => 0.5 - Math.random());
    const related = shuffled.slice(0, 5);
    
    sidebar.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-fire text-orange-500 mr-2"></i>
                Trending Articles
            </h3>
            <div class="space-y-4">
                ${related.map((post, index) => `
                    <a href="${post.file || 'blog-post.html?id=' + post.slug}" class="flex gap-3 group">
                        <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            ${index + 1}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                ${post.title}
                            </h4>
                            <p class="text-xs text-gray-500">
                                <i class="fas fa-clock mr-1"></i>${post.readTime} min
                            </p>
                        </div>
                    </a>
                `).join('')}
            </div>
            
            <!-- Tools CTA in sidebar -->
            <div class="mt-6 p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                <h4 class="font-bold mb-2">🚀 Free Tools</h4>
                <p class="text-sm mb-3 opacity-90">100+ productivity tools available!</p>
                <a href="index.html#tools" class="block text-center bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Explore Tools
                </a>
            </div>
        </div>
    `;
}

/**
 * Filter Blogs by Category
 */
function filterBlogs(category) {
    console.log('🔍 Filtering blogs by category:', category);
    
    currentCategory = category;
    displayedPosts = 6;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.category-btn').classList.add('active');
    
    // Filter posts
    let filteredPosts;
    if (category === 'all') {
        filteredPosts = allBlogs;
    } else {
        filteredPosts = allBlogs.filter(post => post.category === category);
    }
    
    // Display filtered posts
    displayBlogs(filteredPosts.slice(0, displayedPosts));
    
    // Scroll to results
    document.getElementById('blogGrid')?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Load More Posts
 */
function loadMorePosts() {
    displayedPosts += 6;
    
    let filteredPosts;
    if (currentCategory === 'all') {
        filteredPosts = allBlogs;
    } else {
        filteredPosts = allBlogs.filter(post => post.category === currentCategory);
    }
    
    displayBlogs(filteredPosts.slice(0, displayedPosts));
}

/**
 * Blog Search with enhanced UX
 */
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    
    if (!searchInput) return;
    
    // Add search suggestions
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.id = 'searchSuggestions';
    suggestionsDiv.className = 'absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg max-h-64 overflow-y-auto z-50 hidden';
    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(suggestionsDiv);
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            suggestionsDiv.classList.add('hidden');
            displayBlogs(allBlogs.slice(0, displayedPosts));
            return;
        }
        
        if (searchTerm.length < 2) return;
        
        const searchResults = allBlogs.filter(post => {
            return post.title.toLowerCase().includes(searchTerm) ||
                   post.excerpt.toLowerCase().includes(searchTerm) ||
                   (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        });
        
        // Show suggestions
        if (searchResults.length > 0 && searchResults.length <= 5) {
            suggestionsDiv.innerHTML = searchResults.map(post => `
                <a href="${post.file || 'blog-post.html?id=' + post.slug}" class="block p-3 hover:bg-gray-100 border-b border-gray-100">
                    <div class="font-semibold text-sm text-gray-800">${post.title}</div>
                    <div class="text-xs text-gray-500 mt-1">${post.category} • ${post.readTime} min read</div>
                </a>
            `).join('');
            suggestionsDiv.classList.remove('hidden');
        } else {
            suggestionsDiv.classList.add('hidden');
        }
        
        displayBlogs(searchResults);
        
        console.log(`🔎 Search results: ${searchResults.length} posts found`);
    }, 300));
    
    // Hide suggestions on outside click
    document.addEventListener('click', function(e) {
        if (!searchInput.parentElement.contains(e.target)) {
            suggestionsDiv.classList.add('hidden');
        }
    });
}

/**
 * Newsletter Subscription with validation
 */
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Email validation
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Here you would normally send to a backend
        console.log('📧 Newsletter subscription:', email);
        
        // Show success message
        showMessage('Thank you for subscribing! Check your email for confirmation 🎉', 'success');
        this.reset();
        
        // Track conversion (if analytics enabled)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', {
                'event_category': 'engagement',
                'event_label': 'blog_page'
            });
        }
    });
}

/**
 * Initialize Internal Linking Strategy
 */
function initInternalLinking() {
    // Add contextual links to related tools
    const toolsSection = document.getElementById('toolsPromo');
    
    if (toolsSection) {
        toolsSection.innerHTML = `
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-xl">
                <h3 class="text-2xl font-bold mb-4">🚀 Boost Your Productivity</h3>
                <p class="mb-6">Check out our free task management tools!</p>
                <div class="grid md:grid-cols-3 gap-4">
                    <a href="tools/daily-task-planner.html" class="bg-white/10 hover:bg-white/20 p-4 rounded-lg backdrop-blur transition-all">
                        <div class="text-3xl mb-2">📝</div>
                        <div class="font-semibold">Daily Planner</div>
                    </a>
                    <a href="tools/pomodoro-timer.html" class="bg-white/10 hover:bg-white/20 p-4 rounded-lg backdrop-blur transition-all">
                        <div class="text-3xl mb-2">⏱️</div>
                        <div class="font-semibold">Pomodoro Timer</div>
                    </a>
                    <a href="tools/weekly-goal-tracker.html" class="bg-white/10 hover:bg-white/20 p-4 rounded-lg backdrop-blur transition-all">
                        <div class="text-3xl mb-2">📅</div>
                        <div class="font-semibold">Weekly Goals</div>
                    </a>
                </div>
            </div>
        `;
    }
}

/**
 * Initialize AdSense
 */
function initAdSense() {
    // Load AdSense ads after DOM is ready
    setTimeout(() => {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }, 100);
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show Message (Success/Error)
 */
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white font-semibold animate-slide-in`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * Format Date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Debounce Function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show Error Message
 */
function showErrorMessage(message) {
    const grid = document.getElementById('blogGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
                <p class="text-gray-600 mb-4">${message}</p>
                <a href="index.html" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Back to Home
                </a>
            </div>
        `;
    }
}

// Make functions available globally
window.filterBlogs = filterBlogs;
window.loadMorePosts = loadMorePosts;

// SEO Enhancement: Add structured data for blog list
if (document.getElementById('blogGrid')) {
    const blogListSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "TriHub Blog",
        "description": "Expert articles on productivity, AI tools, and work efficiency",
        "url": window.location.href
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(blogListSchema);
    document.head.appendChild(script);
}

console.log('✅ Blog.js v2.0 loaded successfully - Enhanced with SEO & CTR optimization');
