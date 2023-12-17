import cartManager from "../DAO/mongo/managers/cartManager.js";
const CS = new cartManager();


const CSetter = async (req, res, next) => {
    if (!req.cookies.cart && !req.user) {
        const cart = await CS.createNewCart();
        res.cookie("cart", cart._id.toString());
    }
    next();
};
export default CSetter;