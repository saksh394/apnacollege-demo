# ShopEasy - Modern E-commerce Frontend

A responsive, user-friendly e-commerce frontend built with HTML, CSS, JavaScript, and React. Designed to seamlessly integrate with a Python Flask backend in the future.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Product Catalog**: Grid layout with search, filtering, and sorting
- **Shopping Cart**: Add/remove items, quantity management, real-time updates
- **Product Details**: Modal with specifications, reviews, and wishlist
- **User Authentication**: Login/register with demo account support
- **Checkout Process**: Multi-step checkout with shipping and payment
- **Modern UI**: Clean design with smooth animations and transitions

### Technical Features
- **React Components**: Modular, reusable component architecture
- **Local Storage**: Persistent cart, wishlist, and user preferences
- **API Ready**: Service layer prepared for Flask backend integration
- **Mock Data**: Comprehensive mock data for development
- **Event System**: Custom events for component communication
- **Responsive**: Mobile-first design with breakpoints for all devices

## 📁 Project Structure

```
/workspace/
├── index.html              # Main HTML file
├── package.json           # Project dependencies
├── README.md             # Project documentation
├── styles/
│   ├── main.css          # Main stylesheet
│   └── responsive.css    # Responsive design rules
├── js/
│   ├── app.js           # Main React application
│   ├── components/      # React components
│   │   ├── Header.js    # Navigation header
│   │   ├── ProductCard.js    # Product card component
│   │   ├── ProductGrid.js    # Product listing with filters
│   │   ├── ProductDetail.js  # Product detail modal
│   │   ├── Cart.js      # Shopping cart sidebar
│   │   ├── Auth.js      # Login/register modal
│   │   └── Checkout.js  # Checkout process
│   ├── utils/           # Utility functions
│   │   ├── api.js       # API service layer
│   │   └── storage.js   # Local storage utilities
│   └── data/
│       └── mockData.js  # Mock data for development
└── images/              # Image assets (placeholder)
```

## 🛠 Installation & Setup

1. **Clone or download the project**
2. **Install dependencies** (optional for development server):
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Or simply open `index.html` in your browser

## 🎯 Usage

### Development Mode
The application runs in mock mode by default with sample data. You can:
- Browse products and categories
- Add items to cart and wishlist
- Use the demo login (email: `demo@example.com`, password: `demo123`)
- Complete the checkout process
- Test responsive design on different screen sizes

### Demo Account
- **Email**: demo@example.com
- **Password**: demo123

## 🔌 Flask Backend Integration

The frontend is designed to easily connect to a Flask backend. Here's how:

### API Service Configuration
The `ApiService` class in `/js/utils/api.js` is ready for backend integration:

```javascript
// Update the base URL to your Flask backend
this.baseURL = 'http://localhost:5000/api';
this.mockMode = false; // Disable mock mode
```

### Expected Flask API Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `GET /api/products/search?query=...` - Search products

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Cart & Orders
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove cart item
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders

### Sample Flask Backend Structure
```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

@app.route('/api/products', methods=['GET'])
def get_products():
    # Return products from database
    pass

@app.route('/api/auth/login', methods=['POST'])
def login():
    # Handle user authentication
    pass

# ... other endpoints
```

## 🎨 Customization

### Styling
- Modify CSS variables in `/styles/main.css` for theme customization
- Update responsive breakpoints in `/styles/responsive.css`
- Add custom animations and transitions

### Components
- All React components are modular and easily customizable
- Add new components in `/js/components/`
- Extend functionality by modifying existing components

### Data
- Update mock data in `/js/data/mockData.js`
- Add new product categories, shipping options, etc.

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: < 576px - Single column layout
- **Tablet**: 577px - 768px - Two column product grid
- **Desktop**: 769px - 992px - Three column grid
- **Large Desktop**: > 993px - Four column grid

## 🔧 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Production Deployment

For production deployment:
1. Replace React development scripts with production builds
2. Optimize images and assets
3. Configure proper CORS settings for your Flask backend
4. Set up environment variables for API endpoints
5. Enable HTTPS for secure transactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test responsiveness and functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready for Flask Backend Integration** 🐍
This frontend is specifically designed to work with Python Flask backends and includes all necessary API endpoints and data structures.