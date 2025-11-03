// Generated for WorkShala — Vanilla HTML/CSS/JS. Open index.html to run.

(function() {
    'use strict';

    let currentTrackingOrder = null;

    document.addEventListener('DOMContentLoaded', function() {
        initializeOrdersPage();
    });

    function initializeOrdersPage() {
        // Check if user is logged in
        const session = JSON.parse(localStorage.getItem('workshala_session') || 'null');
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        renderOrders();
        setupEventListeners();
    }

    function setupEventListeners() {
        const exportBtn = document.getElementById('exportOrdersBtn');
        const closeTracking = document.getElementById('closeTracking');
        const advanceStatusBtn = document.getElementById('advanceStatusBtn');

        if (exportBtn) {
            exportBtn.addEventListener('click', exportOrders);
        }

        if (closeTracking) {
            closeTracking.addEventListener('click', closeTrackingModal);
        }

        if (advanceStatusBtn) {
            advanceStatusBtn.addEventListener('click', advanceOrderStatus);
        }

        // Close modal when clicking outside
        const trackingModal = document.getElementById('trackingModal');
        if (trackingModal) {
            trackingModal.addEventListener('click', function(e) {
                if (e.target === trackingModal) {
                    closeTrackingModal();
                }
            });
        }
    }

    function renderOrders() {
        const container = document.getElementById('ordersContainer');
        if (!container) return;

        const orders = getUserOrders();

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="no-orders">
                    <h3>No orders yet</h3>
                    <p>You haven't placed any orders. Start shopping to see your orders here!</p>
                    <button class="form-btn" onclick="window.location.href='index.html'" style="margin-top: 20px;">
                        Start Shopping
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => createOrderCard(order)).join('');
    }

    function getUserOrders() {
        const session = JSON.parse(localStorage.getItem('workshala_session') || 'null');
        const allOrders = JSON.parse(localStorage.getItem('workshala_orders') || '[]');
        
        if (!session) return [];

        // Filter orders for current user and sort by date (newest first)
        return allOrders
            .filter(order => order.userId === session.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    function createOrderCard(order) {
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const statusClass = `status-${order.status.toLowerCase().replace(/\s+/g, '-')}`;

        const orderItems = order.items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-details">
                    <div class="item-title">${item.title}</div>
                    <div class="item-price">₹${item.price} × ${item.quantity}</div>
                </div>
                <div style="font-weight: 600; color: var(--text);">₹${item.subtotal}</div>
            </div>
        `).join('');

        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order #${order.orderId}</h3>
                        <div class="order-meta">
                            Placed on ${orderDate} • ${order.items.length} item(s)
                        </div>
                    </div>
                    <div class="order-status ${statusClass}">
                        ${order.status}
                    </div>
                    <div class="order-total">
                        ₹${order.totals.total}
                    </div>
                </div>
                
                <div class="order-items">
                    ${orderItems}
                </div>
                
                <div class="order-actions">
                    <button class="action-btn" onclick="showOrderTracking('${order.orderId}')">
                        Track Order
                    </button>
                    <button class="action-btn" onclick="viewOrderDetails('${order.orderId}')">
                        View Details
                    </button>
                    ${order.status === 'Delivered' ? 
                        `<button class="action-btn" onclick="reorderItems('${order.orderId}')">Reorder</button>` : 
                        ''
                    }
                </div>
            </div>
        `;
    }

    function showOrderTracking(orderId) {
        const orders = JSON.parse(localStorage.getItem('workshala_orders') || '[]');
        const order = orders.find(o => o.orderId === orderId);
        
        if (!order) {
            showMessage('Order not found', 'error');
            return;
        }

        currentTrackingOrder = order;
        renderTrackingModal(order);
        
        const modal = document.getElementById('trackingModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function renderTrackingModal(order) {
        const titleElement = document.getElementById('trackingTitle');
        const detailsContainer = document.getElementById('trackingDetails');

        if (titleElement) {
            titleElement.textContent = `Order #${order.orderId}`;
        }

        if (!detailsContainer) return;

        // Define tracking steps
        const trackingSteps = [
            { status: 'Order Placed', key: 'processing' },
            { status: 'Packed', key: 'packed' },
            { status: 'Shipped', key: 'shipped' },
            { status: 'Out for Delivery', key: 'out-for-delivery' },
            { status: 'Delivered', key: 'delivered' }
        ];

        const currentStatusIndex = trackingSteps.findIndex(step => 
            step.status.toLowerCase() === order.status.toLowerCase()
        );

        const trackingHTML = `
            <div style="margin-bottom: 24px;">
                <div style="color: var(--text); margin-bottom: 8px;">
                    <strong>Current Status:</strong> ${order.status}
                </div>
                <div style="color: var(--text-muted); font-size: 14px;">
                    Expected delivery: ${getExpectedDeliveryDate(order)}
                </div>
            </div>
            
            <div class="tracking-timeline">
                ${trackingSteps.map((step, index) => {
                    const trackingEntry = order.tracking.find(t => 
                        t.status.toLowerCase() === step.status.toLowerCase()
                    );
                    
                    let stepClass = '';
                    if (index < currentStatusIndex) {
                        stepClass = 'completed';
                    } else if (index === currentStatusIndex) {
                        stepClass = 'current';
                    }

                    return `
                        <div class="tracking-step ${stepClass}">
                            <div class="step-title">${step.status}</div>
                            ${trackingEntry ? `
                                <div class="step-time">
                                    ${new Date(trackingEntry.timestamp).toLocaleString('en-IN')}
                                </div>
                                <div class="step-description">
                                    ${trackingEntry.description}
                                </div>
                            ` : `
                                <div class="step-description">
                                    ${index <= currentStatusIndex ? 'Completed' : 'Pending'}
                                </div>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        detailsContainer.innerHTML = trackingHTML;
    }

    function getExpectedDeliveryDate(order) {
        const orderDate = new Date(order.createdAt);
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from order
        
        return deliveryDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function closeTrackingModal() {
        const modal = document.getElementById('trackingModal');
        if (modal) {
            modal.style.display = 'none';
        }
        currentTrackingOrder = null;
    }

    function advanceOrderStatus() {
        if (!currentTrackingOrder) return;

        const statusProgression = [
            'Processing',
            'Packed', 
            'Shipped',
            'Out for Delivery',
            'Delivered'
        ];

        const currentIndex = statusProgression.indexOf(currentTrackingOrder.status);
        if (currentIndex === -1 || currentIndex >= statusProgression.length - 1) {
            showMessage('Order is already at final status', 'info');
            return;
        }

        const nextStatus = statusProgression[currentIndex + 1];
        
        // Update order status
        const orders = JSON.parse(localStorage.getItem('workshala_orders') || '[]');
        const orderIndex = orders.findIndex(o => o.orderId === currentTrackingOrder.orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = nextStatus;
            
            // Add tracking entry
            const trackingEntry = {
                status: nextStatus,
                timestamp: new Date().toISOString(),
                description: getStatusDescription(nextStatus)
            };
            
            orders[orderIndex].tracking.push(trackingEntry);
            
            // Save updated orders
            localStorage.setItem('workshala_orders', JSON.stringify(orders, null, 2));
            
            // Update current tracking order
            currentTrackingOrder = orders[orderIndex];
            
            // Re-render tracking modal and orders list
            renderTrackingModal(currentTrackingOrder);
            renderOrders();
            
            showMessage(`Order status updated to: ${nextStatus}`, 'success');
        }
    }

    function getStatusDescription(status) {
        const descriptions = {
            'Processing': 'Your order is being processed',
            'Packed': 'Your order has been packed and ready for shipment',
            'Shipped': 'Your order has been shipped and is on the way',
            'Out for Delivery': 'Your order is out for delivery',
            'Delivered': 'Your order has been delivered successfully'
        };
        
        return descriptions[status] || 'Status updated';
    }

    function viewOrderDetails(orderId) {
        // For now, just show tracking - could be expanded to show full order details
        showOrderTracking(orderId);
    }

    function reorderItems(orderId) {
        const orders = JSON.parse(localStorage.getItem('workshala_orders') || '[]');
        const order = orders.find(o => o.orderId === orderId);
        
        if (!order) {
            showMessage('Order not found', 'error');
            return;
        }

        // Clear current cart and add order items
        if (typeof window.CartManager !== 'undefined') {
            window.CartManager.clearCart();
            
            let addedItems = 0;
            order.items.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    if (window.CartManager.addToCart(item.productId, 1)) {
                        addedItems++;
                    }
                }
            });
            
            if (addedItems > 0) {
                showMessage(`${addedItems} items added to cart`, 'success');
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 1500);
            } else {
                showMessage('Unable to add items to cart. Some products may be out of stock.', 'error');
            }
        } else {
            showMessage('Cart functionality not available', 'error');
        }
    }

    function exportOrders() {
        const orders = getUserOrders();
        if (orders.length === 0) {
            showMessage('No orders to export', 'info');
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            totalOrders: orders.length,
            orders: orders
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `workshala_orders_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showMessage('Orders exported successfully', 'success');
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

    // Global functions
    window.showOrderTracking = showOrderTracking;
    window.viewOrderDetails = viewOrderDetails;
    window.reorderItems = reorderItems;

})();