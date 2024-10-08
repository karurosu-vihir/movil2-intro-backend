const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorUsuario = require('../controladores/controladorusuario');
const modeloUsuario = require('../modelos/usuario');
const rutaUsuario = Router();


rutaUsuario.get('/', controladorUsuario.inicio)
rutaUsuario.get('/listar',controladorUsuario.listar)

rutaUsuario.post('/guardar',
    body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre de usuario no permite nulos')
        }}),
    body("correo").isLength({min: 13, max: 100}).withMessage("El limite de caracteres es de 13 a 100")
    .custom(async value =>{
        if(!value){
            throw new Error('El correo no permite nulos')
        }})
        .custom(async value =>{
            if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))){
                throw new Error('El correo que ingreso no es valido')
            }}),
    body("tipo_usuario").optional().isIn(['cliente','empleado']).withMessage("cliente o empleado"),
    body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    controladorUsuario.guardar)

    rutaUsuario.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarUsuario = await modeloUsuario.findOne({
                    where: {id: value}
                });
                if(!buscarUsuario){
                    throw new Error('El id del usuario no existe');
                };
            };
        }),
        body("nombre").optional().isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre de usuario no permite nulos')
            }}),
        body("correo").optional().isLength({min: 13, max: 100}).withMessage("El limite de caracteres es de 13 a 100")
        .custom(async value =>{
            if(!value){
                throw new Error('El correo no permite nulos')
            }})
            .custom(async value =>{
                if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))){
                    throw new Error('El correo que ingreso no es valido')
                }}),
        body("tipo_usuario").optional().isIn(['cliente','empleado']).withMessage("cliente o empleado"),
        body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
        controladorUsuario.modificar)

        rutaUsuario.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscarUsuario = await modeloUsuario.findOne({
                        where: {id: value}
                    });
                    if(!buscarUsuario){
                        throw new Error('El id del usuario no existe');
                    };
                };
            }),
            controladorUsuario.eliminar)

module.exports = rutaUsuario;
