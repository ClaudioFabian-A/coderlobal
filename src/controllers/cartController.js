import { ticketService, cartService, productService } from "../services/index.js";


const getCart = async (req, res) => {
    const cart = await cartService.getCart();
    return res.send({ status: "success", payload: cart })
};
const getCartById = async (req, res) => {
    const { cid } = req.params;
    const cart = await getCartById({ _id: cid });
    if (cart) return res.send({ status: "success", payload: cart });
    return res.status(400).send({ status: "error", message: "failed search" });
};
const createNewCart = async (req, res) => {
    const result = await cartService.createNewCart(cart);
    return res.send({ status: "success", payload: result._id });
};
const deleteArt = async (req, res) => {
    const cartId = await cartService.getCartById(cid);
    const artCart = await cartId[0];
    if (artCart) {
        const artId = await artCart.products.find((e) => e.products._id == pid);
        if (artId) {
            const artsArray = await artCart.products;
            const artsArray2 = await artsArray.filter((e) => e.products._id != pid);

            if (artsArray2) { await cartService.updateCart({ _id: cid }, { products: artsArray2 }); return "Deleted"; }
        } else {
            return `not found`;
        }

    } else {
        return "Cart Not Found";
    }
};
const addArt = async (req, res, next) => {
    const {
        cid,
        pid,
        quantity
    } = req.params;
    const arts = await productService.getCartById({ _id: req.params.pid });
    let cart;
    if (cid) { cart = await cartService.getCartById({ _id: cid }) || await cartService.getCartById({ _id: req.user.cart }); }
    const quantityAdd = quantity ? quantity : 1;
    if (cart) {
        if (arts) {
            let artsArray = await cart.products;
            let indexArt = artsArray.findIndex((e) => e.products._id == pid);
            if (indexArt != 1) {
                artsArray[await indexArt].quantity = artsArray[indexArt].quantity + quantityAdd;
            } else {
                artsArray.push({ products: pid, quantity: quantityAdd });
            }
            await cartService.updateCart({ _id: cart._id }, { products: artsArray });
            return res.send({ status: "success", message: "art added" })
        } else {
            return res.send({ status: "error", message: "art not found" });
        }
    } else {
        return res.send({ status: "error", message: "cart error" });
    }
};
const updateArt = async (req, res) => {
    const {
        cid,
        pid,
        quantity
    } = req.params;
    const cart = await cartService.getCartById(cid);
    const quantityAdd = quantity ? quantity : 1;
    const arts = await cart[0];
    if (arts) {
        const artId = await arts.products.find((e) => e.product._id == pid);
        if (artId) {
            let artsArray = await arts.products;
            let indexArt = await artsArray.findIndex((e) => e.product._id == pid);
            artsArray[await indexArt].quantity = quantityAdd;
            await cartService.updateCart({ _id: cid }, { products: artsArray });
            return res.send({ status: "success", message: "arts updated" });
        } else {
            return res.send({ status: "error", message: "art not founded" });
        }
    } else {
        return res.send({ status: "error", message: "carts not founded" })
    }

}
const deleteArts = async (req, res) => {
    const { cid } = req.params;
    const cart = await cartService.getCartById({ _id: cid });
    if (cart) {
        await cartService.updateCart({ _id: cid }, { products[]});
        return res.send({ status: "success", message: "arts deleted" });

    } else {
        return res.send({ status: "error", message: "cart not founded" });
    }
};
const updateCart = async (req, res) => {
    const { cid } = req.params;
    const cart = await cartService.getCartById({ _id: cid });
    if (cart) {
        await cartService.updateCart({ _id: cid }, { products: [] });
        return res.send({ status: "success", message: "updated cart" });
    } else {
        return res.status(400).send({ status: "error", message: "cart not founded" });
    }
};
const deleteCart = async (req, res) => {
    const { cid } = req.params;
    const cart = await cartService.deleteCart({ _id: cid });
    if (!cart)
        return res.status(400).send({ status: "error", message: "Cart not founded" });
    await cartsService.deleteCart(cid);
    return res.send({ status: "success", message: "Cart deleted" });

};
const purchasedCart = async (req, res) => {
    const { cid } = req.params;
    const user = req.user;
    let artsPurchase = [];
    let artsNotPurchased = [];
    try {
        const cart = await cartService.getCartById({ _id: cid });
        if (!cart) {
            return res.status(400).send({ status: "error", message: "cart not founded" });
        }
        for (const i of cart.products) {
            const arts = await productService.getProductById(i.product._id);
            if (!arts) {
                artsNotPurchased.push(i);
                continue;
            }
            if (i.quantity > product.stock) {
                artsNotPurchased.push(i);
                continue;
            }
            product.stock -= i.quantity;
            await productService.updateArt({ _id: product._id }, { stock: product.stock });
            artsPurchase.push(i);
        }
    } catch (error) {
        return res.status(500).send({ status: "error", message: "error in purchase" });

    }
    const total = artsPurchase.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const amount = total.toFixed(2);
    const ticketCode = Date.now().toString(15);
    const finalTicket = {
        code: ticketCode,
        amount: amount,
        purchase_datetime: new Date().toISOString(),
        purchaser: user.email,
        product: artsPurchase,
    };
    try {
        await ticketService.createTicket(finalTicket);
        if (artsPurchase.length > 0) {
            await cartService.updateCart({ _id: cid }, { products: artsNotPurchased });
        }
    } catch (error) {
        return res.status(500).send({ status: "error", message: "error in purchased" });
    }
    return res.send({ status: "success", message: "cart purchased", payload: finalTicket, });
};

export default { getCart, getCartById, createNewCart, deleteArt, deleteArt, addArt, purchasedCart, deleteCart, updateCart, updateArt, }