module.exports = (sequelize, DataTypes) => {
    const courses = sequelize.define('courses', {
      module: DataTypes.STRING,
      course: DataTypes.STRING,
      color: DataTypes.STRING,
      value: DataTypes.FLOAT,
      lot: DataTypes.INTEGER,
      date: DataTypes.DATE,
      quantity: DataTypes.INTEGER,
    });
  
    return courses;
  };
  