const mongoose =require("mongoose");


const UserScehma= new mongoose.Schema(
    {
        fname:{type : String},
        lname:{type : String},
        email:{type : String,unique:true},
        password:{type : String},
        age :{type:String},
        username:{type : String,unique:true},
        contact :{type:String},
        followers:[String],
        followings:[String],
        saved:[String],
    },
    {
        collection:"UserInfo",
    }
);
mongoose.model("UserInfo",UserScehma);

