import basRouter from "../routes/baseRouter.js";

import productManager from "../DAO/mongo/managers/productManager.js";

import { getValidFilters } from "../utils.js";

const prodManager = new productManager();



class viewsRouter extends basRouter {
    init() {
        this.get("/register", ["NO_AUTH"], async (req, res) => { res.render("register");});
        this.get("/login", ["NO_AUTH"], async (req, res) => { res.render("login"); });
        this.get("/", ["PUBLIC"], async (req, res) => { res.render("home"); });
        this.get("/realTimeProducts", ["ADMIN"], async (req, res) => { const prodList = await prodManager.getProducts(); res.render("realTimeProducts", { prodList }); });
        this.get("/products", ["PUBLIC"], async (req, res) => {
            let { page = 1,
                limit = 10,
                sort,
                order = 1,
                ...filters } = req.query;
            const haveFilters = getValidFilters(filters, "product");
            let theSort = {};
            if (sort) { theSort[sort] = order; }
            const paginate = await prodManager.paginateProducts(haveFilters, {
                page,
                lean: true,
                limit,
                sort: theSort,
            });
            res.render("product", {
                products: paginate.docs,
                hasNextPage: paginate.hasNextPage,
                hasPrevPage: paginate.hasPrevPage,
                nextPage: paginate.nextPage,
                prevPage: paginate.prevPage,
                page: paginate.page,

            });
        });
        this.get("/chat", ["PUBLIC"], (req, res) => { res.render("chat"); });
        
    }
}
const ViewsRouter = new viewsRouter();
export default ViewsRouter.getRouter();
