import { productsService, cartsService, ticketsService, usersService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { getValidFilters } from "../utils.js";
import errorHandler from "../helpers/errorHandler.js";
import auth from "../services/auth.js";

const home = async (req, res, next) => { try { return res.render("home"); } catch (error) { req.logger.error(error); errorHandler(error, next); } };
const register = async (req, res, next) => { try { return res.render("register"); } catch (error) { req.logger(error); errorHandler(error, next); } };
const login = async (req, res, next) => { try { return res.render("login"); } catch (error) { req.logger.error(error); error.errorHandler(error, next); } };
const profile = async (req, res, next) => { try { return res.render("profile"); } catch (error) { req.logger.error(error); errorHandler(error, next); } };
const products = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, sort, order = 1, ...filters } = req.query;
        const cleanFilters = getValidFilters(filters, "product");
        let sortResult = {};
        if (sort) { sortResult[sort] = order; }
        const pagination = await productsService.paginateProducts(cleanFilters, { page, lean: true, limit, sort: sortResult, });
        res.render("productos", {
            products: pagination.docs,
            hasNextPage: pagination.hasNextPage,
            hasPrevPage: pagination.hasPrevPage,
            nextPage: pagination.nextPage,
            prevPage: pagination.prevPage,
            page: pagination.page,


        });
    } catch (error) { req.logger.error(error); errorHandler(error, next); }
};
const chat = async (req, res, next) => { try { res.render("chat"); } catch (error) { req.logger.error(error), errorHandler(error, next); } };
const realTimeProducts = async (req, res, next) => { try { res.render("realTimeProducts"); } catch (error) { req.logger.error(error), errorHandler(error, next); } };
const cart = async (req, res, next) => { try { const cart = await cartsService.getCartById(req.user._id); return res.render("cart", { cart }); } catch (error) { req.logger.error(error), errorHandler(error, next); } };
const purchase = async (req, res, next) => { try { const ticket = await ticketsService.getCartById(req.user.cart._id); return res.render("purchase", { ticket }); } catch (error) { req.logger.error(error), errorHandler(error, next); } };
const restorePassword = async (req, res, next) => {
    try {
        const { newPassword, token } = req.body;
        if (!newPassword || !token) return res.sendBadRequest("incomplete values");
        try {
            const { email } = jwt.verify(token, config.JWT.SECRET);
            const user = await usersService.getUserBy({ email });
            if (!user) { return res.sendBadRequest("User doesnt't exist"); }
            const isSamePassword = await auth.validatePassword(newPassword, user.password);

            if (isSamePassword)
                return res.sendBadRequest("New Password Cannot be equal to Old Password");
            const newHash = await auth.createHash(newPassword);
            await usersService.updateUser(user._id, { password: newHash });
            res.sendSuccess();

        } catch (error) {
            req.logger.error(error);
            res.sendBadRequest("Invalid Token");


        }
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const passwordRestore = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token)
            return res.render("RestorePasswordError", {
                error:
                    "Ruta inválida, por favor solicita un nuevo link de restablecimiento",
            });
        try {
            jwt.verify(token, config.JWT.SECRET);
            req.logger.info("Link valid to restore password");
            return res.render("passwordRestore", { token });
        } catch (error) {
            req.logger.error(error);
            console.log(Object.keys(error));
            if (error.expiredAt) {
                req.logger.warning("Link expired", error.expiredAt);
                return res.render("RestorePasswordError", {
                    error:
                        "Link expirado, por favor solicita un nuevo link de restablecimiento",
                });
            }
            req.logger.warning("Trying to restore password with invalid Link");
            return res.render("RestorePasswordError", {
                error:
                    "Link inválido o corrupto. Por favor solicita un nuevo link de restablecimiento",
            });
        }
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const premium = async (req, res, next) => {
    try {
        return res.render("premium");
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const productCreator = async (req, res, next) => {
    try {
        return res.render("productCreator");
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
export default { home, register, login, profile, products, chat, realTimeProducts, cart, purchase, passwordRestore, restorePassword, premium, productCreator, };

