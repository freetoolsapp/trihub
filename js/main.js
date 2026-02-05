/**
 * TriHub - Main JavaScript
 * All core functionality for the website
 */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TriHub initialized');
    
    // Initialize all components
    initMobileMenu();
    initBackToTop();
    initSearchFunctionality();
    initSmoothScroll();
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
 * Search Functionality (basic implementation)
 */
function initSearchFunctionality() {
    const searchInput = document.querySelector('input[type="search"]');
    
    if (!searchInput) {
        console.warn('⚠️ Search input not found');
        return;
    }
    
    console.log('✅ Search functionality initialized');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 2) {
            console.log('🔍 Searching for:', searchTerm);
            // Future: Implement actual search functionality here
            // This will search through tools, blogs, and resources
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchTerm = e.target.value.toLowerCase();
            console.log('🔍 Search submitted:', searchTerm);
            // Future: Handle search submission
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
 * Filter Tools by Category
 * This will be used when tools are added
 */
function filterTools(category) {
    console.log('🔍 Filtering tools by category:', category);
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    // Set clicked button as active
    event.target.closest('.category-btn').classList.add('active');
    event.target.closest('.category-btn').setAttribute('aria-selected', 'true');
    
    // Future: Implement actual filtering logic here
    // This will filter tools based on category
}

/**
 * Load Tools from JSON
 * Future implementation when tools.json is ready
 */
async function loadTools() {
    try {
        console.log('📦 Loading tools...');
        
        const response = await fetch('data/tools.json');
        
        if (!response.ok) {
            throw new Error('Failed to load tools.json');
        }
        
        const data = await response.json();
        console.log(`✅ Loaded ${data.tools.length} tools`);
        
        // Display tools
        displayTools(data.tools);
        
    } catch (error) {
        console.error('❌ Error loading tools:', error);
        // Show error message to user
        showErrorMessage('Failed to load tools. Please try again later.');
    }
}

/**
 * Display Tools in Grid
 * Future implementation
 */
function displayTools(tools) {
    const grid = document.getElementById('toolsGrid');
    
    if (!grid) {
        console.warn('⚠️ Tools grid not found');
        return;
    }
    
    // Clear existing content
    grid.innerHTML = '';
    
    // Add each tool to the grid
    tools.forEach(tool => {
        const toolCard = createToolCard(tool);
        grid.appendChild(toolCard);
    });
    
    console.log(`✅ Displayed ${tools.length} tools`);
}

/**
 * Create Tool Card Element
 * Future implementation
 */
function createToolCard(tool) {
    // This will create and return a tool card element
    // Implementation will be added when tools are ready
    const card = document.createElement('div');
    card.className = 'tool-card';
    return card;
}

/**
 * Show Error Message
 */
function showErrorMessage(message) {
    // Simple error display (can be enhanced with a modal or toast)
    console.error('❌', message);
    
    // Future: Show user-friendly error notification
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

console.log('✅ TriHub JavaScript fully loaded');
