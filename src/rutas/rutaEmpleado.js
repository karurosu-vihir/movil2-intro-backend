const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorEmpleado = require('../controladores/controladorempleado');
const modeloEmpleado = require('../modelos/empleado');
const modeloCargo = require('../modelos/cargo')
const modeloUsuario = require('../modelos/usuario')
const rutaEmpleado = Router();


rutaEmpleado.get('/', controladorEmpleado.inicio)
rutaEmpleado.get('/listar',controladorEmpleado.listar)

rutaEmpleado.post('/guardar',
    body("identidad").isLength({min: 13, max: 13}).withMessage("Identidad de 13 digitos")
    .custom(async value =>{
        if(!value){
            throw new Error('La identidad no permite nulos')
        }})
    .custom(async value =>{
            if(/^\d{8}$/.test(value)){
                throw new Error('La identidad son 13 numeros')
            }}),     
    body("primerNombre").isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }}),
    body("segundoNombre").optional().isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50"),
    body("primerApellido").isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El apellido no permite nulos')
        }}),
    body("segundoApellido").optional().isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50"),
    body("sueldo").optional().isDecimal().withMessage("El sueldo debe ser un numero decimal")
    .custom(async value =>{
        if(/^\d+(\.\d{1,2})?$/.test(value)){
            throw new Error('El sueldo tiene que ser positivo y puede tener hasta dos posiciones decimales')
        }}),
    body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    body("clientedireccionId").isInt().withMessage("El id de la direccion debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscardireccion = await modeloDireccion.findOne({
                where: {id: value}
            });
            if(!buscardireccion){
                throw new Error('El id de la direccion no existe');
            }
        }
    }),
    body("cargoId").isInt().withMessage("El id del cargo debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarcargo = await modeloCargo.findOne({
                where: {id: value}
            });
            if(!buscarcargo){
                throw new Error('El id del cargo no existe');
            }
        }
    }),
    body("usuarioId").isInt().withMessage("El id del usuario debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarusuario = await modeloUsuario.findOne({
                where: {id: value}
            });
            if(!buscarusuario){
                throw new Error('El id del usuario no existe');
            }
        }
    }),
    controladorEmpleado.guardar)

    rutaEmpleado.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarMunicipio = await modeloEmpleado.findOne({
                    where: {id: value}
                });
                if(!buscarMunicipio){
                    throw new Error('El id del municipio no existe');
                };
            };
        }),
        body("identidad").optional().isLength({min: 13, max: 13}).withMessage("Identidad de 13 digitos")
    .custom(async value =>{
        if(!value){
            throw new Error('La identidad no permite nulos')
        }})
    .custom(async value =>{
            if(/^\d{8}$/.test(value)){
                throw new Error('La identidad son 13 numeros')
            }}),     
    body("primerNombre").optional().isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }}),
    body("segundoNombre").optional().isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50"),
    body("primerApellido").optional().isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El apellido no permite nulos')
        }}),
    body("segundoApellido").optional().isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50"),
    body("sueldo").optional().isDecimal().withMessage("El sueldo debe ser un numero decimal")
    .custom(async value =>{
        if(/^\d+(\.\d{1,2})?$/.test(value)){
            throw new Error('El sueldo tiene que ser positivo y puede tener hasta dos posiciones decimales')
        }}),
    body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    body("cargoId").optional().isInt().withMessage("El id del cargo debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarcargo = await modeloCargo.findOne({
                where: {id: value}
            });
            if(!buscarcargo){
                throw new Error('El id del cargo no existe');
            }
        }
    }),
    body("usuarioId").isInt().withMessage("El id del usuario debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarusuario = await modeloUsuario.findOne({
                where: {id: value}
            });
            if(!buscarusuario){
                throw new Error('El id del usuario no existe');
            }
        }
    }),
        controladorEmpleado.modificar)

        rutaEmpleado.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscarcliente = await modeloEmpleado.findOne({
                        where: {id: value}
                    });
                    if(!buscarcliente){
                        throw new Error('El id del cliente no existe');
                    };
                };
            }),
            controladorEmpleado.eliminar)

module.exports = rutaEmpleado;
