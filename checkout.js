// Generated for WorkShala — Vanilla HTML/CSS/JS. Open index.html to run.
// Data Storage: All user data, cart, and orders are stored in browser localStorage as JSON
// - workshala_users: User accounts with hashed passwords
// - workshala_session: Current user session
// - workshala_cart: Shopping cart items
// - workshala_orders: Order history with tracking

(function() {
    'use strict';

    let orderData = null;

    document.addEventListener('DOMContentLoaded', function() {
        initializeCheckout();
    });

    function initializeCheckout() {
        // Check if cart has items
        const cart = JSON.parse(localStorage.getItem('workshala_cart') || '[]');
        if (cart.length === 0) {
            showMessage('Your cart is empty', 'error');
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 2000);
            return;
        }

        renderOrderSummary();
        prefillUserData();
        setupEventListeners();
    }

    function setupEventListeners() {
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const cancelPayment = document.getElementById('cancelPayment');
        const processPayment = document.getElementById('processPayment');

        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', handlePlaceOrder);
        }

        if (cancelPayment) {
            cancelPayment.addEventListener('click', closePaymentModal);
        }

        if (processPayment) {
            processPayment.addEventListener('click', handlePayment);
        }

        // Payment method switching
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', handlePaymentMethodChange);
        });

        // Format card number input
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', formatCardNumber);
        }

        // Format expiry date input
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', formatExpiryDate);
        }

        // CVV input validation
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
            });
        }
    }

    function renderOrderSummary() {
        const orderItemsContainer = document.getElementById('orderItems');
        const orderTotalsContainer = document.getElementById('orderTotals');

        if (!orderItemsContainer || !orderTotalsContainer) return;

        const cartItems = window.CartManager.getCartWithDetails();
        const totals = window.CartManager.getCartTotals();

        // Render order items
        orderItemsContainer.innerHTML = cartItems.map(item => `
            <div class="order-item">
                <img src="${item.product.images[0]}" alt="${item.product.title}" class="item-image">
                <div class="item-details">
                    <div class="item-title">${item.product.title}</div>
                    <div class="item-price">₹${item.product.price} × ${item.quantity}</div>
                </div>
                <div style="font-weight: 600; color: var(--text);">₹${item.subtotal}</div>
            </div>
        `).join('');

        // Render order totals
        orderTotalsContainer.innerHTML = `
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
        `;
    }

    function prefillUserData() {
        const session = JSON.parse(localStorage.getItem('workshala_session') || 'null');
        if (session) {
            const emailField = document.getElementById('email');
            if (emailField) {
                emailField.value = session.email;
            }

            // Split name if available
            if (session.name) {
                const nameParts = session.name.split(' ');
                const firstNameField = document.getElementById('firstName');
                const lastNameField = document.getElementById('lastName');
                
                if (firstNameField && nameParts.length > 0) {
                    firstNameField.value = nameParts[0];
                }
                if (lastNameField && nameParts.length > 1) {
                    lastNameField.value = nameParts.slice(1).join(' ');
                }
            }
        }
    }

    function handlePlaceOrder() {
        if (!validateShippingForm()) {
            return;
        }

        // Collect shipping data
        const shippingData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            pincode: document.getElementById('pincode').value.trim(),
            state: document.getElementById('state').value
        };

        // Prepare order data
        const cartItems = window.CartManager.getCartWithDetails();
        const totals = window.CartManager.getCartTotals();

        orderData = {
            orderId: generateOrderId(),
            userId: getCurrentUserId(),
            items: cartItems.map(item => ({
                productId: item.productId,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.subtotal,
                image: item.product.images[0]
            })),
            shipping: shippingData,
            totals: totals,
            status: 'Processing',
            createdAt: new Date().toISOString(),
            tracking: [{
                status: 'Order Placed',
                timestamp: new Date().toISOString(),
                description: 'Your order has been placed successfully'
            }]
        };

        // Show payment modal
        showPaymentModal();
    }

    function validateShippingForm() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'address', 'city', 'pincode', 'state'
        ];

        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                showFieldError(fieldId, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(fieldId);
            }
        });

        // Validate email
        const email = document.getElementById('email').value.trim();
        if (email && !isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        const phone = document.getElementById('phone').value.trim();
        if (phone && !isValidPhone(phone)) {
            showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate pincode
        const pincode = document.getElementById('pincode').value.trim();
        if (pincode && !isValidPincode(pincode)) {
            showFieldError('pincode', 'Please enter a valid 6-digit PIN code');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        clearFieldError(fieldId);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'var(--error)';
    }

    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = 'var(--border)';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
    }

    function isValidPincode(pincode) {
        return /^\d{6}$/.test(pincode);
    }

    function handlePaymentMethodChange() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const cardForm = document.getElementById('cardPaymentForm');
        const upiForm = document.getElementById('upiPaymentForm');
        const codForm = document.getElementById('codPaymentForm');
        const buttonText = document.getElementById('paymentButtonText');

        // Hide all forms
        cardForm.style.display = 'none';
        upiForm.style.display = 'none';
        codForm.style.display = 'none';

        // Show selected form and update button text
        switch(selectedMethod) {
            case 'card':
                cardForm.style.display = 'block';
                buttonText.textContent = 'Pay Now';
                break;
            case 'upi':
                upiForm.style.display = 'block';
                buttonText.textContent = 'Pay via UPI';
                break;
            case 'cod':
                codForm.style.display = 'block';
                buttonText.textContent = 'Place Order';
                break;
        }
    }

    function showPaymentModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Pre-fill cardholder name
            const cardNameField = document.getElementById('cardName');
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            if (cardNameField && firstName && lastName) {
                cardNameField.value = `${firstName} ${lastName}`;
            }
        }
    }

    function closePaymentModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function handlePayment() {
        if (!validatePaymentForm()) {
            return;
        }

        // Show processing state
        const paymentForm = document.getElementById('paymentForm');
        const paymentProcessing = document.getElementById('paymentProcessing');
        
        if (paymentForm) paymentForm.style.display = 'none';
        if (paymentProcessing) paymentProcessing.style.display = 'block';

        // Simulate payment processing
        setTimeout(() => {
            processPayment();
        }, 3000);
    }

    function validatePaymentForm() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        switch(selectedMethod) {
            case 'card':
                return validateCardPayment();
            case 'upi':
                return validateUpiPayment();
            case 'cod':
                return true; // COD doesn't need validation
            default:
                return false;
        }
    }

    function validateCardPayment() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value.trim();

        if (!cardNumber || cardNumber.length < 13) {
            showMessage('Please enter a valid card number', 'error');
            return false;
        }
        if (!expiryDate || !isValidExpiryDate(expiryDate)) {
            showMessage('Please enter a valid expiry date', 'error');
            return false;
        }
        if (!cvv || cvv.length < 3) {
            showMessage('Please enter a valid CVV', 'error');
            return false;
        }
        if (!cardName) {
            showMessage('Please enter the name on card', 'error');
            return false;
        }
        return true;
    }

    function validateUpiPayment() {
        const upiId = document.getElementById('upiId').value.trim();
        if (!upiId || !upiId.includes('@')) {
            showMessage('Please enter a valid UPI ID', 'error');
            return false;
        }
        return true;
    }

    function isValidExpiryDate(expiry) {
        const match = expiry.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return false;

        const month = parseInt(match[1]);
        const year = parseInt('20' + match[2]);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        return month >= 1 && month <= 12 && 
               (year > currentYear || (year === currentYear && month >= currentMonth));
    }

    function isValidCardNumber(cardNumber) {
        // Simple Luhn algorithm check
        let sum = 0;
        let alternate = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let n = parseInt(cardNumber.charAt(i));
            
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10) === 0;
    }

    function processPayment() {
        try {
            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('workshala_orders') || '[]');
            orders.push(orderData);
            localStorage.setItem('workshala_orders', JSON.stringify(orders, null, 2));

            // Clear cart
            window.CartManager.clearCart();

            // Show success and redirect
            showMessage('Payment successful! Order placed.', 'success');
            
            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 2000);

        } catch (error) {
            console.error('Error processing payment:', error);
            showMessage('Payment failed. Please try again.', 'error');
            
            // Reset payment modal
            const paymentForm = document.getElementById('paymentForm');
            const paymentProcessing = document.getElementById('paymentProcessing');
            
            if (paymentForm) paymentForm.style.display = 'block';
            if (paymentProcessing) paymentProcessing.style.display = 'none';
        }
    }

    function formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    }

    function formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    function generateOrderId() {
        return 'WS' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    function getCurrentUserId() {
        const session = JSON.parse(localStorage.getItem('workshala_session') || 'null');
        return session ? session.id : null;
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

})();