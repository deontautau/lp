let cart = [];
let orderType = 'Dine In';
let selectedPayment = 'qris';
let queueCounter = 1;

function setOrderType(type) {
    orderType = type;
    document.getElementById('dineInBtn').classList.toggle('active', type === 'Dine In');
    document.getElementById('takeAwayBtn').classList.toggle('active', type === 'Take Away');
    document.getElementById('orderTypeBadge').innerText = type;
}

function filterCategory(category, element) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'flex';
        } else {
            product.style.display = 'none';
        }
    });
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
}

function updateQty(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Keranjang masih kosong.<br>Pilih menu di sebelah kiri!</p>';
        document.getElementById('subtotalText').innerText = 'Rp 0';
        document.getElementById('taxText').innerText = 'Rp 0';
        document.getElementById('totalText').innerText = 'Rp 0';
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }

    cartContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rp ${itemTotal.toLocaleString('id-ID')}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty('${item.name}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    document.getElementById('subtotalText').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('taxText').innerText = `Rp ${tax.toLocaleString('id-ID')}`;
    document.getElementById('totalText').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    document.getElementById('checkoutBtn').disabled = false;
}

function openPaymentModal() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let total = subtotal + (subtotal * 0.10);
    
    document.getElementById('modalTotalText').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function selectPayment(method, element) {
    selectedPayment = method;
    document.querySelectorAll('.pay-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    if (method === 'qris') {
        document.getElementById('qrisDetail').classList.remove('hidden');
        document.getElementById('cashDetail').classList.add('hidden');
    } else {
        document.getElementById('qrisDetail').classList.add('hidden');
        document.getElementById('cashDetail').classList.remove('hidden');
    }
}

function processPayment() {
    closePaymentModal();

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let total = subtotal + (subtotal * 0.10);

    const formattedQueue = 'A-' + String(queueCounter).padStart(3, '0');
    queueCounter++;

    document.getElementById('queueNum').innerText = formattedQueue;
    document.getElementById('rOrderType').innerText = orderType;
    document.getElementById('rPaymentMethod').innerText = selectedPayment === 'qris' ? 'QRIS' : 'Tunai / Cash';
    document.getElementById('rTotalAmount').innerText = `Rp ${total.toLocaleString('id-ID')}`;

    document.getElementById('receiptModal').classList.add('active');
}

function resetKiosk() {
    cart = [];
    updateCartUI();
    document.getElementById('receiptModal').classList.remove('active');
}