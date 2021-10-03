module.exports = (sequelize, DataTypes) => {
    const valvulaseletoramodelos = sequelize.define('valvulaseletoramodelos', {
      modelo: DataTypes.STRING,
      fabricante: DataTypes.INTEGER,
      quantidade_areia: DataTypes.INTEGER,
      valor_filtro: DataTypes.FLOAT
    });
  
    return valvulaseletoramodelos;
  };
  