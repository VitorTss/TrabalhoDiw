document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubData();
});

async function fetchGitHubData() {
    try {
        const githubUser = 'VitorTss'; // Seu nome de usuário do GitHub

        // Busca perfil do usuário
        const profileResponse = await fetch(`https://api.github.com/users/${githubUser}`);
        const profileData = await profileResponse.json();
        displayUserProfile(profileData);

    
    } catch (error) {
        console.error('Erro ao buscar dados do GitHub: ', error);
    }
}

function displayUserProfile(data) {
    const profileImageDiv = document.getElementById('profile-image');
    const profileDiv = document.getElementById('user-profile');

    profileImageDiv.innerHTML = `
        <img src="${data.avatar_url}" alt="Avatar" class="rounded-circle img-fluid">
    `;

    profileDiv.innerHTML = `
        <h3>${data.name}</h3>
        <p>${data.bio}</p>
        <div>
            <a href="mailto:${data.email ? data.email : '#'}" class="btn btn-primary">E-mail</a>
            <a href="${data.html_url}" class="btn btn-secondary">GitHub</a>
            <a href="https://www.linkedin.com/in/seu-linkedin-id" class="btn btn-info">LinkedIn</a>
        </div>
    `;
}

function displayRepositories(repos) {
    const container = document.getElementById('repositories');
    let repoHtml = '';

    repos.slice(0, 3).forEach(repo => {
        repoHtml += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${repo.name}</h5>
                        <p class="card-text">${repo.description}</p>
                        <a href="${repo.html_url}" class="btn btn-primary">Ver Repositório</a>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = repoHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchJsonServerData();
});

async function fetchJsonServerData() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        displayCoworkers(data.colegas_de_trabalho);
        displayCarousel(data.conteudos_sugeridos);
    } catch (error) {
        console.error('Erro ao buscar dados do JSON Server: ', error);
    }
}

function displayCoworkers(colegas) {
    const container = document.getElementById('coworkers');
    const colegasHtml = colegas.map(colega => `
        <div class="col text-center">
            <img src="${colega.url_foto}" class="img-fluid" alt="Foto do Colega" style="width: 200px;">
            <p class="mt-2">
                <a href="${colega.url_github}" target="_blank" rel="noopener noreferrer">${colega.nome}</a>
            </p>
        </div>`).join('');
    container.innerHTML = colegasHtml;
}


function displayCarousel(conteudos) {
    const indicatorsContainer = document.getElementById('carousel-indicators');
    const innerContainer = document.getElementById('carousel-inner');

    const indicatorsHtml = conteudos.map((conteudo, index) => `
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${index + 1}"></button>
    `).join('');

    const innerHtml = conteudos.map((conteudo, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <a href="${conteudo.url_conteudo}" target="_blank">
                <img src="${conteudo.url_imagem}" class="d-block w-100" alt="${conteudo.titulo}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${conteudo.titulo}</h5>
                    <p>${conteudo.descricao}</p>
                </div>
            </a>
        </div>
    `).join('');

    indicatorsContainer.innerHTML = indicatorsHtml;
    innerContainer.innerHTML = innerHtml;
}
