module.exports = (sequelize, DataTypes) => {
    const clientes = sequelize.define('clientes', {
      nome: DataTypes.STRING,
      cpf: DataTypes.STRING,
      cep: DataTypes.STRING,
      endereco: DataTypes.STRING,
      bairro: DataTypes.STRING,
      cidade: DataTypes.STRING,
      estado: DataTypes.STRING,
      distancia: DataTypes.INTEGER,
      email: DataTypes.STRING,
      celular: DataTypes.STRING,
      numero: DataTypes.INTEGER,
      complemento: DataTypes.STRING,
      id_fatura_simples: DataTypes.INTEGER
    });
  
    return clientes;
  };
  