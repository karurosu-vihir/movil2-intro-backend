const { default: AsyncQueue } = require('sequelize/lib/dialects/mssql/async-queue');
const modeloCiudad = require('../modelos/direcciones/ciudad')
const { validationResult } = require('express-validator');
const { where, Op } = require('sequelize');

exports.inicio = (req, res) => {
    let info = {
        rutas: [
            {
                url: 'servidor:3002/api/ciudad',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Manual de rutas'
            },
            {
                url: 'servidor:3002/api/ciudad/listar',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos las ciudades'
            },
            {
                url: 'servidor:3002/api/ciudad/municipio',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos las ciudades de un municipio'
            },
        ]
    }
    res.send(info);
}

exports.listar = async (req, res) => {
    try {
        await modeloCiudad.findAll()
            .then((data) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json")
                res.json(data)
            }).catch((error) => {
                console.log(error)
                res.statusCode = 300;
                res.setHeader("Content-Type", "application/json")
                res.json({ msg: "ERROR EN LA CONSULTA" })
            });
    } catch (error) {
        console.log(error)
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json")
        res.json({ msg: "ERROR EN EL SERVIDOR" })
    }
}

exports.listarmunicipioid = async (req, res) => {
    try {
        const { municipioId } = req.query
        await modeloCiudad.findAll({
            where: {
                municipioId: municipioId
            }
        })
            .then((data) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json")
                res.json(data)
            }).catch((error) => {
                console.log(error)
                res.statusCode = 300;
                res.setHeader("Content-Type", "application/json")
                res.json({ msg: "ERROR EN LA CONSULTA" })
            });
    } catch (error) {
        console.log(error)
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json")
        res.json({ msg: "ERROR EN EL SERVIDOR" })
    }
}

exports.guardar = async (req, res) => {
    const errores = validationResult(req);
    let ers = []
    const { Nombre, municipioId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            const buscarNombre = await modeloCiudad.findOne({
                where: {
                    Nombre: Nombre,
                    municipioId: municipioId
                }
            })
            if (buscarNombre) {
                ers.push({ campo: "nombre", msj: "Ya hay una ciudad con ese nombre dentro de este municipio" })
                res.status(400).json({ ers });
            }
            else {
                await modeloCiudad.create({ ...req.body })
                    .then((data) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json")
                        res.json({ msg: "Registro Guardado " + data })
                    }).catch((error) => {
                        res.statusCode = 300;
                        res.setHeader("Content-Type", "application/json")
                        res.json({ msg: "ERROR EN LA CONSULTA" })
                    });
            }
        } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json")
            res.json({ msg: "ERROR EN EL SERVIDOR" })
        }
    }
}

exports.modificar = async (req, res) => {
    const errores = validationResult(req);
    let ers = []
    const { id } = req.query;
    const { Nombre, municipioId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            if (Nombre && municipioId) {
                const buscarNombre = await modeloCiudad.findOne({
                    where: {
                        Nombre: Nombre,
                        [Op.not]: { id: id },
                        municipioId: municipioId
                    }
                })
                if (buscarNombre) {
                    ers.push({ campo: "nombre", msj: "Ya hay una ciudad con ese nombre dentro de este municipio" })
                    res.status(400).json({ ers });
                }
            }
            if (ers.length >= 1) {
                res.status(400).json({ ers });
            }
            else {
                await modeloCiudad.update(
                    { ...req.body, },
                    { where: { id: id } })
                    .then((data) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json")
                        res.json({ msg: "Registro Actualizado " + data })
                    }).catch((error) => {
                        res.statusCode = 300;
                        res.setHeader("Content-Type", "application/json")
                        res.json({ msg: "ERROR EN LA CONSULTA" + error })
                    });
            }
        } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json")
            res.json({ msg: "ERROR EN EL SERVIDOR" })
        }
    }
}



exports.eliminar = async (req, res) => {
    const errores = validationResult(req);
    let ers = []
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            const { id } = req.query;

            await modeloCiudad.destroy({ where: { id: id } })
                .then((data) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json")
                    res.json({ msg: "Registro Eliminado " + data })
                }).catch((error) => {
                    res.statusCode = 300;
                    res.setHeader("Content-Type", "application/json")
                    res.json({ msg: "ERROR EN LA CONSULTA" + error })
                });
        } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json")
            res.json({ msg: "ERROR EN EL SERVIDOR" })
        }
    }
}