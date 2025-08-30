// Product Grid Component
const ProductGrid = ({ products, loading = false, onProductSelect }) => {
    const [sortBy, setSortBy] = React.useState('');
    const [filterCategory, setFilterCategory] = React.useState('');
    const [priceRange, setPriceRange] = React.useState({ min: '', max: '' });
    const [filteredProducts, setFilteredProducts] = React.useState(products);

    React.useEffect(() => {
        applyFilters();
    }, [products, sortBy, filterCategory, priceRange]);

    const applyFilters = () => {
        let filtered = [...products];

        // Category filter
        if (filterCategory) {
            filtered = filtered.filter(product => 
                product.category.toLowerCase() === filterCategory.toLowerCase()
            );
        }

        // Price range filter
        if (priceRange.min) {
            filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
        }
        if (priceRange.max) {
            filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
        }

        // Sorting
        switch (sortBy) {
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
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            default:
                // Default order
                break;
        }

        setFilteredProducts(filtered);
    };

    const handleClearFilters = () => {
        setSortBy('');
        setFilterCategory('');
        setPriceRange({ min: '', max: '' });
    };

    const categories = window.mockData.categories;

    if (loading) {
        return React.createElement('div', { className: 'product-grid' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'text-center p-8' },
                    React.createElement('div', { className: 'spinner' }),
                    React.createElement('p', { className: 'mt-4' }, 'Loading products...')
                )
            )
        );
    }

    return React.createElement('div', { className: 'product-grid' },
        React.createElement('div', { className: 'container' },
            // Section title
            React.createElement('div', { className: 'section-title' },
                React.createElement('h2', null, 'Our Products'),
                React.createElement('p', null, 'Discover amazing products at great prices')
            ),

            // Filters
            React.createElement('div', { className: 'filters' },
                React.createElement('div', { className: 'container' },
                    React.createElement('div', { className: 'filters-content' },
                        React.createElement('div', { className: 'filter-group' },
                            React.createElement('label', { className: 'font-medium' }, 'Category:'),
                            React.createElement('select', {
                                className: 'filter-select',
                                value: filterCategory,
                                onChange: (e) => setFilterCategory(e.target.value)
                            },
                                React.createElement('option', { value: '' }, 'All Categories'),
                                categories.map(category =>
                                    React.createElement('option', {
                                        key: category.id,
                                        value: category.name
                                    }, `${category.icon} ${category.name}`)
                                )
                            )
                        ),

                        React.createElement('div', { className: 'filter-group' },
                            React.createElement('label', { className: 'font-medium' }, 'Price Range:'),
                            React.createElement('input', {
                                type: 'number',
                                placeholder: 'Min',
                                className: 'filter-select',
                                style: { width: '80px' },
                                value: priceRange.min,
                                onChange: (e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))
                            }),
                            React.createElement('span', null, '-'),
                            React.createElement('input', {
                                type: 'number',
                                placeholder: 'Max',
                                className: 'filter-select',
                                style: { width: '80px' },
                                value: priceRange.max,
                                onChange: (e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))
                            })
                        ),

                        React.createElement('div', { className: 'filter-group' },
                            React.createElement('label', { className: 'font-medium' }, 'Sort by:'),
                            React.createElement('select', {
                                className: 'filter-select',
                                value: sortBy,
                                onChange: (e) => setSortBy(e.target.value)
                            },
                                React.createElement('option', { value: '' }, 'Default'),
                                React.createElement('option', { value: 'price_asc' }, 'Price: Low to High'),
                                React.createElement('option', { value: 'price_desc' }, 'Price: High to Low'),
                                React.createElement('option', { value: 'name_asc' }, 'Name: A to Z'),
                                React.createElement('option', { value: 'rating_desc' }, 'Highest Rated'),
                                React.createElement('option', { value: 'newest' }, 'Newest First')
                            )
                        ),

                        React.createElement('button', {
                            className: 'btn btn-secondary btn-sm',
                            onClick: handleClearFilters
                        }, 'Clear Filters')
                    )
                )
            ),

            // Results info
            React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                React.createElement('p', { className: 'text-secondary' },
                    `Showing ${filteredProducts.length} of ${products.length} products`
                ),
                
                filteredProducts.length === 0 && products.length > 0 &&
                    React.createElement('p', { className: 'text-sm text-secondary' },
                        'No products match your filters. Try adjusting your search criteria.'
                    )
            ),

            // Products grid
            filteredProducts.length > 0 ? 
                React.createElement('div', { className: 'products-container' },
                    filteredProducts.map(product =>
                        React.createElement(ProductCard, {
                            key: product.id,
                            product,
                            onViewDetails: onProductSelect
                        })
                    )
                ) :
                React.createElement('div', { className: 'text-center p-8' },
                    React.createElement('div', { 
                        style: { fontSize: '4rem', marginBottom: '1rem' } 
                    }, '🔍'),
                    React.createElement('h3', { className: 'text-xl mb-2' }, 'No products found'),
                    React.createElement('p', { className: 'text-secondary mb-4' }, 
                        'Try adjusting your search criteria or browse our categories.'
                    ),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: handleClearFilters
                    }, 'View All Products')
                )
        )
    );
};