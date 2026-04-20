/* ═══════════════════════════════════════════════════════════════
   SHOPHUB - ECOMMERCE PLATFORM
   Premium shopping experience with full functionality
═══════════════════════════════════════════════════════════════ */

// Sample Products Database
const products = [
    { id: 1, name: 'Premium Wireless Headphones', category: 'electronics', price: 149.99, original_price: 249.99, rating: 4.5, reviews: 1240, image: '🎧', stock: 15, discount: 40 },
    { id: 2, name: 'Smart Watch Pro', category: 'electronics', price: 199.99, original_price: 399.99, rating: 4.7, reviews: 856, image: '⌚', stock: 8, discount: 50 },
    { id: 3, name: 'Designer Sunglasses', category: 'fashion', price: 89.99, original_price: 179.99, rating: 4.4, reviews: 342, image: '😎', stock: 20, discount: 50 },
    { id: 4, name: 'Premium Leather Bag', category: 'fashion', price: 159.99, original_price: 299.99, rating: 4.6, reviews: 567, image: '👜', stock: 12, discount: 47 },
    { id: 5, name: 'Cozy Throw Blanket', category: 'home', price: 49.99, original_price: 99.99, rating: 4.8, reviews: 1089, image: '🛏️', stock: 25, discount: 50 },
    { id: 6, name: 'Ceramic Vase Set', category: 'home', price: 64.99, original_price: 129.99, rating: 4.3, reviews: 234, image: '🏺', stock: 18, discount: 50 },
    { id: 7, name: 'Premium Skincare Kit', category: 'beauty', price: 74.99, original_price: 149.99, rating: 4.6, reviews: 912, image: '💆', stock: 22, discount: 50 },
    { id: 8, name: 'Luxury Perfume Collection', category: 'beauty', price: 89.99, original_price: 179.99, rating: 4.7, reviews: 678, image: '💐', stock: 14, discount: 50 },
    { id: 9, name: 'Bestselling Novel Series', category: 'books', price: 34.99, original_price: 59.99, rating: 4.9, reviews: 2341, image: '📚', stock: 30, discount: 42 },
    { id: 10, name: 'Programming Guide 2024', category: 'books', price: 44.99, original_price: 89.99, rating: 4.8, reviews: 567, image: '💻', stock: 16, discount: 50 },
    { id: 11, name: 'Professional Yoga Mat', category: 'sports', price: 59.99, original_price: 119.99, rating: 4.5, reviews: 845, image: '🧘', stock: 19, discount: 50 },
    { id: 12, name: 'Premium Dumbbell Set', category: 'sports', price: 129.99, original_price: 249.99, rating: 4.6, reviews: 723, image: '🏋️', stock: 11, discount: 48 },
];

// State Management
const state = {
    cart: [],
    currentPage: 1,
    itemsPerPage: 12,
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'relevance',
    filters: {
        price: 1000,
        rating: 0,
        category: [],
        brand: []
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadThemeFromStorage();
    loadCartFromStorage();
    renderProducts();
    setupEventListeners();
    updateCartBadge();
});

// ═══════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        state.currentPage = 1;
        renderProducts();
    });

    // Category Filters
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            state.selectedCategory = e.target.dataset.category;
            state.currentPage = 1;
            renderProducts();
        });
    });

    // Price Range Filter
    const priceSlider = document.querySelector('.price-slider');
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            state.filters.price = e.target.value;
            document.getElementById('price-value').textContent = `$${e.target.value}`;
            renderProducts();
        });
    }

    // Sort Options
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderProducts();
        });
    }

    // Cart Toggle
    document.getElementById('cart-toggle')?.addEventListener('click', toggleCart);
    document.getElementById('close-cart')?.addEventListener('click', closeCart);

    // Theme Toggle
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    // Cart Backdrop Click
    document.getElementById('cart-sidebar')?.addEventListener('click', (e) => {
        if (e.target.id === 'cart-sidebar') closeCart();
    });

    // Checkout
    document.getElementById('checkout-btn')?.addEventListener('click', openCheckout);
    document.getElementById('modal-close')?.addEventListener('click', closeCheckout);
    document.getElementById('checkout-modal-backdrop')?.addEventListener('click', closeCheckout);

    // Checkout Steps
    document.getElementById('next-step')?.addEventListener('click', nextCheckoutStep);
    document.getElementById('prev-step')?.addEventListener('click', prevCheckoutStep);

    // Continue Shopping
    document.querySelector('.btn-continue-shopping')?.addEventListener('click', closeCart);

    // Scroll to Top
    document.getElementById('scroll-top')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Filter Toggles
    document.querySelectorAll('.filter-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const content = e.currentTarget.nextElementSibling;
            content.classList.toggle('open');
            e.currentTarget.setAttribute('aria-expanded', content.classList.contains('open'));
        });
    });

    // Clear Filters
    document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT RENDERING & FILTERING
// ═══════════════════════════════════════════════════════════════

function getFilteredProducts() {
    let filtered = products;

    // Search Filter
    if (state.searchQuery) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
    }

    // Category Filter
    if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === state.selectedCategory);
    }

    // Price Filter
    filtered = filtered.filter(p => p.price <= state.filters.price);

    // Rating Filter
    if (state.filters.rating > 0) {
        filtered = filtered.filter(p => p.rating >= state.filters.rating);
    }

    return filtered;
}

function getSortedProducts(filtered) {
    const sorted = [...filtered];

    switch (state.sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.reverse();
        default:
            return sorted;
    }
}

function renderProducts() {
    const filtered = getFilteredProducts();
    const sorted = getSortedProducts(filtered);

    // Update results count
    document.getElementById('results-count').textContent = `${sorted.length} Products`;

    // Paginate
    const startIdx = (state.currentPage - 1) * state.itemsPerPage;
    const endIdx = startIdx + state.itemsPerPage;
    const paginatedProducts = sorted.slice(startIdx, endIdx);

    // Render Grid
    const productsGrid = document.getElementById('products');
    productsGrid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            <button class="wishlist-btn" title="Add to Wishlist">❤️</button>
            
            <div class="product-image">${product.image}</div>
            
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-desc">Premium quality • Fast delivery</div>
                
                <div class="product-rating">
                    <span class="stars">⭐ ${product.rating}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                
                <div class="product-price">
                    <span class="product-price-current">$${product.price.toFixed(2)}</span>
                    ${product.original_price ? `<span class="product-price-original">$${product.original_price.toFixed(2)}</span>` : ''}
                </div>
                
                <div class="product-footer">
                    <button class="wishlist-quick">❤️</button>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    // Setup Product Interactions
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            addToCart(productId);
        });
    });

    document.querySelectorAll('.wishlist-btn, .wishlist-quick').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('active');
            showNotification('Added to Wishlist!', 'success');
        });
    });

    // Pagination
    renderPagination(sorted.length);
}

function renderPagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / state.itemsPerPage);
    const paginationContainer = document.getElementById('pagination');

    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `page-number ${state.currentPage === i ? 'active' : ''}`;
        btn.addEventListener('click', () => {
            state.currentPage = i;
            renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(btn);
    }

    // Update pagination buttons
    document.querySelector('.pagination-btn.prev').disabled = state.currentPage === 1;
    document.querySelector('.pagination-btn.next').disabled = state.currentPage === totalPages;
}

// ═══════════════════════════════════════════════════════════════
// CART MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartBadge();
    renderCart();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartBadge();
    renderCart();
}

function updateCartQuantity(productId, quantity) {
    const item = state.cart.find(p => p.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            renderCart();
        }
    }
}

function renderCart() {
    const cartList = document.getElementById('cart');
    const emptyCart = document.getElementById('empty-cart');

    if (state.cart.length === 0) {
        cartList.innerHTML = '';
        emptyCart.style.display = 'flex';
    } else {
        emptyCart.style.display = 'none';
        cartList.innerHTML = state.cart.map(item => `
            <li class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
            </li>
        `).join('');
    }

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 10;
    const total = subtotal + tax + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('shipping-cost').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

// ═══════════════════════════════════════════════════════════════
// CART UI INTERACTIONS
// ═══════════════════════════════════════════════════════════════

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        renderCart();
    }
}

function closeCart() {
    document.getElementById('cart-sidebar')?.classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
// CHECKOUT FLOW
// ═══════════════════════════════════════════════════════════════

let currentCheckoutStep = 1;

function openCheckout() {
    if (state.cart.length === 0) {
        showNotification('Cart is empty!', 'error');
        return;
    }

    document.getElementById('checkout-modal-backdrop')?.classList.add('open');
    document.getElementById('checkout-modal')?.classList.add('open');
    currentCheckoutStep = 1;
    showCheckoutStep(1);
}

function closeCheckout() {
    document.getElementById('checkout-modal-backdrop')?.classList.remove('open');
    document.getElementById('checkout-modal')?.classList.remove('open');
}

function showCheckoutStep(step) {
    document.querySelectorAll('.checkout-step-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.step').forEach(el => {
        el.classList.remove('active');
    });

    document.querySelector(`[data-step="${step}"]`)?.classList.add('active');
    document.querySelector(`.checkout-step-content[data-step="${step}"]`)?.classList.add('active');

    document.getElementById('prev-step').style.display = step > 1 ? 'block' : 'none';
    document.getElementById('next-step').textContent = step === 3 ? 'Complete Order' : 'Continue →';
}

function nextCheckoutStep() {
    if (currentCheckoutStep === 3) {
        completeOrder();
    } else {
        currentCheckoutStep++;
        showCheckoutStep(currentCheckoutStep);
    }
}

function prevCheckoutStep() {
    currentCheckoutStep--;
    showCheckoutStep(currentCheckoutStep);
}

function completeOrder() {
    closeCheckout();
    state.cart = [];
    updateCartBadge();
    renderCart();
    saveCartToStorage();
    showNotification('Order placed successfully! 🎉', 'success');
}

// ═══════════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════════

function clearFilters() {
    state.searchQuery = '';
    state.selectedCategory = 'all';
    state.filters = { price: 1000, rating: 0, category: [], brand: [] };
    state.currentPage = 1;

    document.getElementById('search').value = '';
    document.querySelector('.price-slider').value = 1000;
    document.getElementById('price-value').textContent = '$1000';
    document.querySelectorAll('.category-chip').forEach((chip, idx) => {
        chip.classList.toggle('active', idx === 0);
    });

    renderProducts();
}

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        state.cart = JSON.parse(saved);
        updateCartBadge();
        renderCart();
    }
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// Smooth Scroll Enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ═══════════════════════════════════════════════════════════════
// THEME MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    saveThemeToStorage(newTheme);
    updateThemeIcon(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Add smooth transition class
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
}

function loadThemeFromStorage() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    updateThemeIcon(savedTheme);
}

function saveThemeToStorage(theme) {
    localStorage.setItem('theme', theme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    loadThemeFromStorage();
});

console.log('✨ ShopHub initialized - Ready for premium shopping experience!');
