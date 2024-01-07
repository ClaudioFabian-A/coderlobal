import BaseRouter from "./baseRouter.js"
import cartsControler from "../controllers/cartController.js";



class CartsRouter extends BaseRouter {
    init() {
        this.get("/:cid", ["USER", "PREMIUM"], cartsControler.getCartById);
        this.get("/:cid/purchase",["USER", "PREMIUM"], cartsControler.purchasedCart);
        this.post("/", ["USER", "PREMIUM"],cartsControler.createCart);
        this.put(":cid/products/:pid",["NO_AUTH"],cartsControler.addProduct);
        this.put("/products/:pid",["USER", "PREMIUM"],cartsControler.addProduct);
        this.delete("/:cid",["USER", "PREMIUM"],cartsControler.deleteArts);
        this.delete("/:cid",["ADMIN"],cartsControler.deleteCart);
    }
}



const cartRouter = new CartsRouter();
export default cartRouter.getRouter();