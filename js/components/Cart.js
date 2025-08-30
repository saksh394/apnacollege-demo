// Shopping Cart Component
const Cart = ({ isOpen, onClose, onCheckout }) => {
    const [cartData, setCartData] = React.useState({ items: [], total: 0, subtotal: 0, shipping: 0, tax: 0 });
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            loadCartData();
        }

        // Listen for cart updates
        const handleCartUpdate = () => {
            loadCartData();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [isOpen]);

    const loadCartData = async () => {
        setLoading(true);
        try {
            const data = await window.api.getMockCart();
            setCartData(data);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(itemId);
        } else {
            window.storage.updateCartItem(itemId, newQuantity);
        }
    };

    const removeItem = (itemId) => {
        window.storage.removeFromCart(itemId);
        
        // Show notification
        const event = new CustomEvent('showNotification', {
            detail: {
                type: 'success',
                message: 'Item removed from cart'
            }
        });
        window.dispatchEvent(event);
    };

    const clearCart = () => {
        window.storage.clearCart();
        
        const event = new CustomEvent('showNotification', {
            detail: {
                type: 'success',
                message: 'Cart cleared'
            }
        });
        window.dispatchEvent(event);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleCheckout = () => {
        if (cartData.items.length === 0) return;
        
        onClose();
        if (onCheckout) {
            onCheckout(cartData);
        }
    };

    const handleContinueShopping = () => {
        onClose();
        const event = new CustomEvent('showProducts');
        window.dispatchEvent(event);
    };

    return React.createElement(React.Fragment, null,
        // Overlay
        React.createElement('div', {
            className: `cart-overlay ${isOpen ? 'open' : ''}`,
            onClick: onClose
        }),

        // Cart sidebar
        React.createElement('div', {
            className: `cart-sidebar ${isOpen ? 'open' : ''}`
        },
            // Header
            React.createElement('div', { className: 'cart-header' },
                React.createElement('h3', null, 
                    React.createElement('i', { className: 'fas fa-shopping-cart mr-2' }),
                    'Shopping Cart'
                ),
                React.createElement('button', {
                    className: 'close-cart',
                    onClick: onClose
                }, React.createElement('i', { className: 'fas fa-times' }))
            ),

            // Cart items
            React.createElement('div', { className: 'cart-items' },
                loading ? 
                    React.createElement('div', { className: 'text-center p-4' },
                        React.createElement('div', { className: 'spinner' }),
                        React.createElement('p', { className: 'mt-2' }, 'Loading cart...')
                    ) :
                    cartData.items.length === 0 ?
                        React.createElement('div', { className: 'text-center p-4' },
                            React.createElement('div', { 
                                style: { fontSize: '3rem', marginBottom: '1rem' } 
                            }, '🛒'),
                            React.createElement('h4', { className: 'mb-2' }, 'Your cart is empty'),
                            React.createElement('p', { className: 'text-secondary mb-4' }, 
                                'Add some products to get started!'
                            ),
                            React.createElement('button', {
                                className: 'btn btn-primary',
                                onClick: handleContinueShopping
                            }, 'Continue Shopping')
                        ) :
                        React.createElement(React.Fragment, null,
                            // Cart items list
                            cartData.items.map(item =>
                                React.createElement('div', {
                                    key: item.id,
                                    className: 'cart-item'
                                },
                                    React.createElement('div', { className: 'cart-item-image' },
                                        item.product?.image || '📦'
                                    ),
                                    
                                    React.createElement('div', { className: 'cart-item-info' },
                                        React.createElement('h4', { className: 'cart-item-title' },
                                            item.product?.name || 'Unknown Product'
                                        ),
                                        React.createElement('p', { className: 'cart-item-price' },
                                            formatPrice(item.product?.price || 0)
                                        ),
                                        
                                        React.createElement('div', { className: 'quantity-controls' },
                                            React.createElement('button', {
                                                className: 'quantity-btn',
                                                onClick: () => updateQuantity(item.id, item.quantity - 1)
                                            }, '-'),
                                            React.createElement('span', { 
                                                style: { 
                                                    padding: '0 1rem', 
                                                    fontWeight: '600' 
                                                } 
                                            }, item.quantity),
                                            React.createElement('button', {
                                                className: 'quantity-btn',
                                                onClick: () => updateQuantity(item.id, item.quantity + 1)
                                            }, '+'),
                                            React.createElement('button', {
                                                className: 'quantity-btn',
                                                style: { 
                                                    marginLeft: '1rem', 
                                                    color: 'var(--error-color)',
                                                    borderColor: 'var(--error-color)'
                                                },
                                                onClick: () => removeItem(item.id)
                                            }, React.createElement('i', { className: 'fas fa-trash' }))
                                        )
                                    ),
                                    
                                    React.createElement('div', { className: 'text-right' },
                                        React.createElement('p', { 
                                            className: 'font-semibold',
                                            style: { color: 'var(--primary-color)' }
                                        }, formatPrice(item.total))
                                    )
                                )
                            ),

                            // Clear cart button
                            cartData.items.length > 0 &&
                                React.createElement('div', { className: 'text-center mt-4' },
                                    React.createElement('button', {
                                        className: 'btn btn-secondary btn-sm',
                                        onClick: clearCart
                                    }, 'Clear Cart')
                                )
                        )
            ),

            // Cart footer with totals and checkout
            cartData.items.length > 0 && React.createElement('div', { className: 'cart-footer' },
                React.createElement('div', { className: 'mb-4' },
                    React.createElement('div', { className: 'flex justify-between mb-2' },
                        React.createElement('span', null, 'Subtotal:'),
                        React.createElement('span', null, formatPrice(cartData.subtotal))
                    ),
                    React.createElement('div', { className: 'flex justify-between mb-2' },
                        React.createElement('span', null, 'Shipping:'),
                        React.createElement('span', null, 
                            cartData.shipping === 0 ? 'FREE' : formatPrice(cartData.shipping)
                        )
                    ),
                    React.createElement('div', { className: 'flex justify-between mb-2' },
                        React.createElement('span', null, 'Tax:'),
                        React.createElement('span', null, formatPrice(cartData.tax))
                    ),
                    React.createElement('hr', { style: { margin: '1rem 0' } }),
                    React.createElement('div', { className: 'cart-total' },
                        React.createElement('span', null, 'Total:'),
                        React.createElement('span', null, formatPrice(cartData.total))
                    )
                ),

                React.createElement('div', { className: 'flex flex-col gap-2' },
                    React.createElement('button', {
                        className: 'btn btn-primary w-full',
                        onClick: handleCheckout
                    }, 
                        React.createElement('i', { className: 'fas fa-credit-card mr-2' }),
                        'Proceed to Checkout'
                    ),
                    React.createElement('button', {
                        className: 'btn btn-outline w-full',
                        onClick: handleContinueShopping
                    }, 'Continue Shopping')
                ),

                // Free shipping notice
                cartData.subtotal > 0 && cartData.subtotal < 100 &&
                    React.createElement('div', {
                        className: 'mt-4 p-3 rounded',
                        style: { 
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)'
                        }
                    },
                        React.createElement('p', { className: 'text-sm text-center' },
                            React.createElement('i', { className: 'fas fa-truck mr-1' }),
                            `Add ${formatPrice(100 - cartData.subtotal)} more for FREE shipping!`
                        )
                    )
            )
        )
    );
};