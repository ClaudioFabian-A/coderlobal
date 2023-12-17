import {Router} from "express";
import chatManager from "../DAO/mongo/managers/chatManager.js";

let ChatManager = new chatManager();
const chatRouter = Router();

chatRouter.get("/chat", async( req,res)=>{
    res.send( await ChatManager.getMessages())
});
chatRouter.post("/chat", async(req,res)=>{
    let {usuario, chat}= param.body;
    res.send( await ChatManager.createMessage(usuario, chat));
})
// export default chatRouter;

