import errorHandler from "../helpers/errorHandler.js";
import { ticketsService, cartsService, productsService } from "../services/index.js";


import MailerService from "../services/mailerService.js";
import mailTemplates from "../constants//mailTemplates.js";



const getCart = async (req, res, next) => {
    try {
        const carts = await cartsService.getCart();
        return res.send({ status: "success", payload: carts })
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const getCartById = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.getCartById({ _id: cid });
        if (!cart)
          return res
            .status(404)
            .send({ status: "error", message: "Cart not found" });
        return res.send({ status: "success", payload: cart });
      } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
      }
    
};
const createCart = async (req, res, next) => {
    try {
        const result = await cartsService.createCart(cart);
        req.logger.info("cart created ", result._id);

        return res.send({ status: "success", payload: result._id });
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const addProduct = async (req, res, next) => {
    try {
        const { cid, pid, quantity } = req.params;
        const product = await productsService.getProductBy({
            _id: req.params.pid,
        });
        let cart;
        if (cid) {
            cart = await cartsService.getCartById({ _id: cid });
        } else {
            cart = await cartsService.getCartById({ _id: req.user.cart });
        }
        const quantityAdd = quantity ? quantity : 1;

        if (cart && product) {
            if (req.user.role === "PREMIUM" && product.owner === req.user.id) {
                return res
                    .status(403)
                    .send({ status: "error", message: "Cannot add own product to cart" });
            }

            let arrayProducts = await cart.products;
            let positionProduct = arrayProducts.findIndex(
                (product) => product.product._id == pid
            );

            if (positionProduct != -1) {
                arrayProducts[positionProduct].quantity =
                    arrayProducts[positionProduct].quantity + quantityAdd;
            } else {
                arrayProducts.push({ product: pid, quantity: quantityAdd });
            }

            await cartsService.updateCart(
                { _id: cart._id },
                { products: arrayProducts }
            );
            return res.send({ status: "success", message: "Added successfully" });
        } else {
            return res
                .status(404)
                .send({ status: "error", message: "Product or Cart not found" });
        }


    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};

const updateArt = async (req, res) => {
    try {
        const {
            cid,
            pid,
            quantity
        } = req.params;
        const cart = await cartsService.getCartById(cid);
        const quantityAdd = quantity ? quantity : 1;
        const arts = await cart[0];
        if (arts) {
            const artId = await arts.products.find((e) => e.product._id == pid);
            if (artId) {
                let artsArray = await arts.products;
                let indexArt = await artsArray.findIndex((e) => e.product._id == pid);

                artsArray[await indexArt].quantity = quantityAdd;
                await cartsService.updateCart({ _id: cid }, { products: artsArray });
                return res.send({ status: "success", message: "arts updated" });
            } else {
                return res.send({ status: "error", message: "art not founded" });
            }
        } else {
            return res.send({ status: "error", message: "carts not founded" })
        }
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }

}
const deleteArts = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.getCartById({ _id: cid });
        if (cart) {
            await cartsService.updateCart({ _id: cid }, { products: [] });
            return res.send({ status: "success", message: "arts deleted" });

        } else {
            return res.send({ status: "error", message: "cart not founded" });
        }
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.getCartById({ _id: cid });
        if (cart) {
            await cartsService.updateCart({ _id: cid }, { products: [] });
            return res.send({ status: "success", message: "updated cart" });
        } else {
            return res.status(400).send({ status: "error", message: "cart not founded" });
        }
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.deleteCart({ _id: cid });
        if (!cart)
            return res.status(400).send({ status: "error", message: "Cart not founded" });
        await cartsService.deleteCart(cid);
        return res.send({ status: "success", message: "Cart deleted" });
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const purchasedCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const user = req.user;
        let artsPurchase = [];
        let artsNotPurchased = [];
        try {
            const cart = await cartsService.getCartById({ _id: cid });
            if (!cart) {
                return res.status(400).send({ status: "error", message: "cart not founded" });
            }
            if (req.user.role === "PREMIUM") {
                const userProducts = cart.products.filter(
                    (item) => item.product.owner === req.user.id
                );
                if (userProducts.length > 0) {
                    return res.status(403).send({
                        status: "error",
                        message: "Cannot purchase own products",
                    });
                }
            }
            for (const i of cart.products) {
                const arts = await productsService.getProductBy(i.product._id);
                if (!arts) {
                    artsNotPurchased.push(i);
                    continue;
                }
                if (i.quantity > product.stock) {
                    artsNotPurchased.push(i);
                    continue;
                }
                product.stock -= i.quantity;
                await productsService.updateArt({ _id: product._id }, { stock: product.stock });
                artsPurchase.push(i);
            }
        } catch (error) {
            req.logger.error("An error occurred:", error);
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
            await ticketsService.createTicket(finalTicket);
            if (artsPurchase.length > 0) {
                await cartsService.updateCart({ _id: cid }, { products: artsNotPurchased });
            }
        } catch (error) {
            req.logger.error("An error occurred:", error);
            return res.status(500).send({ status: "error", message: "error in purchased" });
        }
        try {
            const mailerService = new MailerService();
            const payload = {
                nombreUsuario: req.user.name,
                productos: productPurchase,
            };
            const result = await mailerService.sendMail(
                [req.user.email],
                mailTemplates.PURCHASE,
                {
                    name: req.user.name,
                    ticket: newTicket.code,
                    products: newTicket.products,
                    total: newTicket.amount,
                    date: newTicket.purchase_datetime,
                }
            );
        } catch (error) {
            req.logger.error(
                `Falló el envío de correo para ${req.user.email}`,
                error
            );
        }
        req.logger.info("Cart purchased successfully");
        return res.send({ status: "success", message: "cart purchased", payload: newTicket, });
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};

export default { getCart, getCartById, createCart, deleteArts, addProduct, purchasedCart, deleteCart, updateCart, updateArt, };