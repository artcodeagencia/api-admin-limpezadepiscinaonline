module.exports = (sequelize, DataTypes) => {
    const servicoadicionallimpezadecapa = sequelize.define('servicoadicionallimpezadecapa', {
      nome_capa: DataTypes.STRING,
      tamanho_minimo_metro_cubico: DataTypes.INTEGER,
      tamanho_maximo_metro_cubico: DataTypes.INTEGER,
      valor_capa: DataTypes.INTEGER
    });
  
    return servicoadicionallimpezadecapa;
  };
  