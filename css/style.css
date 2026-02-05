/* ============================================
   TriHub - Custom Styles
   ============================================ */

/* Smooth Scroll with Padding for Sticky Header */
html {
    scroll-behavior: smooth;
    scroll-padding-top: 100px;
}

/* ============================================
   Mobile Menu Animations
   ============================================ */

@keyframes slideDown {
    from {
        opacity: 0;
        max-height: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        max-height: 500px;
        transform: translateY(0);
    }
}

@keyframes slideUp {
    from {
        opacity: 1;
        max-height: 500px;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        max-height: 0;
        transform: translateY(-20px);
    }
}

/* Mobile Menu States */
#mobileMenu {
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

#mobileMenu:not(.hidden) {
    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

#mobileMenu.hidden {
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    max-height: 0;
    opacity: 0;
}

/* ============================================
   Category Buttons (for future tools section)
   ============================================ */

.category-btn {
    background: #f3f4f6;
    color: #374151;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.category-btn:hover {
    background: #e5e7eb;
    transform: translateY(-2px);
}

.category-btn.active {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    border-color: #3b82f6;
}

/* ============================================
   Tool Cards (for future tools)
   ============================================ */

.tool-card {
    transition: all 0.3s ease;
}

.tool-card:hover {
    transform: translateY(-5px);
}

/* ============================================
   Loading Animation
   ============================================ */

@keyframes pulse {
    0%, 100% { 
        opacity: 1; 
    }
    50% { 
        opacity: 0.5; 
    }
}

.loading {
    animation: pulse 1.5s ease-in-out infinite;
}

/* ============================================
   Scroll Margin for Sections
   ============================================ */

section[id], 
main[id], 
#tools {
    scroll-margin-top: 120px;
}

/* ============================================
   Back to Top Button
   ============================================ */

#backToTop {
    transition: all 0.3s ease;
}

#backToTop:hover {
    transform: translateY(-3px);
}

/* ============================================
   Custom Scrollbar
   ============================================ */

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
}

/* ============================================
   Accessibility - Focus States
   ============================================ */

a:focus,
button:focus,
input:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* ============================================
   Utility Classes
   ============================================ */

.gradient-text {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.shadow-glow {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

/* ============================================
   Responsive Adjustments
   ============================================ */

@media (max-width: 768px) {
    html {
        scroll-padding-top: 80px;
    }
    
    section[id], 
    main[id] {
        scroll-margin-top: 80px;
    }
}
