require('rootpath')()

const fs = require('fs')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'local'
const config = require('config.json')[env]
const db = {}

let sequelize;
sequelize = new Sequelize(config.connectionString, { native_parser: true })

fs
    .readdirSync(__dirname)
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file.indexOf('index.js') !== 0) &&
        (file.slice(-3) === '.js'))
    .forEach(file => {
        const filename = __dirname + '/' + file
        console.log("Loading model from file: " + filename)
        const model = sequelize.import(filename);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// force: true when you need to recreate all tables
sequelize.sync({force: false}).then(function () {
})

db.sequelize = sequelize
module.exports = db