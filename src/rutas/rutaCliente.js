const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorCliente = require('../controladores/controladorcliente');
const modeloCliente = require('../modelos/cliente');
const modeloDireccion = require('../modelos/direcciones/clientedireccion')
const modeloTelefono = require('../modelos/ClienteTelefono')
const modeloUsuario = require('../modelos/usuario')
const rutaCliente = Router();


rutaCliente.get('/', controladorCliente.inicio)
rutaCliente.get('/listar',controladorCliente.listar)

rutaCliente.post('/guardar',
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
    body("telefonoId").isInt().withMessage("El id del telefono debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscartelefono = await modeloTelefono.findOne({
                where: {id: value}
            });
            if(!buscartelefono){
                throw new Error('El id del telefono no existe');
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
    controladorCliente.guardar)

    rutaCliente.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarMunicipio = await modeloCliente.findOne({
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
    body("primerNombre").isLength({min: 3, max: 50}).withMessage("Minimo de 3, maximo de 50")
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
    body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    body("clientedireccionId").optional().isInt().withMessage("El id de la direccion debe ser un numero entero")
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
    body("telefonoId").optional().isInt().withMessage("El id del telefono debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscartelefono = await modeloTelefono.findOne({
                where: {id: value}
            });
            if(!buscartelefono){
                throw new Error('El id del telefono no existe');
            }
        }
    }),
    body("usuarioId").optional().isInt().withMessage("El id del usuario debe ser un numero entero")
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
        controladorCliente.modificar)

        rutaCliente.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscarcliente = await modeloCliente.findOne({
                        where: {id: value}
                    });
                    if(!buscarcliente){
                        throw new Error('El id del cliente no existe');
                    };
                };
            }),
            controladorCliente.eliminar)

module.exports = rutaCliente;
