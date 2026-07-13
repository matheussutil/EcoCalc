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

       // 1. O Banco de Perguntas (Array de Objetos)
const perguntasEcoCalc = [
    { id: 1, texto: "Como você costuma se locomover no dia a dia?", tipo: "select", opcoes: ["Transporte público", "Carro particular", "Moto", "Bicicleta / A pé"] },
    { id: 2, texto: "Quantos km você percorre em média por semana?", tipo: "range", min: 0, max: 500, step: 10, valorPadrao: 50, unidade: "km" },
    { id: 3, texto: "Qual o seu consumo médio de energia elétrica?", tipo: "number", placeholder: "Ex: 150", unidade: "kWh/mês" },
    { id: 4, texto: "Com que frequência você come carne vermelha?", tipo: "select", opcoes: ["Todos os dias", "Algumas vezes na semana", "Raramente", "Nunca (Vegetariano/Vegano)"] },
    { id: 5, texto: "Quantos voos curtos você faz por ano?", tipo: "number", placeholder: "Ex: 2", unidade: "voos" },
    { id: 6, texto: "Você separa o lixo para reciclagem?", tipo: "select", opcoes: ["Sim, sempre", "Às vezes", "Não"] },
    { id: 7, texto: "Quanto tempo você gasta no banho diariamente?", tipo: "range", min: 5, max: 60, step: 5, valorPadrao: 15, unidade: "minutos" },
    { id: 8, texto: "Você utiliza energia limpa (ex: painéis solares)?", tipo: "select", opcoes: ["Sim", "Não", "Gostaria de utilizar"] }
];

let etapaAtual = 0; // O JavaScript começa a contar do zero!

// 2. Função que renderiza a pergunta na tela
function renderizarPergunta() {
    const pergunta = perguntasEcoCalc[etapaAtual];
    const totalEtapas = perguntasEcoCalc.length;

    // Atualiza o texto da pergunta
    document.getElementById('pergunta-texto').innerText = pergunta.texto;

    // Constrói o HTML do input baseado no "tipo"
    const container = document.getElementById('input-container');
    container.innerHTML = ''; // Limpa o input da pergunta anterior

    if (pergunta.tipo === 'range') {
        container.innerHTML = `
            <input type="range" id="resposta-${pergunta.id}" min="${pergunta.min}" max="${pergunta.max}" step="${pergunta.step}" value="${pergunta.valorPadrao}" class="slider" oninput="document.getElementById('valor-display').innerText = this.value + ' ${pergunta.unidade}'">
            <p id="valor-display" style="margin-top: 15px; font-weight: bold; font-size: 1.2rem; color: var(--verde-escuro);">${pergunta.valorPadrao} ${pergunta.unidade}</p>
        `;
    } else if (pergunta.tipo === 'number') {
        container.innerHTML = `
            <input type="number" id="resposta-${pergunta.id}" placeholder="${pergunta.placeholder}" class="form-group input" style="width: 80%; padding: 10px; border-radius: 8px; border: 2px solid #eee;"> 
            <span style="font-weight:bold; margin-left: 10px;">${pergunta.unidade}</span>
        `;
    } else if (pergunta.tipo === 'select') {
        let optionsHTML = pergunta.opcoes.map(opcao => `<option value="${opcao}">${opcao}</option>`).join('');
        container.innerHTML = `
            <select id="resposta-${pergunta.id}" style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #eee; font-family: 'Nunito', sans-serif;">
                ${optionsHTML}
            </select>
        `;
    }

    // Atualiza a Barra de Progresso
    const porcentagem = ((etapaAtual + 1) / totalEtapas) * 100;
    document.getElementById('progress-bar').style.width = porcentagem + '%';
    document.getElementById('progress-text').innerText = `${etapaAtual + 1} de ${totalEtapas}`;

    // Controla os botões (Esconde o "Anterior" na primeira etapa e muda o texto no final)
    document.getElementById('btn-prev').style.display = etapaAtual === 0 ? 'none' : 'inline-block';
    document.getElementById('btn-next').innerText = etapaAtual === totalEtapas - 1 ? 'Finalizar e Calcular' : 'Próximo';
}

// 3. Função que avança ou retrocede
function mudarEtapa(direcao) {
    // (Opcional) Você pode colocar lógica de validação aqui depois para checar se o input não está vazio

    etapaAtual += direcao;

    // Se passou da última etapa, finaliza o formulário
    if (etapaAtual >= perguntasEcoCalc.length) {
        alert(" Respostas enviadas! Em breve integraremos o cálculo aqui.");
        // Impede de avançar mais
        etapaAtual = perguntasEcoCalc.length - 1; 
        return;
    }

    // Renderiza a nova etapa
    renderizarPergunta();
}

// Inicia a primeira pergunta assim que o código carrega
renderizarPergunta();