# Cookmaster

Bem vindos ao repositório do projeto `Cookmaster`. 

Esse projeto foi realizado  durante o módulo de Back-end do curso da Trybe.

O projeto foi realizado em 3 dias e todo o desenvolvimento foi feito sozinho. 
Esse projeto visava apenas o desenvolvimento do Back-end, criando uma API para fazer requisições e um banco de dados não relacional, utilizando a linguagem Javascript.

## Tecnologias Utilizadas

Durante o desenvolvimento do projeto foram utilizadas algumas bibliotecas e ferramentas.

* NodeJS 
* Express
* Arquitetura MSC (Model, Service e Controller)
* Joi (Validação de dados)
* MongoDB
* JWToken
* Mocha
* Chai
* Sinon

## Executando a Aplicação Localmente

### Clonando o Repositório

1. No seu terminal, acesse a pasta onde o repositório será clonado e execute:
  - `git clone git@github.com:renanvamo/cookmaster.git`.
  - Entre na pasta do repositório que você acabou de clonar:
  - `cd cookmaster`

2. Instale as dependências do projeto executando no terminal:
  - `npm install`

### Executando aplicação
Execute no terminal:
  - `npm start`

Você verá no output do seu console a seguinte mensagem `conectado na porta 3000`

### Testes

Para rodar os testes do projeto basta executar o comando:
  - `npm run dev:test`

Ou para verificar a cobertura de testes, execute:
  - `npm run dev:test:coverage`
