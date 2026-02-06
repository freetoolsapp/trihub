/**
 * TriHub - Main JavaScript (Enhanced v2.0)
 * All core functionality for the website with tool loading
 */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TriHub initialized - v2.0');
    
    // Initialize all components
    initMobileMenu();
    initBackToTop();
    initSearchFunctionality();
    initSmoothScroll();
    initCategoryFilter();
    
    // Load tools automatically
    loadTools();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) {
        console.warn('⚠️ Mobile menu elements not found');
        return;
    }
    
    console.log('✅ Mobile menu initialized');
    
    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const icon = this.querySelector('i');
        const isNowVisible = mobileMenu.classList.toggle('hidden');
        
        // Update aria-expanded
        this.setAttribute('aria-expanded', !isNowVisible);
        
        // Toggle hamburger/close icon
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        
        console.log('📱 Menu toggled:', !isNowVisible ? 'OPEN' : 'CLOSED');
    });
    
    // Close menu when clicking on links
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(() => {
                closeMobileMenu();
            }, 200);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            if (!mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
            }
        }
    });
    
    // Helper function to close mobile menu
    function closeMobileMenu() {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) {
        console.warn('⚠️ Back to top button not found');
        return;
    }
    
    console.log('✅ Back to top button initialized');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Search Functionality with Tool Filtering
 */
function initSearchFunctionality() {
    const searchInput = document.querySelector('input[type="search"]');
    
    if (!searchInput) {
        console.warn('⚠️ Search input not found');
        return;
    }
    
    console.log('✅ Search functionality initialized');
    
    // Store all tools globally for search
    window.allTools = [];
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            // Show all tools
            loadTools();
            return;
        }
        
        if (searchTerm.length < 2) return;
        
        console.log('🔍 Searching for:', searchTerm);
        
        // Filter tools based on search term
        const filteredTools = window.allTools.filter(tool => {
            return tool.name.toLowerCase().includes(searchTerm) ||
                   tool.description.toLowerCase().includes(searchTerm) ||
                   tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                   tool.category.toLowerCase().includes(searchTerm);
        });
        
        displayTools(filteredTools);
        
        console.log(`📊 Found ${filteredTools.length} matching tools`);
    }, 300));
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('✅ Smooth scroll initialized');
}

/**
 * Initialize Category Filter
 */
function initCategoryFilter() {
    console.log('✅ Category filter initialized');
}

/**
 * Filter Tools by Category
 */
function filterTools(category) {
    console.log('🔍 Filtering tools by category:', category);
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
        btn.setAttribute('aria-selected', 'false');
    });
    
    // Set clicked button as active
    const clickedBtn = event.target.closest('.category-btn');
    if (clickedBtn) {
        clickedBtn.classList.remove('bg-gray-200', 'text-gray-700');
        clickedBtn.classList.add('active', 'bg-blue-600', 'text-white');
        clickedBtn.setAttribute('aria-selected', 'true');
    }
    
    // Filter and display tools
    if (category === 'all') {
        displayTools(window.allTools);
    } else {
        const filteredTools = window.allTools.filter(tool => tool.category === category);
        displayTools(filteredTools);
    }
    
    // Scroll to tools section
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Load Tools from JSON
 */
async function loadTools() {
    try {
        console.log('📦 Loading tools from JSON...');
        
        const response = await fetch('data/tools.json');
        
        if (!response.ok) {
            throw new Error('Failed to load tools.json');
        }
        
        const data = await response.json();
        window.allTools = data.tools;
        
        console.log(`✅ Loaded ${data.tools.length} tools`);
        
        // Display featured tools first
        const featuredTools = data.tools.filter(tool => tool.featured);
        const otherTools = data.tools.filter(tool => !tool.featured);
        
        displayTools([...featuredTools, ...otherTools]);
        
        // Display categories
        displayCategories(data.categories);
        
    } catch (error) {
        console.error('❌ Error loading tools:', error);
        showErrorMessage('Failed to load tools. Please refresh the page.');
    }
}

/**
 * Display Categories Filter
 */
function displayCategories(categories) {
    const categoriesContainer = document.getElementById('categoriesFilter');
    
    if (!categoriesContainer) return;
    
    categoriesContainer.innerHTML = `
        <button onclick="filterTools('all')" class="category-btn active bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-md" aria-selected="true">
            <i class="fas fa-th mr-2"></i>All Tools
        </button>
    `;
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.onclick = () => filterTools(category.id);
        btn.className = 'category-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all hover:bg-gray-300';
        btn.setAttribute('aria-selected', 'false');
        btn.innerHTML = `<i class="fas ${category.icon} mr-2"></i>${category.name}`;
        categoriesContainer.appendChild(btn);
    });
    
    console.log('✅ Categories displayed');
}

/**
 * Display Tools in Grid
 */
function displayTools(tools) {
    const grid = document.getElementById('toolsGrid');
    
    if (!grid) {
        console.warn('⚠️ Tools grid not found');
        return;
    }
    
    // Clear existing content
    grid.innerHTML = '';
    
    if (tools.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <i class="fas fa-search text-gray-300 text-6xl mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">No Tools Found</h3>
                <p class="text-gray-600 mb-6">Try a different search term or category.</p>
                <button onclick="loadTools()" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Show All Tools
                </button>
            </div>
        `;
        return;
    }
    
    // Add each tool to the grid
    tools.forEach((tool, index) => {
        const toolCard = createToolCard(tool);
        grid.appendChild(toolCard);
        
        // Add animation delay
        toolCard.style.animationDelay = `${index * 0.05}s`;
    });
    
    console.log(`✅ Displayed ${tools.length} tools`);
}

/**
 * Create Tool Card Element
 */
function createToolCard(tool) {
    const card = document.createElement('article');
    card.className = 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 animate-fadeInUp';
    
    // Color mapping
    const colorClasses = {
        'blue': { border: 'border-blue-600', gradient: 'from-blue-500 to-blue-700', badge: 'bg-blue-100 text-blue-800' },
        'red': { border: 'border-red-600', gradient: 'from-red-500 to-red-700', badge: 'bg-red-100 text-red-800' },
        'purple': { border: 'border-purple-600', gradient: 'from-purple-500 to-purple-700', badge: 'bg-purple-100 text-purple-800' },
        'green': { border: 'border-green-600', gradient: 'from-green-500 to-green-700', badge: 'bg-green-100 text-green-800' },
        'teal': { border: 'border-teal-600', gradient: 'from-teal-500 to-teal-700', badge: 'bg-teal-100 text-teal-800' },
        'orange': { border: 'border-orange-600', gradient: 'from-orange-500 to-orange-700', badge: 'bg-orange-100 text-orange-800' },
        'indigo': { border: 'border-indigo-600', gradient: 'from-indigo-500 to-indigo-700', badge: 'bg-indigo-100 text-indigo-800' }
    };
    
    const colors = colorClasses[tool.color] || colorClasses['blue'];
    card.classList.add(colors.border);
    
    // Badge mapping
    const badgeColors = {
        'NEW': 'bg-green-500',
        'HOT': 'bg-red-500',
        'POPULAR': 'bg-orange-500'
    };
    
    card.innerHTML = `
        ${tool.badge ? `
            <div class="absolute top-3 right-3 ${badgeColors[tool.badge] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-bold uppercase z-10 shadow-lg">
                ${tool.badge}
            </div>
        ` : ''}
        
        <div class="bg-gradient-to-br ${colors.gradient} p-6 text-white relative">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur">
                <i class="fas ${tool.icon} text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">${tool.name}</h3>
            <p class="text-white/90 text-sm">${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tool</p>
        </div>
        
        <div class="p-6">
            <p class="text-gray-600 mb-4 leading-relaxed min-h-[60px]">
                ${tool.description}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-4">
                ${tool.tags.slice(0, 3).map(tag => `
                    <span class="${colors.badge} px-3 py-1 rounded-full text-xs font-semibold">${tag}</span>
                `).join('')}
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                ${tool.rating ? `<span><i class="fas fa-star text-yellow-500 mr-1"></i>${tool.rating}/5</span>` : ''}
                ${tool.users ? `<span><i class="fas fa-users mr-1"></i>${tool.users} users</span>` : ''}
                <span><i class="fas fa-check-circle text-green-500 mr-1"></i>Free</span>
            </div>
            
            <a href="${tool.file}" class="block w-full text-center bg-gradient-to-r ${colors.gradient} text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                Launch Tool <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
    `;
    
    return card;
}

/**
 * Show Error Message
 */
function showErrorMessage(message) {
    const grid = document.getElementById('toolsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <i class="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="loadTools()" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Try Again
                </button>
            </div>
        `;
    }
    console.error('❌', message);
}

/**
 * Utility Functions
 */

// Debounce function for search
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

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Export functions for use in other scripts if needed
window.TriHub = {
    filterTools,
    loadTools,
    displayTools
};

// Add fadeInUp animation CSS if not already present
if (!document.getElementById('customAnimations')) {
    const style = document.createElement('style');
    style.id = 'customAnimations';
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ TriHub JavaScript fully loaded - Enhanced v2.0');
