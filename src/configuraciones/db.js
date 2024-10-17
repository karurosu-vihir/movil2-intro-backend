const sequelize = require('sequelize');
const db = new sequelize(
    process.env.db,//Nombre de la base de datos
    process.env.USER,//usuario de la base de datos
    process.env.PW,//password de la db 
    {
        host: "localhost",
        dialect: "mysql",
        port: 3306,
    }
);

module.exports = db;
