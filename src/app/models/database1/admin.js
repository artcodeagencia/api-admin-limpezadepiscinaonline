const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define('admin', {
    usuario: DataTypes.STRING,
    senha: DataTypes.VIRTUAL,
    senha_hash: DataTypes.STRING,
  }, {
    hooks: {
      beforeSave: async (adminquery) => {
        if (adminquery.senha) {
          adminquery.senha_hash = await bcrypt.hash(adminquery.senha, 9);
        }
      },
    },
  });

  admin.prototype.checkPassword = function (senha) {
    return bcrypt.compare(senha, this.senha_hash);
  };

  admin.prototype.generateToken = function () {
    return jwt.sign({ id: this.id }, process.env.APP_SECRET);
  };

  return admin;
};
