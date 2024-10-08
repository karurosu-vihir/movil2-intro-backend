const { default: AsyncQueue } = require('sequelize/lib/dialects/mssql/async-queue');
const modeloUsuario = require('../modelos/usuario')
const { validationResult } = require('express-validator');
const { where, Op } = require('sequelize');
const crypt = require('bcrypt')

exports.inicio = (req, res) => {
    let info = {
        rutas: [
            {
                url: 'servidor:3002/api/usuario',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Manual de rutas'
            },
            {
                url: 'servidor:3002/api/usuario/listar',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos los usuarios'
            }
        ]
    }
    res.send(info);
}

exports.listar = async (req, res) => {
    try {
        await modeloUsuario.findAll()
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
    const { nombre, password, correo } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            const buscarnombre = await modeloUsuario.findOne({
                where: {
                    nombre: nombre,
                }
            })
            const buscarcorreo = await modeloUsuario.findOne({
                where: {
                    correo: correo,
                }
            })
            if (buscarnombre) {
                ers.push({ campo: "nombre", msj: "Ya hay un usuario con ese nombre" })
                res.status(400).json({ ers });
            }
            else if (buscarcorreo) {
                ers.push({ campo: "correo", msj: "Ya hay un usuario con ese correo" })
                res.status(400).json({ ers });
            }
            else {
                req.body.password = await crypt.hash(password, 1);
                await modeloUsuario.create({ ...req.body })
                    .then((data) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json")
                        res.json({ msg: "Registro Guardado " + data })
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


exports.modificar = async (req, res) => {
    const errores = validationResult(req);
    let ers = []
    const { id } = req.query;
    const { nombre, correo } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            if (nombre) {
                const buscarnombre = await modeloUsuario.findOne({
                    where: {
                        nombre: nombre,
                        [Op.not]: { id: id },
                    }
                });
                if (buscarnombre) {
                    ers.push({ campo: "nombre", msj: "Ya hay un usuario con ese nombre" });
                }
            }
            if (correo) {
                const buscarcorreo = await modeloUsuario.findOne({
                    where: {
                        correo: correo,
                        [Op.not]: { id: id },
                    }
                });
                if (buscarcorreo) {
                    ers.push({ campo: "correo", msj: "Ya hay un usuario con ese correo" });
                }
            }
            if (ers.length >= 1) {
                res.status(400).json({ ers });
            }
            else {
                const { password, ...lo_demas } = req.body
                console.log(lo_demas)
                await modeloUsuario.update(
                    { ...lo_demas },
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

            await modeloUsuario.destroy({ where: { id: id } })
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