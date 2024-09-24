const sequelize = require('sequelize');
const db = require('../../configuraciones/db');

const Clientedireccion = db.define(
    "clientedireccion",//Nombre de la tabla
    {
        descripcion:{
            type: sequelize.TEXT,
            allowNull: false,
        }
    },
    {
        tableName: "clientedirecciones",
    }
);

module.exports = Clientedireccion