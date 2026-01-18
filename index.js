document.addEventListener('DOMContentLoaded', () => {
    fetch('data/produtos.json')
        .then(response => response.json())
        .then(data => {
            // Pegar os 4 primeiros
            const featured = data.slice(0, 4);
            const container = document.getElementById('featured-products');
            container.innerHTML = '';

            featured.forEach(product => {
                const isSold = product.estoque === 0;
                const card = `
                    <div class="product-card ${isSold ? 'sold-out' : ''}">
                        <div class="card-img">
                            <span class="badge-unique">Peça Única</span>
                            <a href="produto.html?id=${product.id}">
                                <img src="${product.imagem}" alt="${product.nome}">
                            </a>
                        </div>
                        <div class="card-info">
                            <div class="card-brand">${product.marca}</div>
                            <h3 class="card-title"><a href="produto.html?id=${product.id}">${product.nome}</a></h3>
                            <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Tam: ${product.tamanho} • ${product.condicao}</div>
                            <div class="card-price">${App.formatCurrency(product.preco)}</div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        });
});