const { leads } = require('../models');
const { inscriptions } = require('../models');
const { valvulaseletoramodelos } = require('../models');
const { Op } = require("sequelize");
const dateFormat = require("dateformat");

class BudgetsController {

  async getBudgets(req, res) {
    const {offset, limit} = req.query;
    
    const budgets = await leads.findAll({
      order: [['createdAt', 'DESC']],
      offset: parseInt(offset),
      limit:  parseInt(limit)
    });

    const models = await valvulaseletoramodelos.findAll();

    let data = await leads.count();
    const count = Math.ceil(data / limit);

    return res.status(200).json({ budgets, count, models });
  }

  async getInscriptions(req, res) {
    const {offset, limit} = req.query;

    const budgets = await inscriptions.findAll({
      order: [['createdAt', 'DESC']],
      offset: parseInt(offset),
      limit:  parseInt(limit)
    });

    const select = await inscriptions.count();
    const count = Math.ceil(select / limit);

    return res.status(200).json({ budgets, count });
  }

  
  async getSearchBudgets(req, res){
    const { string, type, offset, limit, filterType, filterDateDefault, filterDate, startDate, endDate } = req.query;
    var result = new Array();

    let info;
    if(type === "email") {

      let dataOrder = {
          where: {},
          order: [['createdAt', 'DESC']],
          offset: parseInt(offset),
          limit:  parseInt(limit)
      }

      if(string !== "") dataOrder.where.email = string;
      if(parseInt(filterType) > 0) dataOrder.where.id_tipo_atendimento = filterType;
      
      if(parseInt(filterDateDefault) > 0){

        let array;
        let date_structure;
        date_structure = new Date();
        let date_today = date_structure.setDate(date_structure.getDate());
        date_structure = new Date();
        let date_yesterday = date_structure.setDate(date_structure.getDate() - 1);
        date_structure = new Date();
        let date_30_days = date_structure.setDate(date_structure.getDate() - 30);
        date_structure = new Date();
        let date_60_days = date_structure.setDate(date_structure.getDate() - 60);
        date_structure = new Date();
        let date_90_days = date_structure.setDate(date_structure.getDate() - 90);
  
        const now = dateFormat(date_today, "isoDateTime");
        const today = dateFormat(date_today, "yyyy-mm-dd");
        const yesterday = dateFormat(date_yesterday, "yyyy-mm-dd");
        const day_30 = dateFormat(date_30_days, "yyyy-mm-dd");
        const day_60 = dateFormat(date_60_days, "yyyy-mm-dd");
        const day_90 = dateFormat(date_90_days, "yyyy-mm-dd");
  
        switch(parseInt(filterDateDefault)){
          case 1: array = [today+"T00:00:00-0300", now]; break;
          case 2: array = [yesterday+"T00:00:00-0300", now]; break;
          case 3: array = [day_30+"T00:00:00-0300", now]; break;
          case 4: array = [day_60+"T00:00:00-0300", now]; break;
          case 5: array = [day_90+"T00:00:00-0300", now]; break;
        }
        
        dataOrder.where.createdAt = {
          [Op.between]: array
        };
      } else {
        if(filterDate === "true"){
          dataOrder.where.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          };
        }
      }
  
      info = await leads.findAll(dataOrder);
    }


    result = JSON.parse(JSON.stringify(info));
  
    const count = Math.ceil(result.length / limit);
 
    return res.status(200).json({ result, count });
  }

  async getSearchBudgetsCourses(req, res) {
    const { string, type, offset, limit, filterModule, filterCourse, filterDateDefault, filterDate, startDate, endDate } = req.query;

    // Convert
    let module, course;
    switch(parseInt(filterModule)){
      case 1: module = "basic"; break;
      case 2: module = "master"; break;
    }

    switch(parseInt(filterCourse)){
      case 1: course = "presencial"; break;
      case 2: course = "in-company"; break;
      case 3: course = "on-line"; break;
    }

    let dataOrder = {
        where: {},
        order: [['createdAt', 'DESC']],
        offset: parseInt(offset),
        limit:  parseInt(limit)
    }

    if(parseInt(filterModule) > 0) dataOrder.where.module = module;
    if(parseInt(filterCourse) > 0) dataOrder.where.course = course;

    if(parseInt(filterDateDefault) > 0){

      let array;
      let date_structure;
      date_structure = new Date();
      let date_today = date_structure.setDate(date_structure.getDate());
      date_structure = new Date();
      let date_yesterday = date_structure.setDate(date_structure.getDate() - 1);
      date_structure = new Date();
      let date_30_days = date_structure.setDate(date_structure.getDate() - 30);
      date_structure = new Date();
      let date_60_days = date_structure.setDate(date_structure.getDate() - 60);
      date_structure = new Date();
      let date_90_days = date_structure.setDate(date_structure.getDate() - 90);

      const now = dateFormat(date_today, "isoDateTime");
      const today = dateFormat(date_today, "yyyy-mm-dd");
      const yesterday = dateFormat(date_yesterday, "yyyy-mm-dd");
      const day_30 = dateFormat(date_30_days, "yyyy-mm-dd");
      const day_60 = dateFormat(date_60_days, "yyyy-mm-dd");
      const day_90 = dateFormat(date_90_days, "yyyy-mm-dd");

      switch(parseInt(filterDateDefault)){
        case 1: array = [today+"T00:00:00-0300", now]; break;
        case 2: array = [yesterday+"T00:00:00-0300", now]; break;
        case 3: array = [day_30+"T00:00:00-0300", now]; break;
        case 4: array = [day_60+"T00:00:00-0300", now]; break;
        case 5: array = [day_90+"T00:00:00-0300", now]; break;
      }

      dataOrder.where.createdAt = {
        [Op.between]: array
      };
    } else {
      if(filterDate === "true"){
        dataOrder.where.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
    }

    if(string !== ""){
      (type === "name") ? dataOrder.where.user_name = { [Op.substring] : string } : dataOrder.where.email = { [Op.substring] : string };
    }

    const result = await inscriptions.findAll(dataOrder);

    const count = Math.ceil(result.length / limit);
 
    return res.status(200).json({ result, count });
  }

}

module.exports = new BudgetsController()
