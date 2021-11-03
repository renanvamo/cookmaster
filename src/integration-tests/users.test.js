const chaiHttp = require('chai-http');
const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const server = require('../api/server');
const connection = require('./connection/connectionMock');
const { MongoClient } = require('mongodb');

chai.use(chaiHttp);

describe('realiza testes de integração na rota \'/users\'', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await connection();
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  beforeEach(async () => {
    await connectionMock.db('Cookmaster').collection('users').insertMany([
      {
        name: 'usuário',
        role: 'user',
        email: 'usuario@gmail.com',
        password: 'senha'
      },
      {
        name: 'admin',
        role: 'admin',
        email: 'admin@gmail.com',
        password: 'senha'
      },
    ]);
  });
  
  afterEach(async () => {
    await connectionMock.db('Cookmaster').collection('users').deleteMany({});
  })
  
  after(async () => {
    MongoClient.connect.restore();
  });

  it('sem o campo name, resultado deve ser \'Invalid entries. Try again.\'', async () => {
    const response = await chai.request(server)
      .post('/users')
      .send({
        email: 'vdevingança@gmail.com',
        passowrod: 'senha-secreta'
      });
        
    expect(response).to.have.status(400);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Invalid entries. Try again.');
  });
  
  it('sem o campo email, resultado deve ser \'Invalid entries. Try again.\'', async () => {  
    const response = await chai.request(server)
      .post('/users')
      .send({
        name: 'V de Vingança',
        passowrod: 'senha-secreta'
      });

    expect(response).to.have.status(400);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Invalid entries. Try again.');
  });

  it('sem o campo password, resultado deve ser \'Invalid entries. Try again.\'', async () => {  
    const response = await chai.request(server)
      .post('/users')
      .send({
        name: 'V de Vingança',
        email: 'vdevingança@gmail.com'
      });

    expect(response).to.have.status(400);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Invalid entries. Try again.');
  });

  it('preenchendo todos os campos, mas o email possui um formato inválido, o resultado deve ser \'Invalid entries. Try again.\'', async () => {
    const response = await chai.request(server)
    .post('/users')
    .send({
      name: 'V de Vingança',
      password: 'senha-secreta',
      email: 'email-inválido'
    });

    expect(response).to.have.status(400);  
    expect(response).to.be.an('object');  
    expect(response.body).to.have.property('message');  
    expect(response.body.message).to.be.equal('Invalid entries. Try again.');
  });
    
  it('preenchendo todos os campos, com os formatos válidos, o cadastro é realizado com sucesso', async () => {
    const response = await chai.request(server)
      .post('/users')
      .send({
        name: 'V de Vingança',
        password: 'senha-secreta',
        email: 'vdevingança@gmail.com'
      });

    expect(response).to.have.status(201);  
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('user')
    expect(response.body.user).to.have.property('_id');
    expect(response.body.user.name).to.be.equal('V de Vingança');
    expect(response.body.user.email).to.be.equal('vdevingança@gmail.com');
    expect(response.body.user.role).to.be.equal('user');
  });

  it('preenchendo todos os campos corretamente, porém o email já existe no banco de dados, o retorno deve ser \'Email already registered.\'', async () => {
    await connectionMock.db('Cookmaster').collection('users').insertOne({
      name: 'V de Vingança',
      password: 'senha-secreta',
      email: 'vdevingança@gmail.com'
    });

    const response = await chai.request(server)
      .post('/users')
      .send({
        name: 'V de Vingança',
        password: 'senha-secreta',
        email: 'vdevingança@gmail.com'
      });

    expect(response).to.have.status(409);  
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal('Email already registered');
  });

  it('testa a rota \'/users/admin\' e tenta criar um novo admin, usando um usuário do tipo \'user\', e a resposta deve ser \'Only admins can register new admins\'', async () => {
    let userToken;
    await chai.request(server)
      .post('/login')
      .send({
        email: 'usuario@gmail.com',
        password: 'senha'
      })
      .then(response => userToken = response.body.token);

    const response = await chai.request(server)
      .post('/users/admin')
      .set('Authorization', userToken)
      .send({
        name: 'Admin da Vingança',
        password: 'senha-do-admin',
        email: 'vdeadmin@gmail.com'
      });

    expect(response).to.have.status(403);  
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal('Only admins can register new admins');
  });

  it('testa a rota \'/users/admin\' e tenta criar um novo admin, usando um usuário do tipo \'admin\', e a resposta deve ser os dados do novo usuário admin', async () => {
    let adminToken;

    await chai.request(server)
      .post('/login')
      .send({
        email: 'admin@gmail.com',
        password: 'senha'
      })
      .then(response => adminToken = response.body.token);

    const response = await chai.request(server)
      .post('/users/admin')
      .set('Authorization', adminToken)
      .send({
        name: 'Admin da Vingança',
        password: 'senha-do-admin',
        email: 'vdeadmin@gmail.com'
      });

    expect(response).to.have.status(201);  
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('user')
    expect(response.body.user).to.have.property('_id');
    expect(response.body.user.name).to.be.equal('Admin da Vingança');
    expect(response.body.user.email).to.be.equal('vdeadmin@gmail.com');
    expect(response.body.user.role).to.be.equal('admin');
  });
});
