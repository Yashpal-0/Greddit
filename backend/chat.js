const mongoose =require("mongoose");

const Chatschema= new mongoose.Schema(
    {
        sender:{type : String },
        reciever:{type : String},
        message:{type : String},
       
    },
    {
        timestamps:[true],
        collection:"Chat",
    }
);
module.exports=mongoose.model("Chat",Chatschema);

