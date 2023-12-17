import baseRouter from "./baseRouter.js"
import { Router } from "express";
import cartsManager from "../DAO/mongo/managers/cartManager.js";
import productManager from "../DAO/mongo/managers/productManager.js"
import  __dirname  from "../utils.js";


const PManager = new productManager();
const CManager = new cartsManager();


class cartsRouter extends baseRouter {
    init() {
        this.get("/:cid", ["USER"], async (req, res) => {
            const { cid } = req.params;
            const cart = await CManager.findOne({ _id: cid });
            if (!cart) { return res.status(404).send({ status: "error", message: "not found" }) } else { res.send({ status: "success", payload: cart }); }
        });
        this.post("/carts/", async (req, res) => {
            let cartCreate = await CManager.createNewCart();
            res.send({ status: "success", payload: cart })
        })
    }
}



const CartRouter = new cartsRouter();
export default CartRouter.getRouter();