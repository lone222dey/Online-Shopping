# WorkShala - Student & Office Products E-commerce

A complete static e-commerce website built with vanilla HTML, CSS, and JavaScript. Features a dark theme with yellow accents and a Flipkart-inspired layout.

## Features

### 🛍️ Product Management
- 30+ products across 4 categories (Books, Furniture, Electronics, Stationery)
- Product search and filtering
- Category-wise browsing
- Detailed product pages with image gallery
- Stock management

### 🔐 User Authentication
- User registration and login
- Profile management
- Session persistence with localStorage
- User data export/import functionality

### 🛒 Shopping Cart
- Add/remove items from cart
- Quantity management
- Cart persistence across sessions
- Real-time cart count updates

### 💳 Checkout & Orders
- Complete checkout flow with shipping form
- Dummy payment processing with card validation
- Order history and tracking
- Order status progression simulation
- Order data export

### 🤖 AI Assistant
- Client-side chatbot with product search
- Rule-based responses for common queries
- Quick actions for navigation
- Product recommendations

### 📱 Responsive Design
- Mobile-first responsive design
- Touch-friendly interface
- Hamburger menu for mobile
- Optimized layouts for all screen sizes

## Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Start browsing** products and testing features

No server setup required - runs entirely in the browser!

## Project Structure

```
shopping/
├── index.html              # Main homepage
├── productpage.html        # Product details page
├── login.html             # User login
├── signup.html            # User registration
├── profile.html           # User profile management
├── cart.html              # Shopping cart
├── checkout.html          # Checkout process
├── orders.html            # Order history
├── css/
│   └── styles.css         # Main stylesheet
├── js/
│   ├── products.js        # Product data (30 items)
│   ├── main.js            # Core site functionality
│   ├── auth.js            # Authentication system
│   ├── cart.js            # Cart management
│   ├── checkout.js        # Checkout & payment
│   ├── orders.js          # Order management
│   ├── productpage.js     # Product page logic
│   └── ai-assistant.js    # AI chatbot
├── assets/
│   └── placeholder.jpg    # Placeholder image
└── README.md              # This file
```

## Key Technologies

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+ features, localStorage
- **Google Fonts** - Roboto font family
- **Unsplash** - Product images via API

## Theme & Design

- **Colors**: Dark background (#0f1720) with yellow accents (#FFCC00)
- **Typography**: Roboto font family
- **Layout**: Flipkart-inspired grid system
- **Icons**: Inline SVG icons for performance

## Data Persistence

All data is stored in browser localStorage:
- `workshala_users` - User accounts
- `workshala_session` - Current user session
- `workshala_cart` - Shopping cart items
- `workshala_orders` - Order history

## Demo Features

### Test User Account
- Email: `test@example.com`
- Password: `password123`

### Sample Products
- Books: Programming guides, academic texts
- Furniture: Study desks, ergonomic chairs
- Electronics: Headphones, keyboards, accessories
- Stationery: Pens, notebooks, calculators

### AI Assistant Commands
- "show books" - Display book products
- "recommend desk" - Suggest furniture
- "track order [ID]" - Order tracking help
- "trending products" - Show popular items

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Features

- Lazy loading images
- Debounced search (300ms)
- Efficient DOM updates
- Minimal external dependencies

## Security Notes

⚠️ **This is a demo application**:
- Passwords use simple hashing (not cryptographically secure)
- Payment processing is simulated
- No server-side validation
- Not suitable for production use

## License

This project is for educational purposes. Feel free to use and modify for learning.

---

**WorkShala** - Empowering students and professionals with quality products! 🎓💼