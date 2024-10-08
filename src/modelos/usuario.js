const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Usuario = db.define(
    "usuario",//Nombre de la tabla
    {
        nombre:{
            type: sequelize.STRING(50),
            allowNull: false,
        },
        password:{
            type: sequelize.STRING(100),
            allowNull: false,
        },
        correo:{
            type: sequelize.STRING(100),
            allowNull: false,
            unique:{
                args: true,
                msg: "Ya existe este correo"  
            }
        },
        tipo_usuario:{
            type: sequelize.ENUM('cliente','empleado'),
            allowNull: true,
            defaultValue: 'cliente'
        },
        estado:{
            type: sequelize.ENUM('AC','IN','BL'),
            allowNull: true,
            defaultValue: 'AC'
        }
    },
    {
        tableName: "usuario",
    }
);

module.exports = Usuario