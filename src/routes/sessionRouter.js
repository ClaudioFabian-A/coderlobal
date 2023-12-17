import jwt from "jsonwebtoken";
import passportCall from "../middlewares/passportCall.js";
import BasRouter from "./baseRouter.js";
import config from "../config/config.js";




class sessionRouter extends BasRouter {
    init() {
        
        this.post(
            "/register",
            ["NO_AUTH"],
            passportCall("register", { strategyType: "LOCALS" }),
            async (req, res) => {
              res.cookieLine("cart");
              res.sendSuccessWithPayload("Registered");
            }
          );
           
   
        this.post("/login", ["NO_AUTH"], passportCall("login", { strategyType: "LOCALS" }), async (req, res) => {
            const userToken = {
                name: `${req.user.firstName} ${req.user.lastName}`,
                id: req.user._id,
                role: req.user.role,
                cart: req.user.cart,
            };
            const token = jwt.sign(tokenizedUser, config.JWT.SECRET, {
                expiresIn: "1d",
            });
            // const token = jwt.sing(userToken, config.jwt.SECRET, { expiresIn: "2d", });
            res.cookie(config.JWT.COOKIE, token);
            res.cookieLine("cart");
            res.sendSuccessWithPayload("logged");
            // res.render("products")
        })
        this.get("/current", ["AUTH"], async (req, res) => { res.sendSuccessWithPayload(req.user); });
    }

}
const sessionsRouter = new sessionRouter();
export default sessionsRouter.getRouter();

