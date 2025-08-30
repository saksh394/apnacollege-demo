// Main App Component
const App = () => {
    const [currentView, setCurrentView] = React.useState('home');
    const [products, setProducts] = React.useState([]);
    const [filteredProducts, setFilteredProducts] = React.useState([]);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    
    // Modal states
    const [showCart, setShowCart] = React.useState(false);
    const [showAuth, setShowAuth] = React.useState(false);
    const [showProductDetail, setShowProductDetail] = React.useState(false);
    const [showCheckout, setShowCheckout] = React.useState(false);
    const [checkoutData, setCheckoutData] = React.useState(null);

    // Notification state
    const [notification, setNotification] = React.useState(null);

    React.useEffect(() => {
        initializeApp();
        setupEventListeners();
        
        return () => {
            // Cleanup event listeners
            window.removeEventListener('toggleCart', handleToggleCart);
            window.removeEventListener('showAuth', handleShowAuth);
            window.removeEventListener('navigateHome', handleNavigateHome);
            window.removeEventListener('showProducts', handleShowProducts);
            window.removeEventListener('searchProducts', handleSearchProducts);
            window.removeEventListener('filterByCategory', handleFilterByCategory);
            window.removeEventListener('showNotification', handleShowNotification);
            window.removeEventListener('userLogout', handleUserLogout);
        };
    }, []);

    const initializeApp = async () => {
        try {
            // Load initial data
            const productsData = await window.api.getProducts();
            setProducts(productsData.products);
            setFilteredProducts(productsData.products);
            
            // Check for logged in user
            const currentUser = window.storage.getUser();
            setUser(currentUser);
            
            setLoading(false);
            
            // Hide loading screen
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Error initializing app:', error);
            setLoading(false);
        }
    };

    const setupEventListeners = () => {
        window.addEventListener('toggleCart', handleToggleCart);
        window.addEventListener('showAuth', handleShowAuth);
        window.addEventListener('navigateHome', handleNavigateHome);
        window.addEventListener('showProducts', handleShowProducts);
        window.addEventListener('searchProducts', handleSearchProducts);
        window.addEventListener('filterByCategory', handleFilterByCategory);
        window.addEventListener('showNotification', handleShowNotification);
        window.addEventListener('userLogout', handleUserLogout);
    };

    const handleToggleCart = () => {
        setShowCart(!showCart);
    };

    const handleShowAuth = () => {
        setShowAuth(true);
    };

    const handleNavigateHome = () => {
        setCurrentView('home');
        setFilteredProducts(products);
    };

    const handleShowProducts = () => {
        setCurrentView('products');
        setFilteredProducts(products);
    };

    const handleSearchProducts = async (event) => {
        const query = event.detail.query;
        setLoading(true);
        
        try {
            const searchResults = await window.api.searchMockProducts({ query });
            setFilteredProducts(searchResults.products);
            setCurrentView('products');
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterByCategory = (event) => {
        const category = event.detail.category;
        const filtered = products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
        setFilteredProducts(filtered);
        setCurrentView('products');
    };

    const handleShowNotification = (event) => {
        const { type, message } = event.detail;
        setNotification({ type, message });
        
        // Auto-hide notification after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleUserLogout = () => {
        setUser(null);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setShowProductDetail(true);
    };

    const handleAuthSuccess = (userData) => {
        setUser(userData);
        setShowAuth(false);
    };

    const handleCheckout = (cartData) => {
        setCheckoutData(cartData);
        setShowCheckout(true);
    };

    const renderHeroSection = () => {
        return React.createElement('section', { className: 'hero' },
            React.createElement('div', { className: 'container' },
                React.createElement('h1', null, 'Welcome to ShopEasy'),
                React.createElement('p', null, 'Discover amazing products at unbeatable prices'),
                React.createElement('div', { className: 'flex justify-center gap-4' },
                    React.createElement('button', {
                        className: 'btn btn-lg',
                        style: { 
                            background: 'white', 
                            color: 'var(--primary-color)',
                            fontWeight: '600'
                        },
                        onClick: () => {
                            setCurrentView('products');
                            setFilteredProducts(products);
                        }
                    }, 
                        React.createElement('i', { className: 'fas fa-shopping-bag mr-2' }),
                        'Shop Now'
                    ),
                    React.createElement('button', {
                        className: 'btn btn-lg btn-outline',
                        style: { 
                            borderColor: 'white', 
                            color: 'white' 
                        },
                        onClick: () => {
                            // Scroll to featured products
                            const featuredSection = document.getElementById('featured');
                            if (featuredSection) {
                                featuredSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    }, 'Learn More')
                )
            )
        );
    };

    const renderFeaturedProducts = () => {
        const featuredIds = window.mockData.featuredProducts;
        const featuredProducts = products.filter(product => 
            featuredIds.includes(product.id)
        );

        return React.createElement('section', { 
            id: 'featured',
            className: 'py-16 bg-gray-50' 
        },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'section-title' },
                    React.createElement('h2', null, 'Featured Products'),
                    React.createElement('p', null, 'Hand-picked products just for you')
                ),
                React.createElement('div', { className: 'products-container' },
                    featuredProducts.map(product =>
                        React.createElement(ProductCard, {
                            key: product.id,
                            product,
                            onViewDetails: handleProductSelect
                        })
                    )
                )
            )
        );
    };

    const renderCategories = () => {
        const categories = window.mockData.categories;
        
        return React.createElement('section', { className: 'py-16' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'section-title' },
                    React.createElement('h2', null, 'Shop by Category'),
                    React.createElement('p', null, 'Find exactly what you\'re looking for')
                ),
                React.createElement('div', { 
                    className: 'grid',
                    style: { 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem'
                    }
                },
                    categories.map(category =>
                        React.createElement('div', {
                            key: category.id,
                            className: 'card text-center cursor-pointer',
                            onClick: () => {
                                const event = new CustomEvent('filterByCategory', {
                                    detail: { category: category.name }
                                });
                                window.dispatchEvent(event);
                            }
                        },
                            React.createElement('div', { className: 'card-body' },
                                React.createElement('div', { 
                                    style: { fontSize: '3rem', marginBottom: '1rem' } 
                                }, category.icon),
                                React.createElement('h4', { className: 'font-semibold mb-2' }, 
                                    category.name
                                ),
                                React.createElement('p', { className: 'text-sm text-secondary' },
                                    `${category.count} products`
                                )
                            )
                        )
                    )
                )
            )
        );
    };

    const renderTestimonials = () => {
        const testimonials = window.mockData.testimonials;
        
        return React.createElement('section', { 
            className: 'py-16',
            style: { background: 'var(--bg-secondary)' }
        },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'section-title' },
                    React.createElement('h2', null, 'What Our Customers Say'),
                    React.createElement('p', null, 'Join thousands of satisfied customers')
                ),
                React.createElement('div', { 
                    className: 'grid grid-cols-1',
                    style: { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }
                },
                    testimonials.map(testimonial =>
                        React.createElement('div', {
                            key: testimonial.id,
                            className: 'card'
                        },
                            React.createElement('div', { className: 'card-body' },
                                React.createElement('div', { className: 'flex items-center mb-4' },
                                    React.createElement('div', { 
                                        style: { 
                                            fontSize: '2rem', 
                                            marginRight: '1rem' 
                                        } 
                                    }, testimonial.avatar),
                                    React.createElement('div', null,
                                        React.createElement('h5', { className: 'font-semibold' }, 
                                            testimonial.name
                                        ),
                                        React.createElement('div', { className: 'flex items-center' },
                                            Array.from({ length: 5 }, (_, i) =>
                                                React.createElement('i', {
                                                    key: i,
                                                    className: 'fas fa-star',
                                                    style: {
                                                        color: i < testimonial.rating ? '#f59e0b' : '#e5e7eb',
                                                        fontSize: '0.875rem'
                                                    }
                                                })
                                            ),
                                            testimonial.verified && React.createElement('span', {
                                                className: 'ml-2 text-xs',
                                                style: { color: 'var(--success-color)' }
                                            }, '✓ Verified')
                                        )
                                    )
                                ),
                                React.createElement('p', { className: 'text-secondary italic' },
                                    `"${testimonial.comment}"`
                                )
                            )
                        )
                    )
                )
            )
        );
    };

    const renderFooter = () => {
        return React.createElement('footer', { className: 'footer' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'footer-content' },
                    React.createElement('div', { className: 'footer-section' },
                        React.createElement('h4', null, 'ShopEasy'),
                        React.createElement('p', { className: 'text-light mb-4' },
                            'Your trusted online shopping destination with quality products and excellent service.'
                        ),
                        React.createElement('div', { className: 'flex gap-4' },
                            ['facebook', 'twitter', 'instagram', 'youtube'].map(social =>
                                React.createElement('a', {
                                    key: social,
                                    href: '#',
                                    className: 'text-light hover:text-white',
                                    style: { fontSize: '1.25rem' }
                                }, React.createElement('i', { className: `fab fa-${social}` }))
                            )
                        )
                    ),
                    React.createElement('div', { className: 'footer-section' },
                        React.createElement('h4', null, 'Quick Links'),
                        React.createElement('ul', null,
                            ['About Us', 'Contact', 'FAQ', 'Shipping Info', 'Returns'].map(link =>
                                React.createElement('li', { key: link },
                                    React.createElement('a', { href: '#' }, link)
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'footer-section' },
                        React.createElement('h4', null, 'Categories'),
                        React.createElement('ul', null,
                            window.mockData.categories.slice(0, 5).map(category =>
                                React.createElement('li', { key: category.id },
                                    React.createElement('a', { 
                                        href: '#',
                                        onClick: (e) => {
                                            e.preventDefault();
                                            const event = new CustomEvent('filterByCategory', {
                                                detail: { category: category.name }
                                            });
                                            window.dispatchEvent(event);
                                        }
                                    }, category.name)
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'footer-section' },
                        React.createElement('h4', null, 'Customer Service'),
                        React.createElement('ul', null,
                            React.createElement('li', null, 
                                React.createElement('i', { className: 'fas fa-phone mr-2' }),
                                '1-800-SHOP-EASY'
                            ),
                            React.createElement('li', null,
                                React.createElement('i', { className: 'fas fa-envelope mr-2' }),
                                'support@shopeasy.com'
                            ),
                            React.createElement('li', null,
                                React.createElement('i', { className: 'fas fa-clock mr-2' }),
                                'Mon-Fri 9AM-6PM EST'
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'footer-bottom' },
                    React.createElement('p', null, 
                        '© 2024 ShopEasy. All rights reserved. Built with React and ready for Flask backend integration.'
                    )
                )
            )
        );
    };

    const renderNotification = () => {
        if (!notification) return null;

        const bgColor = notification.type === 'success' ? 'var(--success-color)' : 
                       notification.type === 'error' ? 'var(--error-color)' : 
                       'var(--primary-color)';

        return React.createElement('div', {
            style: {
                position: 'fixed',
                top: '2rem',
                right: '2rem',
                background: bgColor,
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 3000,
                animation: 'slideInRight 0.3s ease',
                maxWidth: '400px'
            }
        },
            React.createElement('div', { className: 'flex items-center gap-3' },
                React.createElement('i', { 
                    className: notification.type === 'success' ? 'fas fa-check-circle' :
                              notification.type === 'error' ? 'fas fa-exclamation-circle' :
                              'fas fa-info-circle'
                }),
                React.createElement('span', null, notification.message),
                React.createElement('button', {
                    onClick: () => setNotification(null),
                    style: {
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        marginLeft: 'auto'
                    }
                }, React.createElement('i', { className: 'fas fa-times' }))
            )
        );
    };

    const handleUserLogout = () => {
        setUser(null);
    };

    if (loading) {
        return React.createElement('div', { className: 'loading-screen' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Loading ShopEasy...')
        );
    }

    return React.createElement('div', { className: 'app' },
        // Header
        React.createElement(Header),

        // Main content
        React.createElement('main', null,
            currentView === 'home' ? 
                React.createElement(React.Fragment, null,
                    renderHeroSection(),
                    renderFeaturedProducts(),
                    renderCategories(),
                    renderTestimonials()
                ) :
                React.createElement(ProductGrid, {
                    products: filteredProducts,
                    loading: loading,
                    onProductSelect: handleProductSelect
                })
        ),

        // Footer
        renderFooter(),

        // Modals and Sidebars
        React.createElement(Cart, {
            isOpen: showCart,
            onClose: () => setShowCart(false),
            onCheckout: handleCheckout
        }),

        React.createElement(Auth, {
            isOpen: showAuth,
            onClose: () => setShowAuth(false),
            onAuthSuccess: handleAuthSuccess
        }),

        React.createElement(ProductDetail, {
            product: selectedProduct,
            isOpen: showProductDetail,
            onClose: () => {
                setShowProductDetail(false);
                setSelectedProduct(null);
            }
        }),

        React.createElement(Checkout, {
            isOpen: showCheckout,
            onClose: () => {
                setShowCheckout(false);
                setCheckoutData(null);
            },
            cartData: checkoutData
        }),

        // Notification
        renderNotification()
    );
};

// Initialize React app
document.addEventListener('DOMContentLoaded', () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
});