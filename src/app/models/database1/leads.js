module.exports = (sequelize, DataTypes) => {
    const leads = sequelize.define('leads', {
      email: DataTypes.STRING,
      celular: DataTypes.STRING,
      cep: DataTypes.STRING,
      bairro: DataTypes.STRING,
      endereco: DataTypes.STRING,
      distancia: DataTypes.FLOAT,
      valor_total: DataTypes.FLOAT,
      volume_litros: DataTypes.FLOAT,
      areia: DataTypes.INTEGER,
      modelo: DataTypes.INTEGER,
      situacao_piscina: DataTypes.INTEGER,
      primeira_visita: DataTypes.INTEGER,
      segunda_visita: DataTypes.INTEGER,
      taxa_servico: DataTypes.FLOAT,
      taxa_adicional: DataTypes.FLOAT,
      taxa_produtos_quimicos: DataTypes.FLOAT,
      taxa_limpeza_de_capa: DataTypes.FLOAT,
      taxa_troca_de_areia: DataTypes.FLOAT,
      taxa_bomba_movel: DataTypes.FLOAT,
      taxa_troca_de_crepina: DataTypes.FLOAT,
      id_tipo_atendimento: DataTypes.INTEGER,
      ip: DataTypes.STRING,
    });
  
    return leads;
  };
  