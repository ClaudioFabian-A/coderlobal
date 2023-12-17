import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";


// import userManager from "../DAO/mongo/managers/userManager.js"
// import cartsManager from "../DAO/mongo/managers/cartManager.js";
import {cartServices, userServices} from "../services/index.js";
import auth from "../services/auth.js";
import config from "./config.js";

// const US = new userManager();
// const CS = new cartsManager();

const initializePassportStrategy = () => {
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email", session: false }, async (req, email, password, done) => {
        try {
            const { firstName, lastName } = req.body;
            if (!firstName || !lastName) return done(null, false, { message: "incomplete values" });
            const userRedy = await US.getUserBy({ email });
            if (userRedy) return done(null, false, { message: "User Exist" });
            const hashPassword = await auth.createHash(password);
            const newUser = { firstName, lastName, email, password: hashPassword, };
            let cart;
            if (req.cookies["cart"]) { cart = req.cookies["cart"]; } else {
                cartAwaited = await CS.createNewCart();
                cart = cartAwaited.id;
            }
            newUser.cart = cart;
            const result = await US.createUser(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);

        }
    }));
    passport.use("login", new LocalStrategy({ usernameField: "email", session: false }, async (email, password, done) => {
        try {
            if (email === config.app.ADMIN_EMAIL && password === config.app.ADMIN_PASSWORD) {
                const adUser = {
                    role: "admin",
                    id: "0",
                    firstName: "admin",
                };
                return done(null, adUser);
            }
            const user = await US.getUserBy({ email });
            if (!user) return done(null, false, { message: "Invalid Credentials" });
            const isValid = await auth.validatePassword(password, user.password);
            if (!isValid) return done(null, false, { message: "invalid Credentials" });
            return done(null, user);
        } catch (error) {
            return done(error);

        }
    }));
    passport.use("JWT", new JWTStrategy({ jwtFromRequest: ExtractJwt.fromExtractors([auth.extractAuthToken,]), secretOrKey: "Claudio", },
        async (payload, done) => {
            return done(null, payload);
        }));
};
export default initializePassportStrategy;