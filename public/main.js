// 1. Função que controla a troca de telas (SPA)
function showSection(sectionId) {
    document.querySelectorAll('.section-container').forEach(section => {
        section.classList.remove('active');
    });
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
    }
}

// 2. Intercepta o envio do Login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    try {
        const resposta = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            alert('✅ ' + dados.mensagem);
            localStorage.setItem('usuario_id', dados.usuario_id);
            showSection('formulario-quiz'); 
            document.getElementById('loginForm').reset();
        } else {
            alert('⚠️ Erro: ' + dados.erro);
        }
    } catch (error) {
        console.error('Erro na requisição de login:', error);
        alert('❌ Falha ao conectar com o servidor. O Back-end está rodando?');
    }
});

// 3. Intercepta o envio do Cadastro
document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nome = document.getElementById('cad-nome').value;
    const email = document.getElementById('cad-email').value;
    const senha = document.getElementById('cad-senha').value;

    try {
        const resposta = await fetch('/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            alert('✅ ' + dados.mensagem);
            showSection('login');
            document.getElementById('cadastroForm').reset();
        } else {
            alert('⚠️ Erro: ' + dados.erro);
        }
    } catch (error) {
        console.error('Erro na requisição de cadastro:', error);
        alert('❌ Falha ao conectar com o servidor.');
    }
});

// 4. Banco de Perguntas (25 Perguntas)
const perguntasEcoCalc = [
  { id: 1, categoria: "energia", texto: "Quantas pessoas moram com você na sua residência?", tipo: "number", placeholder: "Ex: 3", unidade: "pessoas" },
  { id: 2, categoria: "energia", texto: "Qual o consumo médio mensal de energia elétrica da sua casa?", tipo: "number", placeholder: "Ex: 180", unidade: "kWh/mês" },
  { id: 3, categoria: "energia", texto: "Qual o tipo de gás utilizado na sua cozinha?", tipo: "select", opcoes: ["Gás de Botijão (GLP)", "Gás Encanado (GN)", "Fogão Elétrico / Indução", "Não utilizo gás"] },
  { id: 4, categoria: "energia", texto: "Qual a frequência média de troca de botijões (ou consumo mensal de gás encanado)?", tipo: "select", opcoes: ["Menos de 1 botijão a cada 2 meses", "1 botijão por mês", "2 ou mais botijões por mês", "Não utilizo gás"] },
  { id: 5, categoria: "energia", texto: "Sua residência possui painéis solares ou energia de fonte limpa?", tipo: "select", opcoes: ["Sim, possui", "Não, mas gostaria de ter", "Não possui"] },
  { id: 6, categoria: "transporte", texto: "Qual é o seu meio de transporte principal no dia a dia?", tipo: "select", opcoes: ["Carro particular", "Moto", "Transporte Público (Ônibus/Metrô)", "Bicicleta / A pé"] },
  { id: 7, categoria: "transporte", texto: "Quantos km você percorre em média por semana de carro?", tipo: "range", min: 0, max: 500, step: 10, valorPadrao: 40, unidade: "km/semana" },
  { id: 8, categoria: "transporte", texto: "Qual o combustível principal do seu carro?", tipo: "select", opcoes: ["Gasolina", "Etanol", "Flex (Mistura)", "Diesel", "Elétrico / Híbrido", "Não utilizo carro"] },
  { id: 9, categoria: "transporte", texto: "Quantos km você percorre em média por semana de transporte público?", tipo: "range", min: 0, max: 300, step: 5, valorPadrao: 20, unidade: "km/semana" },
  { id: 10, categoria: "transporte", texto: "Quantos km você percorre em média por semana de moto?", tipo: "number", placeholder: "Ex: 15", unidade: "km/semana" },
  { id: 11, categoria: "transporte", texto: "Com que frequência você utiliza aplicativos de transporte (ex: Uber, 99)?", tipo: "select", opcoes: ["Diariamente", "Algumas vezes por semana", "Raramente", "Nunca"] },
  { id: 12, categoria: "transporte", texto: "Quantos voos nacionais (curta/média distância) você faz por ano?", tipo: "number", placeholder: "Ex: 2", unidade: "voos/ano" },
  { id: 13, categoria: "transporte", texto: "Quantos voos internacionais (longa distância) você faz por ano?", tipo: "number", placeholder: "Ex: 0", unidade: "voos/ano" },
  { id: 14, categoria: "transporte", texto: "Quando viaja a passeio por via terrestre, qual meio de transporte mais utiliza?", tipo: "select", opcoes: ["Carro próprio", "Ônibus rodoviário", "Trem / Metrô", "Não costumo viajar por via terrestre"] },
  { id: 15, categoria: "alimentacao", texto: "Com que frequência você consome carne vermelha?", tipo: "select", opcoes: ["Todos os dias", "3 a 5 vezes na semana", "1 a 2 vezes na semana", "Raramente", "Nunca (Vegetariano/Vegano)"] },
  { id: 16, categoria: "alimentacao", texto: "Com que frequência você consome carne de frango ou porco?", tipo: "select", opcoes: ["Todos os dias", "3 a 5 vezes na semana", "1 a 2 vezes na semana", "Raramente", "Nunca"] },
  { id: 17, categoria: "alimentacao", texto: "Qual a proporção de alimentos ultraprocessados/industrializados na sua rotina?", tipo: "select", opcoes: ["Alta (maioria das refeições)", "Média", "Baixa (priorizo alimentos frescos/caseiros)"] },
  { id: 18, categoria: "alimentacao", texto: "Você costuma comprar alimentos locais ou orgânicos produzidos na sua região?", tipo: "select", opcoes: ["Sempre", "Às vezes", "Raramente / Nunca"] },
  { id: 19, categoria: "alimentacao", texto: "Qual o nível de desperdício de comida na sua residência?", tipo: "select", opcoes: ["Baixo (raramente descarto comida)", "Médio", "Alto (comida estragada ou sobras descartadas com frequência)"] },
  { id: 20, categoria: "consumo", texto: "Quantas peças de roupas ou calçados novos você compra por mês em média?", tipo: "number", placeholder: "Ex: 2", unidade: "peças/mês" },
  { id: 21, categoria: "consumo", texto: "Com que frequência você troca de smartphone ou computador?", tipo: "select", opcoes: ["A cada 1 ano", "A cada 2 ou 3 anos", "A cada 4 anos ou mais", "Apenas quando quebra / sem conserto"] },
  { id: 22, categoria: "consumo", texto: "Você separa o lixo reciclável (plástico, papel, vidro, metal) do lixo comum?", tipo: "select", opcoes: ["Sim, sempre", "Às vezes", "Não"] },
  { id: 23, categoria: "consumo", texto: "Qual o volume aproximado de lixo gerado por semana na sua casa?", tipo: "select", opcoes: ["Pequeno (1 a 2 sacos pequenos)", "Médio (3 a 4 sacos médios)", "Grande (5 ou mais sacos grandes)"] },
  { id: 24, categoria: "consumo", texto: "Sua casa pratica a compostagem de resíduos orgânicos?", tipo: "select", opcoes: ["Sim, fazemos compostagem", "Não, mas temos interesse", "Não"] },
  { id: 25, categoria: "consumo", texto: "Você utiliza sacolas reutilizáveis e evita plásticos de uso único nas compras?", tipo: "select", opcoes: ["Sempre", "Às vezes", "Raramente / Nunca"] }
];

let etapaAtual = 0;
const respostasUsuario = {}; // Armazena as respostas das 25 perguntas

// 5. Renderizar a Pergunta Atual
function renderizarPergunta() {
    const pergunta = perguntasEcoCalc[etapaAtual];
    const totalEtapas = perguntasEcoCalc.length;

    document.getElementById('pergunta-texto').innerText = pergunta.texto;

    const container = document.getElementById('input-container');
    container.innerHTML = '';

    const valorSalvo = respostasUsuario[pergunta.id];

    if (pergunta.tipo === 'range') {
        const val = valorSalvo !== undefined ? valorSalvo : pergunta.valorPadrao;
        container.innerHTML = `
            <input type="range" id="resposta-${pergunta.id}" min="${pergunta.min}" max="${pergunta.max}" step="${pergunta.step}" value="${val}" class="slider" oninput="document.getElementById('valor-display').innerText = this.value + ' ${pergunta.unidade}'">
            <p id="valor-display" style="margin-top: 15px; font-weight: bold; font-size: 1.2rem; color: var(--verde-escuro);">${val} ${pergunta.unidade}</p>
        `;
    } else if (pergunta.tipo === 'number') {
        const val = valorSalvo !== undefined ? valorSalvo : '';
        container.innerHTML = `
            <input type="number" id="resposta-${pergunta.id}" value="${val}" placeholder="${pergunta.placeholder}" class="form-group input" style="width: 80%; padding: 10px; border-radius: 8px; border: 2px solid #eee;"> 
            <span style="font-weight:bold; margin-left: 10px;">${pergunta.unidade}</span>
        `;
    } else if (pergunta.tipo === 'select') {
        let optionsHTML = pergunta.opcoes.map(opcao => {
            const selected = valorSalvo === opcao ? 'selected' : '';
            return `<option value="${opcao}" ${selected}>${opcao}</option>`;
        }).join('');
        container.innerHTML = `
            <select id="resposta-${pergunta.id}" style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #eee; font-family: 'Nunito', sans-serif;">
                ${optionsHTML}
            </select>
        `;
    }

    const porcentagem = ((etapaAtual + 1) / totalEtapas) * 100;
    document.getElementById('progress-bar').style.width = porcentagem + '%';
    document.getElementById('progress-text').innerText = `${etapaAtual + 1} de ${totalEtapas}`;

    document.getElementById('btn-prev').style.display = etapaAtual === 0 ? 'none' : 'inline-block';
    document.getElementById('btn-next').innerText = etapaAtual === totalEtapas - 1 ? 'Finalizar e Calcular' : 'Próximo';
}

// 6. Avançar ou Retroceder
function mudarEtapa(direcao) {
    // Captura o valor informado na pergunta atual
    const perguntaAtualObj = perguntasEcoCalc[etapaAtual];
    const inputEl = document.getElementById(`resposta-${perguntaAtualObj.id}`);
    if (inputEl) {
        respostasUsuario[perguntaAtualObj.id] = inputEl.value;
    }

    etapaAtual += direcao;

    // Se respondeu a última pergunta
    if (etapaAtual >= perguntasEcoCalc.length) {
        etapaAtual = perguntasEcoCalc.length - 1; // Mantém na última etapa para segurança
        finalizarCalculo(respostasUsuario);
        return;
    }

    renderizarPergunta();
}

// 7. Reiniciar Quiz
function reiniciarQuiz() {
    etapaAtual = 0;
    renderizarPergunta();
    showSection('formulario-quiz');
}

// Inicializa a primeira pergunta
renderizarPergunta();

// 8. Enviar respostas e obter resultado
async function finalizarCalculo(respostasDoUsuario) {
    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId) {
        alert("Você precisa estar logado para salvar seu cálculo!");
        showSection('login');
        return;
    }

    try {
        const resposta = await fetch('/api/calculo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: Number(usuarioId),
                respostas: respostasDoUsuario
            })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            document.getElementById('resultado-co2').innerText = `${dados.total_co2_kg.toFixed(1)} kg CO₂/ano`;
            document.getElementById('resultado-arvores').innerText = `${dados.total_arvores} árvores necessárias`;
            
            showSection('resultados');
        } else {
            alert('⚠️ Erro ao calcular: ' + dados.erro);
        }
    } catch (error) {
        console.error('Erro ao processar cálculo:', error);
        alert('❌ Falha na conexão com o servidor.');
    }
}