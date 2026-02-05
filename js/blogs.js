/**
 * TriHub - Blog JavaScript
 * Handles blog loading, filtering, and search
 */

let allBlogs = [];
let currentCategory = 'all';
let displayedPosts = 6; // Number of posts to show initially

// Load blogs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Blog page initialized');
    loadBlogs();
    initBlogSearch();
    initNewsletter();
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
        
    } catch (error) {
        console.error('❌ Error loading blogs:', error);
        showErrorMessage('Failed to load blog posts. Please try again later.');
    }
}

/**
 * Display Featured Post
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
    
    featuredContainer.innerHTML = `
        <div class="grid md:grid-cols-2 gap-0">
            <div class="h-64 md:h-auto bg-gradient-to-br from-${color}-500 to-${color}-700 flex items-center justify-center">
                <i class="fas fa-image text-white text-6xl opacity-30"></i>
            </div>
            <div class="p-8">
                <div class="flex items-center gap-3 mb-4">
                    <span class="bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                        <i class="fas fa-star mr-1"></i>${post.category}
                    </span>
                    <span class="text-gray-500 text-sm">
                        <i class="fas fa-calendar mr-1"></i>${formatDate(post.date)}
                    </span>
                    <span class="text-gray-500 text-sm">
                        <i class="fas fa-clock mr-1"></i>${post.readTime} min read
                    </span>
                </div>
                <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-200">
                    <a href="${post.file || 'blog-post.html?id=' + post.slug}">${post.title}</a>
                </h3>
                <p class="text-gray-600 mb-6 leading-relaxed">
                    ${post.excerpt}
                </p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold text-sm">TH</span>
                        </div>
                        <span class="text-gray-700 font-medium">${post.author}</span>
                    </div>
                    <a href="${post.file || 'blog-post.html?id=' + post.slug}" class="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800">
                        Read More <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Display Blog Posts
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
                <p class="text-gray-600">Try a different category or search term.</p>
            </div>
        `;
        return;
    }
    
    posts.forEach(post => {
        const card = createBlogCard(post);
        grid.appendChild(card);
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
 * Create Blog Card
 */
function createBlogCard(post) {
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
    
    card.innerHTML = `
        <div class="h-48 bg-gradient-to-br from-${color}-500 to-${color}-700 flex items-center justify-center">
            <i class="fas fa-image text-white text-5xl opacity-30"></i>
        </div>
        <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
                <span class="bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    ${post.category}
                </span>
                <span class="text-gray-500 text-xs">
                    <i class="fas fa-calendar mr-1"></i>${formatDate(post.date)}
                </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                <a href="${post.file || 'blog-post.html?id=' + post.slug}">${post.title}</a>
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                ${post.excerpt}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span><i class="fas fa-clock mr-1"></i>${post.readTime} min read</span>
                <a href="${post.file || 'blog-post.html?id=' + post.slug}" class="text-blue-600 font-semibold hover:text-blue-800">
                    Read More <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
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
 * Blog Search
 */
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length === 0) {
            displayBlogs(allBlogs.slice(0, displayedPosts));
            return;
        }
        
        if (searchTerm.length < 2) return;
        
        const searchResults = allBlogs.filter(post => {
            return post.title.toLowerCase().includes(searchTerm) ||
                   post.excerpt.toLowerCase().includes(searchTerm) ||
                   post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
        
        displayBlogs(searchResults);
        
        console.log(`🔍 Search results: ${searchResults.length} posts found`);
    }, 300));
}

/**
 * Newsletter Subscription
 */
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        // Here you would normally send to a backend
        console.log('📧 Newsletter subscription:', email);
        
        // Show success message
        alert('Thank you for subscribing! 🎉');
        this.reset();
    });
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
                <p class="text-gray-600">${message}</p>
            </div>
        `;
    }
}

// Make filterBlogs available globally
window.filterBlogs = filterBlogs;
