// Product Detail Modal Component
const ProductDetail = ({ product, isOpen, onClose }) => {
    const [selectedQuantity, setSelectedQuantity] = React.useState(1);
    const [activeTab, setActiveTab] = React.useState('description');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isInWishlist, setIsInWishlist] = React.useState(false);

    React.useEffect(() => {
        if (product) {
            setIsInWishlist(window.storage.isInWishlist(product.id));
            setSelectedQuantity(1);
        }
    }, [product]);

    if (!product) return null;

    const handleAddToCart = async () => {
        setIsLoading(true);
        
        try {
            window.storage.addToCart(product.id, selectedQuantity);
            
            const event = new CustomEvent('showNotification', {
                detail: {
                    type: 'success',
                    message: `${selectedQuantity}x ${product.name} added to cart!`
                }
            });
            window.dispatchEvent(event);
            
            onClose();
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

    const handleWishlistToggle = () => {
        if (isInWishlist) {
            window.storage.removeFromWishlist(product.id);
            setIsInWishlist(false);
        } else {
            window.storage.addToWishlist(product.id);
            setIsInWishlist(true);
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
        className: `modal ${isOpen ? 'open' : ''}`,
        onClick: (e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }
    },
        React.createElement('div', { 
            className: 'modal-content',
            style: { maxWidth: '800px', width: '95%' }
        },
            // Modal header
            React.createElement('div', { className: 'modal-header' },
                React.createElement('h3', null, product.name),
                React.createElement('button', {
                    className: 'close-cart',
                    onClick: onClose
                }, React.createElement('i', { className: 'fas fa-times' }))
            ),

            // Modal body
            React.createElement('div', { className: 'modal-body' },
                React.createElement('div', { 
                    className: 'grid grid-cols-1',
                    style: { gridTemplateColumns: '1fr 1fr', gap: '2rem' }
                },
                    // Product image
                    React.createElement('div', null,
                        React.createElement('div', {
                            className: 'product-image',
                            style: {
                                height: '400px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontSize: '6rem',
                                position: 'relative',
                                borderRadius: 'var(--radius-lg)'
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
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }
                            }, `-${discountPercentage}% OFF`)
                        )
                    ),

                    // Product details
                    React.createElement('div', null,
                        // Rating
                        React.createElement('div', { 
                            className: 'flex items-center gap-2 mb-4' 
                        },
                            React.createElement('div', { className: 'flex items-center' },
                                Array.from({ length: 5 }, (_, i) =>
                                    React.createElement('i', {
                                        key: i,
                                        className: 'fas fa-star',
                                        style: {
                                            color: i < Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb'
                                        }
                                    })
                                )
                            ),
                            React.createElement('span', { className: 'text-sm text-secondary' },
                                `${product.rating} (${product.reviews} reviews)`
                            )
                        ),

                        // Price
                        React.createElement('div', { className: 'flex items-center gap-3 mb-4' },
                            React.createElement('span', { 
                                className: 'text-3xl font-bold',
                                style: { color: 'var(--primary-color)' }
                            }, formatPrice(product.price)),
                            product.originalPrice && product.originalPrice > product.price &&
                                React.createElement('span', {
                                    className: 'text-lg text-light',
                                    style: { textDecoration: 'line-through' }
                                }, formatPrice(product.originalPrice))
                        ),

                        // Stock status
                        React.createElement('div', { className: 'mb-4' },
                            product.inStock ? 
                                React.createElement('span', {
                                    className: 'text-sm font-medium',
                                    style: { color: 'var(--success-color)' }
                                }, `✓ In Stock (${product.stockCount} available)`) :
                                React.createElement('span', {
                                    className: 'text-sm font-medium',
                                    style: { color: 'var(--error-color)' }
                                }, '✗ Out of Stock')
                        ),

                        // Features
                        React.createElement('div', { className: 'mb-6' },
                            React.createElement('h4', { className: 'font-semibold mb-2' }, 'Key Features'),
                            React.createElement('ul', { className: 'list-none' },
                                product.features?.map((feature, index) =>
                                    React.createElement('li', {
                                        key: index,
                                        className: 'flex items-center gap-2 mb-1'
                                    },
                                        React.createElement('i', { 
                                            className: 'fas fa-check',
                                            style: { color: 'var(--success-color)', fontSize: '0.75rem' }
                                        }),
                                        React.createElement('span', { className: 'text-sm' }, feature)
                                    )
                                )
                            )
                        ),

                        // Quantity selector
                        React.createElement('div', { className: 'mb-6' },
                            React.createElement('label', { className: 'form-label' }, 'Quantity'),
                            React.createElement('div', { className: 'flex items-center gap-3' },
                                React.createElement('div', { className: 'quantity-controls' },
                                    React.createElement('button', {
                                        className: 'quantity-btn',
                                        onClick: () => setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                                    }, '-'),
                                    React.createElement('span', { 
                                        style: { 
                                            padding: '0 1rem', 
                                            fontWeight: '600',
                                            minWidth: '3rem',
                                            textAlign: 'center'
                                        } 
                                    }, selectedQuantity),
                                    React.createElement('button', {
                                        className: 'quantity-btn',
                                        onClick: () => setSelectedQuantity(Math.min(product.stockCount, selectedQuantity + 1)),
                                        disabled: selectedQuantity >= product.stockCount
                                    }, '+')
                                ),
                                React.createElement('span', { className: 'text-sm text-secondary' },
                                    `Max: ${product.stockCount}`
                                )
                            )
                        ),

                        // Action buttons
                        React.createElement('div', { className: 'flex gap-3 mb-6' },
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
                                className: `btn btn-outline`,
                                onClick: handleWishlistToggle
                            }, 
                                React.createElement('i', { 
                                    className: isInWishlist ? 'fas fa-heart' : 'far fa-heart',
                                    style: { color: isInWishlist ? '#ef4444' : 'inherit' }
                                }),
                                isInWishlist ? 'In Wishlist' : 'Add to Wishlist'
                            )
                        )
                    )
                ),

                // Product tabs
                React.createElement('div', { className: 'mt-6' },
                    React.createElement('div', { className: 'flex border-b border-gray-200 mb-4' },
                        ['description', 'specifications', 'reviews'].map(tab =>
                            React.createElement('button', {
                                key: tab,
                                className: `px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                                    activeTab === tab 
                                        ? 'border-blue-500 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`,
                                onClick: () => setActiveTab(tab)
                            }, tab.charAt(0).toUpperCase() + tab.slice(1))
                        )
                    ),

                    React.createElement('div', { className: 'tab-content' },
                        activeTab === 'description' && 
                            React.createElement('div', null,
                                React.createElement('p', { className: 'text-secondary leading-relaxed' },
                                    product.description
                                )
                            ),

                        activeTab === 'specifications' && 
                            React.createElement('div', null,
                                product.specifications ? 
                                    React.createElement('dl', { className: 'grid grid-cols-1 gap-2' },
                                        Object.entries(product.specifications).map(([key, value]) =>
                                            React.createElement(React.Fragment, { key },
                                                React.createElement('div', { className: 'flex justify-between py-2 border-b border-gray-100' },
                                                    React.createElement('dt', { className: 'font-medium' }, key),
                                                    React.createElement('dd', { className: 'text-secondary' }, value)
                                                )
                                            )
                                        )
                                    ) :
                                    React.createElement('p', { className: 'text-secondary' },
                                        'No specifications available.'
                                    )
                            ),

                        activeTab === 'reviews' && 
                            React.createElement('div', null,
                                React.createElement('div', { className: 'text-center p-4' },
                                    React.createElement('div', { 
                                        style: { fontSize: '3rem', marginBottom: '1rem' } 
                                    }, '⭐'),
                                    React.createElement('h4', { className: 'text-xl mb-2' }, 
                                        `${product.rating}/5 Stars`
                                    ),
                                    React.createElement('p', { className: 'text-secondary' },
                                        `Based on ${product.reviews} customer reviews`
                                    ),
                                    React.createElement('p', { className: 'text-sm text-light mt-2' },
                                        'Detailed reviews will be available when connected to the backend.'
                                    )
                                )
                            )
                    )
                )
            )
        )
    );
};