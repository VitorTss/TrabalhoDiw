document.addEventListener("DOMContentLoaded", function () {
    const ul = document.querySelector('.list-group');
  
    // Função para buscar o ID do repositório a partir de db.json
    async function getRepoIdFromDbJson(repoUrl) {
      try {
        const res = await fetch('http://localhost:3000/db.json');
        if (!res.ok) {
          throw new Error(`Erro ao buscar db.json: ${res.status}`);
        }
        const data = await res.json();
        
        // Extrai o ID do repositório da URL fornecida
        const repoId = getRepoIdFromUrl(repoUrl);
        
        // Encontra o repositório correspondente no db.json pelo ID
        const repo = data.albuns.find(item => item.id === repoId);
        if (!repo) {
          throw new Error('Repositório não encontrado no db.json');
        }
        
        return repo.id;
      } catch (error) {
        throw new Error('Erro ao processar db.json: ' + error.message);
      }
    }
    
    // Função para extrair o ID do repositório da URL
    function getRepoIdFromUrl(url) {
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get('id');
    }
  
    // Função para buscar os detalhes do repositório no GitHub API
    async function getRepoDetailsFromGitHub(repoId) {
      try {
        const res = await fetch(`https://api.github.com/repositories/${repoId}`);
        if (!res.ok) {
          throw new Error(`Erro ao buscar dados do GitHub: ${res.status}`);
        }
        return res.json();
      } catch (error) {
        throw new Error('Erro ao buscar dados do GitHub: ' + error.message);
      }
    }
  
    // Função para renderizar os detalhes do repositório no HTML
    function renderRepoDetails(repo) {
      let li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerHTML = `
        <strong>Repositório: ${repo.name.toUpperCase()}</strong><br>
        <span>Descrição: ${repo.description}</span><br>
        <span>Data de Criação: ${Intl.DateTimeFormat('pt-BR').format(new Date(repo.created_at))}</span><br>
        <span>URL: <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></span><br>
        <span>Linguagem Principal: ${repo.language}</span><br>
        <span>Tópicos: ${repo.topics ? repo.topics.join(', ') : 'Nenhum tópico'}</span><br>
        <span>Estrelas: ${repo.stargazers_count}</span><br>
        <span>Observadores: ${repo.watchers_count}</span><br>
        <span>Forks: ${repo.forks_count}</span><br>
        <span>Licença: ${repo.license ? repo.license.name : 'Não especificado'}</span>
      `;
      ul.appendChild(li);
    }
  
    // Função principal para buscar o ID do repositório e renderizar os detalhes
    async function fetchRepoDetails() {
      try {
        // Obtém a URL atual
        const repoUrl = window.location.href;
        
        // Obtém o ID do repositório a partir da URL
        const repoId = await getRepoIdFromDbJson(repoUrl);
        
        // Obtém os detalhes do repositório do GitHub API
        const repoDetails = await getRepoDetailsFromGitHub(repoId);
        
        // Renderiza os detalhes do repositório no HTML
        renderRepoDetails(repoDetails);
      } catch (error) {
        let li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = 'Erro ao processar db.json ou URL: ' + error.message;
        ul.appendChild(li);
      }
    }
  
    // Chama a função principal para buscar e renderizar os detalhes do repositório
    fetchRepoDetails();
  });
  