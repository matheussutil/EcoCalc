document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            alert('Simulação de Login para o e-mail: ' + email);
        });

        document.getElementById('cadastroForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('cad-nome').value;
            alert('Simulação de Cadastro realizado para: ' + nome + '! Próximo passo: criptografar a senha no back-end.');
        });