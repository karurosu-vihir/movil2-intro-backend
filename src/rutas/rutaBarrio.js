const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorBarrio = require('../controladores/controladorbarrio');
const modeloBarrio = require('../modelos/direcciones/barrios');
const modeloCiudad = require('../modelos/direcciones/ciudad')
const rutaCiudad = Router();


rutaCiudad.get('/', controladorBarrio.inicio)
rutaCiudad.get('/listar',controladorBarrio.listar)
rutaCiudad.get('/ciudad',
    query("ciudadId").isInt().withMessage("El id de la ciudad debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarciudad = await modeloCiudad.findOne({
                where: {id: value}
            });
            if(!buscarciudad){
                throw new Error('El id del ciudad no existe');
            }
        }
    }),
    controladorBarrio.listarciudadId);

rutaCiudad.post('/guardar',
    body("Nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }}),
    body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    body("ciudadId").isInt().withMessage("El id del ciudad debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarciudad = await modeloCiudad.findOne({
                where: {id: value}
            });
            if(!buscarciudad){
                throw new Error('El id del ciudad no existe');
            }
        }
    }),
    controladorBarrio.guardar)

    rutaCiudad.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarbarrio = await modeloBarrio.findOne({
                    where: {id: value}
                });
                if(!buscarbarrio){
                    throw new Error('El id del barrio no existe');
                };
            };
        }),
        body("Nombre").optional().isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }}),
        body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
        body("ciudadId").optional().isInt().withMessage("El id de la ciudad debe ser un numero entero")
        .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarciudad = await modeloCiudad.findOne({
                where: {id: value}
            });
            if(!buscarciudad){
                throw new Error('El id de la ciudad no existe');
            }
        }
        }),
        controladorBarrio.modificar)

        rutaCiudad.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscarbarrio = await modeloBarrio.findOne({
                        where: {id: value}
                    });
                    if(!buscarbarrio){
                        throw new Error('El id del barrio no existe');
                    };
                };
            }),
            controladorBarrio.eliminar)

module.exports = rutaCiudad;
