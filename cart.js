// Generated for WorkShala — Vanilla HTML/CSS/JS. Open index.html to run.

(function() {
    'use strict';

    const CartManager = {
        // Get cart from localStorage
        getCart: function() {
            return JSON.parse(localStorage.getItem('workshala_cart') || '[]');
        },

        // Save cart to localStorage
        saveCart: function(cart) {
            localStorage.setItem('workshala_cart', JSON.stringify(cart, null, 2));
            this.updateCartCount();
        },

        // Add product to cart
        addToCart: function(productId, quantity = 1) {
            const product = window.products.find(p => p.id === productId);
            if (!product) {
                console.error('Product not found:', productId);
                return false;
            }

            if (product.stock === 0) {
                console.error('Product out of stock:', productId);
                return false;
            }

            const cart = this.getCart();
            const existingItem = cart.find(item => item.productId === productId);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity <= product.stock) {
                    existingItem.quantity = newQuantity;
                } else {
                    console.error('Not enough stock available');
                    return false;
                }
            } else {
                if (quantity <= product.stock) {
                    cart.push({
                        productId: productId,
                        quantity: quantity,
                        addedAt: new Date().toISOString()
                    });
                } else {
                    console.error('Not enough stock available');
                    return false;
                }
            }

            this.saveCart(cart);
            return true;
        },

        // Remove product from cart
        removeFromCart: function(productId) {
            const cart = this.getCart();
            const updatedCart = cart.filter(item => item.productId !== productId);
            this.saveCart(updatedCart);
        },

        // Update quantity of item in cart
        updateQuantity: function(productId, quantity) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
                return true;
            }

            const product = window.products.find(p => p.id === productId);
            if (!product) {
                console.error('Product not found:', productId);
                return false;
            }

            if (quantity > product.stock) {
                console.error('Not enough stock available');
                return false;
            }

            const cart = this.getCart();
            const item = cart.find(item => item.productId === productId);
            
            if (item) {
                item.quantity = quantity;
                this.saveCart(cart);
                return true;
            }

            return false;
        },

        // Get cart items with product details
        getCartWithDetails: function() {
            const cart = this.getCart();
            return cart.map(item => {
                const product = window.products.find(p => p.id === item.productId);
                return {
                    ...item,
                    product: product,
                    subtotal: product ? product.price * item.quantity : 0
                };
            }).filter(item => item.product); // Filter out items where product is not found
        },

        // Get cart totals
        getCartTotals: function() {
            const cartItems = this.getCartWithDetails();
            const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
            const tax = Math.round(subtotal * 0.18); // 18% GST
            const total = subtotal + shipping + tax;

            return {
                subtotal,
                shipping,
                tax,
                total,
                itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
            };
        },

        // Clear cart
        clearCart: function() {
            localStorage.removeItem('workshala_cart');
            this.updateCartCount();
        },

        // Update cart count in UI
        updateCartCount: function() {
            const cart = this.getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                element.textContent = totalItems;
            });
        }
    };

    // Initialize cart page if we're on cart.html
    document.addEventListener('DOMContentLoaded', function() {
        if (window.location.pathname.includes('cart.html')) {
            initializeCartPage();
        }
    });

    function initializeCartPage() {
        renderCartItems();
        setupCartEventListeners();
    }

    function setupCartEventListeners() {
        // Continue shopping button
        const continueBtn = document.getElementById('continueShopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                const cart = CartManager.getCart();
                if (cart.length === 0) {
                    showMessage('Your cart is empty', 'error');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }

        // Clear cart button
        const clearCartBtn = document.getElementById('clearCart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear your cart?')) {
                    CartManager.clearCart();
                    renderCartItems();
                    showMessage('Cart cleared', 'success');
                }
            });
        }
    }

    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        
        if (!cartItemsContainer || !cartSummary) return;

        const cartItems = CartManager.getCartWithDetails();
        const totals = CartManager.getCartTotals();

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <button class="form-btn" onclick="window.location.href='index.html'">
                        Continue Shopping
                    </button>
                </div>
            `;
            cartSummary.innerHTML = '';
            return;
        }

        // Render cart items
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-product-id="${item.productId}">
                <img src="${item.product.images[0]}" alt="${item.product.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.product.title}</h3>
                    <p class="cart-item-price">₹${item.product.price}</p>
                    <div class="cart-item-stock">
                        ${item.product.stock > 0 ? 
                            `<span class="in-stock">In Stock (${item.product.stock})</span>` :
                            `<span class="out-of-stock">Out of Stock</span>`
                        }
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="${item.product.stock}" 
                           onchange="updateCartQuantity('${item.productId}', this.value)">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-subtotal">
                    <span>₹${item.subtotal}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="removeCartItem('${item.productId}')">Remove</button>
                </div>
            </div>
        `).join('');

        // Render cart summary
        cartSummary.innerHTML = `
            <div class="cart-summary-section">
                <h3>Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal (${totals.itemCount} items)</span>
                    <span>₹${totals.subtotal}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>${totals.shipping === 0 ? 'FREE' : '₹' + totals.shipping}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (GST 18%)</span>
                    <span>₹${totals.tax}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>₹${totals.total}</span>
                </div>
                ${totals.subtotal < 500 ? 
                    `<p class="shipping-note">Add ₹${500 - totals.subtotal} more for free shipping!</p>` : 
                    `<p class="shipping-note">🎉 You get free shipping!</p>`
                }
            </div>
        `;
    }

    // Global functions for cart operations
    window.updateCartQuantity = function(productId, quantity) {
        const numQuantity = parseInt(quantity);
        if (isNaN(numQuantity) || numQuantity < 0) return;

        if (numQuantity === 0) {
            removeCartItem(productId);
            return;
        }

        const success = CartManager.updateQuantity(productId, numQuantity);
        if (success) {
            renderCartItems();
        } else {
            showMessage('Unable to update quantity', 'error');
            renderCartItems(); // Refresh to show correct quantity
        }
    };

    window.removeCartItem = function(productId) {
        if (confirm('Remove this item from cart?')) {
            CartManager.removeFromCart(productId);
            renderCartItems();
            showMessage('Item removed from cart', 'success');
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

    // Export CartManager for use in other files
    window.CartManager = CartManager;

})();