// Generated for WorkShala — Vanilla HTML/CSS/JS. Open index.html to run.

(function() {
    'use strict';

    const AIAssistant = {
        isOpen: false,
        
        // Initialize the AI assistant
        init: function() {
            this.setupEventListeners();
            this.addWelcomeMessage();
        },

        setupEventListeners: function() {
            const toggle = document.getElementById('aiToggle');
            const close = document.getElementById('aiClose');
            const send = document.getElementById('aiSend');
            const input = document.getElementById('aiInput');

            if (toggle) {
                toggle.addEventListener('click', () => this.toggleChat());
            }

            if (close) {
                close.addEventListener('click', () => this.closeChat());
            }

            if (send) {
                send.addEventListener('click', () => this.sendMessage());
            }

            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });
            }

            // Quick action buttons
            const quickActions = document.querySelectorAll('.quick-action');
            quickActions.forEach(action => {
                action.addEventListener('click', (e) => {
                    const actionType = e.target.getAttribute('data-action');
                    this.handleQuickAction(actionType);
                });
            });
        },

        toggleChat: function() {
            const chat = document.getElementById('aiChat');
            if (chat) {
                this.isOpen = !this.isOpen;
                chat.style.display = this.isOpen ? 'flex' : 'none';
            }
        },

        closeChat: function() {
            const chat = document.getElementById('aiChat');
            if (chat) {
                this.isOpen = false;
                chat.style.display = 'none';
            }
        },

        addWelcomeMessage: function() {
            // Welcome message is already in HTML
        },

        sendMessage: async function() {
            const input = document.getElementById('aiInput');
            if (!input) return;

            const message = input.value.trim();
            if (!message) return;

            this.addMessage(message, 'user');
            input.value = '';

            // Show typing indicator
            this.addMessage('Typing...', 'bot');
            const messages = document.getElementById('aiMessages');
            const typingMessage = messages.lastElementChild;

            try {
                const response = await this.processMessage(message);
                typingMessage.remove();
                this.addMessage(response, 'bot');
            } catch (error) {
                typingMessage.remove();
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        },

        addMessage: function(text, sender) {
            const messagesContainer = document.getElementById('aiMessages');
            if (!messagesContainer) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `ai-message ${sender}`;
            
            if (typeof text === 'string') {
                messageDiv.innerHTML = `<p>${text}</p>`;
            } else {
                messageDiv.appendChild(text);
            }

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        },

        processMessage: async function(message) {
            // Check if DeepSeek API is available
            if (window.DEEPSEEK_API_KEY) {
                try {
                    const response = await this.callDeepSeekAPI(message);
                    if (response) return response;
                } catch (error) {
                    console.log('DeepSeek API failed, using fallback');
                }
            }

            // Fallback to rule-based responses
            return this.getRuleBasedResponse(message);
        },

        callDeepSeekAPI: async function(message) {
            if (!window.DEEPSEEK_API_KEY) return null;

            const systemPrompt = `You are WorkShala AI assistant for an e-commerce site selling student & office products. 

Context: 30+ products in Books, Furniture, Electronics, Stationery categories. Features: cart, checkout, orders, user accounts.

Be helpful, concise (under 100 words), and conversational. If users ask about products, mention you can search and show results.`;

            try {
                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.DEEPSEEK_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: message }
                        ],
                        max_tokens: 150,
                        temperature: 0.7
                    })
                });

                if (!response.ok) throw new Error(`API error: ${response.status}`);

                const data = await response.json();
                const aiResponse = data.choices?.[0]?.message?.content;
                
                return aiResponse ? this.enhanceAIResponse(aiResponse, message) : null;
            } catch (error) {
                console.error('DeepSeek API error:', error);
                return null;
            }
        },

        enhanceAIResponse: function(aiResponse, originalMessage) {
            const lowerMessage = originalMessage.toLowerCase();
            
            if (this.matchesIntent(lowerMessage, ['show', 'find', 'search', 'books', 'furniture', 'electronics', 'stationery', 'pen', 'desk', 'chair'])) {
                const searchResults = this.getProductSearchResults(originalMessage);
                if (searchResults) {
                    const responseDiv = document.createElement('div');
                    responseDiv.innerHTML = `<p>${aiResponse}</p>`;
                    responseDiv.appendChild(searchResults);
                    return responseDiv;
                }
            }
            
            return aiResponse;
        },

        getProductSearchResults: function(message) {
            const searchTerms = this.extractSearchTerms(message) || this.extractCategoryFromMessage(message);
            if (!searchTerms) return null;

            const results = this.searchProducts(searchTerms);
            if (results.length === 0) return null;

            const resultDiv = document.createElement('div');
            resultDiv.style.marginTop = '12px';
            resultDiv.innerHTML = `<p style="font-size: 14px; color: var(--accent-yellow); margin-bottom: 8px;">Found ${results.length} products:</p>`;

            const productList = document.createElement('div');
            results.slice(0, 3).forEach(product => {
                const productItem = document.createElement('div');
                productItem.style.cssText = `padding: 8px; margin: 4px 0; background-color: var(--bg-elev); border-radius: 4px; cursor: pointer; border: 1px solid var(--border);`;
                
                productItem.innerHTML = `<div style="font-weight: 500; color: var(--text); font-size: 14px;">${product.title}</div><div style="color: var(--accent-yellow); font-weight: 600; margin: 4px 0;">₹${product.price}</div><div style="color: var(--text-muted); font-size: 12px;">Rating: ${product.rating} ⭐</div>`;

                productItem.addEventListener('click', () => {
                    window.open(`productpage.html?id=${product.id}`, '_blank');
                });

                productList.appendChild(productItem);
            });

            resultDiv.appendChild(productList);
            return resultDiv;
        },

        extractCategoryFromMessage: function(message) {
            const lowerMessage = message.toLowerCase();
            if (lowerMessage.includes('book')) return 'books';
            if (lowerMessage.includes('furniture') || lowerMessage.includes('desk') || lowerMessage.includes('chair')) return 'furniture';
            if (lowerMessage.includes('electronic') || lowerMessage.includes('headphone') || lowerMessage.includes('keyboard')) return 'electronics';
            if (lowerMessage.includes('stationery') || lowerMessage.includes('pen') || lowerMessage.includes('notebook')) return 'stationery';
            return null;
        },

        getContextForAPI: function() {
            const categories = ['Books', 'Furniture', 'Electronics', 'Stationery'];
            const productCount = window.products ? window.products.length : 30;
            return `E-commerce site with ${productCount} products in categories: ${categories.join(', ')}. Features: cart, checkout, orders, user accounts.`;
        },

        getRuleBasedResponse: function(message) {
            const lowerMessage = message.toLowerCase();

            // Greeting responses
            if (this.matchesIntent(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
                return "Hello! I'm here to help you find products and answer questions about WorkShala. What can I help you with today?";
            }

            // Thank you responses
            if (this.matchesIntent(lowerMessage, ['thank', 'thanks', 'appreciate'])) {
                return "You're welcome! Is there anything else I can help you with?";
            }

            // Product search
            if (this.matchesIntent(lowerMessage, ['show', 'find', 'search', 'looking for', 'need', 'want'])) {
                return this.handleProductSearch(lowerMessage);
            }

            // Category requests
            if (this.matchesIntent(lowerMessage, ['books', 'book'])) {
                return this.showCategoryProducts('Books');
            }
            if (this.matchesIntent(lowerMessage, ['furniture', 'desk', 'chair', 'table'])) {
                return this.showCategoryProducts('Furniture');
            }
            if (this.matchesIntent(lowerMessage, ['electronics', 'electronic', 'headphone', 'keyboard', 'mouse'])) {
                return this.showCategoryProducts('Electronics');
            }
            if (this.matchesIntent(lowerMessage, ['stationery', 'pen', 'pencil', 'notebook', 'paper'])) {
                return this.showCategoryProducts('Stationery');
            }

            // Order tracking
            if (this.matchesIntent(lowerMessage, ['track', 'order', 'tracking', 'where is my order'])) {
                return this.handleOrderTracking(lowerMessage);
            }

            // Help with checkout
            if (this.matchesIntent(lowerMessage, ['checkout', 'payment', 'buy', 'purchase'])) {
                return "To complete your purchase: 1) Add items to cart, 2) Go to cart page, 3) Click 'Proceed to Checkout', 4) Fill shipping details, 5) Complete payment. Need help with any specific step?";
            }

            // Recommendations
            if (this.matchesIntent(lowerMessage, ['recommend', 'suggest', 'best', 'popular', 'trending'])) {
                return this.handleRecommendations(lowerMessage);
            }

            // Default response
            return "I didn't quite understand that. Try asking me to 'show books', 'track order 12345', 'recommend study desk', or use the quick actions below!";
        },

        matchesIntent: function(message, keywords) {
            return keywords.some(keyword => message.includes(keyword));
        },

        handleProductSearch: function(message) {
            // Extract search terms
            const searchTerms = this.extractSearchTerms(message);
            if (!searchTerms) {
                return "What specific product are you looking for? Try 'show me pens' or 'find study books'.";
            }

            const results = this.searchProducts(searchTerms);
            if (results.length === 0) {
                return `Sorry, I couldn't find any products matching "${searchTerms}". Try searching for books, furniture, electronics, or stationery.`;
            }

            return this.formatProductResults(results, searchTerms);
        },

        extractSearchTerms: function(message) {
            // Simple extraction - look for words after "show", "find", etc.
            const patterns = [
                /(?:show|find|search|looking for|need|want)\s+(?:me\s+)?(.+)/i,
                /(.+)\s+(?:please|pls)/i
            ];

            for (const pattern of patterns) {
                const match = message.match(pattern);
                if (match && match[1]) {
                    return match[1].trim();
                }
            }

            return null;
        },

        searchProducts: function(query) {
            if (!window.products) return [];

            return window.products.filter(product => 
                product.title.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5); // Limit to 5 results
        },

        showCategoryProducts: function(category) {
            const categoryProducts = window.products.filter(p => p.category === category).slice(0, 5);
            return this.formatProductResults(categoryProducts, category);
        },

        formatProductResults: function(products, searchTerm) {
            if (products.length === 0) {
                return `No products found for "${searchTerm}".`;
            }

            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = `<p>Found ${products.length} products for "${searchTerm}":</p>`;

            const productList = document.createElement('div');
            productList.style.marginTop = '12px';

            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.style.cssText = `
                    padding: 8px;
                    margin: 4px 0;
                    background-color: var(--bg-elev);
                    border-radius: 4px;
                    cursor: pointer;
                    border: 1px solid var(--border);
                `;
                
                productItem.innerHTML = `
                    <div style="font-weight: 500; color: var(--text); font-size: 14px;">${product.title}</div>
                    <div style="color: var(--accent-yellow); font-weight: 600; margin: 4px 0;">₹${product.price}</div>
                    <div style="color: var(--text-muted); font-size: 12px;">Rating: ${product.rating} ⭐</div>
                `;

                productItem.addEventListener('click', () => {
                    window.open(`productpage.html?id=${product.id}`, '_blank');
                });

                productList.appendChild(productItem);
            });

            resultDiv.appendChild(productList);
            return resultDiv;
        },

        handleOrderTracking: function(message) {
            // Extract order ID if present
            const orderIdMatch = message.match(/\b\w+\d+\w*\b/);
            
            if (orderIdMatch) {
                const orderId = orderIdMatch[0];
                return `To track order ${orderId}, please visit your Orders page. You can access it from the user menu or click the "My Orders" quick action below.`;
            }

            return "To track your orders, please visit the Orders page from your account menu. You'll need to be logged in to view your order history and tracking information.";
        },

        handleRecommendations: function(message) {
            if (this.matchesIntent(message, ['desk', 'study desk', 'table'])) {
                const desks = window.products.filter(p => 
                    p.category === 'Furniture' && 
                    (p.title.toLowerCase().includes('desk') || p.title.toLowerCase().includes('table'))
                );
                return this.formatProductResults(desks, 'study desks');
            }

            if (this.matchesIntent(message, ['chair'])) {
                const chairs = window.products.filter(p => 
                    p.category === 'Furniture' && p.title.toLowerCase().includes('chair')
                );
                return this.formatProductResults(chairs, 'chairs');
            }

            if (this.matchesIntent(message, ['student', 'study'])) {
                const studentProducts = window.products
                    .filter(p => p.badges.some(badge => badge.toLowerCase().includes('student')))
                    .slice(0, 5);
                return this.formatProductResults(studentProducts, 'student products');
            }

            // Default recommendations - trending products
            const trending = window.products
                .sort((a, b) => (b.rating + b.discountPercent/10) - (a.rating + a.discountPercent/10))
                .slice(0, 5);
            return this.formatProductResults(trending, 'trending products');
        },

        handleQuickAction: function(action) {
            switch (action) {
                case 'trending':
                    const trending = window.products
                        .sort((a, b) => (b.rating + b.discountPercent/10) - (a.rating + a.discountPercent/10))
                        .slice(0, 5);
                    this.addMessage(this.formatProductResults(trending, 'trending products'), 'bot');
                    break;

                case 'cart':
                    window.location.href = 'cart.html';
                    break;

                case 'orders':
                    const session = JSON.parse(localStorage.getItem('workshala_session') || 'null');
                    if (session) {
                        window.location.href = 'orders.html';
                    } else {
                        this.addMessage('Please log in to view your orders.', 'bot');
                    }
                    break;
            }
        }
    };

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        AIAssistant.init();
    });

    // Export for external use
    window.AIAssistant = AIAssistant;

})();