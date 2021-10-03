module.exports = (sequelize, DataTypes) => {
    const funcionarios = sequelize.define('funcionarios', {
      nome: DataTypes.STRING,
      salario: DataTypes.FLOAT,
      vale_refeicao: DataTypes.FLOAT,
      vale_alimentacao: DataTypes.FLOAT,
      vale_transporte: DataTypes.FLOAT,
      periculosidade: DataTypes.FLOAT,
      decimo_terceiro: DataTypes.FLOAT,
      ferias: DataTypes.FLOAT,
      fgts: DataTypes.FLOAT,
      calculo: DataTypes.INTEGER,
    });
  
    return funcionarios;
  };
  