import { cartsService } from "../services/index.js";


const CSetter = async(req, res, next) => {
    if (req.user && req.cookies.cart) {
        res.clearCookie("cart");
        return next();
    }
    if (!req.cookies.cart && !req.user) {
        const cart = await cartsService.createCart();
        res.cookie("cart", cart._id.toString());
    }
    next();
};
export default CSetter;