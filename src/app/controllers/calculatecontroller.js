const { custosadicionaisatendimento } = require('../models');
const { dadostipoatendimento } = require('../models');
const { descontoporsemana } = require('../models');
const { situacaopiscina } = require('../models');

class CalculateController {

  async get(req, res) {
    const distance = await custosadicionaisatendimento.findAll({
      order: [['id_tipo_atendimento', 'ASC'], ['distancia', 'ASC']]
    });
    const service = await dadostipoatendimento.findAll({
      order: [['id_tipo_atendimento', 'ASC'], ['volume', 'ASC']]
    });
    const week = await descontoporsemana.findAll();
    const pool = await situacaopiscina.findAll();
    return res.status(200).json({ 
      distance,
      service,
      week,
      pool
    });
  }

  async addDistance(req, res) {
    const value = req.body;
  
    const query = await custosadicionaisatendimento.create(value);

    let body, error;
    if(query.id > 0) {
      error = 0;
      body = "Informações adicionadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível adicionar as informações. Contate a administração.";
    }
    return res.status(200).json({ error, body, id: query.id})
  }

  async updateDistance(req, res) {
    const value = req.body;
    const query = await custosadicionaisatendimento.update(value, {
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

  async removeDistance(req, res) {
    const value = req.body;
  
    const query = await custosadicionaisatendimento.destroy({
      where: {
        id: value.id
      }
    });

    let body, error;
    if(query) {
      error = 0;
      body = "Informações adicionadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível adicionar as informações. Contate a administração.";
    }
    return res.status(200).json({ error, body, id: query.id})
  }

  async addVolume(req, res) {
    const value = req.body;
  
    const query = await dadostipoatendimento.create(value);

    let body, error;
    if(query.id > 0) {
      error = 0;
      body = "Informações adicionadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível adicionar as informações. Contate a administração.";
    }
    return res.status(200).json({ error, body, id: query.id})
  }

  async updateVolume(req, res) {
    let value = req.body;
    // Convert string possiblity
    const query = await dadostipoatendimento.update(value, {
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

  async removeVolume(req, res) {
    let value = req.body;

    const query = await dadostipoatendimento.destroy({
      where: {
        id: value.id
      }
    });

    let body, error;
    if(query) {
      error = 0;
      body = "Informações adicionadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível adicionar as informações. Contate a administração.";
    }
    return res.status(200).json({ error, body, id: query.id})
  }

  async updateWeek(req, res) {
    const value = req.body;
    const query = await descontoporsemana.update(value, {
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

  async updatePool(req, res) {
    let value = req.body;
    
    const query = await situacaopiscina.update(value, {
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

module.exports = new CalculateController()
