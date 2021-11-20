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

### MongoDB
Você precisa ter o mongoDB instalado em seu computador para poder rodar o banco de dados.

Segue um link onde você pode seguir o passo a passo para instalar e em seguida iniciar o MongoDB.
[digital-ocean](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04-pt)

### Fazendo requisições

Após ver a mensagem de que está conectado,, e seu MongoDB inicializado, você pode fazer requisições para a API de várias maneiras diferentes:
Uma forma que eu recomendo é a utilização do Postman.

Nele você pode digitar a URL que deverá ser requisitada, e também o método.

Para criar um usuário, você deve fazer requisiçao através do método `POST` para `https://localhost:3000/users` enviando um nome de usuário e uma senha através do `body`, e ao enviar a requisição, você receberá uma mensagem de que um usuário novo foi criado, caso o email e a senha sejam válidos.

Para receber um token, você deve fazer uma requisição do tipo `POST` para `https://localhost:3000/login` enviando o nome de usuário e senha que você criou através no passo anterior, através do `body`, e você receberá como resposta um Token caso o nome de usuário e senha estejam corretos.

Para criar uma nova receita, esse Token será enviado através do `headers`, que será feita no método `POST` para `https://localhost:3000/recipes`, enviando através do `body` as chaves: `name`, `ingredients` e `preparation` e você receberá o ID da receita como resposta.

Para editar ou deletar uma receita, você também deve enviar seu token através do `headers`, com uma requisição de método `PUT` para alterar, ou `DELETE` para deletar, enviando na URL o id da receita que você recebeu ao cria-la, por exemplo `https://localhost:3000/recipes/1a2b3c4d5e`.
PS: Para fazer essas alterações ou deleções, você deve ser o usuário criador da receita, ou um usuário administrador do sistema.

Para fazer consultas a todas as receitas, ou a uma receita específica você deve utilizar o método `GET`, atravpes do URL `https://localhost:3000/recipes`, que irá retornar todas as receitas, ou através do URL `https://localhost:3000/recipes/1a2b3c4d5e`, onde `1a2b3c4d5e` representa o ID da receita que você procura. 

E para criar um usuário administrador, você deve fazer uma requisição do tipo `POST` para a url `https://localhost:3000/users`, enviando o nome de usuário e senha, através das chaves `username` e `password`, além da chave `user` que receberá o valor `admin`.
PS: Apenas um administrador pode criar outro usuário administrador
### Testes

Para rodar os testes do projeto basta executar o comando:
  - `npm run dev:test`

Ou para verificar a cobertura de testes, execute:
  - `npm run dev:test:coverage`
