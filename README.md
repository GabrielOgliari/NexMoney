# NexMoney

# Funcionalidades

### 🟢 **Nomes Modernos / Tecnológicos**

1. **NexMoney**
    - *“A nova geração do controle financeiro.”*
2. **Fluxx**
    - *“Simplifique o fluxo da sua vida financeira.”*
3. **GranaHub**
    - *“Tudo sobre sua grana em um só lugar.”*
4. **ZenFinance**
    - *“Controle financeiro sem estresse.”*

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
