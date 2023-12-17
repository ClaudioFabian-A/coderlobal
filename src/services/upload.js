import multer from "multer";
import __dirname from "../utils";

const locked = multer.diskStorage({destination:function(req,file,callback){return callback(null,`${__dirname}/public/img`);},
filename:function(req,file,callback){return callback(null,`${Date.now()}-${file.originalname}`);},});
const upLoad= multer({locked});
export default upLoad;