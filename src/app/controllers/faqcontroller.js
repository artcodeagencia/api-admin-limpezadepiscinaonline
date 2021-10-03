const { faq } = require('../models');

class FaqController {
  async get(req, res) {
    const faqconst = await faq.findAll();
    return res.status(200).json({ body: faqconst });
  }
  async update(req, res) {
    const value = req.body;
    const query = await faq.update(value, {
      where: {
        id: value.id
      }
    });
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
  async order(req, res) {
    const value = req.body;

    var i = 0;
    value.list.forEach(element => {
        value.itemsOrder[i].id = element.id;
        i++;
    });

    const oldQuery = value.itemsOrder.map(async (element) => 
      await faq.destroy({
        where: {
          id: element.id
        }
      })
    );

    const newQuery = value.itemsOrder.map(async (element) => await faq.create(element));

    await Promise.all(oldQuery);
    await Promise.all(newQuery);

    const response = newQuery;
    let body, error;
    if(response) {
      error = 0;
      body = "Informações atualizadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível atualizar as informações. Contate a administração.";
    }
    return res.status(200).json({ error, body, value: value.itemsOrder})
  }
  async add(req, res){
    const value = req.body;
  
    const query = await faq.create(value);

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
  async remove(req, res){
    const value = req.body;
  
    const query = await faq.destroy({
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

module.exports = new FaqController()
