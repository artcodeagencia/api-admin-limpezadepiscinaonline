module.exports = (sequelize, DataTypes) => {
    const valvulaseletorafabricantes = sequelize.define('valvulaseletorafabricantes', {
      nome: DataTypes.STRING
    });
  
    return valvulaseletorafabricantes;
  };
  