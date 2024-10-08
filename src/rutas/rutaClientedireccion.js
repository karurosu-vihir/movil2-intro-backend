const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorClientedireccion = require('../controladores/controladorclientedireccion');
const modeloClienteDireccion = require('../modelos/direcciones/clientedireccion');
const modeloBarrio = require('../modelos/direcciones/barrios')
const rutaClientedireccion = Router();


rutaClientedireccion.get('/', controladorClientedireccion.inicio)
rutaClientedireccion.get('/listar',controladorClientedireccion.listar)
rutaClientedireccion.get('/barrio',
    query("barrioId").isInt().withMessage("El id del barrio debe ser un numero entero")
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
            }
        }
    }),
    controladorClientedireccion.listarbarrioId);

rutaClientedireccion.post('/guardar',
    body("descripcion").isLength({min: 7}).withMessage("El limite de caracteres es minimo de 7")
    .custom(async value =>{
        if(!value){
            throw new Error('La descripcion no permite nulos')
        }}),
    body("barrioId").isInt().withMessage("El id del barrio debe ser un numero entero")
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
            }
        }
    }),
    controladorClientedireccion.guardar)

    rutaClientedireccion.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscardireccion = await modeloClienteDireccion.findOne({
                    where: {id: value}
                });
                if(!buscardireccion){
                    throw new Error('El id de la direccion no existe');
                };
            };
        }),
        body("descripcion").optional().isLength({min: 7}).withMessage("El limite de caracteres de minimo 7")
        .custom(async value =>{
            if(!value){
                throw new Error('La descripcion no permite nulos')
            }}),
        body("barrioId").optional().isInt().withMessage("El id de la barrio debe ser un numero entero")
        .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarbarrio = await modeloBarrio.findOne({
                where: {id: value}
            });
            if(!buscarbarrio){
                throw new Error('El id de la barrio no existe');
            }
        }
        }),
        controladorClientedireccion.modificar)

        rutaClientedireccion.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscardireccion = await modeloClienteDireccion.findOne({
                        where: {id: value}
                    });
                    if(!buscardireccion){
                        throw new Error('El id de la direccion no existe');
                    };
                };
            }),
            controladorClientedireccion.eliminar)

module.exports = rutaClientedireccion;
