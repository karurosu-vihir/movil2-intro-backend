const { default: AsyncQueue } = require('sequelize/lib/dialects/mssql/async-queue');
const modeloCliente = require('../modelos/cliente')
const { validationResult } = require('express-validator');
const { where, Op } = require('sequelize');

exports.inicio = (req, res) => {
    let info = {
        rutas: [
            {
                url: 'servidor:3002/api/cliente',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Manual de rutas'
            },
            {
                url: 'servidor:3002/api/cliente/listar',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos los clientes'
            }
        ]
    }
    res.send(info);
}

exports.listar = async (req, res) => {
    try {
        await modeloCliente.findAll()
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
    const { identidad, clientedireccionId, telefonoId, usuarioId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            const buscarIdentidad = await modeloCliente.findOne({
                where: {
                    identidad: identidad,
                }
            })
            const buscardireccionId = await modeloCliente.findOne({
                where: {
                    clientedireccionId: clientedireccionId,
                }
            })
            const buscarTelefono = await modeloCliente.findOne({
                where: {
                    telefonoId: telefonoId,
                }
            })
            const buscarUsuario = await modeloCliente.findOne({
                where: {
                    usuarioId: usuarioId,
                }
            })
            if (buscarIdentidad) {
                ers.push({ campo: "Identidad", msj: "Ya hay una Identidad como la que ingreso" })
                res.status(400).json({ ers });
            }
            else if (buscardireccionId) {
                ers.push({ campo: "clientedireccionId", msj: "Ya hay una direccion como la que ingreso" })
                res.status(400).json({ ers });
            }
            else if (buscarTelefono) {
                ers.push({ campo: "telefonoId", msj: "Ya hay un telefono como el que ingreso" })
                res.status(400).json({ ers });
            }
            else if (buscarUsuario) {
                ers.push({ campo: "usuarioId", msj: "Ya hay un usuario como el que ingreso" })
                res.status(400).json({ ers });
            }
            else {
                await modeloCliente.create({ ...req.body })
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
    const { identidad, clientedireccionId, telefonoId, usuarioId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            if (identidad) {
                const buscarIdentidad = await modeloCliente.findOne({
                    where: { identidad: identidad }
                });
                if (buscarIdentidad) {
                    ers.push({ campo: "Identidad", msj: "Ya hay una Identidad como la que ingresó" });
                }
            }
            if (clientedireccionId) {
                const buscardireccionId = await modeloCliente.findOne({
                    where: { clientedireccionId: clientedireccionId }
                });
                if (buscardireccionId) {
                    ers.push({ campo: "clientedireccionId", msj: "Ya hay una dirección como la que ingresó" });
                }
            }
            if (telefonoId) {
                const buscarTelefono = await modeloCliente.findOne({
                    where: { telefonoId: telefonoId }
                });
                if (buscarTelefono) {
                    ers.push({ campo: "telefonoId", msj: "Ya hay un teléfono como el que ingresó" });
                }
            }
            if (usuarioId) {
                const buscarUsuario = await modeloCliente.findOne({
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
                await modeloCliente.update(
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

            await modeloCliente.destroy({ where: { id: id } })
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