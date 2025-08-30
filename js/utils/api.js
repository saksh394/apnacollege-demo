// API Service Layer - Ready for Flask Backend Integration
class ApiService {
    constructor() {
        // This will be the Flask backend URL when ready
        this.baseURL = 'http://localhost:5000/api';
        this.isBackendConnected = false;
        
        // Mock mode for development
        this.mockMode = true;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        if (this.mockMode) {
            return this.mockRequest(endpoint, options);
        }

        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            };

            if (config.body && typeof config.body === 'object') {
                config.body = JSON.stringify(config.body);
            }

            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Mock request handler for development
    async mockRequest(endpoint, options = {}) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const method = options.method || 'GET';
        
        switch (endpoint) {
            case '/products':
                return this.getMockProducts(options.params);
            case '/products/search':
                return this.searchMockProducts(options.params);
            case '/auth/login':
                return this.mockLogin(options.body);
            case '/auth/register':
                return this.mockRegister(options.body);
            case '/cart':
                return this.getMockCart();
            case '/orders':
                return this.createMockOrder(options.body);
            default:
                if (endpoint.startsWith('/products/')) {
                    const id = endpoint.split('/')[2];
                    return this.getMockProduct(id);
                }
                throw new Error(`Mock endpoint not implemented: ${endpoint}`);
        }
    }

    // Product API methods
    async getProducts(params = {}) {
        return this.request('/products', { params });
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async searchProducts(query, filters = {}) {
        return this.request('/products/search', {
            params: { query, ...filters }
        });
    }

    // Authentication API methods
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: credentials
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: userData
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }

    // Cart API methods
    async getCart() {
        return this.request('/cart');
    }

    async addToCart(productId, quantity = 1) {
        return this.request('/cart/add', {
            method: 'POST',
            body: { productId, quantity }
        });
    }

    async updateCartItem(itemId, quantity) {
        return this.request(`/cart/items/${itemId}`, {
            method: 'PUT',
            body: { quantity }
        });
    }

    async removeFromCart(itemId) {
        return this.request(`/cart/items/${itemId}`, {
            method: 'DELETE'
        });
    }

    // Order API methods
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: orderData
        });
    }

    async getOrders() {
        return this.request('/orders');
    }

    // Mock data methods (for development)
    getMockProducts(params = {}) {
        const products = window.mockData.products;
        let filtered = [...products];

        if (params.category) {
            filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
        }

        if (params.minPrice) {
            filtered = filtered.filter(p => p.price >= parseFloat(params.minPrice));
        }

        if (params.maxPrice) {
            filtered = filtered.filter(p => p.price <= parseFloat(params.maxPrice));
        }

        if (params.sort) {
            switch (params.sort) {
                case 'price_asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'name_asc':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'rating_desc':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
            }
        }

        return {
            products: filtered,
            total: filtered.length,
            page: 1,
            totalPages: Math.ceil(filtered.length / 12)
        };
    }

    getMockProduct(id) {
        const product = window.mockData.products.find(p => p.id === parseInt(id));
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    searchMockProducts(params) {
        const products = window.mockData.products;
        const query = params.query?.toLowerCase() || '';
        
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        return {
            products: filtered,
            total: filtered.length,
            query: params.query
        };
    }

    mockLogin(credentials) {
        // Simulate login validation
        if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
            const user = {
                id: 1,
                email: credentials.email,
                name: 'Demo User',
                token: 'mock-jwt-token'
            };
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, user };
        }
        throw new Error('Invalid credentials');
    }

    mockRegister(userData) {
        // Simulate registration
        const user = {
            id: Date.now(),
            email: userData.email,
            name: userData.name,
            token: 'mock-jwt-token'
        };
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
    }

    getMockCart() {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const products = window.mockData.products;
        
        const cartWithDetails = cartItems.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                ...item,
                product,
                total: product ? product.price * item.quantity : 0
            };
        });

        const subtotal = cartWithDetails.reduce((sum, item) => sum + item.total, 0);
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        return {
            items: cartWithDetails,
            subtotal,
            shipping,
            tax,
            total
        };
    }

    createMockOrder(orderData) {
        const order = {
            id: Date.now(),
            ...orderData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // Clear cart after order
        localStorage.removeItem('cart');
        
        return { success: true, order };
    }

    // Utility method to switch between mock and real API
    setMockMode(enabled) {
        this.mockMode = enabled;
    }

    // Check if backend is available
    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            this.isBackendConnected = response.ok;
            return this.isBackendConnected;
        } catch (error) {
            this.isBackendConnected = false;
            return false;
        }
    }
}

// Global API instance
window.api = new ApiService();