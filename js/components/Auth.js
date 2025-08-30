// Authentication Component
const Auth = ({ isOpen, onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = React.useState(true);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens
            setFormData({
                email: '',
                password: '',
                name: '',
                confirmPassword: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin) {
            if (!formData.name) {
                newErrors.name = 'Name is required';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            let result;
            
            if (isLogin) {
                result = await window.api.mockLogin({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                result = await window.api.mockRegister({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
            }

            if (result.success) {
                const event = new CustomEvent('showNotification', {
                    detail: {
                        type: 'success',
                        message: isLogin ? 'Login successful!' : 'Registration successful!'
                    }
                });
                window.dispatchEvent(event);

                if (onAuthSuccess) {
                    onAuthSuccess(result.user);
                }
                
                onClose();
            }
        } catch (error) {
            console.error('Auth error:', error);
            setErrors({ submit: error.message });
            
            const event = new CustomEvent('showNotification', {
                detail: {
                    type: 'error',
                    message: error.message
                }
            });
            window.dispatchEvent(event);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const demoLogin = () => {
        setFormData({
            email: 'demo@example.com',
            password: 'demo123',
            name: '',
            confirmPassword: ''
        });
    };

    return React.createElement('div', {
        className: `modal ${isOpen ? 'open' : ''}`,
        onClick: (e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }
    },
        React.createElement('div', { className: 'modal-content' },
            // Modal header
            React.createElement('div', { className: 'modal-header' },
                React.createElement('h3', null, isLogin ? 'Login' : 'Sign Up'),
                React.createElement('button', {
                    className: 'close-cart',
                    onClick: onClose
                }, React.createElement('i', { className: 'fas fa-times' }))
            ),

            // Modal body
            React.createElement('div', { className: 'modal-body' },
                React.createElement('form', { onSubmit: handleSubmit },
                    // Name field (register only)
                    !isLogin && React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' }, 'Full Name'),
                        React.createElement('input', {
                            type: 'text',
                            className: `form-input ${errors.name ? 'border-red-500' : ''}`,
                            placeholder: 'Enter your full name',
                            value: formData.name,
                            onChange: (e) => handleInputChange('name', e.target.value)
                        }),
                        errors.name && React.createElement('p', { 
                            className: 'text-sm mt-1',
                            style: { color: 'var(--error-color)' }
                        }, errors.name)
                    ),

                    // Email field
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' }, 'Email'),
                        React.createElement('input', {
                            type: 'email',
                            className: `form-input ${errors.email ? 'border-red-500' : ''}`,
                            placeholder: 'Enter your email',
                            value: formData.email,
                            onChange: (e) => handleInputChange('email', e.target.value)
                        }),
                        errors.email && React.createElement('p', { 
                            className: 'text-sm mt-1',
                            style: { color: 'var(--error-color)' }
                        }, errors.email)
                    ),

                    // Password field
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' }, 'Password'),
                        React.createElement('input', {
                            type: 'password',
                            className: `form-input ${errors.password ? 'border-red-500' : ''}`,
                            placeholder: 'Enter your password',
                            value: formData.password,
                            onChange: (e) => handleInputChange('password', e.target.value)
                        }),
                        errors.password && React.createElement('p', { 
                            className: 'text-sm mt-1',
                            style: { color: 'var(--error-color)' }
                        }, errors.password)
                    ),

                    // Confirm password field (register only)
                    !isLogin && React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' }, 'Confirm Password'),
                        React.createElement('input', {
                            type: 'password',
                            className: `form-input ${errors.confirmPassword ? 'border-red-500' : ''}`,
                            placeholder: 'Confirm your password',
                            value: formData.confirmPassword,
                            onChange: (e) => handleInputChange('confirmPassword', e.target.value)
                        }),
                        errors.confirmPassword && React.createElement('p', { 
                            className: 'text-sm mt-1',
                            style: { color: 'var(--error-color)' }
                        }, errors.confirmPassword)
                    ),

                    // Submit error
                    errors.submit && React.createElement('div', { 
                        className: 'p-3 rounded mb-4',
                        style: { 
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--error-color)',
                            color: 'var(--error-color)'
                        }
                    }, errors.submit),

                    // Demo login button (login only)
                    isLogin && React.createElement('div', { className: 'mb-4' },
                        React.createElement('button', {
                            type: 'button',
                            className: 'btn btn-secondary w-full',
                            onClick: demoLogin
                        }, 
                            React.createElement('i', { className: 'fas fa-user mr-2' }),
                            'Use Demo Account'
                        ),
                        React.createElement('p', { className: 'text-xs text-center mt-2 text-light' },
                            'Email: demo@example.com, Password: demo123'
                        )
                    ),

                    // Submit button
                    React.createElement('button', {
                        type: 'submit',
                        className: 'btn btn-primary w-full',
                        disabled: loading
                    },
                        loading ? 
                            React.createElement('i', { className: 'fas fa-spinner fa-spin' }) :
                            React.createElement(React.Fragment, null,
                                React.createElement('i', { 
                                    className: isLogin ? 'fas fa-sign-in-alt' : 'fas fa-user-plus',
                                    style: { marginRight: '0.5rem' }
                                }),
                                isLogin ? 'Login' : 'Sign Up'
                            )
                    )
                ),

                // Toggle between login/register
                React.createElement('div', { className: 'text-center mt-4' },
                    React.createElement('p', { className: 'text-sm text-secondary' },
                        isLogin ? "Don't have an account? " : "Already have an account? ",
                        React.createElement('button', {
                            type: 'button',
                            className: 'text-primary font-medium',
                            style: { 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            },
                            onClick: () => {
                                setIsLogin(!isLogin);
                                setErrors({});
                            }
                        }, isLogin ? 'Sign up' : 'Login')
                    )
                )
            )
        )
    );
};