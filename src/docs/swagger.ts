import { Express } from 'express'

const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Morimitsu Dashboard API',
      version: '1.0.0',
      description: 'https://morimitsu-dashboard-api.onrender.com',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor local',
      },

      {
        url: 'https://morimitsu-dashboard-api.onrender.com',
        description: 'API Online  ',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/docs/*.ts'], // Caminhos dos arquivos com docs
}

export const swaggerSpec = swaggerJsDoc(options)

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
