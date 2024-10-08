const { default: AsyncQueue } = require('sequelize/lib/dialects/mssql/async-queue');
const modeloBarrio = require('../modelos/direcciones/barrios')
const { validationResult } = require('express-validator');
const { where, Op } = require('sequelize');

exports.inicio = (req, res) => {
    let info = {
        rutas: [
            {
                url: 'servidor:3002/api/barrio',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Manual de rutas'
            },
            {
                url: 'servidor:3002/api/barrio/listar',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos las barrios'
            },
            {
                url: 'servidor:3002/api/barrio/ciudad',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos las barrios de una ciudad'
            },
        ]
    }
    res.send(info);
}

exports.listar = async (req, res) => {
    try {
        await modeloBarrio.findAll()
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

exports.listarciudadId = async (req, res) => {
    try {
        const { ciudadId } = req.query
        await modeloBarrio.findAll({
            where: {
                ciudadId: ciudadId
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
    const { Nombre, ciudadId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            const buscarNombre = await modeloBarrio.findOne({
                where: {
                    Nombre: Nombre,
                    ciudadId: ciudadId
                }
            })
            if (buscarNombre) {
                ers.push({ campo: "nombre", msj: "Ya hay un barrio con ese nombre dentro de esta ciudad" })
                res.status(400).json({ ers });
            }
            else {
                await modeloBarrio.create({ ...req.body })
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
    const { Nombre, ciudadId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            if (Nombre) {
                const buscarNombre = await modeloBarrio.findOne({
                    where: {
                        Nombre: Nombre,
                        [Op.not]: { id: id },
                        ciudadId: ciudadId
                    }
                })
                if (buscarNombre) {
                    ers.push({ campo: "nombre", msj: "Ya hay una barrio con ese nombre dentro de esta ciudad" })
                    res.status(400).json({ ers });
                }
            }
            if (ers.length >= 1) {
                res.status(400).json({ ers });
            }
            else {
                await modeloBarrio.update(
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
            res.json({ msg: "ERROR EN EL SERVIDOR" + error })
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

            await modeloBarrio.destroy({ where: { id: id } })
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