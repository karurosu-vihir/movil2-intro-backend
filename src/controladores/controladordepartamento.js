const { default: AsyncQueue } = require('sequelize/lib/dialects/mssql/async-queue');
const modeloDepartamento = require('../modelos/direcciones/departamento')
const { validationResult } = require('express-validator');
const { where, Op } = require('sequelize');

exports.inicio = (req, res) => {
    let info = {
            rutas:[
                {
                    url: 'servidor:3002/api/departamento',
                    metodo: 'get',
                    parametros:'ninguno',
                    descripcion: 'Manual de rutas'
                },
                {
                    url: 'servidor:3002/api/departamento/listar',
                    metodo: 'get',
                    parametros:'ninguno',
                    descripcion: 'Listar todos los departamentos'
                }
            ]            
    }
    res.send(info);
}

exports.listar = async (req, res) => {
    try{
        await modeloDepartamento.findAll()
        .then((data)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json")
            res.json(data)
        }).catch((error)=>{
            console.log(error)
            res.statusCode = 300;
            res.setHeader("Content-Type", "application/json")
            res.json({msg: "ERROR EN LA CONSULTA"})
        });
    }catch(error){
        console.log(error)
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json")
        res.json({msg: "ERROR EN EL SERVIDOR"})
    }
}

exports.guardar = async (req, res) => {
    const errores = validationResult(req);
    let ers = [] 
    const {Nombre, Codigo} = req.body
    errores.errors.map((e)=>{
        ers.push({campo: e.path, msg: e.msg});
    })
    if(ers.length >= 1){
        res.status(400).json({ers});
    }
    else{
        const buscarCodigo = await modeloDepartamento.findOne({
            where:{
                Codigo: Codigo
            }
        })
        const buscarNombre = await modeloDepartamento.findOne({
            where:{
                Nombre: Nombre
            }
        })
        if(buscarNombre){
            ers.push({campo: "nombre", msj: "Ya hay un departamento con ese nombre"})
            res.status(400).json({ers});
        }
        else if(buscarCodigo){
            ers.push({campo: "codigo", msj: "Ya hay un departamento con ese codigo"})
            res.status(400).json({ers});
        }
        else{
            try{
                await modeloDepartamento.create({...req.body})
                .then((data)=>{
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json")
                    res.json({msg: "Registro Guardado " + data})
                }).catch((error)=>{
                    res.statusCode = 300;
                    res.setHeader("Content-Type", "application/json")
                    res.json({msg: "ERROR EN LA CONSULTA"})
                });
            }catch(error){
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json")
                res.json({msg: "ERROR EN EL SERVIDOR"})
            }
        }
    }
}

exports.modificar = async (req, res) => {
    const errores = validationResult(req);
    let ers = [] 
    const {id} = req.query;
    const {Nombre, Codigo} = req.body
    errores.errors.map((e)=>{
        ers.push({campo: e.path, msg: e.msg});
    })
    if(ers.length >= 1){
        res.status(400).json({ers});
    }
    else{
        if (Codigo) {
            const buscarCodigo = await modeloDepartamento.findOne({
                where: {
                    Codigo: Codigo,
                    [Op.not]: { id: id }
                }
            });
            if (buscarCodigo) {
                ers.push({ campo: "codigo", msj: "Ya hay un departamento con ese código" });
            }
        }        
        if (Nombre) {
            const buscarNombre = await modeloDepartamento.findOne({
                where: {
                    Nombre: Nombre,
                    [Op.not]: { id: id }
                }
            });
            if (buscarNombre) {
                ers.push({ campo: "nombre", msj: "Ya hay un departamento con ese nombre" });
            }
        }        
        if (ers.length > 0) {
            return res.status(400).json({ ers });
        }        
        else{
            try{
                await modeloDepartamento.update(
                    {...req.body,},
                    { where: {id : id} })
                .then((data)=>{
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json")
                    res.json({msg: "Registro Actualizado " + data})
                }).catch((error)=>{
                    res.statusCode = 300;
                    res.setHeader("Content-Type", "application/json")
                    res.json({msg: "ERROR EN LA CONSULTA" + error})
                });
            }catch(error){
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json")
                res.json({msg: "ERROR EN EL SERVIDOR"})
            }
        }
    }
}


exports.eliminar = async (req, res) => {
    const errores = validationResult(req);
    let ers = [] 
    errores.errors.map((e)=>{
        ers.push({campo: e.path, msg: e.msg});
    })
    if(ers.length >= 1){
        res.status(400).json({ers});
    }
    else{
        try{
            const {id} = req.query;

            await modeloDepartamento.destroy({ where: {id : id} })
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json")
                res.json({msg: "Registro Eliminado " + data})
            }).catch((error)=>{
                res.statusCode = 300;
                res.setHeader("Content-Type", "application/json")
                res.json({msg: "ERROR EN LA CONSULTA" + error})
            });
        }catch(error){
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json")
            res.json({msg: "ERROR EN EL SERVIDOR"})
        }
    }
}