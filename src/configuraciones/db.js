const sequelize = require('sequelize');
const db = new sequelize(
    "movil2",//Nombre de la base de datos
    "root",//usuario de la base de datos
    "",//password de la db 
    {
        host: "localhost",
        dialect: "mysql",
        port: 3306,
    }
);

module.exports = db;
