const { default: AsyncQueue } = require('sequelize/lib/dialects/mssql/async-queue');
const modeloMunicipio = require('../modelos/direcciones/municipios')
const { validationResult } = require('express-validator');
const { where, Op } = require('sequelize');

exports.inicio = (req, res) => {
    let info = {
        rutas: [
            {
                url: 'servidor:3002/api/municipio',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Manual de rutas'
            },
            {
                url: 'servidor:3002/api/municipio/listar',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos los municipios'
            },
            {
                url: 'servidor:3002/api/municipio/departamento',
                metodo: 'get',
                parametros: 'ninguno',
                descripcion: 'Listar todos los municipios de un departamento'
            },
        ]
    }
    res.send(info);
}

exports.listar = async (req, res) => {
    try {
        await modeloMunicipio.findAll()
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

exports.listardepartamentoid = async (req, res) => {
    try {
        const { departamentoId } = req.query
        await modeloMunicipio.findAll({
            where:{
                departamentoId: departamentoId
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
    const { Nombre, Codigo, departamentoId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            const buscarCodigo = await modeloMunicipio.findOne({
                where: {
                    Codigo: Codigo,
                    departamentoId: departamentoId,
                }
            });
            const buscarNombre = await modeloMunicipio.findOne({
                where: {
                    Nombre: Nombre,
                    departamentoId: departamentoId
                }
            })
            if (buscarNombre){
                ers.push({ campo: "nombre", msj: "Ya hay un Municipio con ese nombre dentro de este departamento" })
                res.status(400).json({ers});
            }
            else if (buscarCodigo){
                ers.push({ campo: "codigo", msj: "Ya hay un municipio con ese codigo dentro de este departamento" })
                res.status(400).json({ers});
            }
            else {
                await modeloMunicipio.create({ ...req.body })
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
    const { Nombre, Codigo, departamentoId } = req.body
    errores.errors.map((e) => {
        ers.push({ campo: e.path, msg: e.msg });
    })
    if (ers.length >= 1) {
        res.status(400).json({ ers });
    }
    else {
        try {
            if (Codigo && departamentoId) {
                const buscarCodigo = await modeloMunicipio.findOne({
                    where: {
                        Codigo: Codigo,
                        [Op.not]: { id: id },
                        departamentoId: departamentoId
                    }
                });
                if (buscarCodigo) {
                    ers.push({ campo: "codigo", msj: "Ya hay un municipio con ese código dentro de este departamento" });
                }
            }            
            if (Nombre && departamentoId) {
                const buscarNombre = await modeloMunicipio.findOne({
                    where: {
                        Nombre: Nombre,
                        [Op.not]: { id: id },
                        departamentoId: departamentoId
                    }
                });
                if (buscarNombre) {
                    ers.push({ campo: "nombre", msj: "Ya hay un Municipio con ese nombre dentro de este departamento" });
                }
            }            
            if (ers.length > 0) {
                return res.status(400).json({ ers });
            }
            else {
                await modeloMunicipio.update(
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

            await modeloMunicipio.destroy({ where: { id: id } })
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