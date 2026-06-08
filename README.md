# 🌱 EcoCalc — Calculadora de Pegada de Carbono

O **EcoCalc** é uma plataforma digital focada no **ODS 13 (Ação Contra a Mudança Global do Clima)**. O objetivo principal do sistema é conscientizar pessoas e empresas sobre o impacto ambiental de suas atividades rotineiras, fornecendo um diagnóstico claro de suas emissões e caminhos para a regeneração ambiental.

---

## 🎯 O Problema e a Solução

A falta de medição das atividades cotidianas impede que indivíduos e corporações compreendam seu impacto real na crise climática. Sem dados claros, não há mudança de comportamento. 

O **EcoCalc** resolve isso entregando uma interface simples e amigável onde o usuário informa dados de consumo logístico e energético. O sistema processa essas informações aplicando coeficientes específicos e devolve:
1. O total de emissões brutas de $CO_2$ em quilogramas ($kg$).
2. A meta de compensação equivalente convertida em **número de árvores a serem plantadas**.

---

## 🚀 Principais Funcionalidades (Escopo)

* **Autenticação Segura:** Cadastro e login de usuários com validação de formato de e-mail e armazenamento seguro de senhas através de algoritmos de hashing de via única (ex: Bcrypt).
* **Questionário Dinâmico:** Um formulário gamificado composto por perguntas estruturadas em formato de modal, incluindo controles fluidos como barras de progresso e sliders de transporte.
* **Painel de Resultados Vibrante:** Exibição clara do total de carbono e do contador de árvores, acompanhados por gráficos de pizza/barra segmentados por categoria (Transporte, Energia e Alimentação).

---

## 📅 Cronograma de Desenvolvimento (Metas Semanais)

O projeto foi planejado sob uma metodologia ágil, distribuída entre blocos de desenvolvimento técnico e blocos de validação/ajustes:

* **Semana 1: Modelagem e Estrutura do Banco de Dados (BD)** 💾
    * *Entregável:* Criação do diagrama lógico e script DDL otimizado para PostgreSQL 17 com chaves estrangeiras amarradas.
* **Semana 2: Desenvolvimento do Front-end (Interface Inicial e Login)** 💻
    * *Entregável:* Estrutura inicial e páginas de Login, Cadastro e Home codificadas de forma limpa e responsiva.
* **Semana 3: Front-end do Formulário (O Modal de 8 Etapas)** 📝
    * *Entregável:* Tela de questionário com a lógica de navegação dinâmica (Anterior/Próximo) e barra de progresso.
* **Semana 4: Implementação da Lógica de Cálculo (Back-end)** 🧮
    * *Entregável:* Funções matemáticas alimentadas pelos coeficientes ecológicos e cálculo exato da equivalência em árvores.
* **Semana 5: Tela de Resultados e Gráficos** 📈
    * *Entregável:* Integração de painel analítico com biblioteca de gráficos (como Chart.js) para renderização visual do impacto por categoria.
* **Semana 6: Testes de Fluxo e Integração Inicial** 🛠️
    * *Entregável:* Homologação de ponta a ponta (cadastro, preenchimento, resultado) e tratamento de cenários de exceção.

---

## 👥 Autor

* **Matheus Sutil de Souza** - *Desenvolvedor do Projeto* - Turma IA24

---
*Este projeto faz parte do escopo de desenvolvimento de software focado em metas de sustentabilidade global da Agenda 2030.*