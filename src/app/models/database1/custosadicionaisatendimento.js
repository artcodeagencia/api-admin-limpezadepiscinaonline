module.exports = (sequelize, DataTypes) => {
    const custosadicionaisatendimento = sequelize.define('custosadicionaisatendimento', {
      id_tipo_atendimento: DataTypes.INTEGER,
      distancia: DataTypes.INTEGER,
      percentual: DataTypes.INTEGER
    });
  
    return custosadicionaisatendimento;
  };
  