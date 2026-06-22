// Função que controla a troca de telas
        function showSection(sectionId) {
            // 1. Esconde tudo
            document.querySelectorAll('.section-container').forEach(section => {
                section.classList.remove('active');
            });
            // 2. Mostra apenas o que o botão pediu
            document.getElementById(sectionId).classList.add('active');
        }

        // Intercepta o envio do Login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Impede a página de recarregar
            const email = document.getElementById('login-email').value;
            alert('Simulação de Login! Bem-vindo(a), ' + email);
        });

        // Intercepta o envio do Cadastro
        document.getElementById('cadastroForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Impede a página de recarregar
            const nome = document.getElementById('cad-nome').value;
            alert('Cadastro realizado para: ' + nome + '!');
        });