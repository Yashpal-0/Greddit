const router=require("express").Router();
const passport=require("passport");

router.get("/loggin/success",(req,res)=>{

    if(req.user){
        res.status(200).json({
            error:false,
            message:"Authentication Successfull",
            user:req.user,
        })
    }
    else
    {
        res.status(403).json({
            error:true,
            message:"Authentication Failure",
        })
    }
});

router.get("/loggin/failed",(req,res)=>{

    res.status(401).json({
        error:true,
        message:"Log in Failure",
    });
});

router.get(
    "/google/callback",
    passport.authenticate("google",{successRedirect:process.env.CLIENT_URL,
        failureRedirect:"/login/failed",
    })
);

router.get("/google",passport.authenticate("google",["profile","email"]));

router.get("/loggout",(req,res)=>{
    req.logOut();
    res.redirect(process.env.CLIENT_URL);
})

module.exports=router;