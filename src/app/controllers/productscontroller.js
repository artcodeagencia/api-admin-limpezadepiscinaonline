const { produtosquimicos } = require('../models');
const { quantidadeprodutoservico } = require('../models');
const { servicoadicionaltrocadeareia } = require('../models');
const { servicoadicionallimpezadecapa } = require('../models');
const { valvulaseletorafabricantes } = require('../models');
const { valvulaseletoramodelos } = require('../models');

// function stringToFloat(value){
//   let string = value.toString();
//   string = string.replace(",", ".");
//   string = parseFloat(string.replace("R$", ""));
//   return string
// }

class ProductsController {
  async get(req, res) {
    const products = await produtosquimicos.findAll();
    const quantity = await quantidadeprodutoservico.findAll({
        order: [['id_tipo_atendimento', 'ASC'], ['id_produto', 'ASC']]
    });
    const sand = await servicoadicionaltrocadeareia.findAll();
    const clean = await servicoadicionallimpezadecapa.findAll();
    const models = await valvulaseletoramodelos.findAll();
    const fabricants = await valvulaseletorafabricantes.findAll();
    return res.status(200).json({ 
        products,
        quantity,
        sand,
        clean,
        models,
        fabricants
    });
  }
  
  async updateProducts(req, res) {
    const value = req.body;

    const query = await produtosquimicos.update(value, {
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

  async addProducts(req, res) {
    const value = req.body;
  
    
    const query = await produtosquimicos.create(value);

    let body, error;
    if(query.id > 0) {
      error = 0;
      body = "Informações adicionadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível adicionar as informações. Contate a administração.";
    }

    return res.status(200).json({ error, body, value: query})
  }

  async removeProducts(req, res) {
    const value = req.body;
  
    const query = await produtosquimicos.destroy({
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

  async updateQuantity(req, res) {
    const value = req.body;
    const query = await quantidadeprodutoservico.update(value, {
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

  async addQuantity(req, res) {
    const value = req.body;

    const query = await quantidadeprodutoservico.create(value);

    
    let body, error;
    if(query.id > 0) {
      error = 0;
      body = "Informações adicionadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível adicionar as informações. Contate a administração.";
    }

    return res.status(200).json({ error, body, value: query})
  }

  async removeQuantity(req, res) {
    const value = req.body;
  
    const query = await quantidadeprodutoservico.destroy({
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

  async updateSand(req, res) {
    const value = req.body;
    const query = await servicoadicionaltrocadeareia.update(value, {
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

  async updateClean(req, res) {
    let value = req.body;
    
     // Convert string possiblity
    //  value.tamanho_minimo_metro_cubico = stringToFloat(value.tamanho_minimo_metro_cubico);
    //  value.tamanho_maximo_metro_cubico = stringToFloat(value.tamanho_maximo_metro_cubico);
    //  value.valor_capa = stringToFloat(value.valor_capa)
 
     console.log(value);

    const query = await servicoadicionallimpezadecapa.update(value, {
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

  async updateValvule(req, res) {
    const value = req.body;
  
    const query = await valvulaseletoramodelos.update(value, {
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

  
  async addValvule(req, res) {
    const value = req.body;

    const query = await valvulaseletoramodelos.create(value);
    
    let body, error;
    if(query.id > 0) {
      error = 0;
      body = "Informações adicionadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível adicionar as informações. Contate a administração.";
    }

    return res.status(200).json({ error, body, value: query})
  }

  async removeValvule(req, res) {
    const value = req.body;
  
    const query = await valvulaseletoramodelos.destroy({
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
  
}

module.exports = new ProductsController()
