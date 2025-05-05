// Função para alternar favorito
function toggleFavorite(pageUrl, title) {
    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav.url === pageUrl);
    
    if (isFavorite) {
        removeFavorite(pageUrl);
    } else {
        addFavorite(pageUrl, title);
    }
    
    updateFavoriteButton(pageUrl);
    updateFavoritesList();
}

// Obter lista de favoritos do localStorage
function getFavorites() {
    const favorites = localStorage.getItem('devocionaisFavoritos');
    return favorites ? JSON.parse(favorites) : [];
}

// Adicionar um favorito
function addFavorite(pageUrl, title) {
    const favorites = getFavorites();
    favorites.push({
        url: pageUrl,
        title: title,
        dateAdded: new Date().toISOString()
    });
    localStorage.setItem('devocionaisFavoritos', JSON.stringify(favorites));
}

// Remover um favorito
function removeFavorite(pageUrl) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.url !== pageUrl);
    localStorage.setItem('devocionaisFavoritos', JSON.stringify(updatedFavorites));
}

// Verificar se uma página é favorita
function isFavorite(pageUrl) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.url === pageUrl);
}

// Atualizar aparência do botão de favorito
function updateFavoriteButton(pageUrl) {
    const favButton = document.querySelector('.favorite-button');
    if (favButton) {
        favButton.classList.toggle('active', isFavorite(pageUrl));
    }
}

// Função para formatar data
function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Atualizar lista de favoritos na página inicial
function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    if (favoritesList) {
        const favorites = getFavorites();
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p class="text-center">Nenhum devocional favorito ainda.</p>';
            return;
        }

        const html = favorites.map(fav => {
            const formattedDate = formatDate(fav.dateAdded);
            return `
                <div class="favorite-item">
                    <div class="favorite-item-header">
                        <a href="${fav.url}" class="favorite-item-title">${fav.title}</a>
                        <span class="favorite-item-date">Favoritado em ${formattedDate}</span>
                    </div>
                    <div class="favorite-item-actions">
                        <button onclick="toggleFavorite('${fav.url}', '${fav.title}')" class="remove-favorite">
                            Remover dos favoritos
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        favoritesList.innerHTML = html;
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesList();
    const currentUrl = window.location.pathname;
    if (currentUrl !== '/index.html' && currentUrl !== '/') {
        updateFavoriteButton(currentUrl);
    }
});