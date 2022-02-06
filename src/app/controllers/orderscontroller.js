const { orcamento } = require('../models');
const { clientes } = require('../models');
const { usuarios } = require('../models');
const { checkout } = require('../models');
const { historicostatus } = require('../models');
const { historicoorcamento } = require('../models');
const { Op } = require("sequelize");

const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const axios = require('axios');
const base64 = require('base-64');
var qs = require('qs');
const dateFormat = require("dateformat");

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

function searchDatabase(data) {
  
  let dataOrder = {
      where: {},
      order: [['createdAt', 'DESC']],
      offset: parseInt(data.offset),
      limit:  parseInt(data.limit)
  }

  if(parseInt(data.filterType) > 0) dataOrder.where.id_tipo_atendimento = data.filterType;
  if(parseInt(data.filterStatus) > 0) dataOrder.where.status = data.filterStatus;
  if(parseInt(data.filterDateDefault) > 0){

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

    switch(parseInt(data.filterDateDefault)){
      case 1: array = [today+"T00:00:00-0300", now]; break;
      case 2: array = [yesterday+"T00:00:00-0300", now]; break;
      case 3: array = [day_30+"T00:00:00-0300", now]; break;
      case 4: array = [day_60+"T00:00:00-0300", now]; break;
      case 5: array = [day_90+"T00:00:00-0300", now]; break;
    }

    dataOrder.where.created_at = {
      [Op.between]: array
    };
  } else {
    if(data.filterDate === "true"){
      dataOrder.where.createdAt = {
        [Op.between]: [new Date(data.startDate), new Date(data.endDate)]
      };
    }
  }
  return dataOrder;
}

function ibgeInfo(state){
    let id_state;
    let id_city;
    let string_city;
    switch(state){
      case "AC": id_state = "12"; id_city = "1200401"; string_city = "Rio Branco (AC)"; break;
      case "AL": id_state = "27"; id_city = "2704302"; string_city = "Maceio (AL)"; break;
      case "AP": id_state = "16"; id_city = "1600303"; string_city = "Macapá (AP)"; break;
      case "AM": id_state = "13"; id_city = "1302603"; string_city = "Manaus (AM)"; break;
      case "BA": id_state = "29"; id_city = "2927408"; string_city = "Salvador (BA)"; break;
      case "CE": id_state = "23"; id_city = "2304400"; string_city = "Fortaleza (CE)"; break;
      case "DF": id_state = "53"; id_city = "5300108"; string_city = "Brasília (DF)"; break;
      case "ES": id_state = "32"; id_city = "3205309"; string_city = "Vitória (ES)"; break;
      case "GO": id_state = "52"; id_city = "5208707"; string_city = "Goiânia (GO)"; break;
      case "MA": id_state = "21"; id_city = "2111300"; string_city = "São Luís (MA)"; break;
      case "MT": id_state = "51"; id_city = "5103403"; string_city = "Cuiabá (MT)"; break;
      case "MS": id_state = "50"; id_city = "5002704"; string_city = "Campo Grande (MS)"; break;
      case "MG": id_state = "31"; id_city = "3106200"; string_city = "Belo Horizonte (MG)"; break;
      case "PA": id_state = "15"; id_city = "1501402"; string_city = "Belém (PA)"; break;
      case "PB": id_state = "25"; id_city = "2507507"; string_city = "João Pessoa (PB)"; break;
      case "PR": id_state = "41"; id_city = "4106902"; string_city = "Curitiba (PR)"; break;
      case "PE": id_state = "26"; id_city = "2611606"; string_city = "Recife (PE)"; break;
      case "PI": id_state = "22"; id_city = "2211001"; string_city = "Teresina (PI)"; break;
      case "RJ": id_state = "33"; id_city = "3304557"; string_city = "Rio de Janeiro (RJ)"; break;
      case "RN": id_state = "24"; id_city = "2408102"; string_city = "Natal (RN)"; break;
      case "RS": id_state = "43"; id_city = "4314902"; string_city = "Porto Alegre (RS)"; break;
      case "RO": id_state = "11"; id_city = "1100205"; string_city = "Porto Velho (RO)"; break;
      case "RR": id_state = "14"; id_city = "1400100"; string_city = "Boa Vista (RR)"; break;
      case "SC": id_state = "42"; id_city = "4205407"; string_city = "Florianópolis (SC)"; break;
      case "SP": id_state = "35"; id_city = "3550308"; string_city = "São Paulo (SP)"; break;
      case "SE": id_state = "28"; id_city = "2800308"; string_city = "Aracaju (SE)"; break;
      case "TO": id_state = "17"; id_city = "1721000"; string_city = "Palmas (TO)"; break;
      default: id_state = "0"; id_city = "0"; string_city = "";
  }
  return { id_state, id_city, string_city }
}

class FaturaSimples{
   async newOrder(order){

    let new_client_result;
    // console.log(order);
    
    let user = await clientes.findOne({
      where: {
        id: order.id_cliente
      }
    });

    // new client
      if(user.id_fatura_simples === null) {
        const new_client = await this.newClient(user);
     
        if(!new_client.error){
          user.id_fatura_simples = new_client.body.id;
        } else {
          new_client_result = new_client;
          return new_client_result;
        }
      }

      // new order
      let data;

      // data;
      var date_actual = new Date(order.agendamento_visita);
      
      // Data Agendamento 
      var date_schedule_emission = new Date(order.agendamento_visita);
      date_schedule_emission.setDate(date_schedule_emission.getDate() + parseInt(process.env.TRIAL_PERIOD));

      var date_schedule = new Date(order.agendamento_visita);
      date_schedule.setMonth(date_schedule.getMonth() + 1);

      // Data Única 
      var date_billet = new Date(order.agendamento_visita);
      date_billet.setDate(date_billet.getDate() + parseInt(process.env.DATE_BILLET));


      let same_month;

      var act_m = dateFormat(date_actual, "mm");
      var pos_m = dateFormat(date_schedule, "mm");
      (act_m === pos_m) ? same_month = true : same_month = false;
     

      var servico_recorrente = new Array();
      var servico_servico = new Array();
      var servico_valor  = new Array();
      var servico_qtd = new Array(); 
      var servico_total = new Array();
      
      function service(order){
        
        // Main Service
        var id = -1;
       
        (order.id_tipo_atendimento === 1) ? servico_recorrente[id] = 1 : servico_recorrente[id] = 0;
        servico_valor[id] = order.valor_servico;
        servico_qtd[id] = 1;
        servico_total[id] = (order.valor_servico * 1);
        

        switch(order.id_tipo_atendimento){
          case 1: servico_servico[id] = 2; break;
          case 2: servico_servico[id] = 20; break;
          case 3: servico_servico[id] = 11; break;
          case 4: servico_servico[id] = 13; break;
        }

        // Additional Service
        if(order.taxa_produtos_quimicos > 0){
          id--;
          (order.id_tipo_atendimento === 1) ? servico_recorrente[id] = 1 : servico_recorrente[id] = 0;
          servico_servico[id] = 43;
          servico_valor[id] = order.taxa_produtos_quimicos;
          servico_qtd[id] = 1;
          servico_total[id] = (order.taxa_produtos_quimicos * 1);
        }

        if(order.taxa_limpeza_de_capa > 0){
          id--;
          (order.id_tipo_atendimento === 1) ? servico_recorrente[id] = 1 : servico_recorrente[id] = 0;
          servico_servico[id] = 44;
          servico_valor[id] = order.taxa_limpeza_de_capa;
          servico_qtd[id] = 1;
          servico_total[id] = (order.taxa_limpeza_de_capa * 1);
        }

        if(order.taxa_troca_de_areia > 0){
          id--;
          (order.id_tipo_atendimento === 1) ? servico_recorrente[id] = 1 : servico_recorrente[id] = 0;
          servico_servico[id] = 11;
          servico_valor[id] = order.taxa_troca_de_areia;
          servico_qtd[id] = 1;
          servico_total[id] = (order.taxa_troca_de_areia * 1);
        }

        if(order.taxa_bomba_movel > 0){
          id--;
          (order.id_tipo_atendimento === 1) ? servico_recorrente[id] = 1 : servico_recorrente[id] = 0;
          servico_servico[id] = 45;
          servico_valor[id] = order.taxa_bomba_movel;
          servico_qtd[id] = 1;
          servico_total[id] = (order.taxa_bomba_movel * 1);
        }

        if(order.taxa_troca_de_crepina > 0){
          id--;
          (order.id_tipo_atendimento === 1) ? servico_recorrente[id] = 1 : servico_recorrente[id] = 0;
          servico_servico[id] = 46;
          servico_valor[id] = order.taxa_troca_de_crepina;
          servico_qtd[id] = 1;
          servico_total[id] = (order.taxa_troca_de_crepina * 1);
        }

        // Additional Fee
        if(order.taxa_adicional > 0){
          id--;
          servico_recorrente[id] = 0;
          servico_servico[id] = 76;
          servico_valor[id] = order.taxa_adicional;
          servico_qtd[id] = 1;
          servico_total[id] = (order.taxa_adicional * 1);
        }

      }
      service(order);

      /* ================================ */
   
      if(order.id_tipo_atendimento === 1){
        data = {
          agendamento_data: dateFormat(date_schedule_emission, "yyyy-mm-dd"),
          agendamento: 1,
          agendamento_repetir: 1,
          agendamento_frequencia: 1,
          discriminacao: ((same_month) ? `Período - ${dateFormat(date_schedule, "dd")} de #venda.mesatual até ${dateFormat(date_schedule, "dd")} de #venda.messeguinte\n\nVencimento - #parcela.data_vencimento\n\nLEI 12.741/2012\n\nIMPOSTO INCLUIDO 8,49%` : `Período - ${dateFormat(date_schedule, "dd")} de #venda.mesanterior até ${dateFormat(date_schedule, "dd")} de #venda.mesatual\n\nVencimento - #parcela.data_vencimento\n\nLEI 12.741/2012\n\nIMPOSTO INCLUIDO 8,49%`),
          valor_venda: (order.valor_total + order.taxa_adicional)
        };
      } else {
        data = {
          data: dateFormat(date_actual, "yyyy-mm-dd"),
          agendamento: 0,
          agendamento_repetir: 0,
          agendamento_frequencia: 0,
          discriminacao: "Vencimento - #parcela.data_vencimento \n\nLEI 12.741/2012\n\nIMPOSTO INCLUIDO 8,49%",
          valor_venda: order.valor_total
        };
      }

      /* ================================ */
      if(order.modo_pagamento === 0){
        let expiry_split = order.cartao_expiracao.split("/");
        let expiry = `${expiry_split[1]}${expiry_split[0]}`;
        data['cartao_bandeira'] = order.cartao_bandeira.toLowerCase();
        data['cartao_numero'] = order.cartao_numero.replace(/\s+/g, '');
        data['cartao_validade'] = expiry;
        data['cartao_codigo'] = order.cartao_cvc;
      } else {
        for (let index = 0; index < order.parcelamento; index++) {
        
          if(order.id_tipo_atendimento === 1){

              let date_month_update = new Date(order.agendamento_visita);
              date_month_update.setMonth(date_month_update.getMonth() + (index+1));
              data[`data_vencimento_${(index + 1)}`] = dateFormat(date_month_update, "yyyy-mm-dd");
              data[`valor_${(index + 1)}`] = (order.valor_total + order.taxa_adicional);

          } else {
            
              let date_month_update = new Date(order.agendamento_visita);
              date_month_update.setMonth(date_month_update.getMonth() + index);
              date_month_update.setDate(date_month_update.getDate() + parseInt(process.env.DATE_BILLET));

              data[`data_vencimento_${(index + 1)}`] = dateFormat(date_month_update, "yyyy-mm-dd");
              data[`valor_${(index + 1)}`] = (order.valor_total / order.parcelamento);

          }
        }
      }

      /* IGP-M */
      if(order.id_tipo_atendimento === 1){
        let adjustArray = new Array;
        let igp_m_date = new Date();
        igp_m_date.setFullYear((igp_m_date.getFullYear() + 1));
        adjustArray["proxima_data"] = dateFormat(igp_m_date, "yyyy");
        adjustArray["indice"] = "IGP-M";
        data.reajuste = (adjustArray);
      }

      data.servico_recorrente = servico_recorrente;
      data.servico_servico = servico_servico;
      data.servico_valor = servico_valor;
      data.servico_qtd = servico_qtd;
      data.servico_total = servico_total;
      data.cliente = user.id_fatura_simples;
      data.meio_pagamento = ((parseInt(order.modo_pagamento) === 0) ? "Cartão de Crédito" : "Boleto Bradesco");
      data.parcelas = order.parcelamento;
      data.email_enviar = 1;
      data.email = user.email;
      data.emissao_nfse = 2;
      data.nfse_municipio_emissao = 3550308;
      data.nfse_item_servico = 710;
      data.nfse_optante_simples_nacional = 1;
      data.nfse_incentivador_cultural = 2;
      data.nfse_codigo_tributacao_municipio = "01406";
      data.nfse_inscricao_municipal = "3.563.6335";
      
      /* Preparing to send */
    
      // console.log(data);

      const data_string = qs.stringify(data);
  
      const resultFaturaSimples = await axios.post('https://qualytratus.faturasimples.com.br/api/venda/', data_string, {
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Basic ${base64.encode(process.env.FATURA_SIMPLES_KEY)}`
          }
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          return error;
      });

      if(!resultFaturaSimples.isAxiosError){
      
        const dataOrder = {
          id_fatura_simples: resultFaturaSimples.id
        }
        await orcamento.update(dataOrder, {
          where:{
            id: order.id
          }
        })

        new_client_result = {error: false, title: "Pedido registrado", message: "O status do pedido foi alterado e também foi registrado no Fatura Simples com sucesso.", body: {id_client : user.id_fatura_simples, id_fatura_simples: resultFaturaSimples.id } };
      } else {
        new_client_result = {error: true, title: "Erro ao cadastrar pedido", message: `Não foi possível cadastrar o pedido no fatura simples. Nota Fatura Simples: ${resultFaturaSimples.response.data.mensagem}`}
      }

      return new_client_result;
   }

   async newClient(client){

      let ibge = ibgeInfo(client.estado);
      let new_client_result;

      const data = qs.stringify({
        nome: client.nome,
        email: client.email,
        tipo: 2,
        cpf: client.cpf,
        id_cidade: ibge.id_city,
        cidade: ibge.id_state,
        cep: client.cep,
        endereco: client.endereco,
        bairro: client.bairro,
        numero: client.numero,
        complemento: client.complemento,
        contatos: {
          email: client.email,
          nome: client.nome,
          celular: client.celular,
          principal: true
        }
      });

      const result = await axios.post('https://qualytratus.faturasimples.com.br/api/cliente/', data, {
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Basic ${base64.encode(process.env.FATURA_SIMPLES_KEY)}`
          }
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
      });


      if(result.id > 0) {
        const data = {
          id_fatura_simples: result.id
        }

        await clientes.update(data, {
          where: {
            id: client.id
          }
        })

        new_client_result = {error: false, title: "", message: "", body: {id : result.id} };
      } else {
        new_client_result = {error: true, title: "Erro ao cadastrar usuário", message: "Não foi possível cadastrar o usuário no fatura simples. Por favor, notifique os desenvolvedores."}
      }
  
      return new_client_result;

   }
}

class OrdersController {
  async differentOrderMail(order_id, order_name, order_hash){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS, // generated ethereal password
        },
    });

    const maillist = [
      process.env.MAIL_ADMIN,
      process.env.MAIL_ADMIN_2,
    ];

    let dataSend = {
        from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USER}>`,
        to: maillist,
        subject: `Link de Divergência Gerado`,
        html: `<p style='color: black'><b>O pedido de nº ${order_id} do contratante ${order_name} com divergência, foi aprovado e aceito no sistema com os valores atualizados: ${process.env.APP_DOMAIN}/divergencia-informacao/${order_hash}</b></p>`
    };

    let info = await transporter.sendMail(dataSend);

    if(info.messageId){
        return { message: true}
    } else {
        return { message: false}
    }
  }

  async cancelMail(order_id, order_name, order_email){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS, // generated ethereal password
        },
    });

    const maillist = [
      process.env.MAIL_ADMIN,
      process.env.MAIL_ADMIN_2,
    ];

    let dataSend = {
        from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USER}>`,
        to: maillist,
        subject: `Pedido Cancelado`,
        html: `<p style='color: black'><b style='display:table; width: 100%; text-align:center'>O pedido de nº ${order_id} do cliente ${order_name} foi cancelado no sistema.</b></p>`
    };

    let dataSend2 = {
      from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USER}>`,
      to: order_email,
      subject: `Pedido Cancelado`,
      html: `<p style='color: black'><b style='display:table; width: 100%; text-align:center'>Olá Sr(a) ${order_name}.</b></p><p style='color: black'><b style='display:table; width: 100%; text-align:center'>O seu pedido de nº  ${order_id} foi cancelado no sistema.</b></p>`
  };

    let info = await transporter.sendMail(dataSend);
    let info2 = await transporter.sendMail(dataSend2);

    if(info.messageId && info2.messageId){
        return { message: true}
    } else {
        return { message: false}
    }
  }

  async getOrders(req, res) {
    const {offset, limit} = req.query;
    
    const ordersApp = await orcamento.findAll({
      order: [['createdAt', 'DESC']],
      offset: parseInt(offset),
      limit:  parseInt(limit)
    });
    let data = await orcamento.count();
    const countOrdersApp = Math.ceil(data / limit);

    const clients = await clientes.findAll();

    return res.status(200).json({ ordersApp, countOrdersApp, clients });
  }

  async getOrdersCourses(req, res) {
    const {offset, limit} = req.query;

    const ordersCourses = await checkout.findAll({
        order: [['createdAt', 'DESC']],
        offset: parseInt(offset),
        limit:  parseInt(limit)
    });
    let data = await checkout.count();
    const countCheckout = Math.ceil(data / limit);

    return res.status(200).json({ ordersCourses, countCheckout });
  }

  async getHistoric(req, res) {
    const { id } = req.query;

    const historic_status = await historicostatus.findAll({
        where: {
          id_pedido: id
        },
        order: [['createdAt', 'DESC']]
    });
    
    const historic_order = await historicoorcamento.findAll({
        where: {
          id_pedido: id
        },
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ historic_status, historic_order });
  }

  async updateOrders(req, res) {
    const order = req.body;
 
    let newOrder = { error : false };

    const oldOrder = await orcamento.findOne({
      where: {
        id: order.id
      }
    });

    const query = await orcamento.update(order, {
        where: {
          id: order.id
        }
    });

  
    // Different Information
    let orderHash = "";
    if(order.status === 3 || order.status === 4){
      const hash = randomstring.generate(33);
      orderHash = { hash };
      await orcamento.update(orderHash, {
          where: {
            id: order.id
          }
      });
      
    }

    if(order.status === 4){

      const client = await clientes.findOne({
        where: {
          id: order.id_cliente
        }
      });

      // Send mail
      const OrdersControllerThis = new OrdersController();
      OrdersControllerThis.differentOrderMail(order.id, client.nome, hash);
    }
 

    // Send to Fatura simples if the status is trial
    if(order.status === 5){
      const FaturaSimplesExec = new FaturaSimples();
      newOrder = await FaturaSimplesExec.newOrder(order);
    }


  // Cancel Order
    if(order.status === 7){
        const client = await clientes.findOne({
          where: {
            id: order.id_cliente
          }
        });
      
        const OrdersControllerThis = new OrdersController();
        OrdersControllerThis.cancelMail(order.id, client.nome, client.email);
    }
    

    // Status Update
    let historic_status = null;
    if((order.status !== oldOrder.status) && !newOrder.error){
      await historicostatus.create({
        id_pedido: order.id,
        status: order.status
      });

      historic_status = await historicostatus.findAll({
          where: {
            id_pedido: order.id
          },
          order: [['createdAt', 'DESC']]
      });
      
    }
  

    const response = query[0];
    let body, error;
    if(response) {
      error = 0;
      body = "Informações atualizadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível atualizar as informações. Contate a administração.";
    }
    return res.status(200).json({ error, body, historic_status, newOrder, orderHash});

  }

  async getSearch(req, res) {
    const { string, type, offset, limit, filterType, filterDateDefault, filterDate, startDate, endDate, filterStatus } = req.query;

    var result = new Array();
    var client;

    async function getClient(type){
      let info;
      if(type === "name") {
        info = await clientes.findAll({
            where: {
              nome: {
                [Op.substring]: `${string}`
              }
            }
        });
  
      } else if(type === "email") {
        info = await clientes.findAll({
          where: {
            email: string
          }
        });
      }
      return JSON.parse(JSON.stringify(info));
    }

    if(string !== "") client = await getClient(type);

    var data = {
      offset,
      limit,
      filterType, 
      filterStatus,
      filterDate,
      filterDateDefault,
      startDate,
      endDate
    }

    if(typeof client !== "undefined"){

      await Promise.all(client.map(async (element) => {
      
        var databaseResult = await searchDatabase(data);
        if(string !== "") databaseResult.where.id_cliente = element.id;

        let response = await orcamento.findAll(databaseResult);
       
        response.forEach(element => {
          result.push(JSON.parse(JSON.stringify(element)));
        });
      }));

    } else {
      
      var databaseResult = await searchDatabase(data);
      let response = await orcamento.findAll(databaseResult);
      result = JSON.parse(JSON.stringify(response));

    }
  
    const count = Math.ceil(result.length / limit);
 
    return res.status(200).json({ result, count });
  }

  async getSearchCourses(req, res) {
    const { string, type, offset, limit, filterModule, filterCourse, filterDateDefault, filterDate, startDate, endDate, filterStatus } = req.query;
    
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
    if(parseInt(filterStatus) > 0) dataOrder.where.status = filterStatus;


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

    const result = await checkout.findAll(dataOrder);


    const count = Math.ceil(result.length / limit);
 
    return res.status(200).json({ result, count });
  }

  async deleteOrders(req, res){
    const order = req.body;

    const orderDestroy = await orcamento.destroy({
      where: {
        id: order.id
      }
    });
    
    let error;
    if(orderDestroy) {
      error = false;
    } else {
      error = true;
    }
    return res.status(200).json({ error });
  }

  async deleteUsers(req, res){
    const data = req.body;

    await usuarios.destroy({
      where: {
        id_cliente: data.id
      }
    });

    await orcamento.destroy({
      where: {
        id_cliente: data.id
      }
    });

    const clientDestroy = await clientes.destroy({
      where: {
        id: data.id
      }
    });
    
    let error;
    if(clientDestroy) {
      error = false;
    } else {
      error = true;
    }
    return res.status(200).json({ error });
  }
}

module.exports = new OrdersController()
