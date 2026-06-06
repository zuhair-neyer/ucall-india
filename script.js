// Product Data
const products = [
    {
        id: 1,
        name: 'Premium Leather Briefcase',
        category: 'bags',
        price: 4999,
        originalPrice: 6999,
        rating: 5,
        reviews: 128,
        image: '💼',
        badge: 'Sale'
    },
    {
        id: 2,
        name: 'Classic Leather Wallet',
        category: 'wallets',
        price: 1499,
        originalPrice: 2499,
        rating: 5,
        reviews: 256,
        image: '💛',
        badge: 'Hot'
    },
    {
        id: 3,
        name: 'Executive Belt',
        category: 'belts',
        price: 999,
        originalPrice: 1499,
        rating: 4,
        reviews: 89,
        image: '🎀',
        badge: ''
    },
    {
        id: 4,
        name: 'Leather Messenger Bag',
        category: 'bags',
        price: 3499,
        originalPrice: 5499,
        rating: 5,
        reviews: 195,
        image: '🎒',
        badge: 'Sale'
    },
    {
        id: 5,
        name: 'Slim Card Wallet',
        category: 'wallets',
        price: 799,
        originalPrice: 1299,
        rating: 5,
        reviews: 142,
        image: '💳',
        badge: 'New'
    },
    {
        id: 6,
        name: 'Designer Leather Belt',
        category: 'belts',
        price: 1299,
        originalPrice: 1999,
        rating: 4,
        reviews: 76,
        image: '👕',
        badge: ''
    },
    {
        id: 7,
        name: 'Leather Shoulder Bag',
        category: 'bags',
        price: 2999,
        originalPrice: 4999,
        rating: 5,
        reviews: 203,
        image: '💼',
        badge: 'Sale'
    },
    {
        id: 8,
        name: 'RFID Blocking Wallet',
        category: 'wallets',
        price: 1199,
        originalPrice: 1899,
        rating: 5,
        reviews: 167,
        image: '📱',
        badge: 'Hot'
    },
    {
        id: 9,
        name: 'Luxury Leather Accessory Set',
        category: 'accessories',
        price: 2499,
        originalPrice: 3999,
        rating: 5,
        reviews: 98,
        image: '🎁',
        badge: 'Sale'
    },
    {
        id: 10,
        name: 'Leather Phone Holder',
        category: 'accessories',
        price: 599,
        originalPrice: 999,
        rating: 4,
        reviews: 54,
        image: '📱',
        badge: 'New'
    },
    {
        id: 11,
        name: 'Leather Backpack',
        category: 'bags',
        price: 3999,
        originalPrice: 5999,
        rating: 5,
        reviews: 187,
        image: '🧳',
        badge: 'Sale'
    },
    {
        id: 12,
        name: 'Leather Keychain',
        category: 'accessories',
        price: 399,
        originalPrice: 699,
        rating: 4,
        reviews: 123,
        image: '🔑',
        badge: 'Hot'
    }
];

// Cart Array
let cart = [];
let currentFilter = 'all';

// Load Products on Page Load
window.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    loadCartFromLocalStorage();
});

// Display Products
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image}
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${Array(product.rating).fill('<i class="fas fa-star"></i>').join('')}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="original">₹${product.originalPrice}</span>
                    <span class="current">₹${product.price}</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="wishlist-btn"><i class="fas fa-heart"></i></button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Filter Products
function filterProducts(category) {
    currentFilter = category;
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCartToLocalStorage();
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    updateCart();
}

// Update Cart Quantity
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToLocalStorage();
            updateCart();
        }
    }
}

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '₹0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });

    cartItems.innerHTML = html;
    cartTotal.textContent = '₹' + total.toLocaleString();
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

// Local Storage Functions
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

function openSignupModal() {
    document.getElementById('signupModal').classList.add('active');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('active');
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Form Handlers
function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify({
        email: email,
        loggedIn: true,
        loginTime: new Date().toISOString()
    }));
    
    showNotification('Login successful!');
    closeLoginModal();
}

function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const fullName = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const phone = event.target.querySelector('input[type="tel"]').value;
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify({
        fullName: fullName,
        email: email,
        phone: phone,
        loggedIn: true,
        signupTime: new Date().toISOString()
    }));
    
    showNotification('Account created successfully!');
    closeSignupModal();
}

// Checkout Functions
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    toggleCart();
    openCheckoutModal();
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.add('active');
    updateOrderSummary();
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function updateOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTax = document.getElementById('summaryTax');
    const summaryTotal = document.getElementById('summaryTotal');

    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>₹${itemTotal.toLocaleString()}</span>
            </div>
        `;
    });

    const shipping = subtotal > 2000 ? 0 : 100;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    summaryItems.innerHTML = html;
    summarySubtotal.textContent = '₹' + subtotal.toLocaleString();
    summaryShipping.textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
    summaryTax.textContent = '₹' + tax.toLocaleString();
    summaryTotal.textContent = '₹' + total.toLocaleString();
}

function handleCheckout(event) {
    event.preventDefault();
    
    const firstName = event.target.querySelector('input[type="text"]').value;
    const paymentMethod = event.target.querySelector('input[name="payment"]:checked').value;
    
    // Store order data
    const order = {
        orderId: '#UCL-' + Math.floor(Math.random() * 1000000),
        items: cart,
        orderDate: new Date().toISOString(),
        paymentMethod: paymentMethod
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    // Clear cart
    cart = [];
    saveCartToLocalStorage();
    updateCart();
    
    closeCheckoutModal();
    showSuccessModal();
}

function showSuccessModal() {
    document.getElementById('successModal').classList.add('active');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');

    if (e.target === loginModal) {
        closeLoginModal();
    }
    if (e.target === signupModal) {
        closeSignupModal();
    }
    if (e.target === checkoutModal) {
        closeCheckoutModal();
    }
    if (e.target === successModal) {
        closeSuccessModal();
    }
});