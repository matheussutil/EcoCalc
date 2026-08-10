import { Database } from "bun:sqlite";

// Isso vai criar o arquivo ecocalc.db se ele não existir
const db = new Database("ecocalc.db");

db.run("PRAGMA foreign_keys = ON;");

// Executando o script SQL
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome TEXT NOT NULL, 
        email TEXT NOT NULL UNIQUE, 
        senha TEXT NOT NULL, 
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP 
    );

    CREATE TABLE IF NOT EXISTS constantes_emissao ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome_constante TEXT NOT NULL UNIQUE, 
        valor_fator REAL NOT NULL, 
        unidade TEXT NOT NULL, 
        categoria TEXT NOT NULL, 
        atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP 
    );

    CREATE TABLE IF NOT EXISTS historico_calculos ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        usuario_id INTEGER NOT NULL, 
        total_co2_kg REAL NOT NULL, 
        total_arvores INTEGER NOT NULL, 
        data_calculo TEXT DEFAULT CURRENT_TIMESTAMP, 
        CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE 
    );

    CREATE TABLE IF NOT EXISTS detalhes_calculo ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        calculo_id INTEGER NOT NULL, 
        categoria TEXT NOT NULL CHECK (categoria IN ('transporte', 'energia', 'alimentacao')), 
        valor_consumido REAL NOT NULL CHECK (valor_consumido >= 0), 
        co2_emitido_kg REAL NOT NULL CHECK (co2_emitido_kg >= 0), 
        CONSTRAINT fk_calculo FOREIGN KEY (calculo_id) REFERENCES historico_calculos(id) ON DELETE CASCADE 
    );
`);

console.log("BD criado");