const sequelize = require('sequelize');
const db = require('../../configuraciones/db');

const Municipio = db.define(
    "municipio",//Nombre de la tabla
    {
        Nombre:{
            type: sequelize.STRING(50),
            allowNull: false,
        },
        Codigo:{
            type: sequelize.STRING(3),
            allowNull: false,
        },
        estado:{
            type: sequelize.ENUM('AC','IN','BL'),
            allowNull: true,
            defaultValue: 'AC'
        }
    },
    {
        tableName: "municipios",
    }
);

module.exports = Municipio