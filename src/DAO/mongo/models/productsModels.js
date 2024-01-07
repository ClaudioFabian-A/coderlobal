import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";


const collection = "Products";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        required: true,
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
        default: "admin",
      },

}, { timestamps: true });
schema.plugin(MongoosePaginate);
schema.plugin(MongoosePaginate);
const productsModel = mongoose.model(collection, schema);
export default productsModel;