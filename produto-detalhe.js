document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if(!id) window.location.href = 'index.html';

    const response = await fetch('data/produtos.json');
    const products = await response.json();
    const product = products.find(p => p.id === id);

    if(!product) return; // Tratar 404

    // Renderizar dados na página
    document.getElementById('prod-img').src = product.imagem;
    document.getElementById('prod-brand').innerText = product.marca;
    document.getElementById('prod-name').innerText = product.nome;
    document.getElementById('prod-price').innerText = App.formatCurrency(product.preco);
    document.getElementById('prod-desc').innerText = `Peça autêntica ${product.marca}. Condição: ${product.condicao}. Cor: ${product.cor}.`;
    document.getElementById('prod-eco').innerText = product.eco_impacto;

    // Medidas
    const measuresUl = document.getElementById('prod-measures');
    for (const [key, value] of Object.entries(product.medidas)) {
        measuresUl.innerHTML += `<li><strong>${key}:</strong> ${value}</li>`;
    }

    // Botão Comprar
    const btn = document.getElementById('btn-add');
    if(product.estoque === 0) {
        btn.innerText = "Vendido";
        btn.disabled = true;
        btn.style.background = "#ccc";
    } else {
        btn.onclick = () => {
            App.addToCart(product);
        };
    }
});