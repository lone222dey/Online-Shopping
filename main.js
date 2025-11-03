// Generated for WorkShala — Vanilla HTML/CSS/JS. Open index.html to run.

(function() {
    'use strict';

    // Global variables
    let searchTimeout;
    const SEARCH_DELAY = 300;

    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        setupEventListeners();
        renderProducts();
        updateAuthUI();
        updateCartCount();
    }

    function setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounceSearch);
        }

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
            mobileMenu.addEventListener('click', function(e) {
                if (e.target === mobileMenu) {
                    closeMobileMenu();
                }
            });
        }

        // Category navigation
        const categoryLinks = document.querySelectorAll('.categories-menu a, .mobile-categories a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('href').substring(1);
                scrollToCategory(category);
                closeMobileMenu();
            });
        });

        // Hero CTA button
        const ctaBtn = document.querySelector('.cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', function() {
                scrollToCategory('books');
            });
        }

        // Logout functionality
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }

    function debounceSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = document.getElementById('searchInput').value.trim();
            if (query.length > 0) {
                performSearch(query);
            } else {
                renderProducts();
            }
        }, SEARCH_DELAY);
    }

    function performSearch(query) {
        const filteredProducts = window.products.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );

        renderSearchResults(filteredProducts, query);
    }

    function renderSearchResults(products, query) {
        // Hide category sections and show search results
        const categorySection = document.querySelector('.categories');
        const trendingSection = document.querySelector('.trending');
        
        if (categorySection) categorySection.style.display = 'none';
        if (trendingSection) trendingSection.style.display = 'none';

        // Create or update search results section
        let searchSection = document.querySelector('.search-results');
        if (!searchSection) {
            searchSection = document.createElement('section');
            searchSection.className = 'search-results';
            searchSection.innerHTML = `
                <div class="container">
                    <h2>Search Results for "${query}" (${products.length} items)</h2>
                    <div class="products-grid" id="searchProductsGrid"></div>
                </div>
            `;
            document.querySelector('.hero').insertAdjacentElement('afterend', searchSection);
        } else {
            searchSection.querySelector('h2').textContent = `Search Results for "${query}" (${products.length} items)`;
        }

        const grid = searchSection.querySelector('#searchProductsGrid');
        grid.innerHTML = '';
        
        if (products.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">No products found matching your search.</p>';
        } else {
            products.forEach(product => {
                grid.appendChild(createProductCard(product));
            });
        }
    }

    function renderProducts() {
        // Show all sections
        const categorySection = document.querySelector('.categories');
        const trendingSection = document.querySelector('.trending');
        const searchSection = document.querySelector('.search-results');
        
        if (categorySection) categorySection.style.display = 'block';
        if (trendingSection) trendingSection.style.display = 'block';
        if (searchSection) searchSection.remove();

        renderTrendingProducts();
        renderCategoryProducts();
    }

    function renderTrendingProducts() {
        const trendingGrid = document.getElementById('trendingProducts');
        if (!trendingGrid) return;

        // Get top 6 trending products (highest rated and most discounted)
        const trending = window.products
            .sort((a, b) => (b.rating + b.discountPercent/10) - (a.rating + a.discountPercent/10))
            .slice(0, 6);

        trendingGrid.innerHTML = '';
        trending.forEach(product => {
            trendingGrid.appendChild(createProductCard(product));
        });
    }

    function renderCategoryProducts() {
        const categories = ['Books', 'Furniture', 'Electronics', 'Stationery'];
        
        categories.forEach(category => {
            const gridId = category.toLowerCase() + 'Products';
            const grid = document.getElementById(gridId);
            if (!grid) return;

            const categoryProducts = window.products.filter(p => p.category === category);
            grid.innerHTML = '';
            
            categoryProducts.forEach(product => {
                grid.appendChild(createProductCard(product));
            });
        });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);

        const stockStatus = product.stock > 0 ? 
            `<div class="stock-status in-stock">In Stock (${product.stock})</div>` :
            `<div class="stock-status out-of-stock">Out of Stock</div>`;

        const badges = product.badges.map(badge => 
            `<span class="badge">${badge}</span>`
        ).join('');

        const stars = '★'.repeat(Math.floor(product.rating)) + 
                     (product.rating % 1 >= 0.5 ? '☆' : '') + 
                     '☆'.repeat(5 - Math.ceil(product.rating));

        card.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}" class="product-image" loading="lazy">
            <div class="product-badges">${badges}</div>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                <span class="rating-stars">${stars}</span>
                <span class="rating-value">${product.rating}</span>
            </div>
            <div class="product-price">
                <span class="price">₹${product.price}</span>
                <span class="mrp">₹${product.mrp}</span>
                <span class="discount">${product.discountPercent}% off</span>
            </div>
            ${stockStatus}
            <div class="product-actions">
                <button class="add-to-cart-btn" ${product.stock === 0 ? 'disabled' : ''} 
                        onclick="addToCart('${product.id}')">
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button class="view-details-btn" onclick="viewProduct('${product.id}')">
                    View Details
                </button>
            </div>
        `;

        return card;
    }

    function scrollToCategory(categoryId) {
        const element = document.getElementById(categoryId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
        }
    }

    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.style.display = 'none';
        }
    }

    function updateAuthUI() {
        const session = JSON.parse(localStorage.getItem('workshala_session') || 'null');
        const authSection = document.querySelector('.auth-section');
        const userSection = document.querySelector('.user-section');
        const userNameSpan = document.querySelector('.user-name');

        if (session && session.name) {
            if (authSection) authSection.style.display = 'none';
            if (userSection) userSection.style.display = 'block';
            if (userNameSpan) userNameSpan.textContent = session.name;
        } else {
            if (authSection) authSection.style.display = 'flex';
            if (userSection) userSection.style.display = 'none';
        }
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('workshala_cart') || '[]');
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    function logout() {
        localStorage.removeItem('workshala_session');
        updateAuthUI();
        showMessage('Logged out successfully', 'success');
    }

    function showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        document.body.insertBefore(message, document.body.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // Global functions for product interactions
    window.addToCart = function(productId) {
        if (typeof window.CartManager !== 'undefined') {
            const success = window.CartManager.addToCart(productId);
            if (success) {
                updateCartCount();
                animateCartAdd();
                showMessage('Product added to cart!', 'success');
            }
        } else {
            console.error('CartManager not loaded');
        }
    };

    window.viewProduct = function(productId) {
        window.location.href = `productpage.html?id=${productId}`;
    };

    function animateCartAdd() {
        // Simple cart animation
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Listen for storage changes to update cart count
    window.addEventListener('storage', function(e) {
        if (e.key === 'workshala_cart') {
            updateCartCount();
        }
        if (e.key === 'workshala_session') {
            updateAuthUI();
        }
    });

    // Export for other modules
    window.MainApp = {
        updateCartCount,
        updateAuthUI,
        showMessage
    };

})();