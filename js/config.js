// Configuration for ShopEasy E-commerce App
window.AppConfig = {
    // Environment settings
    environment: 'development', // 'development' | 'production'
    
    // API Configuration
    api: {
        // Flask backend URL (update when backend is ready)
        baseURL: 'http://localhost:5000/api',
        
        // Enable/disable mock mode
        mockMode: true,
        
        // Request timeout (ms)
        timeout: 10000,
        
        // Retry attempts for failed requests
        retryAttempts: 3
    },
    
    // App Settings
    app: {
        name: 'ShopEasy',
        version: '1.0.0',
        description: 'Modern E-commerce Platform',
        
        // Pagination
        productsPerPage: 12,
        
        // Cart settings
        maxCartItems: 50,
        cartExpiryDays: 30,
        
        // Search settings
        searchDebounceMs: 300,
        maxSearchHistory: 10,
        
        // UI settings
        animationDuration: 300,
        notificationDuration: 3000,
        
        // Currency settings
        currency: 'USD',
        locale: 'en-US'
    },
    
    // Feature flags
    features: {
        wishlist: true,
        reviews: true,
        recommendations: true,
        socialShare: true,
        guestCheckout: true,
        multipleAddresses: false,
        subscriptions: false,
        rewards: false
    },
    
    // UI Theme
    theme: {
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b',
        successColor: '#10b981',
        errorColor: '#ef4444',
        warningColor: '#f59e0b'
    },
    
    // Integration settings for future backend
    integrations: {
        // Payment gateways
        stripe: {
            enabled: false,
            publicKey: ''
        },
        paypal: {
            enabled: false,
            clientId: ''
        },
        
        // Analytics
        googleAnalytics: {
            enabled: false,
            trackingId: ''
        },
        
        // Error tracking
        sentry: {
            enabled: false,
            dsn: ''
        },
        
        // Email service
        emailjs: {
            enabled: false,
            serviceId: '',
            templateId: ''
        }
    },
    
    // SEO settings
    seo: {
        siteName: 'ShopEasy',
        siteDescription: 'Your trusted online shopping destination',
        siteKeywords: 'ecommerce, shopping, online store, products',
        siteUrl: 'https://shopeasy.com',
        ogImage: '/images/og-image.jpg'
    },
    
    // Development settings
    development: {
        enableDebugLogs: true,
        showPerformanceMetrics: true,
        enableHotReload: false
    },
    
    // Production settings
    production: {
        enableDebugLogs: false,
        showPerformanceMetrics: false,
        enableHotReload: false,
        minifyAssets: true,
        enableCaching: true
    }
};

// Helper function to get config based on environment
window.getConfig = function(path) {
    const config = window.AppConfig;
    const envConfig = config[config.environment] || {};
    
    // Merge environment-specific config
    const mergedConfig = { ...config, ...envConfig };
    
    // Get nested property
    if (path) {
        return path.split('.').reduce((obj, key) => obj && obj[key], mergedConfig);
    }
    
    return mergedConfig;
};

// Initialize configuration
document.addEventListener('DOMContentLoaded', () => {
    const config = window.getConfig();
    
    if (config.development?.enableDebugLogs) {
        console.log('🔧 ShopEasy Configuration:', config);
        console.log('🌍 Environment:', config.environment);
        console.log('🔗 API Base URL:', config.api.baseURL);
        console.log('🎭 Mock Mode:', config.api.mockMode);
    }
});