module.exports = (sequelize, DataTypes) => {
    const faq = sequelize.define('faq', {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      category: DataTypes.INTEGER,
      highlight: DataTypes.INTEGER,
      fixed: DataTypes.INTEGER,
      show_faq_page: DataTypes.INTEGER,
    });
  
    return faq;
  };
  