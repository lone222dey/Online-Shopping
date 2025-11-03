// Generated for WorkShala — Vanilla HTML/CSS/JS. Open index.html to run.

const products = [
    // Books (8 products)
    {
        id: "p001",
        title: "Data Structures and Algorithms Made Easy",
        category: "Books",
        price: 299,
        mrp: 450,
        discountPercent: 34,
        rating: 4.6,
        stock: 25,
        description: "A comprehensive guide to data structures and algorithms for students preparing for competitive programming and interviews. Covers all fundamental concepts with practical examples.",
        images: [
            "https://imgs.search.brave.com/BpsiKkTj0HJS1tiIolgbZfy4h8eHT__KyDYZYgGYe4E/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFHNjZEcVRDK0wu/anBn",
        ],
        badges: ["Student Pick", "Best Seller"]
    },
    {
        id: "p002",
        title: "Complete Guide to Machine Learning",
        category: "Books",
        price: 399,
        mrp: 599,
        discountPercent: 33,
        rating: 4.4,
        stock: 18,
        description: "Learn machine learning from basics to advanced concepts. Perfect for computer science students and professionals entering the AI field.",
        images: [
            "https://m.media-amazon.com/images/I/71fqAsq7OtL._AC_UY327_FMwebp_QL65_.jpg",

        ],
        badges: ["Trending"]
    },
    {
        id: "p003",
        title: "Engineering Mathematics Handbook",
        category: "Books",
        price: 249,
        mrp: 350,
        discountPercent: 29,
        rating: 4.3,
        stock: 32,
        description: "Essential mathematics for engineering students covering calculus, linear algebra, differential equations, and probability theory.",
        images: [
            "https://m.media-amazon.com/images/I/711xlrcwbGL._AC_UY327_FMwebp_QL65_.jpg",
        ],
        badges: ["Academic"]
    },
    {
        id: "p004",
        title: "Business Communication Skills",
        category: "Books",
        price: 199,
        mrp: 299,
        discountPercent: 33,
        rating: 4.2,
        stock: 45,
        description: "Develop professional communication skills essential for workplace success. Covers written, verbal, and presentation skills.",
        images: [
            "https://m.media-amazon.com/images/I/61syhJV0bYL._AC_UY327_FMwebp_QL65_.jpg",

        ],
        badges: ["Professional"]
    },
    {
        id: "p005",
        title: "Python Programming for Beginners",
        category: "Books",
        price: 329,
        mrp: 499,
        discountPercent: 34,
        rating: 4.7,
        stock: 28,
        description: "Learn Python programming from scratch with hands-on examples and projects. Perfect for students starting their coding journey.",
        images: [
            "https://m.media-amazon.com/images/I/815MAFzE-aL._AC_UY327_FMwebp_QL65_.jpg"
        ],
        badges: ["Best Seller", "Beginner Friendly"]
    },
    {
        id: "p006",
        title: "Financial Accounting Principles",
        category: "Books",
        price: 279,
        mrp: 399,
        discountPercent: 30,
        rating: 4.1,
        stock: 22,
        description: "Comprehensive guide to financial accounting principles and practices for commerce and management students.",
        images: [
            "https://m.media-amazon.com/images/I/71GZ79ykVZL._AC_UY327_FMwebp_QL65_.jpg",

        ],
        badges: ["Commerce"]
    },
    {
        id: "p007",
        title: "Digital Marketing Essentials",
        category: "Books",
        price: 349,
        mrp: 499,
        discountPercent: 30,
        rating: 4.5,
        stock: 19,
        description: "Master digital marketing strategies including SEO, social media marketing, content marketing, and analytics.",
        images: [
            "https://m.media-amazon.com/images/I/71CgvOIpswL._AC_UY327_FMwebp_QL65_.jpg",
            
        ],
        badges: ["Marketing", "Digital"]
    },
    {
        id: "p008",
        title: "Research Methodology Guide",
        category: "Books",
        price: 229,
        mrp: 329,
        discountPercent: 30,
        rating: 4.0,
        stock: 35,
        description: "Complete guide to research methodology for students writing thesis, dissertations, and research papers.",
        images: [
            "https://m.media-amazon.com/images/I/71DFxDCdDKL._AC_UY327_FMwebp_QL65_.jpg",
        ],
        badges: ["Research", "Academic"]
    },

    // Furniture (7 products)
    {
        id: "p009",
        title: "Ergonomic Study Chair with Lumbar Support",
        category: "Furniture",
        price: 4999,
        mrp: 7999,
        discountPercent: 38,
        rating: 4.4,
        stock: 12,
        description: "Comfortable ergonomic chair designed for long study sessions. Features adjustable height, lumbar support, and breathable mesh back.",
        images: [
            "https://m.media-amazon.com/images/I/8167sFg1txL._AC_UL480_FMwebp_QL65_.jpg",

        ],
        badges: ["Ergonomic", "Best Seller"]
    },
    {
        id: "p010",
        title: "Wooden Study Desk with Drawers",
        category: "Furniture",
        price: 6999,
        mrp: 9999,
        discountPercent: 30,
        rating: 4.6,
        stock: 8,
        description: "Spacious wooden study desk with multiple drawers for storage. Perfect for students and professionals working from home.",
        images: [
            "https://m.media-amazon.com/images/I/41Y47zrL1uL._AC_UL480_FMwebp_QL65_.jpg",
        ],
        badges: ["Premium", "Storage"]
    },
    {
        id: "p011",
        title: "Adjustable Laptop Stand",
        category: "Furniture",
        price: 1299,
        mrp: 1999,
        discountPercent: 35,
        rating: 4.3,
        stock: 25,
        description: "Portable and adjustable laptop stand for better ergonomics. Lightweight aluminum construction with cooling vents.",
        images: [
            "https://m.media-amazon.com/images/I/61AS07l2cBL._AC_UY327_FMwebp_QL65_.jpg",
        ],
        badges: ["Portable", "Ergonomic"]
    },
    {
        id: "p012",
        title: "Bookshelf with 5 Compartments",
        category: "Furniture",
        price: 3499,
        mrp: 4999,
        discountPercent: 30,
        rating: 4.2,
        stock: 15,
        description: "Sturdy wooden bookshelf with 5 spacious compartments. Perfect for organizing books, files, and decorative items.",
        images: [
            "https://m.media-amazon.com/images/I/71VWoFK1OgL._AC_UL480_FMwebp_QL65_.jpg",
        ],
        badges: ["Storage", "Wooden"]
    },
    {
        id: "p013",
        title: "Office Filing Cabinet",
        category: "Furniture",
        price: 2999,
        mrp: 4299,
        discountPercent: 30,
        rating: 4.1,
        stock: 10,
        description: "Metal filing cabinet with lock for secure document storage. Features smooth sliding drawers and durable construction.",
        images: [
            "https://m.media-amazon.com/images/I/61oxcYAz6oL._AC_UL480_FMwebp_QL65_.jpg"
        ],
        badges: ["Secure", "Office"]
    },
    {
        id: "p014",
        title: "Foldable Study Table",
        category: "Furniture",
        price: 1999,
        mrp: 2999,
        discountPercent: 33,
        rating: 4.0,
        stock: 20,
        description: "Space-saving foldable study table perfect for small rooms. Easy to store when not in use.",
        images: [
            "https://m.media-amazon.com/images/I/71ComclLq2L._AC_UY327_FMwebp_QL65_.jpg"
        ],
        badges: ["Space Saver", "Foldable"]
    },
    {
        id: "p015",
        title: "Executive Office Chair",
        category: "Furniture",
        price: 8999,
        mrp: 12999,
        discountPercent: 31,
        rating: 4.5,
        stock: 6,
        description: "Premium executive chair with leather upholstery, high back support, and 360-degree swivel. Perfect for professionals.",
        images: [
            "https://m.media-amazon.com/images/I/71CtbzjfaDL._AC_UL480_FMwebp_QL65_.jpg",

        ],
        badges: ["Premium", "Executive", "Leather"]
    },

    // Electronics (7 products)
    {
        id: "p016",
        title: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 2499,
        mrp: 3999,
        discountPercent: 38,
        rating: 4.4,
        stock: 30,
        description: "High-quality wireless headphones with noise cancellation, 20-hour battery life, and superior sound quality.",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
        ],
        badges: ["Wireless", "Best Seller"]
    },
    {
        id: "p017",
        title: "USB-C Hub with Multiple Ports",
        category: "Electronics",
        price: 1299,
        mrp: 1999,
        discountPercent: 35,
        rating: 4.3,
        stock: 45,
        description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and charging port. Perfect for laptops and tablets.",
        images: [
            "https://sabrent.com/cdn/shop/products/HB-TC6C-Main_5000x.jpg?v=1635799059",
        ],
        badges: ["Multi-Port", "USB-C"]
    },
    {
        id: "p018",
        title: "Portable Power Bank 20000mAh",
        category: "Electronics",
        price: 1799,
        mrp: 2499,
        discountPercent: 28,
        rating: 4.5,
        stock: 35,
        description: "High-capacity power bank with fast charging support. Can charge multiple devices simultaneously.",
        images: [
            "https://www.boat-lifestyle.com/cdn/shop/files/PB_300Pro_FI_Blue_01_d3a0aea0-3621-4d42-8464-261bedde0bea_1500x.jpg?v=1725982781",   
        ],
        badges: ["Fast Charging", "High Capacity"]
    },
    {
        id: "p019",
        title: "Mechanical Gaming Keyboard",
        category: "Electronics",
        price: 3499,
        mrp: 4999,
        discountPercent: 30,
        rating: 4.6,
        stock: 18,
        description: "RGB backlit mechanical keyboard with blue switches. Perfect for gaming and programming with tactile feedback.",
        images: [
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
        ],
        badges: ["Mechanical", "RGB", "Gaming"]
    },
    {
        id: "p020",
        title: "Wireless Mouse with Precision Tracking",
        category: "Electronics",
        price: 899,
        mrp: 1299,
        discountPercent: 31,
        rating: 4.2,
        stock: 50,
        description: "Ergonomic wireless mouse with high-precision optical sensor. Long battery life and comfortable grip.",
        images: [
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
        ],
        badges: ["Wireless", "Ergonomic"]
    },
    {
        id: "p021",
        title: "HD Webcam with Microphone",
        category: "Electronics",
        price: 1999,
        mrp: 2999,
        discountPercent: 33,
        rating: 4.1,
        stock: 25,
        description: "1080p HD webcam with built-in microphone. Perfect for online classes, meetings, and content creation.",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcLdagEt6DNVQ-JQJrKo5E9PmcnUIAi1bcj8IJV-nukbaA9v8fgsHsms18Z-DNCaB6uLU&usqp=CAU",
        ],
        badges: ["HD", "Built-in Mic"]
    },
    {
        id: "p022",
        title: "Bluetooth Speaker Portable",
        category: "Electronics",
        price: 1599,
        mrp: 2299,
        discountPercent: 30,
        rating: 4.3,
        stock: 28,
        description: "Compact Bluetooth speaker with powerful bass and 12-hour battery life. Water-resistant design for outdoor use.",
        images: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        ],
        badges: ["Portable", "Water Resistant"]
    },

    // Stationery (8 products)
    {
        id: "p023",
        title: "Premium Gel Pen Set (Pack of 10)",
        category: "Stationery",
        price: 199,
        mrp: 299,
        discountPercent: 33,
        rating: 4.4,
        stock: 100,
        description: "Smooth writing gel pens in assorted colors. Perfect for note-taking, assignments, and creative work.",
        images: [
            "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
        ],
        badges: ["Pack of 10", "Smooth Writing"]
    },
    {
        id: "p024",
        title: "A4 Ruled Notebooks (Set of 5)",
        category: "Stationery",
        price: 299,
        mrp: 449,
        discountPercent: 33,
        rating: 4.3,
        stock: 75,
        description: "High-quality ruled notebooks with 200 pages each. Perfect for lectures, meetings, and daily notes.",
        images: [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        ],
        badges: ["Set of 5", "200 Pages"]
    },
    {
        id: "p025",
        title: "Highlighter Markers (Pack of 6)",
        category: "Stationery",
        price: 149,
        mrp: 199,
        discountPercent: 25,
        rating: 4.2,
        stock: 80,
        description: "Fluorescent highlighter markers in 6 different colors. Long-lasting ink and comfortable grip.",
        images: [
            "https://www.kokuyocamlin.com/camlin/camel-access/image/catalog/assets/camlin/markers-and-pens/highlighters/assorted-packs/assorted-pouch-of-5-shades/FL1.JPG"
        ],
        badges: ["6 Colors", "Fluorescent"]
    },
    {
        id: "p026",
        title: "Sticky Notes Assorted Pack",
        category: "Stationery",
        price: 99,
        mrp: 149,
        discountPercent: 34,
        rating: 4.1,
        stock: 120,
        description: "Colorful sticky notes in various sizes. Perfect for reminders, bookmarks, and organization.",
        images: [
            "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
        ],
        badges: ["Assorted Colors", "Various Sizes"]
    },
    {
        id: "p027",
        title: "Scientific Calculator",
        category: "Stationery",
        price: 799,
        mrp: 1199,
        discountPercent: 33,
        rating: 4.5,
        stock: 40,
        description: "Advanced scientific calculator with 240+ functions. Essential for engineering and science students.",
        images: [
            "https://images-cdn.ubuy.co.in/65f0c6a8fa48d711cd73c981-casio-fx-82es-fx82es-plus-bk-display.jpg",
        
        ],
        badges: ["Scientific", "240+ Functions"]
    },
    {
        id: "p028",
        title: "Geometry Box Set",
        category: "Stationery",
        price: 249,
        mrp: 349,
        discountPercent: 29,
        rating: 4.0,
        stock: 60,
        description: "Complete geometry set with compass, protractor, rulers, and triangles. Essential for technical drawing.",
        images: [
            "https://truewholesale.in/storage/product-images/17250152130.jpg",
    
        ],
        badges: ["Complete Set", "Technical Drawing"]
    },
    {
        id: "p029",
        title: "Whiteboard Markers (Pack of 4)",
        category: "Stationery",
        price: 179,
        mrp: 249,
        discountPercent: 28,
        rating: 4.3,
        stock: 90,
        description: "Dry erase whiteboard markers in 4 colors. Non-toxic ink and easy erasing for presentations and teaching.",
        images: [
            "https://m.media-amazon.com/images/I/71nXkCEj-tL._AC_UF1000,1000_QL80_.jpg",
        ],
        badges: ["Dry Erase", "4 Colors"]
    },
    {
        id: "p030",
        title: "File Organizer with Dividers",
        category: "Stationery",
        price: 399,
        mrp: 599,
        discountPercent: 33,
        rating: 4.4,
        stock: 35,
        description: "Expandable file organizer with 12 dividers. Perfect for organizing documents, assignments, and important papers.",
        images: [
            "https://images.meesho.com/images/products/396896476/ow9wn_512.webp?width=512",
        ],
        badges: ["12 Dividers", "Expandable"]
    }
];

// Export products for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
} else {
    window.products = products;
}