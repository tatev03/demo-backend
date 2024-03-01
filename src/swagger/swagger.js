const express = require('express');  
const router = express.Router();  
const swaggerJSDoc = require('swagger-jsdoc');  
const swaggerUi = require('swagger-ui-express');  
require('swagger-model-validator');  

const loadBalancerUrl = process.env.LOAD_BALANCER_URL;  
  
const options = {  
  swaggerDefinition: {  
    info: {  
      title: 'AWS Demo',  
      version: '1.0.0',  
      description: 'An AWS Demo for a full stack application with Amazon ECS, applying DevOps practices',  
      contact: {  
        email: 'burkhmar@amazon.de'  
      }  
    },  
    tags: [  
      {  
        name: 'AWS Demo Endpoints',  
        description: 'Endpoints descriptions'  
      }  
    ],  
    schemes: ['http'],  
    // Use the load balancer URL from the environment variable  
    host: loadBalancerUrl,  
    basePath: '/'  
  },  
  apis: [  
    './src/app.js',  
  ],  
};  
  
const swaggerSpec = swaggerJSDoc(options);  
require('swagger-model-validator')(swaggerSpec);  
  
router.get('/json', function (req, res) {  
  res.setHeader('Content-Type', 'application/json');  
  res.send(swaggerSpec);  
});  
  
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  
  
function validateModel(name, model) {  
  const responseValidation = swaggerSpec.validateModel(name, model, false, true);  
  if (!responseValidation.valid) {  
    console.error(responseValidation.errors);  
    throw new Error(`Model doesn't match Swagger contract`);  
  }  
}  
  
module.exports = {  
  router,  
  validateModel  
};  
