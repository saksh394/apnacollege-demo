// Product Card Component
const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isInWishlist, setIsInWishlist] = React.useState(false);

    React.useEffect(() => {
        setIsInWishlist(window.storage.isInWishlist(product.id));
    }, [product.id]);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        
        try {
            window.storage.addToCart(product.id, 1);
            
            // Show success notification
            const event = new CustomEvent('showNotification', {
                detail: {
                    type: 'success',
                    message: `${product.name} added to cart!`
                }
            });
            window.dispatchEvent(event);
            
            if (onAddToCart) {
                onAddToCart(product);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            const event = new CustomEvent('showNotification', {
                detail: {
                    type: 'error',
                    message: 'Failed to add item to cart'
                }
            });
            window.dispatchEvent(event);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        
        if (isInWishlist) {
            window.storage.removeFromWishlist(product.id);
            setIsInWishlist(false);
        } else {
            window.storage.addToWishlist(product.id);
            setIsInWishlist(true);
        }
    };

    const handleCardClick = () => {
        window.storage.addToRecentlyViewed(product.id);
        if (onViewDetails) {
            onViewDetails(product);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return React.createElement('div', {
        className: 'product-card',
        onClick: handleCardClick
    },
        // Product image
        React.createElement('div', { 
            className: 'product-image',
            style: {
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                color: 'white',
                fontSize: '4rem',
                position: 'relative'
            }
        },
            product.image,
            
            // Discount badge
            discountPercentage > 0 && React.createElement('div', {
                style: {
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                }
            }, `-${discountPercentage}%`),

            // Wishlist button
            React.createElement('button', {
                className: 'absolute',
                style: {
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isInWishlist ? '#ef4444' : '#64748b'
                },
                onClick: handleWishlistToggle
            }, React.createElement('i', { 
                className: isInWishlist ? 'fas fa-heart' : 'far fa-heart' 
            }))
        ),

        // Product info
        React.createElement('div', { className: 'product-info' },
            React.createElement('h3', { className: 'product-title' }, product.name),
            
            React.createElement('p', { className: 'product-description' }, 
                product.description.length > 100 ? 
                    product.description.substring(0, 100) + '...' : 
                    product.description
            ),

            // Rating
            React.createElement('div', { 
                className: 'flex items-center gap-2 mb-2' 
            },
                React.createElement('div', { className: 'flex items-center' },
                    Array.from({ length: 5 }, (_, i) =>
                        React.createElement('i', {
                            key: i,
                            className: `fas fa-star`,
                            style: {
                                color: i < Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb',
                                fontSize: '0.875rem'
                            }
                        })
                    )
                ),
                React.createElement('span', { className: 'text-sm text-secondary' },
                    `${product.rating} (${product.reviews} reviews)`
                )
            ),

            // Price
            React.createElement('div', { className: 'flex items-center gap-2 mb-4' },
                React.createElement('span', { className: 'product-price' }, 
                    formatPrice(product.price)
                ),
                product.originalPrice && product.originalPrice > product.price &&
                    React.createElement('span', {
                        className: 'text-sm text-light',
                        style: { textDecoration: 'line-through' }
                    }, formatPrice(product.originalPrice))
            ),

            // Stock status
            React.createElement('div', { className: 'mb-4' },
                product.inStock ? 
                    React.createElement('span', {
                        className: 'text-sm',
                        style: { color: 'var(--success-color)' }
                    }, `✓ In Stock (${product.stockCount} available)`) :
                    React.createElement('span', {
                        className: 'text-sm',
                        style: { color: 'var(--error-color)' }
                    }, '✗ Out of Stock')
            ),

            // Actions
            React.createElement('div', { className: 'product-actions' },
                React.createElement('button', {
                    className: `btn btn-primary ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`,
                    onClick: handleAddToCart,
                    disabled: !product.inStock || isLoading,
                    style: { flex: 1 }
                },
                    isLoading ? 
                        React.createElement('i', { className: 'fas fa-spinner fa-spin' }) :
                        React.createElement(React.Fragment, null,
                            React.createElement('i', { className: 'fas fa-cart-plus' }),
                            'Add to Cart'
                        )
                ),
                
                React.createElement('button', {
                    className: 'btn btn-outline',
                    onClick: (e) => {
                        e.stopPropagation();
                        handleCardClick();
                    }
                }, React.createElement('i', { className: 'fas fa-eye' }))
            )
        )
    );
};