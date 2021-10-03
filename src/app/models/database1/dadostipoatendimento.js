module.exports = (sequelize, DataTypes) => {
    const dadostipoatendimento = sequelize.define('dadostipoatendimento', {
      tempo_atendimento: DataTypes.FLOAT,
      volume: DataTypes.INTEGER,
      margem: DataTypes.FLOAT,
      id_tipo_atendimento:DataTypes.INTEGER,
    });
  
    return dadostipoatendimento;
  };
  