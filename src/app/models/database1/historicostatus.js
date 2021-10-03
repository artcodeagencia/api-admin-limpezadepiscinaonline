module.exports = (sequelize, DataTypes) => {
    const historicostatus = sequelize.define('historicostatus', {
      id_pedido: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    });
  
    return historicostatus;
  };
  