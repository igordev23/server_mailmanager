# Sistema de Gestão de E-mails - Backend

## 📋 Descrição do Projeto

Este projeto foi desenvolvido como parte do **Hackaton Sistema de Gestão de E-mails** realizado pelo **IFPI – Curso de Tecnologias em Análise e Desenvolvimento de Sistemas** em **Piripiri – PI, 2025**. O objetivo principal é criar um sistema capaz de gerenciar e organizar e-mails enviados pelos colaboradores de uma empresa, aplicando boas práticas de desenvolvimento, arquitetura de software e banco de dados.

O backend do sistema é responsável por capturar automaticamente e-mails enviados pelos colaboradores (com cópia para um endereço específico), registrá-los em uma base de dados e permitir que informações adicionais, como Estado e Município, sejam associadas a cada e-mail. Além disso, o backend fornece APIs para suporte ao cadastro manual de e-mails e integração com o frontend.

---

## 🛠️ Funcionalidades

1. **Captura Automática de E-mails**:
   - Captura e-mails enviados com cópia para um endereço específico (ex.: `meusistema@gmail.com`).
   - Registra automaticamente os e-mails na base de dados.

2. **Cadastro Manual de E-mails**:
   - Permite que colaboradores adicionem e-mails manualmente ao sistema.

3. **Gestão de Informações Adicionais**:
   - Possibilidade de associar Estado e Município aos e-mails registrados.

4. **APIs para Integração**:
   - Fornece endpoints para o frontend consumir os dados e realizar operações no sistema.

5. **Sincronização Automática**:
   - Sincronização periódica com o serviço MailTM para capturar novos e-mails.

---

## 🧑‍💻 Tecnologias Utilizadas

- **Backend**: Node.js com Express.js.
- **Serviços de E-mail**: Mailgun, Supabase e MailTM.
- **Banco de Dados**: PostgreSQL.
- **Arquitetura**: RESTful APIs.

---

## 📂 Estrutura do Projeto

```bash
src/
├─ routes/              # Rotas da API
├─ services/            # Serviços de integração com APIs externas
├─ models/              # Modelos e entidades              # Funções utilitárias
└─ server.js            # Configuração e inicialização do servidor
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** (v18 ou superior)
- Yarn ou npm

### Passos para execução

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/igordev23/server_mailmanager.git
   cd server_mailmanager
   ```

2. **Instale as dependências**:

   Com Yarn:
   ```bash
   yarn install
   ```

   Ou com npm:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
     ```env
     SUPABASE_KEY=seu_supabase_key
     SUPABASE_URL=seu_supabase_url
     ```

4. **Inicie o servidor**:

   Com Yarn:
   ```bash
   yarn start
   ```

   Ou com npm:
   ```bash
   npm start
   ```

5. **Acesse a API**:
   - O servidor estará disponível em `http://localhost:3000`.

---

## 🧪 Testes

Os testes são essenciais para garantir a qualidade do sistema. As áreas testadas incluem:

1. **Serviços e APIs**:
   - Testes de integração com serviços externos.
   - Testes de endpoints RESTful.

2. **Fluxos de Cadastro e Atualização**:
   - Validação de dados.
   - Comportamento em cenários de erro.

3. **Sincronização Automática**:
   - Testes de captura e inserção de e-mails na base de dados.
4. **Banco de Dados**:
   - Testes de CRUD (Create, Read, Update, Delete) para as entidades.
5. **Postman**:
   - Utilize o Postman para testar as APIs.
   - Importe o arquivo de collection fornecido no repositório.
---

## 📂 Repositório do Frontend

O repositório do frontend está localizado no seguinte endereço: [Frontend do Sistema de Gestão de E-mails](https://github.com/igordev23/mail-flow-manager).

---

## 📄 Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
