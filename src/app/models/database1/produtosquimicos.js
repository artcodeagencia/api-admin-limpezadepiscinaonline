module.exports = (sequelize, DataTypes) => {
    const produtosquimicos = sequelize.define('produtosquimicos', {
      nome: DataTypes.STRING,
      descricao: DataTypes.STRING,
      quantidade_medida: DataTypes.INTEGER,
      id_unidade_medida: DataTypes.INTEGER,
      valor_compra: DataTypes.FLOAT,
      estoque: DataTypes.INTEGER,
    });
  
    return produtosquimicos;
  };
  