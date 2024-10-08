const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorMunicipio = require('../controladores/controladormunicipio');
const modeloMunicipio = require('../modelos/direcciones/municipios');
const modeloDepartamento = require('../modelos/direcciones/departamento')
const rutaMunicipio = Router();


rutaMunicipio.get('/', controladorMunicipio.inicio)
rutaMunicipio.get('/listar',controladorMunicipio.listar)
rutaMunicipio.get('/departamento',
    query("departamentoId").isInt().withMessage("El id del departamento debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscardepartamento = await modeloDepartamento.findOne({
                where: {id: value}
            });
            if(!buscardepartamento){
                throw new Error('El id del departamento no existe');
            }
        }
    }),
    controladorMunicipio.listardepartamentoid);

rutaMunicipio.post('/guardar',
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
    body("departamentoId").isInt().withMessage("El id del departamento debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscardepartamento = await modeloDepartamento.findOne({
                where: {id: value}
            });
            if(!buscardepartamento){
                throw new Error('El id del departamento no existe');
            }
        }
    }),
    controladorMunicipio.guardar)

    rutaMunicipio.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarMunicipio = await modeloMunicipio.findOne({
                    where: {id: value}
                });
                if(!buscarMunicipio){
                    throw new Error('El id del municipio no existe');
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
        body("departamentoId").optional().isInt().withMessage("El id del departamento debe ser un numero entero")
        .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscardepartamento = await modeloDepartamento.findOne({
                where: {id: value}
            });
            if(!buscardepartamento){
                throw new Error('El id del departamento no existe');
            }
        }
        }),
        controladorMunicipio.modificar)

        rutaMunicipio.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscarMunicipio = await modeloMunicipio.findOne({
                        where: {id: value}
                    });
                    if(!buscarMunicipio){
                        throw new Error('El id del Municipio no existe');
                    };
                };
            }),
            controladorMunicipio.eliminar)

module.exports = rutaMunicipio;
