import { Database } from "bun:sqlite";

// 1. Conectando o Banco de Dados
const db = new Database("ecocalc.db");

// Ativando as chaves estrangeiras
db.run("PRAGMA foreign_keys = ON;");

console.log("🌱 EcoCalc Backend rodando na porta 3000!");

// 2. Levantando o Servidor Web Nativo
Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;

    // --- ROTEAMENTO DE ARQUIVOS ESTÁTICOS (FRONT-END) ---
    if (url.pathname === "/" && method === "GET") {
      return new Response(Bun.file("public/index.html"));
    }
    if (url.pathname === "/main.js" && method === "GET") {
      return new Response(Bun.file("public/main.js"));
    }
    if (url.pathname === "/main.css" && method === "GET") {
      return new Response(Bun.file("public/main.css"));
    }

    // --- ROTA 1: CADASTRO DE USUÁRIO ---
    if (url.pathname === "/api/cadastro" && method === "POST") {
      const body = await req.json();
      const { nome, email, senha } = body;

      const hashSenha = await Bun.password.hash(senha);

      try {
        const query = db.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
        query.run(nome, email, hashSenha);

        return new Response(JSON.stringify({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" }), {
          status: 201, headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ sucesso: false, erro: "E-mail já cadastrado ou falha no banco." }), {
          status: 400, headers: { "Content-Type": "application/json" }
        });
      }
    }

    // --- ROTA 2: LOGIN ---
    if (url.pathname === "/api/login" && method === "POST") {
      const body = await req.json();
      const { email, senha } = body;

      const query = db.query("SELECT * FROM usuarios WHERE email = ?");
      const usuario = query.get(email);

      if (!usuario) {
        return new Response(JSON.stringify({ sucesso: false, erro: "Usuário não encontrado." }), {
          status: 404, headers: { "Content-Type": "application/json" }
        });
      }

      const senhaValida = await Bun.password.verify(senha, usuario.senha);

      if (senhaValida) {
        return new Response(JSON.stringify({ sucesso: true, mensagem: "Acesso liberado!", usuario_id: usuario.id }), {
          status: 200, headers: { "Content-Type": "application/json" }
        });
      } else {
        return new Response(JSON.stringify({ sucesso: false, erro: "Senha incorreta." }), {
          status: 401, headers: { "Content-Type": "application/json" }
        });
      }
    }

    // --- ROTA 3: PROCESSAR E SALVAR CÁLCULO ---
if (url.pathname === "/api/calculo" && method === "POST") {
    try {
        const body = await req.json();
        const { usuario_id, respostas } = body;

        // 1. Variáveis de cálculo acumulado por categoria (em kg CO2/ano)
        let co2Energia = 0;
        let co2Transporte = 0;
        let co2Alimentacao = 0;
        let co2Consumo = 0;

        // 2. Módulos de Cálculo
        const moradores = Number(respostas[1]) || 1;
        const kwhMes = Number(respostas[2]) || 0;
        co2Energia += ((kwhMes * 0.09) * 12) / moradores;

        if (respostas[3] === "Gás de Botijão (GLP)") {
            co2Energia += (30 * 6) / moradores; // Média de 6 botijões/ano
        }

        // Transporte
        const kmCarroSemana = Number(respostas[7]) || 0;
        const combustivel = respostas[8] || "Gasolina";
        const fatorCombustivel = combustivel === "Etanol" ? 0.08 : 0.19;
        co2Transporte += kmCarroSemana * 52 * fatorCombustivel;

        const kmBusSemana = Number(respostas[9]) || 0;
        co2Transporte += kmBusSemana * 52 * 0.05;

        const voosNacionais = Number(respostas[12]) || 0;
        const voosInternacionais = Number(respostas[13]) || 0;
        co2Transporte += (voosNacionais * 150) + (voosInternacionais * 700);

        // Alimentação
        const freqCarne = respostas[15];
        if (freqCarne === "Todos os dias") co2Alimentacao += 1200;
        else if (freqCarne === "3 a 5 vezes na semana") co2Alimentacao += 800;
        else if (freqCarne === "1 a 2 vezes na semana") co2Alimentacao += 400;
        else co2Alimentacao += 150;

        // Consumo & Lixo
        const volumeLixo = respostas[23];
        if (volumeLixo === "Grande (5 ou mais sacos grandes)") co2Consumo += 600;
        else if (volumeLixo === "Médio (3 a 4 sacos médios)") co2Consumo += 350;
        else co2Consumo += 150;

        // 3. Totais do Resultado
        const totalCo2Kg = co2Energia + co2Transporte + co2Alimentacao + co2Consumo;
        const totalArvores = Math.ceil(totalCo2Kg / 15); // 1 árvore = 15 kg CO2/ano

        // 4. Salvar o registro no SQLite
        const insertHistorico = db.query(
            "INSERT INTO historico_calculos (usuario_id, total_co2_kg, total_arvores) VALUES (?, ?, ?) RETURNING id"
        );
        const historico = insertHistorico.get(usuario_id, totalCo2Kg, totalArvores);
        const calculoId = historico.id;

        // 5. Salvar o detalhamento por categoria para renderização de gráficos
        const insertDetalhe = db.query(
            "INSERT INTO detalhes_calculo (calculo_id, categoria, valor_consumido, co2_emitido_kg) VALUES (?, ?, ?, ?)"
        );

        insertDetalhe.run(calculoId, 'energia', kwhMes, co2Energia);
        insertDetalhe.run(calculoId, 'transporte', kmCarroSemana, co2Transporte);
        insertDetalhe.run(calculoId, 'alimentacao', 1, co2Alimentacao);

        return new Response(JSON.stringify({
            sucesso: true,
            total_co2_kg: totalCo2Kg,
            total_arvores: totalArvores,
            detalhes: {
                energia: co2Energia,
                transporte: co2Transporte,
                alimentacao: co2Alimentacao,
                consumo: co2Consumo
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Erro no cálculo:", error);
        return new Response(JSON.stringify({ sucesso: false, erro: "Falha ao processar os cálculos." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

    return new Response("Rota não encontrada.", { status: 404 });
  },
});