module.exports = (sequelize, DataTypes) => {
    const quantidadeprodutoservico = sequelize.define('quantidadeprodutoservico', {
      id_produto: DataTypes.INTEGER,
      id_tipo_atendimento: DataTypes.INTEGER,
      quantidade_metro_cubico: DataTypes.INTEGER,
      id_unidade_medida: DataTypes.INTEGER,
    });
  
    return quantidadeprodutoservico;
  };
  