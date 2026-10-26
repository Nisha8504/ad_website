/* ═══════════════════════════════════════════════
   VoltaX Electronics – Script
   ═══════════════════════════════════════════════ */

'use strict';

// ── Product Data ────────────────────────────────────────────────────────────
const products = [
  { id: 1, name: 'iPhone 18 Pro Max', category: 'smartphone', emoji: '📱', price: 134900, original: 154900, rating: 4.9, reviews: 2341, badge: 'Hot', badgeType: 'hot' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'smartphone', emoji: '📱', price: 109999, original: 129999, rating: 4.8, reviews: 1892, badge: 'Sale', badgeType: 'sale' },
  { id: 3, name: 'MacBook Pro M3 16"', category: 'laptop', emoji: '💻', price: 249900, original: 279900, rating: 4.9, reviews: 984, badge: 'New', badgeType: 'new' },
  { id: 4, name: 'Dell XPS 15 OLED', category: 'laptop', emoji: '💻', price: 149990, original: 179990, rating: 4.7, reviews: 756, badge: 'Sale', badgeType: 'sale' },
  { id: 5, name: 'Sony 65" 4K OLED TV', category: 'tv', emoji: '📺', price: 199990, original: 249990, rating: 4.8, reviews: 432, badge: 'Hot', badgeType: 'hot' },
  { id: 6, name: 'LG QNED 55" Smart TV', category: 'tv', emoji: '📺', price: 89990, original: 109990, rating: 4.6, reviews: 678, badge: 'Sale', badgeType: 'sale' },
  { id: 7, name: 'Sony WH-1000XM5', category: 'audio', emoji: '🎧', price: 19999, original: 34990, rating: 4.9, reviews: 5421, badge: '43% OFF', badgeType: 'sale' },
  { id: 8, name: 'Apple AirPods Pro 2', category: 'audio', emoji: '🎧', price: 24900, original: 29900, rating: 4.8, reviews: 3210, badge: 'New', badgeType: 'new' },
  { id: 9, name: 'Apple Watch Ultra 2', category: 'wearable', emoji: '⌚', price: 89900, original: 99900, rating: 4.9, reviews: 1234, badge: 'New', badgeType: 'new' },
  { id: 10, name: 'Samsung Galaxy Watch 6', category: 'wearable', emoji: '⌚', price: 32999, original: 39999, rating: 4.7, reviews: 876, badge: 'Sale', badgeType: 'sale' },
  { id: 11, name: 'Sony A7 IV Mirrorless', category: 'camera', emoji: '📷', price: 229990, original: 259990, rating: 4.9, reviews: 543, badge: 'Hot', badgeType: 'hot' },
  { id: 12, name: 'Canon EOS R8', category: 'camera', emoji: '📷', price: 142990, original: 159990, rating: 4.7, reviews: 342, badge: 'New', badgeType: 'new' },
  { id: 13, name: 'PlayStation 5 Slim', category: 'gaming', emoji: '🎮', price: 54990, original: 59990, rating: 4.9, reviews: 8765, badge: 'Hot', badgeType: 'hot' },
  { id: 14, name: 'Xbox Series X', category: 'gaming', emoji: '🎮', price: 52990, original: 59990, rating: 4.8, reviews: 6543, badge: 'Sale', badgeType: 'sale' },
  { id: 15, name: 'OnePlus 12 Pro', category: 'smartphone', emoji: '📱', price: 69999, original: 79999, rating: 4.7, reviews: 1456, badge: 'New', badgeType: 'new' },
  { id: 16, name: 'ASUS ROG Zephyrus G14', category: 'laptop', emoji: '💻', price: 119990, original: 139990, rating: 4.8, reviews: 654, badge: 'Hot', badgeType: 'hot' },
];

// ── State ────────────────────────────────────────────────────────────────────
const state = {
  cart: [],
  currentCategory: 'all',
  visibleCount: 8,
  searchQuery: '',
  wishlist: new Set(),
};

// ── DOM Refs ──────────────────────────────────────────────────────────────────
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartBody = document.getElementById('cartBody');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const searchClose = document.getElementById('searchClose');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// ── Product Rendering ─────────────────────────────────────────────────────────
function getFilteredProducts() {
  let filtered = products;
  if (state.currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === state.currentCategory);
  }
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  return filtered;
}

function renderProducts() {
  const filtered = getFilteredProducts();
  const visible = filtered.slice(0, state.visibleCount);
  productsGrid.innerHTML = '';

  if (visible.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--text-muted)">
        <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
        <p>No products found for "<strong>${state.searchQuery || state.currentCategory}</strong>"</p>
      </div>`;
    loadMoreBtn.style.display = 'none';
    return;
  }

  visible.forEach((p, i) => {
    const discount = Math.round((1 - p.price / p.original) * 100);
    const inWishlist = state.wishlist.has(p.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', p.id);
    card.style.animationDelay = `${i * 0.06}s`;
    card.innerHTML = `
      <div class="product-img">
        <span>${p.emoji}</span>
        ${p.badge ? `<div class="product-badge ${p.badgeType}">${p.badge}</div>` : ''}
        <button class="product-wishlist" data-id="${p.id}" id="wish-${p.id}" aria-label="Wishlist">
          ${inWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
          <span>${p.rating} (${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-footer">
          <div class="product-prices">
            <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
            <span class="product-original">₹${p.original.toLocaleString('en-IN')}</span>
          </div>
          <button class="add-to-cart" data-id="${p.id}" id="atc-${p.id}">
            🛒 Add
          </button>
        </div>
      </div>`;
    productsGrid.appendChild(card);
  });

  // Animate cards in
  requestAnimationFrame(() => {
    productsGrid.querySelectorAll('.product-card').forEach((c, i) => {
      setTimeout(() => c.classList.add('visible'), i * 60);
    });
  });

  loadMoreBtn.style.display = filtered.length > state.visibleCount ? 'inline-flex' : 'none';

  // Add to cart listeners
  productsGrid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(parseInt(btn.dataset.id));
    });
  });

  // Wishlist listeners
  productsGrid.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWishlist(parseInt(btn.dataset.id), btn);
    });
  });
}

// ── Cart Logic ────────────────────────────────────────────────────────────────
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  renderCart();
  showToast(`✅ ${product.name} added to cart!`);
  animateBadge();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = state.cart.reduce((s, i) => s + i.qty, 0);

  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? 'flex' : 'none';

  if (state.cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItems.innerHTML = '';
    cartFooter.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartFooter.style.display = 'block';
  cartTotal.textContent = '₹' + total.toLocaleString('en-IN');

  cartItems.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}">🗑️</button>
    </div>`).join('');

  cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });
}

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function animateBadge() {
  cartCount.style.transform = 'scale(1.4)';
  setTimeout(() => cartCount.style.transform = '', 200);
}

// ── Wishlist ──────────────────────────────────────────────────────────────────
function toggleWishlist(id, btn) {
  const product = products.find(p => p.id === id);
  if (state.wishlist.has(id)) {
    state.wishlist.delete(id);
    btn.textContent = '🤍';
    showToast(`💔 Removed from wishlist`);
  } else {
    state.wishlist.add(id);
    btn.textContent = '❤️';
    showToast(`❤️ ${product.name} wishlisted!`);
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Category Filter ───────────────────────────────────────────────────────────
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    state.currentCategory = card.dataset.category;
    state.visibleCount = 8;
    renderProducts();

    // Scroll to products
    document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Load More ─────────────────────────────────────────────────────────────────
loadMoreBtn.addEventListener('click', () => {
  state.visibleCount += 4;
  renderProducts();
});

// ── Search ────────────────────────────────────────────────────────────────────
searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('open');
  if (searchBar.classList.contains('open')) searchInput.focus();
});
searchClose.addEventListener('click', () => {
  searchBar.classList.remove('open');
  state.searchQuery = '';
  searchInput.value = '';
  renderProducts();
});
searchInput.addEventListener('input', () => {
  state.searchQuery = searchInput.value.trim();
  state.visibleCount = 8;
  renderProducts();
  if (state.searchQuery) {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  }
});

// ── Cart Events ───────────────────────────────────────────────────────────────
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.getElementById('cartShopBtn').addEventListener('click', closeCart);

// ── Hamburger ─────────────────────────────────────────────────────────────────
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ── Active Nav Link on Scroll ─────────────────────────────────────────────────
const sections = ['home', 'products', 'deals', 'brands', 'contact'];
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

// ── Navbar Scroll ─────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveNav();
});

// ── Intersection Observer for Animations ──────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

// ── Counter Animation ─────────────────────────────────────────────────────────
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

function animateCount(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('en-IN') + (target === 98 ? '' : '+');
    if (current >= target) clearInterval(timer);
  }, 16);
}

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ── Countdown Timer ───────────────────────────────────────────────────────────
function updateCountdown() {
  const target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(23, 59, 59, 0);

  const diff = target - new Date();
  if (diff <= 0) {
    document.getElementById('countDays').textContent = '00';
    document.getElementById('countHours').textContent = '00';
    document.getElementById('countMins').textContent = '00';
    document.getElementById('countSecs').textContent = '00';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('countDays').textContent = String(d).padStart(2, '0');
  document.getElementById('countHours').textContent = String(h).padStart(2, '0');
  document.getElementById('countMins').textContent = String(m).padStart(2, '0');
  document.getElementById('countSecs').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── Newsletter Form ───────────────────────────────────────────────────────────
document.getElementById('newsletterForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('nlEmail').value;
  showToast(`🎉 Subscribed with ${email}!`);
  this.reset();
});

// ── Product Card Animations on Load ──────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  .product-card {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s, border-color 0.3s;
  }
  .product-card.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);

// ── Initial Render ────────────────────────────────────────────────────────────
renderProducts();
renderCart();

// ── Smooth Anchor Clicks ──────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
