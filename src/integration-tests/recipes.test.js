const chaiHttp = require('chai-http');
const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const server = require('../api/server');
const connection = require('./connection/connectionMock');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

describe('realiza testes de integração na rota \'/recipes\'', () => {
  let connectionMock;
  let token;
  const invalidToken = 'token-inválido';
  
  before(async () => {
    connectionMock = await connection();
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);  
  });

  beforeEach(async () => {
    await connectionMock.db('Cookmaster').collection('users').insertOne({
      name: 'usuário',
      password: 'senha',
      email: 'usuario@gmail.com',
      role: 'user'
    });

    // https://buddy.works/tutorials/unit-testing-jwt-secured-node-and-express-restful-api-with-chai-and-mocha
    await chai.request(server) 
      .post('/login')
      .send({
        email: 'usuario@gmail.com',
        password: 'senha'
      })
      .then(result => {
        token = result.body.token
      });
  })

  afterEach(async () => {
    await connectionMock.db('Cookmaster').collection('users').deleteMany({});
    await connectionMock.db('Cookmaster').collection('recipes').deleteMany({});
  });
  
  after(async () => {
    MongoClient.connect.restore();
  });

  it('sem enviar um token, e o resultado deve ser \'missing auth token\'', async () => {
    const response = await chai.request(server)
      .post('/recipes')
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      });
        
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('missing auth token');
  });
  
  it('enviando um token inválido, e o resultado deve ser \'jwt malformed\'', async () => {
    const response = await chai.request(server)
      .post('/recipes')
      .set('Authorization', invalidToken)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      });
        
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('jwt malformed');
  });

  it('com um token válido, mas o campo \'name\' em branco, deve retornar \'Invalid entries. Try again.\'', async () => {
    const response = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: '',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      });

    expect(response).to.have.status(400);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Invalid entries. Try again.');
  });

  it('com o campo \'ingredients\' em branco e o resultado deve ser \'Invalid entries. Try again.\'', async () => {
    const response = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: '',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      });

    expect(response).to.have.status(400);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Invalid entries. Try again.');
  });

  it('com o campo \'preparation\' em branco, o retorno deve ser \'Invalid entries. Try again.\'', async () => {
    const response = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: ''
      });

    expect(response).to.have.status(400);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Invalid entries. Try again.');
  });

  it('enviando todos os campos válidos, o retorno deve ser a nova receita', async () => {
    const response = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      });
      
    expect(response).to.have.status(201);
    expect(response).to.be.an('object');
    expect(response.body).to.have.property('recipe');
    expect(response.body.recipe).to.have.property('_id');
    expect(response.body.recipe).to.have.property('name');
    expect(response.body.recipe).to.have.property('ingredients');
    expect(response.body.recipe).to.have.property('preparation');
    expect(response.body.recipe).to.have.property('userId');
  });

  it('usando o método get, retorna todas as receitas cadastradas', async () => {
    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      });

    const response = await chai.request(server)
      .get('/recipes');
      
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('array');
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.have.property('_id');
    expect(response.body[0]).to.have.property('name');
    expect(response.body[0]).to.have.property('ingredients');
    expect(response.body[0]).to.have.property('preparation');
    expect(response.body[0]).to.have.property('userId');
  });

  it('se passada a rota \'/recipes/id\', usando o método get, retorna a receita que possui aquele id cadastrado', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

      const response = await chai.request(server)
      .get(`/recipes/${recipeId}`);
      
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('_id');
    expect(response.body).to.have.property('userId');
    expect(response.body.name).to.be.equal('miojo gourmet');
    expect(response.body.ingredients).to.be.equal('miojo, salsicha e batata palha');
    expect(response.body.preparation).to.be.equal('ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima');
  });

  it('se passada a rota \'/recipes/id\', usando o método get, e o Id não for encontrado, retorna \'recipe not found\'', async () => {
    let invalidRecipeId = '00000000000000000000';

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      });

    const response = await chai.request(server)
      .get(`/recipes/${invalidRecipeId}`);
      
    expect(response).to.have.status(404);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal('recipe not found');
  });

  it('se passada a rota \'/recipes/id\', usando o método put, e enviando os dados, deve retornar a receita atualizada', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

    const response = await chai.request(server)
      .put(`/recipes/${recipeId}`)
      .set('Authorization', token)
      .send({
        name: 'misto quente',
        ingredients: 'pão, presunto e quejo',
        preparation: 'coloque queijo e presunto a gosto em uma chapa quente, e adicione como recheio no pão após 3 minutos'
      });
      
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('_id');
    expect(response.body).to.have.property('userId');
    expect(response.body.name).to.be.equal('misto quente');
    expect(response.body.ingredients).to.be.equal('pão, presunto e quejo');
    expect(response.body.preparation).to.be.equal('coloque queijo e presunto a gosto em uma chapa quente, e adicione como recheio no pão após 3 minutos');
  });

  it('se passada a rota \'/recipes/id\', usando o método put, sem o token', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

    const response = await chai.request(server)
      .put(`/recipes/${recipeId}`)
      .send({
        name: 'misto quente',
        ingredients: 'pão, presunto e quejo',
        preparation: 'coloque queijo e presunto a gosto em uma chapa quente, e adicione como recheio no pão após 3 minutos'
      });
      
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('missing auth token');
  });

  it('se passada a rota \'/recipes/id\', usando o método put, com o token inválido', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

    const response = await chai.request(server)
      .put(`/recipes/${recipeId}`)
      .set('Authorization', invalidToken)
      .send({
        name: 'misto quente',
        ingredients: 'pão, presunto e quejo',
        preparation: 'coloque queijo e presunto a gosto em uma chapa quente, e adicione como recheio no pão após 3 minutos'
      });
      
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('jwt malformed');
  });

  it('se passada a rota \'/recipes/id\', usando o método delete, com um token inválido', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

    const response = await chai.request(server)
      .delete(`/recipes/${recipeId}`)
      .set('Authorization', invalidToken)
      .send({
        name: 'misto quente',
        ingredients: 'pão, presunto e quejo',
        preparation: 'coloque queijo e presunto a gosto em uma chapa quente, e adicione como recheio no pão após 3 minutos'
      });
    
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('jwt malformed');
  });

  it('se passada a rota \'/recipes/id\', usando o método delete, com um token válido', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

    const response = await chai.request(server)
      .delete(`/recipes/${recipeId}`)
      .set('Authorization', token)
      .send({
        name: 'misto quente',
        ingredients: 'pão, presunto e quejo',
        preparation: 'coloque queijo e presunto a gosto em uma chapa quente, e adicione como recheio no pão após 3 minutos'
      });
      
    expect(response).to.have.status(204);  

    const newResponse = await chai.request(server)
      .get(`/recipes/${recipeId}`)

    expect(newResponse).to.have.status(404);
    expect(newResponse.body).to.be.an('object');
    expect(newResponse.body).to.have.property('message');
    expect(newResponse.body.message).to.be.equal('recipe not found');
  });

    it('se passada a rota \'/recipes/id\', usando o método delete, com um token válido', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

    const response = await chai.request(server)
      .delete(`/recipes/${recipeId}`)
      .set('Authorization', token)
      .send({
        name: 'misto quente',
        ingredients: 'pão, presunto e quejo',
        preparation: 'coloque queijo e presunto a gosto em uma chapa quente, e adicione como recheio no pão após 3 minutos'
      });
      
    expect(response).to.have.status(204);  

    const newResponse = await chai.request(server)
      .get(`/recipes/${recipeId}`)

    expect(newResponse).to.have.status(404);
    expect(newResponse.body).to.be.an('object');
    expect(newResponse.body).to.have.property('message');
    expect(newResponse.body.message).to.be.equal('recipe not found');
  });

  it('se passada a rota \'/recipes/id/image\', usando o método put, e enviando um token válido, adiciona uma chave image, com o valor do caminho da imagem no serve, na receita', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

    const response = await chai.request(server)
      .put(`/recipes/${recipeId}/image`)
      .set('Authorization', token)
      .set('Content-Type', 'image/jpeg')
      .attach('image', fs.readFileSync(path.join(__dirname, '..', 'uploads', 'ratinho.jpg')), 'uploads/ratinho.jpg');
      
    expect(response).to.have.status(200);  
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('image');
  });

  it('se passada a rota \'/recipes/id/image\', usando o método put, com um token inválido, retorna \'jwt malformed\'', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })

    const response = await chai.request(server)
      .put(`/recipes/${recipeId}/image`)
      .set('Authorization', invalidToken)
      .set('Content-Type', 'image/jpeg')
      .attach('image', fs.readFileSync(path.join(__dirname, '..', 'uploads', 'ratinho.jpg')), 'uploads/ratinho.jpg');
      
      expect(response).to.have.status(401);  
      expect(response).to.be.an('object');  
      expect(response.body).to.have.property('message');  
      expect(response.body.message).to.be.equal('jwt malformed');
  });

  it('se passada a rota \'/recipes/id.jpeg\', retorna a imagem que esta associada a receita', async () => {
    let recipeId;

    await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'miojo gourmet',
        ingredients: 'miojo, salsicha e batata palha',
        preparation: 'ferva agua, ferva salsicha separadamente em pedaços, depois de prontos, junte ambos e jogue batata palha em cima'
      })
      .then(resp => recipeId = resp.body.recipe._id );

    await chai.request(server)
      .put(`/recipes/${recipeId}/image`)
      .set('Authorization', token)
      .set('Content-Type', 'image/jpeg')
      .attach('image', fs.readFileSync(path.join(__dirname, '..', 'uploads', 'ratinho.jpg')), 'uploads/ratinho.jpg');
      
    const response = await chai.request(server)
      .get(`/images/${recipeId}.jpeg`);

    expect(response).to.have.status(200);  
  });
});
