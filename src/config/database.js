require('dotenv').config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env'
})

module.exports = {
 "databases" : {
    "database1": {
      host: process.env.DB_HOST1,
      username: process.env.DB_USER1,
      password: process.env.DB_PASS1,
      database: process.env.DB_NAME1,
      dialect: process.env.DB_DIALECT1 || 'mysql',
      storage: './__tests__/database.sqlite',
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        freezeTableName: true
      },
      dialectOptions: {
        dateStrings: true,
        typeCast: function (field, next) { // for reading from database
          if (field.type === 'DATETIME') {
            return field.string()
          }
            return next()
          },
      },
      timezone: '-03:00',
   },
   "database2": {
    host: process.env.DB_HOST2,
    username: process.env.DB_USER2,
    password: process.env.DB_PASS2,
    database: process.env.DB_NAME2,
    dialect: process.env.DB_DIALECT2 || 'mysql',
    storage: './__tests__/database.sqlite',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
      freezeTableName: true
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
          return next()
        },
    },
    timezone: '-03:00',
 }
 }
}
