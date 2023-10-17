// IMPORTACIÓN DE DEPENDENCIAS
import express from "express";
import passport from "passport";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// IMPORTACIÓN DE VARIABLES
import { API_VERSION, NODE_ENV, PORT } from "./config/config.js";
import initializePassport from "./config/passport.config.js";
import __dirname from "./utils.js";
import { setLogger } from "./utils/logger.js";
import { swaggerOptions } from "./config/swagger.config.js";

// IMPORTACIÓN DE RUTAS
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import sessionRoutes from "./routes/session.routes.js";

// DEFINICIÓN DE VARIABLES GLOBALES
const app = express();
const PORT_APP = Number(PORT) || 8080;

// MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(setLogger);

// HANDLEBARS

// PASSPORT
initializePassport();
app.use(passport.initialize());

// SWAGGER SPECS
const specs = swaggerJSDoc(swaggerOptions);

// CREACIÓN DE RUTAS
app.use(`/api/${API_VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));
app.use(`/api/${API_VERSION}/carts`, cartRoutes);
app.use(`/api/${API_VERSION}/products`, productRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/sessions`, sessionRoutes);

// LEVANTAR EL SERVIDOR
app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Running on PORT: ${PORT_APP} || Environment: ${NODE_ENV}`);
});
