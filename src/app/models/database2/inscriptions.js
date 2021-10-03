module.exports = (sequelize, DataTypes) => {
    const inscriptions = sequelize.define('inscriptions', {
      email: DataTypes.STRING,
      whatsapp: DataTypes.STRING,
      area: DataTypes.STRING,
      module: DataTypes.STRING,
      course: DataTypes.STRING
    });
  
    return inscriptions;
  };
  