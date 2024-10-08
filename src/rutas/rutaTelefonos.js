const { Router } = require('express');
const { body, query } = require('express-validator')
const controladorTelefonos = require('../controladores/controladortelefonos');
const modeloTelefonos = require('../modelos/ClienteTelefono');
const rutaTelefonos = Router();


rutaTelefonos.get('/', controladorTelefonos.inicio)
rutaTelefonos.get('/listar', controladorTelefonos.listar)

rutaTelefonos.post('/guardar',
    body("nombre").isLength({ min: 8, max: 8 }).withMessage("ahorre complicaciones solo ponga 8")
        .custom(async value => {
            if (!value) {
                throw new Error('El telefono no permite nulos')
            }
        })
        .custom(async value =>{
            if(!(/^\d{8}$/.test(value)))
                throw new Error('El telefono tiene que ser 8 numeros')
        }),
    body("estado").optional().isIn(['AC', 'IN', 'BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    controladorTelefonos.guardar)

rutaTelefonos.put('/editar',
    query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite nulos')
            }
            else {
                const buscarTelefono = await modeloTelefonos.findOne({
                    where: { id: value }
                });
                if (!buscarTelefono) {
                    throw new Error('El id del Telefono no existe');
                };
            };
        }),
    body("nombre").optional().isLength({ min: 8, max: 8 }).withMessage("ahorre complicaciones solo ponga 8")
        .custom(async value => {
            if (!value) {
                throw new Error('El telefono no permite nulos')
            }
        }),
    body("estado").optional().isIn(['AC', 'IN', 'BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    controladorTelefonos.modificar)

rutaTelefonos.delete('/eliminar',
    query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value => {
            if (!value) {
                throw new Error('El id no permite nulos')
            }
            else {
                const buscarTelefono = await modeloTelefonos.findOne({
                    where: { id: value }
                });
                if (!buscarTelefono) {
                    throw new Error('El id del Telefono no existe');
                };
            };
        }),
    controladorTelefonos.eliminar)

module.exports = rutaTelefonos;
