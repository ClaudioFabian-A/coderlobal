import { Router } from 'express';
import passportCall from '../middlewares/passportCall.js';
import executePolices from '../middlewares/executePolices.js';
import CSetter from '../middlewares/setter.js';
export default class BasRouter {
    constructor() {
        this.router = Router();
        this.init();
    }
    init() { }
    getRouter() {
        return this.router;
    };
    get(path, policies, ...callbacks) {
        this.router.get(path, this.generateCustomResponses, passportCall("JWT", { strategyType: "JWT" }), CSetter, executePolices(policies), this.applyCallbacks(callbacks));

    };
    post(path, policies, ...callbacks) {
        this.router.get(path, this.generateCustomResponses, passportCall("JWT", { strategyType: "JWT" }), CSetter, executePolices(policies), this.applyCallbacks(callbacks), this.applyCallbacks(callbacks))
    };
    put(path, policies, ...callbacks) {
        this.router.get(path, this.generateCustomResponses, passportCall("JWT", { strategyType: "JWT" }), CSetter, executePolices(policies), this.applyCallbacks(callbacks), this.applyCallbacks(callbacks))
    };
    delete(path, policies, ...callbacks) {
        this.router.get(path, this.generateCustomResponses, passportCall("JWT", { strategyType: "JWT" }), CSetter, executePolices(policies), this.applyCallbacks(callbacks), this.applyCallbacks(callbacks))
    };
    generateCustomResponses(req, res, next) {

        res.sendSuccess = (message) => res.send({ status: "success", message });
        res.sendSuccessWithPayload = (payload) =>
            res.send({ status: "success", payload });
        res.sendInternalError = (error) =>
            res.status(500).send({ status: "error", error });
        res.sendUnauthorized = (error) =>
            res.status(401).send({ status: "error", error });
        res.sendForbidden = (error) =>
            res.status(403).send({ status: "error", error });
        next();
    };


    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                params[1].sendInternalError(error);

            }
        });
    }
}
