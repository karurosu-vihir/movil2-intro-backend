const express = require('express')
const morgan = require('morgan')

const db = require("./configuraciones/db");
const modeloCargo = require("./modelos/cargo");
const modeloEmpleado = require('./modelos/empleado')
const modeloCliente = require('./modelos/cliente')
const modeloUsuario = require('./modelos/usuario')

const modeloDepartamento = require('./modelos/direcciones/departamento')
const modeloMunicipio = require('./modelos/direcciones/municipios')
const modeloCiudad = require('./modelos/direcciones/ciudad')
const modeloBarrio = require('./modelos/direcciones/barrios')
const modeloDireccion = require('./modelos/direcciones/clientedireccion')
const modeloTelefono = require('./modelos/ClienteTelefono')


db.authenticate().then(async ()=>{
    console.log("Conexion exitosa con la base de datos");

    modeloDepartamento.hasMany(modeloMunicipio);
    modeloMunicipio.belongsTo(modeloDepartamento);

    modeloMunicipio.hasMany(modeloCiudad);
    modeloCiudad.belongsTo(modeloMunicipio);

    modeloCiudad.hasMany(modeloBarrio);
    modeloBarrio.belongsTo(modeloCiudad);

    modeloBarrio.hasMany(modeloDireccion);
    modeloDireccion.belongsTo(modeloBarrio)

    modeloDireccion.hasMany(modeloCliente);
    modeloCliente.belongsTo(modeloDireccion);

    modeloTelefono.hasMany(modeloCliente);
    modeloCliente.belongsTo(modeloTelefono);

    modeloCargo.hasMany(modeloEmpleado);
    modeloEmpleado.belongsTo(modeloCargo);

    modeloUsuario.hasMany(modeloCliente)
    modeloCliente.belongsTo(modeloUsuario)

    modeloUsuario.hasMany(modeloEmpleado)
    modeloEmpleado.belongsTo(modeloUsuario)



    await modeloDepartamento.sync().then((data)=>{
        console.log("Modelo departamento creado");
    })
    await modeloMunicipio.sync().then((data)=>{
        console.log("Modelo municipio creado");
    })
    await modeloCiudad.sync().then((data)=>{
        console.log("Modelo ciudad creado");
    })
    await modeloBarrio.sync().then((data)=>{
        console.log("Modelo barrio creado");
    })
    await modeloDireccion.sync().then((data)=>{
        console.log("Modelo direccion creado");
    })
    await modeloTelefono.sync().then((data)=>{
        console.log("Modelo telefono creado");
    })
    await modeloUsuario.sync().then((data)=>{
        console.log("Modelo usuario creado");
    })
    await modeloCliente.sync().then((data)=>{
        console.log("Modelo Cliente creado");
    })
    await modeloCargo.sync().then((data)=>{
        console.log("Modelo Cargo creado");
    })
    await modeloEmpleado.sync().then((data)=>{
        console.log("Modelo Empleado creado");
    })
})
.catch((error)=>{
    console.log("Hubo un error con la conexion con la base de datos");
    console.log(error);
})
const app = express();
app.set('port',3002)
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/api',require('./rutas'))
app.use('/api/cargo',require('./rutas/rutaCargo'))
app.use('/api/departamento',require('./rutas/rutaDepartamento'))
app.use('/api/municipio',require('./rutas/rutaMunicipio'))
app.use('/api/ciudad',require('./rutas/rutaCiudad'))
app.use('/api/barrio',require('./rutas/rutaBarrio'))
app.use('/api/direcciones',require('./rutas/rutaClientedireccion'))
app.use('/api/telefonos',require('./rutas/rutaTelefonos'))
app.use('/api/usuario',require('./rutas/rutaUsuario'))
app.use('/api/cliente',require('./rutas/rutaCliente'))
app.use('/api/empleado',require('./rutas/rutaEmpleado'))
app.listen(app.get('port'), ()=>{
    console.log(`servidor iniciado en el puerto ${app.get('port')}`)
});