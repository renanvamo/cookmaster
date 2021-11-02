const chaiHttp = require('chai-http');
const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const server = require('../api/server');
const connection = require('./connection/connectionMock');
const { MongoClient } = require('mongodb');
const { afterEach } = require('mocha');

chai.use(chaiHttp);

describe('realiza testes de integração na rota \'/login\'', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await connection();
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  beforeEach(async () => {
    await connectionMock.db('Cookmaster').collection('users').insertOne({
      name: 'usuário',
      password: 'senha',
      email: 'usuario@gmail.com'
    });
  });
  
  afterEach(async () => {
    await connectionMock.db('Cookmaster').collection('users').deleteMany({});
  })
  
  after(async () => {
    MongoClient.connect.restore();
  });
  
  it('sem o campo password, resultado deve ser \'All fields must be filled\'', async () => {
    const response = await chai.request(server)
      .post('/login')
      .send({
        email: 'usuario@gmail.com'
      });
        
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('All fields must be filled');
  });

  it('sem o campo email, resultado deve ser \'All fields must be filled\'', async () => {
    const response = await chai.request(server)
      .post('/login')
      .send({
        password: 'senha',
      });
        
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('All fields must be filled');
  });

  it('com os campos preenchidos, porém o usuário não existe no banco de dados, o resultado deve ser \'Incorrect username or password\'', async () => {
    const response = await chai.request(server)
      .post('/login')
      .send({
        email: 'outrousuario@gmail.com',
        password: 'senha',
      });
        
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Incorrect username or password');
  });
  
  it('com os campos preenchidos, o email existente no banco, mas a senha inválida', async () => {
    const response = await chai.request(server)
      .post('/login')
      .send({
        email: 'usuario@gmail.com',
        password: 'outra-senha',
      });
        
    expect(response).to.have.status(401);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Incorrect username or password');
  });

  it('com os campos preenchidos, o email e a senha correta, o resultado deve ser um token válido', async () => {
    const response = await chai.request(server)
      .post('/login')
      .send({
        email: 'usuario@gmail.com',
        password: 'senha',
      });
        
    expect(response).to.have.status(200);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('token');  
    expect(response.body.token).to.be.a('string');
  });
});
