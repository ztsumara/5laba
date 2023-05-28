const express = require('express');
const routes = require(__dirname+'/routes/routes');
const contAPI = require("./controllers/Controll")
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "LogRocket Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "LogRocket",
          url: "https://logrocket.com",
          email: "info@email.com",
        },
      },
      servers: [
        {
          url: "http://127.0.0.1:5002",
        },
      ],
    },
    apis: ["./controllers/Controll.js"],
  };
  
  const specs = swaggerJsdoc(options);
const PORT = 5002;
const HOST = '127.0.0.1';
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );
app.use(express.static('public'));
app.use(routes);
app.use('/CRUD',contAPI);
app.listen(PORT,()=>{
    console.log(`server is starting : http://${HOST}:${PORT}`);
});

app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({ message: message });
})





