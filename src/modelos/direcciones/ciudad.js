const sequelize = require('sequelize');
const db = require('../../configuraciones/db');

const Ciudad = db.define(
    "ciudad",//Nombre de la tabla
    {
        Nombre:{
            type: sequelize.STRING(50),
            allowNull: false,
        },
        estado:{
            type: sequelize.ENUM('AC','IN','BL'),
            allowNull: true,
            defaultValue: 'AC'
        }
    },
    {
        tableName: "ciudades",
    }
);

module.exports = Ciudad