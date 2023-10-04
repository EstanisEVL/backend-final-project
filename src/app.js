// IMPORTACIÓN DE DEPENDENCIAS
import express from "express";
import displayRoutes from "express-routemap";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// IMPORTACIÓN DE VARIABLES
import { API_VERSION, NODE_ENV, PORT } from "./config/config.js";
import __dirname from "./utils.js";
import { setLogger } from "./utils/logger.js";
import { swaggerOptions } from "./config/swagger.config.js";

// IMPORTACIÓN DE RUTAS
import userRoutes from "./routes/user.routes.js";

// DEFINICIÓN DE VARIABLES GLOBALES
const app = express();
const PORT_APP = Number(PORT) || 8080;

// MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use(setLogger);

// HANDLEBARS

// PASSPORT

// SWAGGER SPECS
const specs = swaggerJSDoc(swaggerOptions);

// CREACIÓN DE RUTAS
app.use(`/api/${API_VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(specs));
app.use(`/api/${API_VERSION}/users`, userRoutes);

// LEVANTAR EL SERVIDOR
app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Running on PORT: ${PORT_APP} || Environment: ${NODE_ENV}`);
});
