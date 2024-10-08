const {Router} = require('express');
const { body, query } = require('express-validator')
const controladorCiudad = require('../controladores/controladorciudad');
const modeloCiudad = require('../modelos/direcciones/ciudad');
const modeloMunicipio = require('../modelos/direcciones/municipios')
const rutaCiudad = Router();


rutaCiudad.get('/', controladorCiudad.inicio)
rutaCiudad.get('/listar',controladorCiudad.listar)
rutaCiudad.get('/municipio',
    query("municipioId").isInt().withMessage("El id del municipio debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarmunicipio = await modeloMunicipio.findOne({
                where: {id: value}
            });
            if(!buscarmunicipio){
                throw new Error('El id del municipio no existe');
            }
        }
    }),
    controladorCiudad.listarmunicipioid);

rutaCiudad.post('/guardar',
    body("Nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }}),
    body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
    body("municipioId").isInt().withMessage("El id del municipio debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarmunicipio = await modeloMunicipio.findOne({
                where: {id: value}
            });
            if(!buscarmunicipio){
                throw new Error('El id del municipio no existe');
            }
        }
    }),
    controladorCiudad.guardar)

    rutaCiudad.put('/editar',
        query("id").isInt().withMessage("Tiene que ser entero")
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarCiudad = await modeloCiudad.findOne({
                    where: {id: value}
                });
                if(!buscarCiudad){
                    throw new Error('El id de la ciudad no existe');
                };
            };
        }),
        body("Nombre").optional().isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }}),
        body("estado").optional().isIn(['AC','IN','BL']).withMessage("Escriba AC(para activo), IN(para inactivo), BL(para bloquedo"),
        body("municipioId").optional().isInt().withMessage("El id del municipio debe ser un numero entero")
        .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarmunicipio = await modeloMunicipio.findOne({
                where: {id: value}
            });
            if(!buscarmunicipio){
                throw new Error('El id del municipio no existe');
            }
        }
        }),
        controladorCiudad.modificar)

        rutaCiudad.delete('/eliminar',
            query("id").isInt().withMessage("Tiene que ser entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El id no permite nulos')
                }
                else{
                    const buscarCiudad = await modeloCiudad.findOne({
                        where: {id: value}
                    });
                    if(!buscarCiudad){
                        throw new Error('El id de la ciudad no existe');
                    };
                };
            }),
            controladorCiudad.eliminar)

module.exports = rutaCiudad;
