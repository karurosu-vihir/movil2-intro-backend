const { default: AsyncQueue } = require('sequelize/lib/dialects/mssql/async-queue');
const modeloCargo = require('../modelos/cargo')
const { validationResult } = require('express-validator');
const { where } = require('sequelize');

exports.inicio = (req, res) => {
    let info = {
            rutas:[
                {
                    url: 'servidor:3002/api/cargo',
                    metodo: 'get',
                    parametros:'ninguno',
                    descripcion: 'Manual de rutas'
                },
                {
                    url: 'servidor:3002/api/cargo/listar',
                    metodo: 'get',
                    parametros:'ninguno',
                    descripcion: 'Listar todos los cargos'
                }
            ]            
    }
    res.send(info);
}

exports.listar = async (req, res) => {
    try{
        await modeloCargo.findAll()
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
    errores.errors.map((e)=>{
        ers.push({campo: e.path, msg: e.msg});
    })
    if(ers.length >= 1){
        res.status(400).json({ers});
    }
    else{
        try{
            await modeloCargo.create({...req.body})
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

exports.modificar = async (req, res) => {
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

            await modeloCargo.update(
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

            await modeloCargo.destroy({ where: {id : id} })
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