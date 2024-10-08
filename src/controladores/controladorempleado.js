const { default: AsyncQueue } = require('sequelize/lib/dialects/mssql/async-queue');
const modeloEmpleado = require('../modelos/empleado')
const { validationResult } = require('express-validator');
const { where, Op } = require('sequelize');

exports.inicio = (req, res) => {
    let info = {
        rutas: [
            {
                url: 'servidor:3002/api/empleado',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Manual de rutas'
            },
            {
                url: 'servidor:3002/api/empleado/listar',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos los empleados'
            }
        ]
    }
    res.send(info);
}

exports.listar = async (req, res) => {
    try {
        await modeloEmpleado.findAll()
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
    const { identidad, usuarioId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            const buscarIdentidad = await modeloEmpleado.findOne({
                where: {
                    identidad: identidad,
                }
            })
            const buscarUsuario = await modeloEmpleado.findOne({
                where: {
                    usuarioId: usuarioId,
                }
            })
            if (buscarIdentidad) {
                ers.push({ campo: "Identidad", msj: "Ya hay una Identidad como la que ingreso" })
                res.status(400).json({ ers });
            }
            else if (buscarUsuario) {
                ers.push({ campo: "usuarioId", msj: "Ya hay un usuario como el que ingreso" })
                res.status(400).json({ ers });
            }
            else {
                await modeloEmpleado.create({ ...req.body })
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
    const { identidad, usuarioId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            if (identidad) {
                const buscarIdentidad = await modeloEmpleado.findOne({
                    where: { identidad: identidad }
                });
                if (buscarIdentidad) {
                    ers.push({ campo: "Identidad", msj: "Ya hay una Identidad como la que ingresó" });
                }
            }
            if (usuarioId) {
                const buscarUsuario = await modeloEmpleado.findOne({
                    where: { usuarioId: usuarioId }
                });
                if (buscarUsuario) {
                    ers.push({ campo: "usuarioId", msj: "Ya hay un usuario como el que ingresó" });
                }
            }
            if (ers.length > 0) {
                return res.status(400).json({ ers });
            }
            else {
                await modeloEmpleado.update(
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

            await modeloEmpleado.destroy({ where: { id: id } })
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