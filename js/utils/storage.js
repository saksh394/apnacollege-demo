// Local Storage Utilities
class StorageService {
    constructor() {
        this.prefix = 'shopeasy_';
    }

    // Generic storage methods
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    clear() {
        try {
            const keys = Object.keys(localStorage).filter(key => 
                key.startsWith(this.prefix)
            );
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // Cart-specific methods
    getCart() {
        return this.get('cart', []);
    }

    setCart(cartItems) {
        return this.set('cart', cartItems);
    }

    addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: Date.now(),
                productId,
                quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.setCart(cart);
        this.dispatchCartUpdate();
        return cart;
    }

    updateCartItem(itemId, quantity) {
        const cart = this.getCart();
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            if (quantity <= 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = quantity;
            }
            this.setCart(cart);
            this.dispatchCartUpdate();
        }

        return cart;
    }

    removeFromCart(itemId) {
        const cart = this.getCart();
        const filteredCart = cart.filter(item => item.id !== itemId);
        this.setCart(filteredCart);
        this.dispatchCartUpdate();
        return filteredCart;
    }

    clearCart() {
        this.setCart([]);
        this.dispatchCartUpdate();
    }

    getCartItemCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    // User-specific methods
    getUser() {
        return this.get('user', null);
    }

    setUser(user) {
        return this.set('user', user);
    }

    removeUser() {
        return this.remove('user');
    }

    isLoggedIn() {
        const user = this.getUser();
        return user && user.token;
    }

    // Wishlist methods
    getWishlist() {
        return this.get('wishlist', []);
    }

    addToWishlist(productId) {
        const wishlist = this.getWishlist();
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            this.set('wishlist', wishlist);
        }
        return wishlist;
    }

    removeFromWishlist(productId) {
        const wishlist = this.getWishlist();
        const filtered = wishlist.filter(id => id !== productId);
        this.set('wishlist', filtered);
        return filtered;
    }

    isInWishlist(productId) {
        const wishlist = this.getWishlist();
        return wishlist.includes(productId);
    }

    // Search history
    getSearchHistory() {
        return this.get('searchHistory', []);
    }

    addToSearchHistory(query) {
        if (!query.trim()) return;
        
        const history = this.getSearchHistory();
        const filtered = history.filter(item => item !== query);
        filtered.unshift(query);
        
        // Keep only last 10 searches
        const limited = filtered.slice(0, 10);
        this.set('searchHistory', limited);
        return limited;
    }

    clearSearchHistory() {
        return this.remove('searchHistory');
    }

    // Recently viewed products
    getRecentlyViewed() {
        return this.get('recentlyViewed', []);
    }

    addToRecentlyViewed(productId) {
        const recent = this.getRecentlyViewed();
        const filtered = recent.filter(id => id !== productId);
        filtered.unshift(productId);
        
        // Keep only last 5 products
        const limited = filtered.slice(0, 5);
        this.set('recentlyViewed', limited);
        return limited;
    }

    // Preferences
    getPreferences() {
        return this.get('preferences', {
            currency: 'USD',
            language: 'en',
            theme: 'light',
            notifications: true
        });
    }

    setPreferences(preferences) {
        const current = this.getPreferences();
        const updated = { ...current, ...preferences };
        return this.set('preferences', updated);
    }

    // Event system for real-time updates
    dispatchCartUpdate() {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                cart: this.getCart(),
                itemCount: this.getCartItemCount()
            }
        });
        window.dispatchEvent(event);
    }

    // Initialize storage service
    init() {
        // Check if this is the first visit
        if (!this.get('initialized')) {
            this.set('initialized', true);
            this.set('visitCount', 1);
        } else {
            const visitCount = this.get('visitCount', 0);
            this.set('visitCount', visitCount + 1);
        }

        // Clean up old data (older than 30 days)
        this.cleanupOldData();
    }

    cleanupOldData() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Clean up old cart items
        const cart = this.getCart();
        const validCart = cart.filter(item => {
            const addedAt = new Date(item.addedAt);
            return addedAt > thirtyDaysAgo;
        });
        
        if (validCart.length !== cart.length) {
            this.setCart(validCart);
        }
    }

    // Export/Import data (for backup/restore)
    exportData() {
        const data = {
            cart: this.getCart(),
            wishlist: this.getWishlist(),
            preferences: this.getPreferences(),
            searchHistory: this.getSearchHistory(),
            recentlyViewed: this.getRecentlyViewed(),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.cart) this.setCart(data.cart);
            if (data.wishlist) this.set('wishlist', data.wishlist);
            if (data.preferences) this.set('preferences', data.preferences);
            if (data.searchHistory) this.set('searchHistory', data.searchHistory);
            if (data.recentlyViewed) this.set('recentlyViewed', data.recentlyViewed);
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Global storage instance
window.storage = new StorageService();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.storage.init();
});