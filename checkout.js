document.addEventListener('DOMContentLoaded', () => {
    const cart = App.getCart();
    const itemsContainer = document.getElementById('checkout-items');
    let total = 0;

    if(cart.length === 0) {
        alert("Carrinho vazio");
        window.location.href = 'index.html';
    }

    cart.forEach(item => {
        total += item.preco;
        itemsContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem;">
                <span>${item.nome}</span>
                <span>${App.formatCurrency(item.preco)}</span>
            </div>
        `;
    });

    document.getElementById('checkout-total').innerText = App.formatCurrency(total);

    // Simulação de Pagamento
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        
        btn.disabled = true;
        btn.innerText = "Processando...";
        
        // Simular delay de API do Mercado Pago
        setTimeout(() => {
            // Limpar carrinho
            localStorage.removeItem('brecho_cart');
            
            // Simular chance de sucesso (90%)
            if(Math.random() > 0.1) {
                window.location.href = 'pedido-sucesso.html';
            } else {
                window.location.href = 'pedido-falhou.html';
            }
        }, 2000);
    });
});