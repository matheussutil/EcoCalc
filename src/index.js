import { Database } from "bun:sqlite";

// 1. Conectando o Banco de Dados
const db = new Database("ecocalc.db");

// Ativando as chaves estrangeiras (ON DELETE CASCADE) no SQLite
db.run("PRAGMA foreign_keys = ON;");

console.log("🌱 EcoCalc Backend rodando na porta 3000!");

// 2. Levantando o Servidor Web Nativo
Bun.serve({
  port: 3000,
  
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;

    // --- ROTA 0: TESTE DE CONEXÃO ---
    if (url.pathname === "/" && method === "GET") {
      return new Response("Servidor EcoCalc 100% operacional no Bun! 🚀", { status: 200 });
    }

    // --- ROTA 1: CADASTRO DE USUÁRIO ---
    if (url.pathname === "/api/cadastro" && method === "POST") {
      const body = await req.json();
      const { nome, email, senha } = body;

      // Criptografando a senha em 1 linha com a API nativa
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

      // Buscando o usuário no banco
      const query = db.query("SELECT * FROM usuarios WHERE email = ?");
      const usuario = query.get(email);

      if (!usuario) {
        return new Response(JSON.stringify({ sucesso: false, erro: "Usuário não encontrado." }), { 
          status: 404, headers: { "Content-Type": "application/json" } 
        });
      }

      // Validando se a senha bate com o Hash salvo
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

    // --- ROTA 3: SALVAR CÁLCULO (Esqueleto) ---
    if (url.pathname === "/api/calculo" && method === "POST") {
      // O Front-end enviará as 8 respostas para esta rota no futuro
      return new Response(JSON.stringify({ sucesso: true, mensagem: "Rota de cálculo aguardando integração!" }), { 
        status: 200, headers: { "Content-Type": "application/json" } 
      });
    }

    // Rota padrão (Erro 404)
    return new Response("Rota não encontrada.", { status: 404 });
  },
});