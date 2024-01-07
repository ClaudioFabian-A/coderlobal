import { generatedProducts } from "../mocks/products.js";
import { productsService, usersService } from "../services/index.js";
import errorHandler from "../helpers/errorHandler.js";



const paginateProducts = async (req, res) => {
    try {
        const products = await productsService.paginateProducts({}, { page: 1, limit: 10 });
        return res.send({ status: "success", payload: products });
    } catch (error) {
        errorHandler(error, next);
        req.logger.error(error);

    }
};
const getProductsBy = async (req, res) => {
    try {
        const { pid } = parseInt(req.params.pid);
        const product = await productsService.getProductBy(pid);
        if (product === "not founded") {
            return res.status(400).json({ message: "art not founded" });
        } else if (product) {
            return res.status(200).json(product);
        } else {
            return res.status(400).json({ message: "art not founded" });
        }
    } catch (error) {
        errorHandler(error, next);
        req.logger.error(error);

    }
};
const createProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbsnail } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            req.logger.warning("Incomplete data");
            return res.status(400).json({ message: "Error! art noit created" });
        }
        const newProduct = {
            title, description, code, price, stock, category, thumbsnail
        };

        if (req.user.role === "premium") {
            const user = await usersService.getUserBy({ _id: req.user.id });
            if (!user) {
                return res.status(404).send({ statu: "error", message: "user not found" });
            } newProduct.owner = user._id;
        } else { newProduct.owner = null; }
        const product = await productsService.createProduct(newProduct);
        if (product === "The insert code already exists") {
            req.logger.warning("The insert code already exists");
            return req.status(400).json({ message: "Error! art not created" });
        } else {
            req.logger.info("Product created");
            return res.status(201).json({ message: "Product created", product });
        }


    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const updateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productsService.updateProduct(id, req.body);
        if (product) {
            return res.status(200).josn({ message: "product updated", product });

        } else {
            return res.status(400).josn({ message: "product not updated" });
        }
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const deletProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productsService.deleteProduct(id);
        if (product === `Can't find this id : ${id}`) {
            req.logger.warning("Produc not found");
            return res.status(400).josn({ message: "art not deleted", product });
        } else if (product) {
            req.logger.info("Product deleted");
            return res.status(200).json({ message: "art deleted" });
        } else {
            req.logger.warning("Product not deleted");
            return res.status(400).json({ message: "art not deleted" });
        }
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
const mokingProducts = async (req, res) => {
    try {
        const products = [];
        for (let i = 0; i < 50; i++) {
            const mockProduct = generatedProducts();
            products.push(mockProduct);
        }
        req.logger.info("Mock Products created");

        return res.send({ statu: "success", payload: products });
    } catch (error) {
        req.logger.error(error);
        errorHandler(error, next);
    }
};
export default {
    paginateProducts,
    getProductsBy,
    createProduct,
    updateProduct,
    deletProduct,
    mokingProducts,
};