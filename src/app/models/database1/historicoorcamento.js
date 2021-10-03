module.exports = (sequelize, DataTypes) => {
    const historicoorcamento = sequelize.define('historicoorcamento', {
      idCliente: DataTypes.INTEGER,
      id_tipo_atendimento: DataTypes.INTEGER,
      modo_pagamento: DataTypes.INTEGER,
      volume_litros: DataTypes.INTEGER,
      areia: DataTypes.INTEGER,
      fabricante: DataTypes.INTEGER,
      modelo: DataTypes.INTEGER,
      cep: DataTypes.STRING,
      primeira_visita: DataTypes.INTEGER,
      segunda_visita: DataTypes.INTEGER,
      agendamento_visita: DataTypes.STRING,
      situacao_piscina: DataTypes.INTEGER,
      taxa_adicional: DataTypes.FLOAT,
      parcelamento: DataTypes.INTEGER,
      distancia: DataTypes.INTEGER,
      valor_total: DataTypes.FLOAT,
      valor_servico: DataTypes.FLOAT,
      taxa_produtos_quimicos: DataTypes.FLOAT,
      taxa_limpeza_de_capa: DataTypes.FLOAT,
      taxa_troca_de_areia: DataTypes.FLOAT,
      taxa_bomba_movel: DataTypes.FLOAT,
      taxa_troca_de_crepina: DataTypes.FLOAT,
      status: DataTypes.INTEGER,
      hash: DataTypes.STRING,
      id_fatura_simples: DataTypes.INTEGER,
      cartao_numero: DataTypes.STRING,
      cartao_nome: DataTypes.STRING,
      cartao_cvc: DataTypes.INTEGER,
      cartao_expiracao: DataTypes.STRING,
      cartao_bandeira: DataTypes.STRING,
    });
  
    return historicoorcamento;
  };
  