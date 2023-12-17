import chatModel from "../models/chatModels.js";
export default class chatManager{
    getMessages= async()=>{
        try {return await chatModel.find().lean();} catch (error) {return error; }};

    createMessage = async(message)=>{try {return await chatModel.create(message)} catch (error) {return error;}};
}