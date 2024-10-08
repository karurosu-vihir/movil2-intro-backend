const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorDepartamento = require('../controladores/controladordepartamento');
const modeloDepartamento = require('../modelos/direcciones/departamento');
const rutaDepartamento = Router();


rutaDepartamento.get('/', controladorDepartamento.inicio)
rutaDepartamento.get('/listar',controladorDepartamento.listar)
rutaDepartamento.post('/guardar',
    body("Nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }}),
    body("Codigo").isLength({min: 2, max: 2}).withMessage("Escriba dos numeros si el departamento solo tiene un numero comience con un 0. Ej: 04")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }}),
    body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    controladorDepartamento.guardar)

    rutaDepartamento.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarDepartamento = await modeloDepartamento.findOne({
                    where: {id: value}
                });
                if(!buscarDepartamento){
                    throw new Error('El id del departamento no existe');
                };
            };
        }),
        body("Nombre").optional().isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }}),
        body("Codigo").optional().isLength({min: 2, max: 2}).withMessage("Escriba dos numeros si el departamento solo tiene un numero comience con un 0. Ej: 04")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }}),
        body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
        controladorDepartamento.modificar)

        rutaDepartamento.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscarDepartamento = await modeloDepartamento.findOne({
                        where: {id: value}
                    });
                    if(!buscarDepartamento){
                        throw new Error('El id del departamento no existe');
                    };
                };
            }),
            controladorDepartamento.eliminar)

module.exports = rutaDepartamento;
