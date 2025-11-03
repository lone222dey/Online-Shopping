// Generated for WorkShala — Vanilla HTML/CSS/JS. Open index.html to run.

(function() {
    'use strict';

    let currentProduct = null;
    let selectedQuantity = 1;

    document.addEventListener('DOMContentLoaded', function() {
        initializeProductPage();
    });

    function initializeProductPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            showProductNotFound();
            return;
        }

        currentProduct = window.products.find(p => p.id === productId);
        
        if (!currentProduct) {
            showProductNotFound();
            return;
        }

        renderProduct();
        setupEventListeners();
    }

    function renderProduct() {
        const container = document.getElementById('productContainer');
        if (!container) return;

        const stockStatus = currentProduct.stock > 0 ? 
            `<div class="stock-info in-stock">✓ In Stock (${currentProduct.stock} available)</div>` :
            `<div class="stock-info out-of-stock">✗ Out of Stock</div>`;

        const badges = currentProduct.badges.map(badge => 
            `<span class="badge">${badge}</span>`
        ).join('');

        const stars = '★'.repeat(Math.floor(currentProduct.rating)) + 
                     (currentProduct.rating % 1 >= 0.5 ? '☆' : '') + 
                     '☆'.repeat(5 - Math.ceil(currentProduct.rating));

        const thumbnails = currentProduct.images.map((image, index) => 
            `<img src="${image}" alt="Product image ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                  onclick="changeMainImage('${image}', ${index})">`
        ).join('');

        container.innerHTML = `
            <div class="product-container">
                <div class="product-images">
                    <img src="${currentProduct.images[0]}" alt="${currentProduct.title}" class="main-image" id="mainImage">
                    <div class="thumbnail-images">
                        ${thumbnails}
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-badges">${badges}</div>
                    
                    <h1 class="product-title">${currentProduct.title}</h1>
                    
                    <div class="product-rating">
                        <span class="rating-stars">${stars}</span>
                        <span class="rating-text">${currentProduct.rating} out of 5</span>
                    </div>
                    
                    <div class="product-price">
                        <span class="current-price">₹${currentProduct.price}</span>
                        <span class="original-price">₹${currentProduct.mrp}</span>
                        <span class="discount-badge">${currentProduct.discountPercent}% OFF</span>
                    </div>
                    
                    ${stockStatus}
                    
                    <div class="product-description">
                        <p>${currentProduct.description}</p>
                    </div>
                    
                    <div class="quantity-selector">
                        <label style="color: var(--text); font-weight: 500;">Quantity:</label>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(-1)" ${currentProduct.stock === 0 ? 'disabled' : ''}>-</button>
                            <input type="number" class="quantity-input" id="quantityInput" value="1" min="1" max="${currentProduct.stock}" 
                                   onchange="setQuantity(this.value)" ${currentProduct.stock === 0 ? 'disabled' : ''}>
                            <button class="quantity-btn" onclick="updateQuantity(1)" ${currentProduct.stock === 0 ? 'disabled' : ''}>+</button>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <button class="action-btn add-to-cart" onclick="addToCartFromProduct()" 
                                ${currentProduct.stock === 0 ? 'disabled' : ''}>
                            ${currentProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="action-btn buy-now" onclick="buyNow()" 
                                ${currentProduct.stock === 0 ? 'disabled' : ''}>
                            ${currentProduct.stock === 0 ? 'Unavailable' : 'Buy Now'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function setupEventListeners() {
        // Update page title
        document.title = `${currentProduct.title} - WorkShala`;
    }

    function showProductNotFound() {
        const container = document.getElementById('productContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="product-not-found">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <button class="form-btn" onclick="window.location.href='index.html'">
                    Browse Products
                </button>
            </div>
        `;
    }

    // Global functions for product page interactions
    window.changeMainImage = function(imageSrc, index) {
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.src = imageSrc;
        }

        // Update active thumbnail
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    };

    window.updateQuantity = function(change) {
        const input = document.getElementById('quantityInput');
        if (!input) return;

        const newQuantity = Math.max(1, Math.min(currentProduct.stock, selectedQuantity + change));
        selectedQuantity = newQuantity;
        input.value = newQuantity;
    };

    window.setQuantity = function(value) {
        const quantity = parseInt(value);
        if (isNaN(quantity) || quantity < 1) {
            selectedQuantity = 1;
        } else if (quantity > currentProduct.stock) {
            selectedQuantity = currentProduct.stock;
        } else {
            selectedQuantity = quantity;
        }
        
        const input = document.getElementById('quantityInput');
        if (input) {
            input.value = selectedQuantity;
        }
    };

    window.addToCartFromProduct = function() {
        if (!currentProduct || currentProduct.stock === 0) return;

        if (typeof window.CartManager !== 'undefined') {
            let success = true;
            
            // Add the selected quantity
            for (let i = 0; i < selectedQuantity; i++) {
                if (!window.CartManager.addToCart(currentProduct.id, 1)) {
                    success = false;
                    break;
                }
            }

            if (success) {
                showMessage(`${selectedQuantity} item(s) added to cart!`, 'success');
                
                // Animate the add to cart button
                const addToCartBtn = document.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    addToCartBtn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        addToCartBtn.style.transform = 'scale(1)';
                    }, 150);
                }
            } else {
                showMessage('Unable to add all items to cart. Check stock availability.', 'error');
            }
        } else {
            console.error('CartManager not loaded');
        }
    };

    window.buyNow = function() {
        if (!currentProduct || currentProduct.stock === 0) return;

        // Add to cart first
        if (typeof window.CartManager !== 'undefined') {
            // Clear cart and add this product
            window.CartManager.clearCart();
            
            let success = true;
            for (let i = 0; i < selectedQuantity; i++) {
                if (!window.CartManager.addToCart(currentProduct.id, 1)) {
                    success = false;
                    break;
                }
            }

            if (success) {
                // Redirect to checkout
                window.location.href = 'checkout.html';
            } else {
                showMessage('Unable to process order. Please try again.', 'error');
            }
        } else {
            console.error('CartManager not loaded');
        }
    };

    function showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        document.body.insertBefore(message, document.body.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

})();