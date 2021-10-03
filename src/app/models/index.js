'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const config = require('../../config/database')
const db = {}

// const sequelize = new Sequelize(config.database, config.username, config.password, config)

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
//     db[model.name] = model
//   })

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db)
//   }
// })

// db.sequelize = sequelize
// db.Sequelize = Sequelize

// module.exports = db

//Extract the database information into an array
const databases = Object.keys(config.databases);

//Loop over the array and create a new Sequelize instance for every database from config.js
for(let i = 0; i < databases.length; ++i) {
  let database = databases[i];
  let dbPath = config.databases[database];
  //Store the database connection in our db object
  db[database] = new Sequelize( dbPath.database, dbPath.username, dbPath.password, dbPath );
}


/**Add the Database Models**/
//Add models from database1 folder
fs
    .readdirSync(__dirname + '/database1')
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach(file => {
       const model = require(path.join(__dirname + '/database1', file))(db.database1, Sequelize.DataTypes)
        // const model = db.database1.import(path.join(__dirname + '/database1', file));
        db[model.name] = model;
    });


// Add models from database2 folder

fs
    .readdirSync(__dirname + '/database2')
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach(file => {
      const model = require(path.join(__dirname + '/database2', file))(db.database2, Sequelize.DataTypes)
        // const model = db.Database2.import(path.join(__dirname + '/database2', file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


module.exports = db;