// Checkout Component
const Checkout = ({ isOpen, onClose, cartData }) => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
        // Shipping information
        shipping: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US'
        },
        // Payment information
        payment: {
            method: 'card',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardName: ''
        },
        // Shipping method
        shippingMethod: '1'
    });
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        if (isOpen) {
            // Pre-fill user data if logged in
            const user = window.storage.getUser();
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    shipping: {
                        ...prev.shipping,
                        firstName: user.name?.split(' ')[0] || '',
                        lastName: user.name?.split(' ').slice(1).join(' ') || '',
                        email: user.email || ''
                    }
                }));
            }
        }
    }, [isOpen]);

    const steps = [
        { id: 1, title: 'Shipping', icon: 'fas fa-truck' },
        { id: 2, title: 'Payment', icon: 'fas fa-credit-card' },
        { id: 3, title: 'Review', icon: 'fas fa-check' }
    ];

    const shippingOptions = window.mockData.shippingOptions;
    const selectedShipping = shippingOptions.find(option => option.id === parseInt(formData.shippingMethod));

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
            required.forEach(field => {
                if (!formData.shipping[field]) {
                    newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                }
            });

            if (formData.shipping.email && !/\S+@\S+\.\S+/.test(formData.shipping.email)) {
                newErrors.email = 'Email is invalid';
            }
        }

        if (step === 2) {
            if (formData.payment.method === 'card') {
                const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
                required.forEach(field => {
                    if (!formData.payment[field]) {
                        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                    }
                });

                if (formData.payment.cardNumber && formData.payment.cardNumber.replace(/\s/g, '').length !== 16) {
                    newErrors.cardNumber = 'Card number must be 16 digits';
                }

                if (formData.payment.cvv && formData.payment.cvv.length !== 3) {
                    newErrors.cvv = 'CVV must be 3 digits';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
    };

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateStep(3)) return;

        setLoading(true);

        try {
            const orderData = {
                items: cartData.items,
                shipping: formData.shipping,
                payment: { method: formData.payment.method },
                shippingMethod: selectedShipping,
                totals: {
                    subtotal: cartData.subtotal,
                    shipping: selectedShipping?.price || 0,
                    tax: cartData.tax,
                    total: cartData.subtotal + (selectedShipping?.price || 0) + cartData.tax
                }
            };

            const result = await window.api.createMockOrder(orderData);

            if (result.success) {
                const event = new CustomEvent('showNotification', {
                    detail: {
                        type: 'success',
                        message: `Order placed successfully! Order #${result.order.id}`
                    }
                });
                window.dispatchEvent(event);

                onClose();
                
                // Navigate to home or order confirmation
                const navEvent = new CustomEvent('navigateHome');
                window.dispatchEvent(navEvent);
            }
        } catch (error) {
            console.error('Order error:', error);
            const event = new CustomEvent('showNotification', {
                detail: {
                    type: 'error',
                    message: 'Failed to place order. Please try again.'
                }
            });
            window.dispatchEvent(event);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const calculateTotal = () => {
        const shippingCost = selectedShipping?.price || 0;
        return cartData.subtotal + shippingCost + cartData.tax;
    };

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return null;
    }

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
            style: { maxWidth: '900px', width: '95%' }
        },
            // Modal header
            React.createElement('div', { className: 'modal-header' },
                React.createElement('h3', null, 'Checkout'),
                React.createElement('button', {
                    className: 'close-cart',
                    onClick: onClose
                }, React.createElement('i', { className: 'fas fa-times' }))
            ),

            // Steps indicator
            React.createElement('div', { 
                className: 'flex justify-center mb-6 p-4',
                style: { background: 'var(--bg-secondary)' }
            },
                steps.map((step, index) =>
                    React.createElement('div', {
                        key: step.id,
                        className: 'flex items-center'
                    },
                        React.createElement('div', {
                            className: `flex items-center justify-center w-10 h-10 rounded-full ${
                                currentStep >= step.id 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                            }`,
                            style: { marginRight: '0.5rem' }
                        }, React.createElement('i', { className: step.icon })),
                        
                        React.createElement('span', { 
                            className: `font-medium ${
                                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                            }`
                        }, step.title),

                        index < steps.length - 1 && React.createElement('div', {
                            className: 'w-12 h-px bg-gray-300 mx-4'
                        })
                    )
                )
            ),

            // Modal body
            React.createElement('div', { className: 'modal-body' },
                React.createElement('div', { 
                    className: 'grid',
                    style: { gridTemplateColumns: '2fr 1fr', gap: '2rem' }
                },
                    // Main content
                    React.createElement('div', null,
                        // Step 1: Shipping Information
                        currentStep === 1 && React.createElement('div', null,
                            React.createElement('h4', { className: 'text-xl font-semibold mb-4' }, 
                                'Shipping Information'
                            ),
                            
                            React.createElement('div', { 
                                className: 'grid grid-cols-2 gap-4 mb-4' 
                            },
                                React.createElement('div', null,
                                    React.createElement('label', { className: 'form-label' }, 'First Name'),
                                    React.createElement('input', {
                                        type: 'text',
                                        className: `form-input ${errors.firstName ? 'border-red-500' : ''}`,
                                        value: formData.shipping.firstName,
                                        onChange: (e) => handleInputChange('shipping', 'firstName', e.target.value)
                                    }),
                                    errors.firstName && React.createElement('p', { 
                                        className: 'text-sm mt-1 text-red-500' 
                                    }, errors.firstName)
                                ),
                                React.createElement('div', null,
                                    React.createElement('label', { className: 'form-label' }, 'Last Name'),
                                    React.createElement('input', {
                                        type: 'text',
                                        className: `form-input ${errors.lastName ? 'border-red-500' : ''}`,
                                        value: formData.shipping.lastName,
                                        onChange: (e) => handleInputChange('shipping', 'lastName', e.target.value)
                                    }),
                                    errors.lastName && React.createElement('p', { 
                                        className: 'text-sm mt-1 text-red-500' 
                                    }, errors.lastName)
                                )
                            ),

                            React.createElement('div', { className: 'grid grid-cols-2 gap-4 mb-4' },
                                React.createElement('div', null,
                                    React.createElement('label', { className: 'form-label' }, 'Email'),
                                    React.createElement('input', {
                                        type: 'email',
                                        className: `form-input ${errors.email ? 'border-red-500' : ''}`,
                                        value: formData.shipping.email,
                                        onChange: (e) => handleInputChange('shipping', 'email', e.target.value)
                                    }),
                                    errors.email && React.createElement('p', { 
                                        className: 'text-sm mt-1 text-red-500' 
                                    }, errors.email)
                                ),
                                React.createElement('div', null,
                                    React.createElement('label', { className: 'form-label' }, 'Phone'),
                                    React.createElement('input', {
                                        type: 'tel',
                                        className: 'form-input',
                                        value: formData.shipping.phone,
                                        onChange: (e) => handleInputChange('shipping', 'phone', e.target.value)
                                    })
                                )
                            ),

                            React.createElement('div', { className: 'mb-4' },
                                React.createElement('label', { className: 'form-label' }, 'Address'),
                                React.createElement('input', {
                                    type: 'text',
                                    className: `form-input ${errors.address ? 'border-red-500' : ''}`,
                                    value: formData.shipping.address,
                                    onChange: (e) => handleInputChange('shipping', 'address', e.target.value)
                                }),
                                errors.address && React.createElement('p', { 
                                    className: 'text-sm mt-1 text-red-500' 
                                }, errors.address)
                            ),

                            React.createElement('div', { className: 'grid grid-cols-3 gap-4 mb-6' },
                                React.createElement('div', null,
                                    React.createElement('label', { className: 'form-label' }, 'City'),
                                    React.createElement('input', {
                                        type: 'text',
                                        className: `form-input ${errors.city ? 'border-red-500' : ''}`,
                                        value: formData.shipping.city,
                                        onChange: (e) => handleInputChange('shipping', 'city', e.target.value)
                                    }),
                                    errors.city && React.createElement('p', { 
                                        className: 'text-sm mt-1 text-red-500' 
                                    }, errors.city)
                                ),
                                React.createElement('div', null,
                                    React.createElement('label', { className: 'form-label' }, 'State'),
                                    React.createElement('input', {
                                        type: 'text',
                                        className: `form-input ${errors.state ? 'border-red-500' : ''}`,
                                        value: formData.shipping.state,
                                        onChange: (e) => handleInputChange('shipping', 'state', e.target.value)
                                    }),
                                    errors.state && React.createElement('p', { 
                                        className: 'text-sm mt-1 text-red-500' 
                                    }, errors.state)
                                ),
                                React.createElement('div', null,
                                    React.createElement('label', { className: 'form-label' }, 'ZIP Code'),
                                    React.createElement('input', {
                                        type: 'text',
                                        className: `form-input ${errors.zipCode ? 'border-red-500' : ''}`,
                                        value: formData.shipping.zipCode,
                                        onChange: (e) => handleInputChange('shipping', 'zipCode', e.target.value)
                                    }),
                                    errors.zipCode && React.createElement('p', { 
                                        className: 'text-sm mt-1 text-red-500' 
                                    }, errors.zipCode)
                                )
                            ),

                            // Shipping method selection
                            React.createElement('div', null,
                                React.createElement('h5', { className: 'font-semibold mb-3' }, 'Shipping Method'),
                                shippingOptions.map(option =>
                                    React.createElement('label', {
                                        key: option.id,
                                        className: `flex items-center p-3 border rounded-lg cursor-pointer mb-2 ${
                                            formData.shippingMethod === option.id.toString() 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200'
                                        }`
                                    },
                                        React.createElement('input', {
                                            type: 'radio',
                                            name: 'shippingMethod',
                                            value: option.id,
                                            checked: formData.shippingMethod === option.id.toString(),
                                            onChange: (e) => setFormData(prev => ({ 
                                                ...prev, 
                                                shippingMethod: e.target.value 
                                            })),
                                            className: 'mr-3'
                                        }),
                                        React.createElement('div', { className: 'flex-1' },
                                            React.createElement('div', { className: 'flex justify-between items-center' },
                                                React.createElement('span', { className: 'font-medium' }, option.name),
                                                React.createElement('span', { className: 'font-semibold' }, 
                                                    option.price === 0 ? 'FREE' : formatPrice(option.price)
                                                )
                                            ),
                                            React.createElement('p', { className: 'text-sm text-secondary' },
                                                `${option.estimatedDays} - ${option.description}`
                                            )
                                        )
                                    )
                                )
                            )
                        ),

                        // Step 2: Payment Information
                        currentStep === 2 && React.createElement('div', null,
                            React.createElement('h4', { className: 'text-xl font-semibold mb-4' }, 
                                'Payment Information'
                            ),

                            // Payment method selection
                            React.createElement('div', { className: 'mb-6' },
                                React.createElement('h5', { className: 'font-semibold mb-3' }, 'Payment Method'),
                                React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
                                    window.mockData.paymentMethods.map(method =>
                                        React.createElement('label', {
                                            key: method.id,
                                            className: `flex items-center p-3 border rounded-lg cursor-pointer ${
                                                formData.payment.method === method.name.toLowerCase().replace(' ', '') 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-200'
                                            }`
                                        },
                                            React.createElement('input', {
                                                type: 'radio',
                                                name: 'paymentMethod',
                                                value: method.name.toLowerCase().replace(' ', ''),
                                                checked: formData.payment.method === method.name.toLowerCase().replace(' ', ''),
                                                onChange: (e) => handleInputChange('payment', 'method', e.target.value),
                                                className: 'mr-3'
                                            }),
                                            React.createElement('span', { style: { fontSize: '1.5rem', marginRight: '0.5rem' } }, 
                                                method.icon
                                            ),
                                            React.createElement('span', null, method.name)
                                        )
                                    )
                                )
                            ),

                            // Credit card form
                            formData.payment.method === 'card' && React.createElement('div', null,
                                React.createElement('div', { className: 'mb-4' },
                                    React.createElement('label', { className: 'form-label' }, 'Card Number'),
                                    React.createElement('input', {
                                        type: 'text',
                                        className: `form-input ${errors.cardNumber ? 'border-red-500' : ''}`,
                                        placeholder: '1234 5678 9012 3456',
                                        value: formData.payment.cardNumber,
                                        onChange: (e) => handleInputChange('payment', 'cardNumber', formatCardNumber(e.target.value)),
                                        maxLength: 19
                                    }),
                                    errors.cardNumber && React.createElement('p', { 
                                        className: 'text-sm mt-1 text-red-500' 
                                    }, errors.cardNumber)
                                ),

                                React.createElement('div', { className: 'grid grid-cols-2 gap-4 mb-4' },
                                    React.createElement('div', null,
                                        React.createElement('label', { className: 'form-label' }, 'Expiry Date'),
                                        React.createElement('input', {
                                            type: 'text',
                                            className: `form-input ${errors.expiryDate ? 'border-red-500' : ''}`,
                                            placeholder: 'MM/YY',
                                            value: formData.payment.expiryDate,
                                            onChange: (e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length >= 2) {
                                                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                                }
                                                handleInputChange('payment', 'expiryDate', value);
                                            },
                                            maxLength: 5
                                        }),
                                        errors.expiryDate && React.createElement('p', { 
                                            className: 'text-sm mt-1 text-red-500' 
                                        }, errors.expiryDate)
                                    ),
                                    React.createElement('div', null,
                                        React.createElement('label', { className: 'form-label' }, 'CVV'),
                                        React.createElement('input', {
                                            type: 'text',
                                            className: `form-input ${errors.cvv ? 'border-red-500' : ''}`,
                                            placeholder: '123',
                                            value: formData.payment.cvv,
                                            onChange: (e) => handleInputChange('payment', 'cvv', e.target.value.replace(/\D/g, '')),
                                            maxLength: 3
                                        }),
                                        errors.cvv && React.createElement('p', { 
                                            className: 'text-sm mt-1 text-red-500' 
                                        }, errors.cvv)
                                    )
                                ),

                                React.createElement('div', { className: 'mb-4' },
                                    React.createElement('label', { className: 'form-label' }, 'Cardholder Name'),
                                    React.createElement('input', {
                                        type: 'text',
                                        className: `form-input ${errors.cardName ? 'border-red-500' : ''}`,
                                        placeholder: 'John Doe',
                                        value: formData.payment.cardName,
                                        onChange: (e) => handleInputChange('payment', 'cardName', e.target.value)
                                    }),
                                    errors.cardName && React.createElement('p', { 
                                        className: 'text-sm mt-1 text-red-500' 
                                    }, errors.cardName)
                                )
                            )
                        ),

                        // Step 3: Review Order
                        currentStep === 3 && React.createElement('div', null,
                            React.createElement('h4', { className: 'text-xl font-semibold mb-4' }, 
                                'Review Your Order'
                            ),

                            // Order items
                            React.createElement('div', { className: 'mb-6' },
                                React.createElement('h5', { className: 'font-semibold mb-3' }, 'Items'),
                                cartData.items.map(item =>
                                    React.createElement('div', {
                                        key: item.id,
                                        className: 'flex justify-between items-center py-2 border-b'
                                    },
                                        React.createElement('div', null,
                                            React.createElement('span', { className: 'font-medium' }, 
                                                item.product?.name
                                            ),
                                            React.createElement('span', { className: 'text-sm text-secondary ml-2' },
                                                `x${item.quantity}`
                                            )
                                        ),
                                        React.createElement('span', { className: 'font-semibold' },
                                            formatPrice(item.total)
                                        )
                                    )
                                )
                            ),

                            // Shipping address
                            React.createElement('div', { className: 'mb-6' },
                                React.createElement('h5', { className: 'font-semibold mb-2' }, 'Shipping Address'),
                                React.createElement('div', { className: 'p-3 bg-gray-50 rounded' },
                                    React.createElement('p', null, 
                                        `${formData.shipping.firstName} ${formData.shipping.lastName}`
                                    ),
                                    React.createElement('p', null, formData.shipping.address),
                                    React.createElement('p', null, 
                                        `${formData.shipping.city}, ${formData.shipping.state} ${formData.shipping.zipCode}`
                                    ),
                                    React.createElement('p', null, formData.shipping.email)
                                )
                            ),

                            // Shipping method
                            React.createElement('div', { className: 'mb-6' },
                                React.createElement('h5', { className: 'font-semibold mb-2' }, 'Shipping Method'),
                                React.createElement('div', { className: 'p-3 bg-gray-50 rounded' },
                                    React.createElement('p', { className: 'font-medium' }, selectedShipping?.name),
                                    React.createElement('p', { className: 'text-sm text-secondary' }, 
                                        selectedShipping?.estimatedDays
                                    )
                                )
                            )
                        )
                    ),

                    // Order summary sidebar
                    React.createElement('div', null,
                        React.createElement('div', { 
                            className: 'card',
                            style: { position: 'sticky', top: '1rem' }
                        },
                            React.createElement('div', { className: 'card-header' },
                                React.createElement('h4', { className: 'font-semibold' }, 'Order Summary')
                            ),
                            React.createElement('div', { className: 'card-body' },
                                React.createElement('div', { className: 'space-y-2 mb-4' },
                                    React.createElement('div', { className: 'flex justify-between' },
                                        React.createElement('span', null, 'Subtotal:'),
                                        React.createElement('span', null, formatPrice(cartData.subtotal))
                                    ),
                                    React.createElement('div', { className: 'flex justify-between' },
                                        React.createElement('span', null, 'Shipping:'),
                                        React.createElement('span', null, 
                                            selectedShipping?.price === 0 ? 'FREE' : formatPrice(selectedShipping?.price || 0)
                                        )
                                    ),
                                    React.createElement('div', { className: 'flex justify-between' },
                                        React.createElement('span', null, 'Tax:'),
                                        React.createElement('span', null, formatPrice(cartData.tax))
                                    )
                                ),
                                React.createElement('hr', null),
                                React.createElement('div', { className: 'flex justify-between font-semibold text-lg mt-2' },
                                    React.createElement('span', null, 'Total:'),
                                    React.createElement('span', { style: { color: 'var(--primary-color)' } },
                                        formatPrice(calculateTotal())
                                    )
                                )
                            )
                        )
                    )
                )
            ),

            // Modal footer
            React.createElement('div', { className: 'modal-footer' },
                currentStep > 1 && React.createElement('button', {
                    className: 'btn btn-secondary',
                    onClick: handlePrevious
                }, 'Previous'),

                currentStep < 3 ? 
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: handleNext
                    }, 'Next') :
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: handlePlaceOrder,
                        disabled: loading
                    },
                        loading ? 
                            React.createElement('i', { className: 'fas fa-spinner fa-spin' }) :
                            React.createElement(React.Fragment, null,
                                React.createElement('i', { className: 'fas fa-check mr-2' }),
                                'Place Order'
                            )
                    )
            )
        )
    );

    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
};