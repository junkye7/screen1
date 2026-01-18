document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const cart = App.getCart();
    const container = document.getElementById('cart-items-list');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const cartLayout = document.getElementById('cart-container');

    if (cart.length === 0) {
        cartLayout.classList.add('hidden');
        emptyMsg.classList.remove('hidden');
        return;
    }

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.preco;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="item-details">
                    <h4><a href="produto.html?id=${item.id}">${item.nome}</a></h4>
                    <p class="brand">${item.marca} • Tam: ${item.tamanho}</p>
                    <p class="price">${App.formatCurrency(item.preco)}</p>
                </div>
                <button class="remove-btn" onclick="removeItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    updateTotals(subtotal);
}

function removeItem(id) {
    App.removeFromCart(id);
    renderCart();
}

function updateTotals(subtotal) {
    const shipping = 25.00; // Valor fixo simulado
    document.getElementById('subtotal').innerText = App.formatCurrency(subtotal);
    document.getElementById('total').innerText = App.formatCurrency(subtotal + shipping);
}

function applyCoupon() {
    const code = document.getElementById('coupon-code').value.toUpperCase();
    if(code === 'ECO10') {
        alert("Cupom aplicado: 10% de desconto!");
        // Lógica simplificada apenas visual
        document.getElementById('discount').innerText = "- 10%";
    } else {
        alert("Cupom inválido");
    }
}