let allProducts = [];
let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 6; // Limitando para testar o botão "Carregar Mais"

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch de Dados
    const response = await fetch('data/produtos.json');
    allProducts = await response.json();
    currentProducts = [...allProducts]; // Cópia para filtrar

    // 2. Inicializar Tela
    applyFilters(); 

    // 3. Event Listeners
    setupListeners();
});

function setupListeners() {
    // Busca por texto
    document.getElementById('search-input').addEventListener('input', (e) => {
        applyFilters();
    });

    // Checkboxes Categoria
    document.querySelectorAll('.filter-check').forEach(ch => {
        ch.addEventListener('change', applyFilters);
    });

    // Checkboxes Condição
    document.querySelectorAll('.filter-check-cond').forEach(ch => {
        ch.addEventListener('change', applyFilters);
    });

    // Slider Preço
    const range = document.getElementById('price-range');
    range.addEventListener('input', (e) => {
        document.getElementById('price-value').innerText = App.formatCurrency(e.target.value);
        applyFilters();
    });

    // Ordenação
    document.getElementById('sort-select').addEventListener('change', applyFilters);

    // Limpar Filtros
    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
        document.getElementById('price-range').value = 2000;
        document.getElementById('sort-select').value = 'new';
        applyFilters();
    });

    // Load More
    document.getElementById('load-more-btn').addEventListener('click', () => {
        currentPage++;
        renderGrid(false); // false = não limpar, apenas adicionar (append)
    });

    // Mobile Menu Toggle
    const sidebar = document.getElementById('filters-sidebar');
    const overlay = document.getElementById('overlay');
    
    document.getElementById('btn-filter-mobile').addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.remove('hidden');
    });

    const closeMenu = () => {
        sidebar.classList.remove('active');
        overlay.classList.add('hidden');
    };

    document.getElementById('close-filter').addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
}

function applyFilters() {
    // Resetar página ao filtrar
    currentPage = 1;
    
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const maxPrice = parseFloat(document.getElementById('price-range').value);
    const checkedCats = Array.from(document.querySelectorAll('.filter-check:checked')).map(c => c.value);
    const checkedCond = Array.from(document.querySelectorAll('.filter-check-cond:checked')).map(c => c.value);
    const sortType = document.getElementById('sort-select').value;

    // Lógica de Filtragem
    currentProducts = allProducts.filter(p => {
        const matchesSearch = p.nome.toLowerCase().includes(searchTerm) || p.marca.toLowerCase().includes(searchTerm);
        const matchesPrice = p.preco <= maxPrice;
        const matchesCat = checkedCats.length === 0 || checkedCats.includes(p.categoria);
        const matchesCond = checkedCond.length === 0 || p.condicao.includes(checkedCond[0]); // Simplificado

        return matchesSearch && matchesPrice && matchesCat && matchesCond;
    });

    // Lógica de Ordenação
    if (sortType === 'asc') currentProducts.sort((a, b) => a.preco - b.preco);
    else if (sortType === 'desc') currentProducts.sort((a, b) => b.preco - a.preco);
    else if (sortType === 'az') currentProducts.sort((a, b) => a.marca.localeCompare(b.marca));
    // 'new' deixamos como padrão do JSON

    // Atualizar UI
    document.getElementById('results-count').innerText = `${currentProducts.length} peças encontradas`;
    renderGrid(true);
}

function renderGrid(clear = true) {
    const container = document.getElementById('catalog-grid');
    const loadBtn = document.getElementById('load-more-btn');
    
    if (clear) container.innerHTML = '';

    // Paginação Lógica
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = currentProducts.slice(start, end);

    if (pageItems.length === 0 && clear) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px;">
            <i class="fas fa-search" style="font-size: 2rem; color: #ddd; margin-bottom:10px;"></i>
            <p>Nenhum produto encontrado.</p>
        </div>`;
        loadBtn.style.display = 'none';
        return;
    }

    // Renderizar Cards
    pageItems.forEach(p => {
        const isSold = p.estoque === 0;
        // Checar wishlist (simulado)
        const isWished = localStorage.getItem(`wish_${p.id}`);
        const heartClass = isWished ? 'fas' : 'far';
        const heartColor = isWished ? 'red' : 'inherit';

        const html = `
            <div class="product-card ${isSold ? 'sold-out' : ''} fade-in">
                 <div class="card-img">
                    <span class="badge-unique">Peça Única</span>
                    <button class="wishlist-btn" onclick="toggleWish('${p.id}', this)" style="color:${heartColor}">
                        <i class="${heartClass} fa-heart"></i>
                    </button>
                    <a href="produto.html?id=${p.id}">
                        <img src="${p.imagem}" alt="${p.nome}">
                    </a>
                </div>
                <div class="card-info">
                    <div class="card-brand">${p.marca}</div>
                    <h3 class="card-title"><a href="produto.html?id=${p.id}">${p.nome}</a></h3>
                    <div class="card-price">${App.formatCurrency(p.preco)}</div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });

    // Controlar botão Load More
    if (end >= currentProducts.length) {
        loadBtn.style.display = 'none';
    } else {
        loadBtn.style.display = 'inline-block';
    }
}

// Função Global para Wishlist (exposta no window)
window.toggleWish = (id, btn) => {
    const icon = btn.querySelector('i');
    if (localStorage.getItem(`wish_${id}`)) {
        localStorage.removeItem(`wish_${id}`);
        icon.classList.remove('fas', 'text-red');
        icon.classList.add('far');
        btn.style.color = 'inherit';
        App.showToast('Removido dos favoritos');
    } else {
        localStorage.setItem(`wish_${id}`, 'true');
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.color = 'red';
        App.showToast('Salvo nos favoritos!');
    }
};