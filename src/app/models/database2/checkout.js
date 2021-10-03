module.exports = (sequelize, DataTypes) => {
    const checkout = sequelize.define('checkout', {
      email: DataTypes.STRING,
      whatsapp: DataTypes.STRING,
      area: DataTypes.STRING,
      module: DataTypes.STRING,
      course: DataTypes.STRING,
      user_name: DataTypes.STRING,
      user_cpf: DataTypes.STRING,
      user_cnpj: DataTypes.STRING,
      user_cep: DataTypes.STRING,
      user_cpf: DataTypes.STRING,
      user_street: DataTypes.STRING,
      user_street_number: DataTypes.INTEGER,
      user_district: DataTypes.STRING,
      user_state: DataTypes.STRING,
      user_city: DataTypes.STRING,
      user_district: DataTypes.STRING,
      user_ibge: DataTypes.STRING,
      user_complement: DataTypes.STRING,
      id_fatura_simples: DataTypes.INTEGER,
      payment_module: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      quota: DataTypes.INTEGER,
      lot_name: DataTypes.STRING,
      lot_price: DataTypes.FLOAT,
      participants: DataTypes.INTEGER,
      card_brand: DataTypes.STRING,
      card_number: DataTypes.INTEGER,
      card_name: DataTypes.STRING,
      card_expiry: DataTypes.STRING,
      card_cvc: DataTypes.STRING,
      billing: DataTypes.STRING,
    });
  
    return checkout;
};
  