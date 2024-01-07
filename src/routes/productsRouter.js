import BaseRouter from "./baseRouter.js";
import productController from "../controllers/productController.js";



class PRouter extends BaseRouter {
    init() {
        this.get("/", ["PUBLIC"], productController.paginateProducts);
        this.get("/:pid", ["PUBLIC"], productController.getProductsBy);
        this.put("/:pid", ["ADMIN"], productController.updateProduct);
        this.delete("/:pid", ["ADMIN"], productController.deletProduct);
        this.post("/", ["ADMIN"], productController.createProduct);
        this.get("/mockingproducts",["PUBLIC"],productController.mokingProducts);
    }
}
const ProductsRouters = new PRouter();
export default ProductsRouters.getRouter();


