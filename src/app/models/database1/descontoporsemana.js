module.exports = (sequelize, DataTypes) => {
    const descontoporsemana = sequelize.define('descontoporsemana', {
      dia_da_semana: DataTypes.STRING,
      desconto_margem: DataTypes.FLOAT
    });
  
    return descontoporsemana;
  };
  