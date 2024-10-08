const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorCargo = require('../controladores/controladorcargo');
const modeloCargo = require('../modelos/cargo');
const { where } = require('sequelize');
const rutaCargo = Router();


rutaCargo.get('/', controladorCargo.inicio)
rutaCargo.get('/listar',controladorCargo.listar)
rutaCargo.post('/guardar',
    body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }
        else{
            const buscarCargo = await modeloCargo.findOne({
                where: {nombre: value}
            });
            if(buscarCargo){
                throw new Error('No pueden haber nombres de cargo repetido')
            };
        };
    }),
    controladorCargo.guardar)

    rutaCargo.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarCargo = await modeloCargo.findOne({
                    where: {id: value}
                });
                if(!buscarCargo){
                    throw new Error('El id del cargo no existe');
                };
            };
        }),
        body("nombre").optional().isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }
            else{
                const buscarCargo = await modeloCargo.findOne({
                    where: {nombre: value}
                });
                if(buscarCargo){
                    throw new Error('No pueden haber nombres de cargo repetido')
                };
            };
        }),
        body("activo").optional().isBoolean().withMessage("Tiene que ser verdadero o falso en booleano"),
        controladorCargo.modificar)

        rutaCargo.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscarCargo = await modeloCargo.findOne({
                        where: {id: value}
                    });
                    if(!buscarCargo){
                        throw new Error('El id del cargo no existe');
                    };
                };
            }),
            controladorCargo.eliminar)

module.exports = rutaCargo;
