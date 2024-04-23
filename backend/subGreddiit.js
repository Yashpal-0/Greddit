const mongoose =require("mongoose");


const SubGreddiit= new mongoose.Schema(
    {
        sname:{type : String ,unique:true},
        owner:{type : String},
        desc:{type : String},
        tags:[String],
        Banned_keywords:[String],
        follower :[String],
        image:{type:String},
        pending:[String],
        reported:[{
            postid:{type:String},
            reportedby:{type:String},
            reportedto:{type:String},
            report:{type:String},
            post:{type:String},
            fade:{type:Boolean,default:true},
            countdown:{type:Boolean,default:false},
            date:{type:String}
        }],
        blocked:[{type: String ,unique:false}],
        stats:[
                {
                    date:{type:String},
                    no_of_user:{type:Number},
                    no_of_post:{type:Number},
                    no_of_visitor:{type:Number},
                    no_of_report:{type:Number},
                    no_of_delete:{type:Number},
                }
              ]
       
    },
    {
        timestamps:[true],
        collection:"Sub",
    }
);
mongoose.model("Sub",SubGreddiit);

