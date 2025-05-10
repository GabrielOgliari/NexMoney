# NexMoney

# Funcionalidades

### 🟢 **Nomes Modernos / Tecnológicos**

**NexMoney** - _“A nova geração do controle financeiro.”_

## 🧾 **Descrição do Projeto - Sistema Financeiro Pessoal**

---

### 🟢 **1. Tela de Login**

- Campos para **e-mail** e **senha**
- Botão “Entrar”
- Link para **cadastro de novo usuário**

---

### 🟢 **2. Tela de Cadastro de Usuário**

- Campos padrão:
  - Nome completo
  - E-mail
  - Senha e confirmação de senha
  - Telefone
  - Data de nascimento
- Opções de segurança:
  - Pergunta de segurança
  - Autenticação em duas etapas (opcional)

---

### 🟢 **3. Tela Principal / Dashboard**

- Visão geral com os principais dados do mês:
  - **Saldo atual**
  - **Contas a receber**
  - **Contas a pagar**
  - **Investimentos**
    - Tendo um drop box para abrir os totais de cada tipo de investimento
  - **Despesas do Mês**
  - Gráfico de pizza com categorias de gasto (alimentação, transporte, lazer, etc.)
  - Gráfico de linha de fluxo de caixa do mês

---

### 🟢 **4. Listagem de Contas a Receber**

- Filtros por:
  - Data
  - Categoria
  - Valor
- Status (recebido / pendente)
- Opção para adicionar nova conta a receber manualmente

---

### 🟢 **5. Listagem de Contas a Pagar**

- Mesmo padrão da tela de contas a receber
- Opção para criar lembretes ou alertas de vencimento

---

### 🟢 **6. Tela de Importação de Extrato Bancário**

- Upload de arquivo (.OFX)
- Visualização prévia dos dados
- Reconhecimento manual de:
  - Datas
  - Valores
  - descrição
- Possibilidade de vincular lançamentos ao sistema
- Vai cruzar os dados com o que tem na tela de contas a pagar e receber podendo selecionar em qual das duas para fazer o mapeamento do que é o que não for

---

### 🟢 **7. Tela “Planejado vs Real”**

- Duas colunas:
  - **Gastos planejados** (orçamento mensal)
  - **Gastos reais (Referente os lançamentos reais do arquivo ofx)**
- Mostrando o que foi mapeado na tela de **Tela de Importação de Extrato Bancário**
- Destaques:
  - Categorias com **gastos excessivos**
  - Sugestões de economia
- Gráfico de barras comparativo

---

### 🟢 **8. Tela de Gestão de Investimentos**

- Resumo dos investimentos:
  - Renda fixa (CDB, Tesouro Direto)
  - Renda variável (ações, fundos)
  - Criptomoedas
- Funcionalidades:
  - Cadastro manual
  - Histórico de rendimentos
  - Gráfico de performance por tipo de investimento
  - Simulador de rentabilidade
  - Comparativo com inflação e CDI
  - Alerta de vencimentos ou datas importantes
  - Mostrar valor na hora
  - mostrar perca ou ganho de quanto
  - Se for de rendimentos tenha como colocar quanto recebeu por mês mostrando no dashboard o total de rendimento, e quanto rendeu no mês

---

### 🔧 Funcionalidades Extras (Sugeridas)

- Notificações (via app, email ou push)
- Dark mode
- Perfil de usuário com metas financeiras
- Relatórios PDF ou Excel

# Estrutura de pastas

[rocketseat](https://www.rocketseat.com.br/blog/artigos/post/organizacao-pastas-react-estrutura-escalavel#caba73cce29e47dbb0f1cfe2793babef)

NexMoney/
├── back/ # 🟡 Backend (ex: Fastify, Express)
│ ├── node_modules/
│ ├── src/
│ │ ├── controllers/
│ │ ├── database/
│ │ ├── routes/
│ │ ├── services/
│ │ └── main.js
│ ├── .env
│ ├── jsconfig.json
│ └── package.json
│
├── front/ # 🔵 Frontend (React + Vite)
│ ├── node_modules/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── charts/
│ │ │ ├── layout/
│ │ │ └── ui/
│ │ ├── constants/
│ │ │ ├── categories.js
│ │ │ ├── messages.js
│ │ │ └── routes.js
│ │ ├── context/
│ │ │ └── auth_context.js
│ │ ├── hooks/
│ │ │ └── use_auth.js
│ │ ├── lib/
│ │ │ └── validator.js
│ │ ├── pages/
│ │ │ ├── auth/
│ │ │ │ ├── login_page.jsx
│ │ │ │ └── register_page.jsx
│ │ │ ├── bank_statement/
│ │ │ │ └── bank_statement_page.jsx
│ │ │ ├── budget_vs_actual/
│ │ │ │ └── budget_vs_actual_page.jsx
│ │ │ ├── dashboard/
│ │ │ │ └── dashboard_page.jsx
│ │ │ ├── expenses/
│ │ │ │ └── expenses_page.jsx
│ │ │ ├── incomes/
│ │ │ │ └── incomes_page.jsx
│ │ │ ├── investments/
│ │ │ │ └── investments_page.jsx
│ │ │ └── profile/
│ │ │ └── profile_page.jsx
│ │ ├── router/
│ │ │ └── index.jsx
│ │ ├── services/
│ │ │ ├── api/
│ │ │ │ ├── auth.js
│ │ │ │ ├── finance.js
│ │ │ │ ├── index.js
│ │ │ │ └── investments.js
│ │ ├── store/
│ │ │ └── query_client.js
│ │ ├── utils/
│ │ │ ├── date_helpers.js
│ │ │ └── format_currency.js
│ │ ├── app.css
│ │ ├── app.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.js
│
├── .gitignore
└── README.md

assets/: Armazena imagens, ícones e outros arquivos estáticos. Ideal para manter esses arquivos organizados fora do código principal.
components/: Aqui ficam os componentes reutilizáveis e independentes, como botões, modais e outros elementos da interface que podem ser utilizados em várias partes do projeto. Cada componente possui sua própria pasta, incluindo arquivo principal, testes (.test.js) e estilos (.css).
context/: Essa pasta guarda os contextos criados com a Context API do React, úteis para gerenciar estados globais que precisam ser compartilhados entre diferentes componentes. No exemplo, temos o AuthContext.js para autenticação.
features/: Esta pasta é ótima para organizar componentes e lógica específicos de funcionalidades, como “Auth” (autenticação) e “Dashboard” (painel de usuário). Cada funcionalidade tem seus próprios componentes, lógica de estado (como authSlice.js para Redux) e até mesmo estilos e testes próprios.
hooks/: Os hooks personalizados ficam aqui, permitindo o compartilhamento de lógica entre diferentes componentes. Hooks como useAuth.js (para lógica de autenticação) e useFetch.js (para chamadas API) são comuns.
pages/: Contém as páginas principais do aplicativo, como a Home e o Profile. Em frameworks como o Next.js, essa pasta é usada para roteamento automático.
services/: Centraliza as funções que lidam com chamadas de APIs ou serviços externos. Arquivos como api.js e authService.js mantêm o código de integração com serviços separados da lógica dos componentes.
styles/: Para estilos globais da aplicação, como variáveis de CSS ou temas. Inclui arquivos como variables.css e main.css, que afetam toda a aplicação.
utils/: Guarda funções auxiliares e utilitários, como formatDate.js para formatação de datas e slugify.js para transformar textos em slugs. Essas funções são reutilizáveis e independentes dos componentes.
