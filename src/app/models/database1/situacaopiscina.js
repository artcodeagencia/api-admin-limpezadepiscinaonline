module.exports = (sequelize, DataTypes) => {
    const situacaopiscina = sequelize.define('situacaopiscina', {
      condicao: DataTypes.STRING,
      margem_acrescimo: DataTypes.FLOAT
    });
  
    return situacaopiscina;
  };
  