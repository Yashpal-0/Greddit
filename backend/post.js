const mongoose =require("mongoose");

const Post= new mongoose.Schema(
    {   
        sname:{type:String},
        postedby:{type:String},
        post:{type:String},
        liked:[String],
        disliked:[String],
        comment:[
                { 
                    commented_by:{type:String},
                    msg:{type:String},
                }
                ]    ,
        saved:[String],
    },
    {
        timestamps:[true],
        collection:"Post",
    }
);
mongoose.model("Post",Post);

