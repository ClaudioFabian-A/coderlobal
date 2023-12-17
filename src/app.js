import express from "express";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";

import productRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from './routes/viewsRouter.js';
import sessionRouter from "./routes/sessionRouter.js";
// import chatRouter from "./routes/chatRouter.js";

import __dirname from "./utils.js";
import config from "./config/config.js";
import initializesStrategy from "./config/passportConfig.js";

import ProductManager from "./DAO/mongo/managers/productManager.js";
import ChatManager from "./DAO/mongo/managers/chatManager.js";



const app = express();
const PORT = process.env.PORT || 8080;

const connection = mongoose.connect(config.mongo.URL);
console.log(connection);
console.log(`base en linea`);


app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializesStrategy();

app.use('/', viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use('/api/sessions', sessionRouter);
app.use("/", chatRouter);


const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);

});

const socketServer = new Server(httpServer);

const prodManager = new ProductManager();
const chatManager = new ChatManager();





socketServer.on("connection", async (socket) => {

    const prodList = await prodManager.getProducts();
    // let chatManager = new ChatManager();
    // let chat = await chatManager.getMessages();
    console.log("Cliente conectado con id: ", socket.id);
    socketServer.emit("prodList", prodList);

    socket.on("updateProduct", async (product) => {
        let prodManager = new ProductManager()
        await prodManager.addProduct(obj)

        let prodList = await prodManager.getProducts({});
        socketServer.emit("prodList", prodList);
    });
    

    socket.on("articleDeleted", async (id) => {
        // let prodManager = new ProductManager();

        await prodManager.deleteProduct(id);
        // let newProdList = new ProductManager()

        let prodList = await prodManager.getProducts({});
        socketServer.emit("prodList", prodList);
    });

    socket.on("disconnected", () => {
        console.log("Cliente desconectado");
    });
    let chatManager = new ChatManager();
    let chat = await chatManager.getMessages();
    console.log("Cliente conectado con id: ", socket.id);
    socketServer.emit("prodList", prodList);
    socketServer.emit("message", chat);

    socket.on("newUser", (userValue) => {
        console.log("userValue", userValue);
        socket.broadcast.emit("bCast", userValue);
    });
    socket.on("disconnected", () => {
        console.log(`user ${socket.id} desconectado`);
    });
    socket.on("message", async (data) => {
        console.log(data);
        await chatManager.createMessage(data);
        socketServer.emit("pChat", await chatManager.getMessages());
    });
});










