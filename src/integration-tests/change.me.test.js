const chaiHttp = require('chai-http');
const chai = require('chai');
const { expect } = chai;
const server = require('../api/server');

chai.use(chaiHttp);
// describe('', () => {
  
// });

describe('realiza testes de integração da API nas rotas:', () => {
  describe('/users, utilizando o método .post', () => {
    it('sem o campo name, resultado deve ser \'Invalid entries. Try again.\'', async () => {
      let response = await chai.request(server)
          .post('/users')
          .send({
            email: 'vdevingança@gmail.com',
            passowrod: 'senha-secreta'
          });
        expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
    
    it('sem o campo email, resultado deve ser \'Invalid entries. Try again.\'', async () => {  
      let response = await chai.request(server)
          .post('/users')
          .send({
            name: 'V de Vingança',
            passowrod: 'senha-secreta'
          });
  
        expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });

    it('sem o campo passowrd, resultado deve ser \'Invalid entries. Try again.\'', async () => {  
      let response = await chai.request(server)
          .post('/users')
          .send({
            name: 'V de Vingança',
            email: 'vdevingança@gmail.com'
          });
  
        expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
  });
});
