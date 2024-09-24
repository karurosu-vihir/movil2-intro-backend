const {Router} = require('express');
const controladorInicio = require('../controladores/controlador_inicio'); 
const ruta = Router();

ruta.get('/', controladorInicio.inicio)
ruta.get('/otra',controladorInicio.otra)
ruta.get('/nombre',controladorInicio.nombre)

module.exports = ruta;
