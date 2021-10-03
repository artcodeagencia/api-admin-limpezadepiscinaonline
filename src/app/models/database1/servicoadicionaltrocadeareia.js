module.exports = (sequelize, DataTypes) => {
    const servicoadicionaltrocadeareia = sequelize.define('servicoadicionaltrocadeareia', {
      minimo_metros_cubicos: DataTypes.INTEGER,
      maximo_metros_cubicos: DataTypes.INTEGER,
      quantidade_areia: DataTypes.INTEGER
    });
  
    return servicoadicionaltrocadeareia;
  };
  