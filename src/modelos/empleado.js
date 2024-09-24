const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Empleado = db.define(
    "empleado",//Nombre de la tabla
    {
        identidad:{
            type: sequelize.STRING(20),
            allowNull: false,
            unique:{
                args: true,
                msg: "Ya existe esta identidad"  
            }
        },
        primerNombre:{
            type: sequelize.STRING(50),
            allowNull: false,
        },
        segundoNombre:{
            type: sequelize.STRING(50),
            allowNull: true,
        },
        primerApellido:{
            type: sequelize.STRING(50),
            allowNull: false,
        },
        segundoApellido:{
            type: sequelize.STRING(50),
            allowNull: true,
        },
        sueldo:{
            type: sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        imagen:{
            type: sequelize.STRING(250),
            allowNull: true,
        },
        estado:{
            type: sequelize.ENUM('AC','IN','BL'),
            allowNull: true,
            defaultValue: 'AC'
        }
    },
    {
        tableName: "empleados",
    }
);

module.exports = Empleado