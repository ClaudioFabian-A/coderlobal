import express from "express";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";
import cors from "cors";



import productRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from './routes/viewsRouter.js';
import sessionsRouter from "./routes/sessionRouter.js";
import chatRouter from "./routes/chatRouter.js";
import usersRouter from "./routes/usersRouter.js";

import __dirname from "./utils.js";
import config from "./config/config.js";

import initializePassportStrategies from "./config/passportConfig.js";
import registerChatHandler from "./listeners/chatListener.js";

const app = express();
const corsOptions = {
  origin: 'http://localhost:8080',  // Sustituye con la URL de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8080;

const connection =  mongoose.connect(config.mongo.URL);

console.log(`base en linea `);
const swaggerSpecOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "coderlobal",
        description: "E-commerce",
      },
    },
    apis: [`${__dirname}/docs/**/*.yml`],
  };
  
  const swaggerSpec = swaggerJSDoc(swaggerSpecOptions);
  app.use(
    "/api-docs",
    swaggerUIExpress.serve,
    swaggerUIExpress.setup(swaggerSpec)
  );



app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassportStrategies();

app.use('/', viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/users", usersRouter);


app.use("/loggerTest", async (req, res) => {
    req.logger.log("fatal", "Logger test fatal");
    req.logger.log("error", "Logger test error");
    req.logger.log("warning", "Logger test warning");
    req.logger.log("info", "Logger test info");
    req.logger.log("http", "Logger test http");
    req.logger.log("debug", "Logger test");
    res.send({ status: 200, message: "Logger test" });
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({ error: error.message });
});


const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);

});

const socketServer = new Server(httpServer);



socketServer.on("connection", async (socket) => {
    registerChatHandler(io, socket);
    socket.on("disconnect", () => {
        console.log(`Usuario with ID : ${socket.id} disconnected `);
    });

});

