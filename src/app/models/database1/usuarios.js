module.exports = (sequelize, DataTypes) => {
    const usuarios = sequelize.define('usuarios', {
      id_cliente: DataTypes.INTEGER,
      email: DataTypes.STRING,
      senha_hash: DataTypes.STRING,
      nivel: DataTypes.INTEGER,
      forgot_password: DataTypes.STRING
    });
  
    return usuarios;
  };
  