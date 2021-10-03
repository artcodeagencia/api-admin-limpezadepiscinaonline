const { funcionarios } = require('../models');

class EmployeesController {

  async get(req, res) {
    const employees = await funcionarios.findAll();

    return res.status(200).json({ body: employees });
  }

  async update(req, res) {
    const value = req.body;
    const query = await funcionarios.update(value, {
      where: {
        id: value.id
      }
    })
    const response = query[0];
    let body, error;
    if(response) {
      error = 0;
      body = "Informações atualizadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível atualizar as informações. Contate a administração.";
    }
    return res.status(200).json({ error, body})
  }
}

module.exports = new EmployeesController()
