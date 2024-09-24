const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Cargo = db.define(
    "Cargo",//Nombre de la tabla
    {
        nombre:{
            type: sequelize.STRING(50),
            allowNull: false,
            unique:{
            args: true,
            msg: "Ya existe este nombre"  
            }
        },
        descripcion:{
            type: sequelize.TEXT,
            allowNull: true,
        },
        activo:{
            type: sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        }
    },
    {
        tableName: "cargos",
    }
);

module.exports = Cargo