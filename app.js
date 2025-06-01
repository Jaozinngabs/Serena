// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0UyPkbhKS2Y6u0y9PjC-UDh9rnJuyxH0",
  authDomain: "loja-serena-583d7.firebaseapp.com",
  projectId: "loja-serena-583d7",
  storageBucket: "loja-serena-583d7.appspot.com",
  messagingSenderId: "101022685860",
  appId: "1:101022685860:web:8af466c68a15fdda946431",
  measurementId: "G-8CCDZQ0PMG"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Dados dos produtos
// Dados dos produtos com caminhos para suas imagens
const products = [
    {
        id: 1,
        name: "Camisa Polo Premium",
        description: "Camisa polo de algodão com detalhes em silicone.",
        price: 89.90,
        category: "camisas",
        image: "images/produtos/camisa-polo.jpg"  // Caminho para sua imagem
    },
    {
        id: 2,
        name: "Tênis Esportivo",
        description: "Tênis para corrida com amortecimento de impacto.",
        price: 199.90,
        category: "tenis",
        image: "images/produtos/tenis-esportivo.jpg"  // Caminho para sua imagem
    },
    {
        id: 3,
        name: "Relógio Digital",
        description: "Relógio digital resistente à água com múltiplas funções.",
        price: 129.90,
        category: "acessorios",
        image: "images/produtos/relogio-digital.jpg"  // Caminho para sua imagem
    },
    {
        id: 4,
        name: "Camisa Social Slim",
        description: "Camisa social corte slim fit, ideal para o trabalho.",
        price: 119.90,
        category: "camisas",
        image: "images/produtos/camisa-social.jpg"  // Caminho para sua imagem
    },
    {
        id: 5,
        name: "Tênis Casual",
        description: "Tênis casual estilo urbano para o dia a dia.",
        price: 159.90,
        category: "tenis",
        image: "images/produtos/tenis-casual.jpg"  // Caminho para sua imagem
    },
    {
        id: 6,
        name: "Mochila Esportiva",
        description: "Mochila para dias de esporte e academia.",
        price: 179.90,
        category: "acessorios",
        image: "images/produtos/mochila-esportiva.jpg"  // Caminho para sua imagem
    }
];

// Elementos da DOM
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const authSection = document.getElementById('authSection');
const loginError = document.getElementById('loginError');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const productsContainer = document.getElementById('productsContainer');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const filterButton = document.getElementById('filterButton');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// Test credentials
const TEST_EMAIL = "test@gmail.com";
const TEST_PASSWORD = "123456";

// Estado da aplicação
let currentCategory = 'all';
let currentSearchTerm = '';

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Preenche automaticamente as credenciais de teste (apenas para desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.getElementById('email').value = TEST_EMAIL;
        document.getElementById('password').value = TEST_PASSWORD;
    }
    
    // Carrega os produtos
    renderProducts(products);
    
    // Configura eventos
    setupEventListeners();
});

// Configura os event listeners
function setupEventListeners() {
    // Eventos de autenticação
    loginForm.addEventListener('submit', handleLogin);
    
    // Eventos de busca e filtro
    searchForm.addEventListener('submit', handleSearch);
    filterButton.addEventListener('click', handleFilter);
    
    // Eventos do dropdown de categorias
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = e.target.dataset.category;
            filterProducts();
        });
    });
}

// Função para renderizar produtos
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>Nenhum produto encontrado</h4>
                <p>Tente ajustar sua busca ou filtro</p>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card product-card h-100">
                    <span class="badge bg-primary badge-category">${getCategoryName(product.category)}</span>
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="price">R$ ${product.price.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
}

// Função para filtrar produtos
function filterProducts() {
    let filteredProducts = [...products];
    
    // Filtro por categoria
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === currentCategory);
    }
    
    // Filtro por busca
    if (currentSearchTerm) {
        const searchTerm = currentSearchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts(filteredProducts);
}

// Função para traduzir nome da categoria
function getCategoryName(category) {
    const categories = {
        'camisas': 'Camisas',
        'tenis': 'Tênis',
        'acessorios': 'Acessórios'
    };
    return categories[category] || category;
}

// Handlers de eventos
function handleSearch(e) {
    e.preventDefault();
    currentSearchTerm = searchInput.value.trim();
    filterProducts();
}

function handleFilter() {
    currentCategory = categoryFilter.value;
    filterProducts();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            loginModal.hide();
            loginForm.reset();
            loginError.classList.add('d-none');
        })
        .catch((error) => {
            loginError.textContent = getErrorMessage(error.code);
            loginError.classList.remove('d-none');
        });
}

// Função para logout
function handleLogout() {
    signOut(auth).catch((error) => {
        console.error("Erro ao fazer logout:", error);
    });
}

// Verifica estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUIForLoggedInUser(user);
    } else {
        updateUIForLoggedOutUser();
    }
});

// Atualiza UI para usuário logado
function updateUIForLoggedInUser(user) {
    authSection.innerHTML = `
        <div class="user-info">
            <span>${user.email}</span>
        </div>
        <button class="btn btn-light" id="logoutButton">Logout</button>
    `;
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
}

// Atualiza UI para usuário não logado
function updateUIForLoggedOutUser() {
    authSection.innerHTML = `
        <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#loginModal" id="loginButton">Login</button>
    `;
}

// Função para traduzir códigos de erro
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/invalid-email': 'Email inválido.',
        'auth/user-disabled': 'Esta conta foi desativada.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'default': 'Erro ao fazer login. Tente novamente.'
    };
    return errorMessages[errorCode] || errorMessages['default'];
}
// Efeito de transição suave ao carregar a página
document.body.classList.add('fade-in');

// Adicione ao CSS:
/*
.fade-in {
    animation: fadeIn 1.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
*/

// Melhorar a interação do dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = 'rgba(229, 152, 155, 0.3)';
    });
    item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = '';
    });
});

// Efeito hover sofisticado para cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const x = e.clientX - card.getBoundingClientRect().left;
            const y = e.clientY - card.getBoundingClientRect().top;
            
            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});