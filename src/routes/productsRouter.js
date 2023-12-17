// import { Router } from "express";
import baseRouter from "./baseRouter.js";
import productManager from "../DAO/mongo/managers/productManager.js";
import __dirname from "../utils.js";

const PM = new productManager();
// const router = Router();

class PRouter extends baseRouter {
    init() {
        this.get("/", ["PUBLIC"], async (req, res) => { const arts = await PM.paginate({}, { page: 1, limit: 10 }); res.send({ status: "success", payload: arts }); });
        this.get("/:pid", ["PUBLIC"], async (req, res) => {
            let id = parseInt(req.params.pid);
            const art = await PM.getProductById(id);
            if (art) {
                res.status(200).json(art);
            } else if (art === "Not Found") {
                res.status(400).json({ message: "art not found" });
            } else {
                res.status(400).json({ message: "art not found" });
            }
        });
        this.put("/:pid", ["ADMIN"], async (req, res) => {
            let id = parseInt(req.params.pid);
            const art = await PM.updateProduct(id, req.body);
            if (art) { res.status(200).json({ message: "update art", art }); } else { res.status(400).json({ message: "not update art" }); }
        });
        this.delete("/:pid", ["ADMIN"], async (req, res) => {
            let id = parseInt(req.params.pid);
            const art = await PM.deleteProduct(id);
            if (art) { res.status(200).json({ message: "deleted art", art }) } else {
                res.status(400).json({ message: "art not found" })
            }
        });
        this.post("/", ["ADMIN"], async (req, res) => {
            try {
                const art = await PM.addProduct(req.body);
                if (art) { res.status(400).json({ message: "Error in cart", art }); } else {
                    res.status(201).json({ message: "art created" }, art);
                }
            } catch (error) {
                throw new error("Error in cart", error);
            }
        });
    }
}
const ProductsRouters = new PRouter();
export default ProductsRouters.getRouter();




// router.get("/products", async (req, res) => {

//     const products = await PM.getProducts(req.query);
//     //console.log(products);
//     res.send(products)
//     // console.log(products);

// });
// router.get("/products/:pid", async (req, res) => {
//     let pid = req.params.pid;
//     if (pid == undefined) { res.send(await PM.getProducts()) } else {
//         let resp = await PM.getProductById(pid);
//         if (resp == false) { res.send("id not found"); } else { res.send(await PM.getProductById(pid)) }
//     }
// })
// router.post("/products/", async (req, res) => {
//     let {
//         title,
//         description,
//         category,
//         price,
//         thumbnail,
//         code,
//         stock
//     } = req.body;
//     let prodList = await PM.addProduct(
//         title,
//         description,
//         category,
//         price,
//         thumbnail,
//         code,
//         stock
//     );
//     if (prodList == "emptyvalues") {
//         res.status(400).send({ status: "error", error: "uncomplete vaules" })
//     } else if (prodList == "repeatvalue") {
//         res.status(400).send({ status: "error", error: "repeat values" })
//     } else {
//         res.status(200).send("ok")
//     }
// });
// router.put("/products/:pid", async (req, res) => {
//     const id = req.params.pid;
//     let {
//         title,
//         description,
//         category,
//         price,
//         thumbnail,
//         code,
//         stock
//     } = req.body;
//     let prodList = await PM.updateProduct(
//         id,
//         title,
//         description,
//         category,
//         price,
//         thumbnail,
//         code,
//         stock
//     );
//     if (prodList == "emptyvalue") {
//         res.status(400).send({ status: "error", error: "empty values" })
//     } else if (prodList == "codeRepetido") {
//         res.status(400).send({ status: "error", error: "dual code" })
//     } else {
//         res.status(200).send("ok")
//     }
// });
// router.delete("/products/:pid", async (req, res) => {
//     const id = req.params.pid;
//     let prodList = await PM.deleteProduct(id);
//     if (prodList) {
//         res.status(200).send("ok")
//     } else {
//         res.status(400).send({ status: "error", error: "not deleted" })
//     }
// })




// router.post("/carts/:cid/products/:pid", async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const { quantity } = req.body;
//     const addedArts = await productsServices.addPCartWithId(cid, pid, quantity);
//     if ((await addedArts) == "artAdded") {
//         res.send("art added to cart")
//     } else if ((await addedArts) == "artNotAdded") {
//         res.status(500).send({ status: "error", payload: "arID not Found" });
//     } else {
//         res.status(500).send({ status: "error", payload: "cartID not found" });
//     }
// });
// router.put("/carts/:cid/products/:pid", async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const { quantity } = req.body;
//     const addArts = await productsServices.addPCartWithId(cid, pid, quantity);
//     if ((await addArts) == "artAdded") {
//         res.send("added art")
//     } else if ((await addArts) == "artNotAdded") {
//         res.status(500).send({ status: "error", payload: "error product manager M" });
//     } else {
//         res.status(500).send({ status: "error", payload: "error products router N" });

//     }

// });
// router.put("/carts/:cid", async (req, res) => {

//     const cid = req.params.cid;
//     const product = req.body;
//     const addCart = await productsServices.addCart(cid, product);
//     if ((await addCart) == "updatedcart") {
//         res.send("adeddCart")

//     } else if ((await addCart) == "failedupdate") {
//         res.status(500).send({ status: "error", payload: "error produc Router O" });

//     } else {
//         res.status(500).send({ status: "error", payload: "error product router P" });
//     }


// });
// router.delete("/carts/:cid", async (req, res) => {
//     let cid = req.params.cid;
//     const deleteProdInCartProduct = await productsServices.deleteProdInCartProduct(cid);
//     if ((await deleteProdInCartProduct) == "deletedarticles") {
//         res.send("deleted articles");
//     } else {
//         res.status(500).send({ status: "error", payload: "error product manager O" })
//     }

// });
// router.delete("/carts/:cid/product/:pid", async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const deleteCartProduct = await productsServices.deleteCartProduct(cid, pid);
//     if ((deleteCartProduct) == "deletedarticle") {
//         res.send("deleted article");
//     } else if ((deleteCartProduct) == "artnotfound") {
//         res.status(500).send({ status: "error", payload: "error product router P" });
//     } else {
//         res.status(500).send({ status: "error", payload: "error product router Q" });
//     }
// });


// export default router;