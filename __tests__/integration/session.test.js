const { Admin } = require("../../src/app/models/Admin")
const app = require('../../src/app');
const request = require('supertest')

describe('Authentication', () => {
    it('should login with email', () => {
        const email = "admin@artcodeagencia.com";
        const password = "123456";

        const auth = await request(app)
        .post('/auth')
        .send({
          email,
          password
        })
    })
})
