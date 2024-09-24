const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Telefono = db.define(
    "telefono",//Nombre de la tabla
    {
        nombre:{
            type: sequelize.STRING(8),
            allowNull: true,
            defaultValue: 0
        },
        estado:{
            type: sequelize.ENUM('AC','IN','BL'),
            allowNull: true,
            defaultValue: 'AC'
        }
    },
    {
        tableName: "telefonos",
    }
);

module.exports = Telefono