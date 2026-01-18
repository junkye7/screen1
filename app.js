const App = {
    // --- Inicialização ---
    init: () => {
        // 1. PRIMEIRO: Injeta o HTML (Header/Footer)
        App.loadComponents();

        // 2. DEPOIS: Inicializa as funcionalidades (agora que o HTML existe)
        App.updateCartCount();
        App.setupMobileMenu();
        App.highlightActiveLink();
        App.setupSearchBehavior();
        
        // 3. Modal e Lógicas Extras
        App.injectSellModal();
        App.setupModalLogic();
        
        console.log("Sistema Vintage.Eco carregado via JS.");
    },

    // --- Injeção de Layout (Header Dinâmico) ---
    loadComponents: () => {
        const headerContainer = document.getElementById('main-header');
        
        if (headerContainer) {
            headerContainer.innerHTML = `
                <div class="container">
                    <button class="mobile-toggle" aria-label="Abrir menu"><i class="fas fa-bars"></i></button>
                    
                    <a href="index.html" class="logo">VINTAGE<span style="color:var(--accent-color)">.ECO</span></a>
                    
                    <nav class="nav-links desktop-only">
                        <a href="index.html" class="nav-link">Home</a>
                        <a href="produtos.html" class="nav-link">Catálogo</a>
                        <a href="sobre.html" class="nav-link">Sobre</a>
                        <a href="#vender" class="nav-link trigger-sell-modal">Vender</a>
                    </nav>
                    
                    <div class="nav-icons">
                        <a href="produtos.html" aria-label="Buscar"><i class="fas fa-search"></i></a>
                        <a href="carrinho.html" class="cart-icon" aria-label="Carrinho">
                            <i class="fas fa-shopping-bag"></i>
                            <span class="cart-count">0</span>
                        </a>
                    </div>
                </div>

                <div class="mobile-nav-overlay">
                    <div class="mobile-nav-content">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                            <span class="logo" style="font-size:1.5rem;">VINTAGE.ECO</span>
                            <button class="close-mobile-nav">&times;</button>
                        </div>
                        <a href="index.html" class="mobile-link">Home</a>
                        <a href="produtos.html" class="mobile-link">Catálogo Completo</a>
                        <a href="sobre.html" class="mobile-link">Nossa História</a>
                        <a href="#vender" class="mobile-link trigger-sell-modal">Vender / Consignar</a>
                        <div style="margin-top: auto; border-top: 1px solid #eee; padding-top: 20px; color: #666;">
                            <p><i class="far fa-user"></i> Minha Conta</p>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    // --- Carrinho (LocalStorage) ---
    getCart: () => JSON.parse(localStorage.getItem('brecho_cart')) || [],
    
    addToCart: (product) => {
        let cart = App.getCart();
        // Verificar se já existe (Peça única = max 1)
        if (cart.find(item => item.id === product.id)) {
            App.showToast("Esta é uma peça única e já está na sacola!", "error");
            return;
        }
        cart.push({ ...product, qtd: 1 });
        localStorage.setItem('brecho_cart', JSON.stringify(cart));
        App.updateCartCount();
        App.showToast("Produto adicionado à sacola!");
        
        // Dispara evento para atualizar carrinho se a página estiver aberta
        window.dispatchEvent(new Event('storage')); 
    },

    removeFromCart: (id) => {
        let cart = App.getCart();
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('brecho_cart', JSON.stringify(cart));
        App.updateCartCount();
        // Se estivermos na página do carrinho, recarrega para atualizar a lista visual
        if(window.location.pathname.includes('carrinho.html')) {
            window.location.reload();
        }
    },

    updateCartCount: () => {
        const count = App.getCart().length;
        document.querySelectorAll('.cart-count').forEach(el => {
            el.innerText = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // --- UI & Funcionalidades ---

    setupMobileMenu: () => {
        const toggleBtn = document.querySelector('.mobile-toggle');
        const overlay = document.querySelector('.mobile-nav-overlay');
        const closeBtn = document.querySelector('.close-mobile-nav');

        if (toggleBtn && overlay) {
            const toggleMenu = () => overlay.classList.toggle('open');
            
            toggleBtn.addEventListener('click', toggleMenu);
            if(closeBtn) closeBtn.addEventListener('click', toggleMenu);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) toggleMenu();
            });
        }
    },

    highlightActiveLink: () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a, .mobile-nav-content a').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    },

    setupSearchBehavior: () => {
        const searchIcons = document.querySelectorAll('a[aria-label="Buscar"]');
        const isCatalogPage = window.location.pathname.includes('produtos.html');

        searchIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                if (isCatalogPage) {
                    e.preventDefault();
                    const input = document.getElementById('search-input');
                    if(input) {
                        input.focus();
                        input.parentElement.style.borderColor = 'var(--accent-color)';
                        setTimeout(() => input.parentElement.style.borderColor = '#ddd', 1000);
                    }
                }
            });
        });
    },

    // --- Modal de Venda ---
    injectSellModal: () => {
        if (document.getElementById('sell-modal')) return;

        const modalHTML = `
            <div id="sell-modal" class="modal hidden" style="display:none;">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Desapegue com Luxo</h2>
                    <p>Venda ou consigne suas peças de marca. Avaliação em 24h.</p>
                    <form onsubmit="event.preventDefault(); alert('Solicitação enviada! Cheque seu e-mail.');" style="margin-top:20px; text-align:left;">
                        <input type="text" class="input-std" placeholder="Seu Nome" style="margin-bottom:10px; width:100%; padding:10px;">
                        <input type="email" class="input-std" placeholder="Seu E-mail" style="margin-bottom:10px; width:100%; padding:10px;">
                        <input type="text" class="input-std" placeholder="Marca e Modelo da Peça" style="margin-bottom:10px; width:100%; padding:10px;">
                        <button type="submit" class="btn" style="width:100%;">Enviar para Análise</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    setupModalLogic: () => {
        const modal = document.getElementById('sell-modal');
        // Usa classe .trigger-sell-modal que colocamos no header dinâmico
        const triggerLinks = document.querySelectorAll('.trigger-sell-modal, a[href="#vender"]');
        
        // Listener global para fechar modal (pois ele foi criado dinamicamente)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || e.target === modal) {
                modal.style.display = 'none';
            }
        });

        triggerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Fecha menu mobile se estiver aberto
                document.querySelector('.mobile-nav-overlay')?.classList.remove('open');
                
                if(modal) {
                    modal.style.display = 'flex';
                    modal.classList.remove('hidden');
                }
            });
        });
    },

    // --- Utils ---
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    },

    showToast: (msg, type = 'success') => {
        const toast = document.createElement('div');
        toast.innerText = msg;
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: ${type === 'error' ? '#d9534f' : '#1a1a1a'};
            color: white; padding: 15px 25px; border-radius: 4px;
            z-index: 9999; animation: fadein 0.5s; font-size: 0.9rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
};

// Iniciar Aplicação
document.addEventListener('DOMContentLoaded', App.init);