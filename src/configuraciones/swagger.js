const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path')

const options = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Ejemplo Movil 2',
            version: '1.0.0',
            description: 'Ejemplo visto en clase'
        },
        servers: [
            {
                url: 'http://localhost:3002/api',
                description: 'Servidor Local'
            }
        ]
    },
    apis: [path.join(__dirname, "../rutas/*.js")]
}

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec