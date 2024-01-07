import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";


import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { usersService, cartsService } from "../services/index.js";
import auth from "../services/auth.js";
import config from "./config.js";



const initializePassportStrategies = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email", session: false }, async (req, email, password, done) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            if (!firstName || !lastName || !email || !password)
             return done(null, false, { message: "incomplete values" });
            
            const userRedy = await usersService.getUserBy({ email });
            if (userRedy) return done(null, false, { message: "User Exist" });


            const hashPassword = await auth.createHash(password);
            const newUser = { firstName, lastName, email, password: hashPassword, };
            let cart;
            if (req.cookies["cart"]) { cart = req.cookies["cart"]; } else {
                const cartResult = await cartsService.createCart();
                cart = cartResult.id;
            }
            newUser.cart = cart;
            const result = await usersService.createUser(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);

        }
    }));
    passport.use("login", new LocalStrategy({ usernameField: "email", session: false }, async (email, password, done) => {
        try {
            if (email === config.app.ADMIN_EMAIL && password === config.app.ADMIN_PASSWORD) {
                const adminUser = {
                    role: "admin",
                    id: "0",
                    firstName: "admin",
                };
                return done(null, adminUser);
            }
            const user = await usersService.getUserBy({ email });
            if (!user) return done(null, false, { message: "Invalid Credentials" });
            const isValid = await auth.validatePassword(password, user.password);
            if (!isValid) return done(null, false, { message: "invalid Credentials" });
            return done(null, user);
        } catch (error) {
            return done(error);

        }
    }));
    passport.use("jwt", new JWTStrategy({ jwtFromRequest: ExtractJwt.fromExtractors([auth.extractAuthToken,]), secretOrKey: "Claudio", },
        async (payload, done) => {
            return done(null, payload);
        }));

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: config.github.CLIENT_ID,
                clientSecret: config.github.CLIENT_SECRET,
                callbackURL: "http://localhost:8080/api/sessions/githubcallback",
                passReqToCallback: true,
            },
            async ( accessToken, refreshToken, profile, done) => {
                const email = profile._json.email;

                let user = await usersService.getUserBy({ email });
                if (!user) {
                    const newUser = {
                        first_name: profile._json.name,
                        last_name: "",
                        age: "",
                        email,
                        password: "",
                        admin: false,
                    };
                    let cart;

                    if (req.cookies["cart"]) {
                        cart = req.cookies["cart"];
                    } else {
                        const cartResult = await cartsService.createCart();
                        cart = cartResult.id;
                    }

                    newUser.cart = cart;
                    const result = await usersService.createUser(newUser);
                    return done(null, result);
                } else {
                    return done(null, user);
                }
            }
        ));
    passport.use("google",
        new GoogleStrategy(
            {
                clientID: config.google.CLIENT_ID,
                clientSecret: config.google.CLIENT_SECRET,
                callbackURL: "http://localhost:8080/api/sessions/googlecallback",
                // passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                const { _json } = profile;
                const email = _json.email;

                const user = await usersService.getUserBy({ email: _json.email });
                if (user) {
                    return done(null, user);
                } else {
                    const newUser = {
                        firstName: _json.given_name,
                        lastName: _json.family_name,
                        email: _json.email,
                    };
                    let cart;

                    if (req.cookies["cart"]) {
                        cart = req.cookies["cart"];
                    } else {
                        const cartResult = await cartsService.createCart();
                        cart = cartResult.id;
                    }

                    newUser.cart = cart;
                    const result = await usersService.createUser(newUser);
                    return done(null, result);
                }
            }
        ));
};
export default initializePassportStrategies;