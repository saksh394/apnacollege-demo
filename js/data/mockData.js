// Mock Data for Development
window.mockData = {
    products: [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
            price: 299.99,
            originalPrice: 399.99,
            category: "Electronics",
            image: "🎧",
            rating: 4.8,
            reviews: 156,
            inStock: true,
            stockCount: 25,
            features: ["Noise Cancellation", "30-hour Battery", "Wireless Charging", "Premium Audio"],
            specifications: {
                "Battery Life": "30 hours",
                "Connectivity": "Bluetooth 5.0",
                "Weight": "250g",
                "Warranty": "2 years"
            }
        },
        {
            id: 2,
            name: "Smart Fitness Watch",
            description: "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration. Track your health goals effectively.",
            price: 199.99,
            originalPrice: 249.99,
            category: "Electronics",
            image: "⌚",
            rating: 4.6,
            reviews: 89,
            inStock: true,
            stockCount: 15,
            features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"],
            specifications: {
                "Display": "1.4 inch AMOLED",
                "Battery": "7 days",
                "Water Resistance": "50m",
                "Sensors": "Heart Rate, GPS, Accelerometer"
            }
        },
        {
            id: 3,
            name: "Organic Cotton T-Shirt",
            description: "Comfortable and sustainable organic cotton t-shirt. Soft fabric with a perfect fit for everyday wear.",
            price: 29.99,
            originalPrice: 39.99,
            category: "Clothing",
            image: "👕",
            rating: 4.4,
            reviews: 203,
            inStock: true,
            stockCount: 50,
            features: ["100% Organic Cotton", "Sustainable", "Machine Washable", "Various Colors"],
            specifications: {
                "Material": "100% Organic Cotton",
                "Care": "Machine Wash Cold",
                "Origin": "Fair Trade Certified",
                "Sizes": "XS to XXL"
            }
        },
        {
            id: 4,
            name: "Professional Camera Lens",
            description: "High-performance camera lens for professional photography. Sharp images with excellent bokeh effect.",
            price: 899.99,
            originalPrice: 1099.99,
            category: "Electronics",
            image: "📷",
            rating: 4.9,
            reviews: 67,
            inStock: true,
            stockCount: 8,
            features: ["Professional Grade", "Weather Sealed", "Image Stabilization", "Fast Autofocus"],
            specifications: {
                "Focal Length": "85mm",
                "Aperture": "f/1.4",
                "Mount": "Canon EF",
                "Weight": "950g"
            }
        },
        {
            id: 5,
            name: "Ergonomic Office Chair",
            description: "Comfortable ergonomic office chair with lumbar support and adjustable height. Perfect for long working hours.",
            price: 399.99,
            originalPrice: 499.99,
            category: "Furniture",
            image: "🪑",
            rating: 4.7,
            reviews: 124,
            inStock: true,
            stockCount: 12,
            features: ["Lumbar Support", "Adjustable Height", "Breathable Mesh", "360° Swivel"],
            specifications: {
                "Material": "Mesh and Foam",
                "Weight Capacity": "150kg",
                "Dimensions": "65x65x110cm",
                "Warranty": "5 years"
            }
        },
        {
            id: 6,
            name: "Stainless Steel Water Bottle",
            description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
            price: 34.99,
            originalPrice: 44.99,
            category: "Lifestyle",
            image: "🍶",
            rating: 4.5,
            reviews: 312,
            inStock: true,
            stockCount: 75,
            features: ["Double Wall Insulated", "BPA Free", "Leak Proof", "Easy Clean"],
            specifications: {
                "Capacity": "750ml",
                "Material": "Stainless Steel",
                "Insulation": "24h Cold / 12h Hot",
                "Dimensions": "7x7x28cm"
            }
        },
        {
            id: 7,
            name: "Wireless Gaming Mouse",
            description: "High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons.",
            price: 79.99,
            originalPrice: 99.99,
            category: "Electronics",
            image: "🖱️",
            rating: 4.6,
            reviews: 89,
            inStock: true,
            stockCount: 30,
            features: ["RGB Lighting", "Programmable Buttons", "High DPI", "Wireless"],
            specifications: {
                "DPI": "16000",
                "Battery": "70 hours",
                "Connectivity": "2.4GHz Wireless",
                "Buttons": "8 Programmable"
            }
        },
        {
            id: 8,
            name: "Minimalist Backpack",
            description: "Sleek and functional minimalist backpack perfect for work, travel, or daily use. Multiple compartments included.",
            price: 89.99,
            originalPrice: 119.99,
            category: "Accessories",
            image: "🎒",
            rating: 4.3,
            reviews: 156,
            inStock: true,
            stockCount: 22,
            features: ["Water Resistant", "Laptop Compartment", "Multiple Pockets", "Comfortable Straps"],
            specifications: {
                "Capacity": "25L",
                "Material": "Nylon",
                "Laptop Size": "Up to 15 inch",
                "Dimensions": "45x30x15cm"
            }
        },
        {
            id: 9,
            name: "Smart Home Speaker",
            description: "Voice-controlled smart speaker with premium sound quality and smart home integration capabilities.",
            price: 149.99,
            originalPrice: 199.99,
            category: "Electronics",
            image: "🔊",
            rating: 4.4,
            reviews: 278,
            inStock: true,
            stockCount: 18,
            features: ["Voice Control", "Smart Home Hub", "Premium Audio", "Multi-room"],
            specifications: {
                "Connectivity": "WiFi, Bluetooth",
                "Voice Assistant": "Built-in",
                "Audio": "360-degree Sound",
                "Compatibility": "iOS, Android"
            }
        },
        {
            id: 10,
            name: "Ceramic Coffee Mug Set",
            description: "Beautiful set of 4 ceramic coffee mugs with elegant design. Perfect for your morning coffee routine.",
            price: 49.99,
            originalPrice: 64.99,
            category: "Home",
            image: "☕",
            rating: 4.2,
            reviews: 94,
            inStock: true,
            stockCount: 40,
            features: ["Set of 4", "Dishwasher Safe", "Microwave Safe", "Elegant Design"],
            specifications: {
                "Material": "Ceramic",
                "Capacity": "350ml each",
                "Care": "Dishwasher Safe",
                "Set Size": "4 mugs"
            }
        },
        {
            id: 11,
            name: "Yoga Mat Pro",
            description: "Professional-grade yoga mat with superior grip and cushioning. Eco-friendly and durable for all yoga practices.",
            price: 69.99,
            originalPrice: 89.99,
            category: "Sports",
            image: "🧘",
            rating: 4.7,
            reviews: 167,
            inStock: true,
            stockCount: 35,
            features: ["Non-slip Surface", "Eco-friendly", "Extra Thick", "Carrying Strap"],
            specifications: {
                "Thickness": "6mm",
                "Material": "Natural Rubber",
                "Dimensions": "183x61cm",
                "Weight": "1.8kg"
            }
        },
        {
            id: 12,
            name: "LED Desk Lamp",
            description: "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for work and study.",
            price: 59.99,
            originalPrice: 79.99,
            category: "Home",
            image: "💡",
            rating: 4.5,
            reviews: 112,
            inStock: true,
            stockCount: 28,
            features: ["Adjustable Brightness", "Color Temperature", "USB Charging Port", "Touch Control"],
            specifications: {
                "Power": "12W LED",
                "Color Temperature": "3000K-6500K",
                "Brightness": "10 Levels",
                "Features": "USB Port, Touch Control"
            }
        }
    ],

    categories: [
        { id: 1, name: "Electronics", icon: "📱", count: 156 },
        { id: 2, name: "Clothing", icon: "👕", count: 89 },
        { id: 3, name: "Home", icon: "🏠", count: 234 },
        { id: 4, name: "Sports", icon: "⚽", count: 67 },
        { id: 5, name: "Accessories", icon: "👜", count: 123 },
        { id: 6, name: "Furniture", icon: "🪑", count: 45 },
        { id: 7, name: "Lifestyle", icon: "✨", count: 78 }
    ],

    testimonials: [
        {
            id: 1,
            name: "Sarah Johnson",
            rating: 5,
            comment: "Amazing quality products and fast shipping! Highly recommend ShopEasy.",
            avatar: "👩",
            verified: true
        },
        {
            id: 2,
            name: "Mike Chen",
            rating: 5,
            comment: "Great customer service and easy returns. My go-to online store.",
            avatar: "👨",
            verified: true
        },
        {
            id: 3,
            name: "Emily Davis",
            rating: 4,
            comment: "Love the user-friendly website and quick checkout process.",
            avatar: "👩‍💼",
            verified: true
        }
    ],

    featuredProducts: [1, 4, 7, 9], // Product IDs for featured section

    banners: [
        {
            id: 1,
            title: "Summer Sale",
            subtitle: "Up to 50% off on selected items",
            cta: "Shop Now",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            active: true
        },
        {
            id: 2,
            title: "Free Shipping",
            subtitle: "On orders over $100",
            cta: "Learn More",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            active: true
        }
    ],

    shippingOptions: [
        {
            id: 1,
            name: "Standard Shipping",
            price: 10,
            estimatedDays: "5-7 business days",
            description: "Regular shipping option"
        },
        {
            id: 2,
            name: "Express Shipping",
            price: 25,
            estimatedDays: "2-3 business days",
            description: "Faster delivery option"
        },
        {
            id: 3,
            name: "Next Day Delivery",
            price: 45,
            estimatedDays: "1 business day",
            description: "Get it tomorrow"
        }
    ],

    paymentMethods: [
        { id: 1, name: "Credit Card", icon: "💳", supported: true },
        { id: 2, name: "PayPal", icon: "🅿️", supported: true },
        { id: 3, name: "Apple Pay", icon: "📱", supported: true },
        { id: 4, name: "Google Pay", icon: "🔵", supported: true }
    ]
};