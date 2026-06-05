# 🕴️ Para o quem for testar e avaliar 

Lembre de caminhar até a pasta onde está o back-end;

Lempre do "npm i" e do "node --watch index.js";

No database use sua senha local, crie a database exatamente como "mvc-lojinha" ou muda lá no database e bom você sabe copiar e colar o negocio pra criar as tabelas do banco (Alias aqui é PostgreSQL); 

Quando digitar ADMIN já tendo aberto o projeto, abra no admin.js pra pegar a senha e o login e ver mais coisa.

Ah... Sim, a pasta em imagens "produtos" ainda tá sem imagens para os produtos pq eu não tô com tempo de desenhar eles.

# 🏢 Sobre a Multiversal Void Company

A MVC busca transformar problemas multidimensionais em oportunidades de negócio desde antes do início da linha temporal. Ela é uma empresa fictícia.

# 🌌 MVC E-commerce

Esse trabalho em especial foi focado na parte de E-commerce, a parte da estrutura eu fiz em outro.

O Sistema de e-commerce aqui foi desenvolvido para a Multiversal Void Company (MVC), ela é uma empresa fictícia especializada em tecnologia, pesquisa multiversal e soluções interdimensionais de uma historia criada por mim, Sara.

Esse projeto consiste em uma aplicação web com front-end e back-end separados, permitindo a visualização de produtos, busca por itens, gerenciamento de estoque e realização de pedidos.

---

# 📋 Funcionalidades

## Produtos

* Listagem de produtos disponíveis.
* Busca de produtos por nome.
* Exibição de:

  * Nome
  * Descrição
  * Preço
  * Estoque
  * Imagem

## Carrinho

* Adição de produtos ao carrinho.
* Persistência utilizando LocalStorage.
* Alteração de quantidades.
* Remoção de itens.

## Pedidos

* Cadastro de:

  * Nome do cliente
  * E-mail

* Envio dos produtos selecionados.
* Cálculo automático do valor total.
* Registro do pedido no banco de dados.

## Estoque

* Verificação automática de disponibilidade.
* Bloqueio de venda quando o estoque é insuficiente.
* Atualização automática do estoque após confirmação do pedido.

---

# 🏗️ Arquitetura

O projeto utiliza uma arquitetura inspirada no padrão MVC.

```
Cliente
↓
Front-End
↓
Express
↓
Controller
↓
Repository
↓
PostgreSQL
```

---

## Camadas

### Controller

Responsável por:

* Receber requisições HTTP.
* Validar dados básicos.
* Controlar fluxo da aplicação.
* Retornar respostas ao cliente.

Arquivo:

```
controller.js
```

---

### Repository

Responsável por:

* Executar consultas SQL.
* Manipular dados persistidos.
* Realizar operações de estoque.
* Criar pedidos.

Arquivo:

```
repository.js
```

---

### Database

Responsável pela conexão com o PostgreSQL através do Pool de conexões.

Arquivo:

```
database.js
```

---

# 🚀 Tecnologias Utilizadas

## Front-End

* HTML5
* CSS3
* JavaScript

## Back-End

* Node.js
* Express
* CORS

## Banco de Dados

* PostgreSQL

## Dependências

```json
{
  "cors": "^2.8.6",
  "express": "^5.2.1",
  "pg": "^8.21.0"
}
```

---

# 🔗 Endpoints

## Listar Produtos

```http
GET /api/produtos
```

Retorna todos os produtos disponíveis.

---

## Buscar Produtos

```http
GET /api/produtos?busca=termo
```

Exemplo:

```http
GET /api/produtos?busca=camisa
```

---

## Criar Pedido

```http
POST /api/pedidos
```

### Corpo da requisição

```json
{
  "nome_cliente": "Sara",
  "email_cliente": "sara@email.com",
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2
    }
  ]
}
```

### Resposta

```json
{
  "id": 1,
  "total": 59.90,
  "status": "confirmado",
  "criado_em": "2026-01-01T12:00:00.000Z",
  "mensagem": "Pedido recebido com sucesso!"
}
```

---

# 🔒 Controle de Consistência

Durante a criação de pedidos o sistema utiliza transações SQL:

```sql
BEGIN;
COMMIT;
ROLLBACK;
```

Isso é para garantir que:

* Não ocorram vendas sem estoque.
* O estoque seja atualizado corretamente.
* O pedido seja salvo apenas quando todas as operações forem concluídas.

---

# 📂 Estrutura do Projeto

```
Multiversal-Void-Company/
│
├── README.md
│
├── frontend/
│   ├── index.html
│   ├── 404.html
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── imagens/
│   └── pages/
│
├── backend/
│   ├── index.js
│   ├── controller.js
│   ├── repository.js
│   ├── database.js
│   ├── package.json
│   └── package-lock.json
│
└── database/
    └── mvc-lojinha.sql
```

---

# 👩‍💻 Autora

Sara Rebeka Pinheiro Mendes, S.D.S, Sasotsu D. Sara em outras dimensões, Sarinha para os amigos ou simplismente "Sara".
Cursa Análise e Desenvolvimento de Sistemas (ADS) no IFCE Jaguaruana.

Projeto desenvolvido para fins acadêmicos, como um estudo de desenvolvimento web, banco de dados e arquitetura de software.

---

# 🗓️ Última atualização:

> 5 de junho de 2026. Durante o meu 3° Semestre no curso de ADS. 
