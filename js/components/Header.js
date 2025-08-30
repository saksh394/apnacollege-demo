// Header Component
const Header = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [cartItemCount, setCartItemCount] = React.useState(0);
    const [user, setUser] = React.useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        // Initialize cart count
        updateCartCount();
        
        // Initialize user
        const currentUser = window.storage.getUser();
        setUser(currentUser);

        // Listen for cart updates
        const handleCartUpdate = (event) => {
            setCartItemCount(event.detail.itemCount);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const updateCartCount = () => {
        const count = window.storage.getCartItemCount();
        setCartItemCount(count);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.storage.addToSearchHistory(searchQuery.trim());
            // Trigger search event
            const event = new CustomEvent('searchProducts', {
                detail: { query: searchQuery.trim() }
            });
            window.dispatchEvent(event);
        }
    };

    const handleCartClick = () => {
        const event = new CustomEvent('toggleCart');
        window.dispatchEvent(event);
    };

    const handleAuthClick = () => {
        const event = new CustomEvent('showAuth');
        window.dispatchEvent(event);
    };

    const handleLogout = () => {
        window.storage.removeUser();
        setUser(null);
        // Trigger app update
        const event = new CustomEvent('userLogout');
        window.dispatchEvent(event);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return React.createElement('header', { className: 'header' },
        React.createElement('div', { className: 'container' },
            React.createElement('div', { className: 'header-content' },
                // Logo
                React.createElement('a', { 
                    href: '#', 
                    className: 'logo',
                    onClick: (e) => {
                        e.preventDefault();
                        const event = new CustomEvent('navigateHome');
                        window.dispatchEvent(event);
                    }
                }, 'ShopEasy'),

                // Mobile menu toggle
                React.createElement('button', {
                    className: 'mobile-menu-toggle',
                    onClick: toggleMobileMenu
                }, React.createElement('i', { 
                    className: mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars' 
                })),

                // Navigation
                React.createElement('nav', null,
                    React.createElement('ul', { 
                        className: `nav-menu ${mobileMenuOpen ? 'open' : ''}` 
                    },
                        React.createElement('li', null,
                            React.createElement('a', { 
                                href: '#', 
                                className: 'nav-link',
                                onClick: (e) => {
                                    e.preventDefault();
                                    const event = new CustomEvent('navigateHome');
                                    window.dispatchEvent(event);
                                    setMobileMenuOpen(false);
                                }
                            }, 'Home')
                        ),
                        React.createElement('li', null,
                            React.createElement('a', { 
                                href: '#', 
                                className: 'nav-link',
                                onClick: (e) => {
                                    e.preventDefault();
                                    const event = new CustomEvent('showProducts');
                                    window.dispatchEvent(event);
                                    setMobileMenuOpen(false);
                                }
                            }, 'Products')
                        ),
                        React.createElement('li', null,
                            React.createElement('a', { 
                                href: '#', 
                                className: 'nav-link',
                                onClick: (e) => {
                                    e.preventDefault();
                                    const event = new CustomEvent('filterByCategory', {
                                        detail: { category: 'Electronics' }
                                    });
                                    window.dispatchEvent(event);
                                    setMobileMenuOpen(false);
                                }
                            }, 'Electronics')
                        ),
                        React.createElement('li', null,
                            React.createElement('a', { 
                                href: '#', 
                                className: 'nav-link',
                                onClick: (e) => {
                                    e.preventDefault();
                                    const event = new CustomEvent('filterByCategory', {
                                        detail: { category: 'Clothing' }
                                    });
                                    window.dispatchEvent(event);
                                    setMobileMenuOpen(false);
                                }
                            }, 'Clothing')
                        ),
                        React.createElement('li', null,
                            React.createElement('a', { 
                                href: '#', 
                                className: 'nav-link',
                                onClick: (e) => {
                                    e.preventDefault();
                                    const event = new CustomEvent('filterByCategory', {
                                        detail: { category: 'Home' }
                                    });
                                    window.dispatchEvent(event);
                                    setMobileMenuOpen(false);
                                }
                            }, 'Home')
                        )
                    )
                ),

                // Header actions
                React.createElement('div', { className: 'header-actions' },
                    // Search box
                    React.createElement('form', { 
                        className: 'search-box',
                        onSubmit: handleSearch
                    },
                        React.createElement('input', {
                            type: 'text',
                            placeholder: 'Search products...',
                            className: 'search-input',
                            value: searchQuery,
                            onChange: (e) => setSearchQuery(e.target.value)
                        }),
                        React.createElement('button', {
                            type: 'submit',
                            className: 'search-btn'
                        }, React.createElement('i', { className: 'fas fa-search' }))
                    ),

                    // User account
                    user ? 
                        React.createElement('div', { className: 'flex items-center gap-2' },
                            React.createElement('span', { className: 'text-sm' }, `Hi, ${user.name}`),
                            React.createElement('button', {
                                className: 'btn btn-sm btn-outline',
                                onClick: handleLogout
                            }, 'Logout')
                        ) :
                        React.createElement('button', {
                            className: 'btn btn-sm btn-outline',
                            onClick: handleAuthClick
                        }, 'Login'),

                    // Cart icon
                    React.createElement('div', {
                        className: 'cart-icon',
                        onClick: handleCartClick
                    },
                        React.createElement('i', { className: 'fas fa-shopping-cart' }),
                        cartItemCount > 0 && React.createElement('span', { 
                            className: 'cart-badge' 
                        }, cartItemCount)
                    )
                )
            )
        )
    );
};