// require("dotenv").config();
const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SCERET = "sdfghjkll1234567[](){}//\\:-)8=========>"
const session = require('express-session');
// var CASAuthentication = require('node-cas-authentication');
const CASAuthentication = require('node-cas-authentication');

// const cas = new CASAuthentication({
//     cas_url         : 'https://my-cas-host.com/cas',
//     service_url     : 'https://my-service-host.com',
//     cas_version     : '3.0',
//     renew           : false,
//     is_dev_mode     : false,
//     dev_mode_user   : '',
//     dev_mode_info   : {},
//     session_name    : 'cas_user',
//     session_info    : 'cas_userinfo',
//     destroy_session : false,
//     return_to       : 'https://my-website.com/'
// });
// const passport = require("passport");
// const passportSetup= require("./passport");
// const authRoute = require("./routes/auth");
app.use(express.json())
app.use(cors());
var nodemailer = require("nodemailer");
// const { cookie } = require("express/lib/response");
// const cookieSession = require("cookie-session");
// const { session } = require("passport");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false, limit: "5mb" }));
app.use(session({
    secret: 'super secret key',
    resave: false,
    saveUninitialized: true
}));



const mongobdURL = "mongodb+srv://admin123:admin123@greddiit.zuktoko.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', false);
mongoose.connect(mongobdURL, { useNewUrlParser: true }).then(() => { console.log("conected to mongodb"); })
    .catch(e => console.log(e));

const port = process.env.PORT || 8080;
app.listen(8080, '0.0.0.0', () => {
    console.log("Sever Started");
});

require("./userDetails");
require("./subGreddiit");
require("./post");
require("./chat")
const User = mongoose.model("UserInfo");
const Sub = mongoose.model("Sub");
const Post = mongoose.model("Post");
const Chat = mongoose.model("Chat");

//cas object
let cas = new CASAuthentication({
    cas_url: 'https://login.iiit.ac.in/cas',
    service_url: 'http://localhost:8080/cas',
    cas_version: '3.0',
    renew: true,
    is_dev_mode: false,
    dev_mode_user: '',
    dev_mode_info: {},
    session_name: 'cas_user',
    session_info: 'cas_userinfo',
    destroy_session: true,
    return_to : 'http://localhost:3000/userprofile'
});

app.use("/cas", cas.bounce, async (req, res) => {
    try {
        console.log(req.session);
        const email = req.session["cas_userinfo"]["e-mail"];
        const user_find = await User.findOne({ email: email });
        const token = jwt.sign({ email }, JWT_SCERET);
        res.send({data:token})

        if (user_find) {
            return res.redirect(`http://localhost:3000/cas/${user_find._id}`)
        }
        console.log(req.session);
        const firstname = req.session["cas_userinfo"]["firstname"];
        const lastname = req.session["cas_userinfo"]["lastname"];
        const newUser = {
            email: email,
            fname: firstname,
            lname: lastname,
            username: "",
            age: "",
            contact: "",
            password: "",
            followers: [],
            followings: [],
            saved: [],
        }
        console.log(token);
        const user_create = await User.create(newUser);
        res.send({data:req.session});
        return res.redirect(`http://localhost:3000/cas/${user_create._id}`)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
});
app.get("/logoutcas", cas.logout);
app.get( '/authenticate', cas.bounce_redirect );

// app.get("/logout", cas.logout);

app.post("/register", async (req, res) => {
    const { fname, lname, email, password, age ,contact,username} = req.body;
    // console.log(username);
    const Encryptedpassword = await bcrypt.hash(password, 12);
    try {
        const oldUser = await User.findOne({ email });
        // const old = await User.findOne({ contact });
        if(!fname||!lname||!email||!password||!age||age<=0||!contact||contact.length<10||!username)
        {
            return res.send({ error: "Input Wrong" });
        }
        if (oldUser) {
            // return alert("User Already Exsist meri jaan");
            return res.send({ error: "User Already Exsist" });
        }
        // if (old) {
        //     // return alert("User Already Exsist meri jaan");
        //     return res.send({ error: "User Already Exsist" });
        // }

        await User.create({
            fname,
            lname,
            email,
            password: Encryptedpassword,
            age,
            contact,
            username,
        });
        const token = jwt.sign({ email }, JWT_SCERET);

        if (res.status(201)) {
            if(oldUser)
            return res.json({ status: "done", data: token });
            else
            return res.json({ status: "ok", data: token });

        }
        else {
            return res.send({ error: "ERROR" });
        }

        // res.send({ status: "ok" });
        //  alert("Registered Successfully meri jaan");

    }
    catch (error) {
        res.send({ error: "error123" });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // console.log(email,password);

    const user = await User.findOne({email});
    if (!user) {
        // alert("User Not Exsist meri jaan");
        return res.send({ error: "User Not Exsist" });
    }
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, JWT_SCERET);

        if (res.status(201)) {
            return res.json({ status: "ok", data: token })
        }
        else {

            return res.send({ error: "ERROR" });
        }
    }

    res.send({ error: "User Not Exsist or Password Incorrect" });

})

app.post("/Userprofile", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
        if (user) {
            const email = user.email;
            User.findOne({ email }).then((data) => {
                res.send({ status: "ok", data: data })
            })

        }

        // console.log(email)
        { res.send({ error: "Error", data: error }); }

    }
    catch (error) { }
})

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.json({ status: "User Not Found" });
        }
        const secret = JWT_SCERET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: '5m' });
        const link = `http://localhost:8080/reset-password/${oldUser._id}/${token}`;
        console.log(link);

        // let testAccount=await nodemailer.createTestAccount();
        var transporter = nodemailer.createTransport({
            service: 'gmail',

            auth: {
                user: 'kabirshamlani04@gmail.com',
                pass: 'yyebhnwpdvlimbzn',
            },
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Password reset',
            text: link 
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        // console.log(link);
    }
    catch (error) {
        console.log(error);
    }
})

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Found" });
    }
    const secret = JWT_SCERET + oldUser.password;

    try {
        const verify = jwt.verify(token, secret);
        // res.send("User Verified");
        res.render("index", { email: verify.email, status: "Not Verified" });

    } catch (error) {
        console.log(error);
        res.send("User Not verfied");

    }
    // console.log(req.params);
    // res.send("done");

});

app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Found" });
    }
    const secret = JWT_SCERET + oldUser.password;

    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 12);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set:
                {
                    password: encryptedPassword,
                },
            }

        );
        // res.json({status:"Password Updated Successfully"});
        res.render("index", { email: verify.email, status: "verified" });

    } catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
        // res.send("User Not verfied");

    }
    // console.log(req.params);
    // res.send("done");

});

app.post("/edit", async (req, res) => {
    const { email, fname, lname, age } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.json({ status: "User Not Found" });
        }
        await User.updateOne(
            {
                _id: oldUser._id,
            },
            {
                $set:
                {
                    lname: lname,
                    fname: fname,
                    age: age,
                },
            }
        );
        res.send({ status: "Profile Updated" })
    }
    catch (error) {
        res.send({ error: "error" });
    }
});

app.post("/google", async (req, res) => {
    const { email, fname, lname, password, age } = req.body;
    try {
        const Encryptedpassword = await bcrypt.hash(password, 12);
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            await User.create({
                fname,
                lname,
                email,
                password,
                age,
            });

        }
        const token = jwt.sign({ email }, JWT_SCERET);

        if (res.status(201)) {
            if(oldUser)
            return res.json({ status: "done", data: token });
            else
            return res.json({ status: "ok", data: token });

        }
        else {
            return res.send({ error: "ERROR" });
        }



    }
    catch (error) {
        console.error(error);
        res.send({ error: error });
    }
});

app.post("/newsub", async (req, res) => {
    const { sname, desc, tags, Banned_keywords, token, image } = req.body;

    const user = jwt.verify(token, JWT_SCERET);
    const email = user.email;
    const old = await Sub.findOne({ sname });
    console.log(email)
    if (!user) {
        return res.send({ status: "Something Went Wrong" });
    }
    if (old) {
        return res.send({ status: "Sub-name Already in Use" });
    }
    const { follower } = [];
    // console.log(oldUser);
    try {
        await Sub.create({
            sname,
            desc,
            tags,
            Banned_keywords,
            owner: email,
            follower: [email],
            image,
        });
        res.send({ status: "ok" });
    } catch (error) {

    }

});

app.post("/mysub", async (req, res) => {

    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
        const email = user.email;

        Sub.find({ owner: email }).then((data) => {
            // console.log(data);
            res.send({ status: "ok", data: data })
        })
        { res.send({ error: "Error", data: error }); }

    }
    catch (error) { }

});

app.post("/deletesub", async (req, res) => {
    const id = req.body.id;
    // console.log(id);
    try {
        const check = await Sub.findByIdAndDelete({ _id: id });
        // console.log(check);
        const find = await Post.find({ sname: check.sname });
        const find1 = await Post.deleteMany({ sname: check.sname });
        //  console.log(find);
        if (check) {
            res.send({ status: "ok" });
            console.log("done");
        }

    }
    catch (error) {
        console.error(error);
    }
})

app.post("/allsub", async (req, res) => {

    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);


        await Sub.find({}).then((data) => {
            // console.log(data);
            res.send({ status: user.email, data: data })
        })
        { res.send({ error: "Error", data: error }); }

    }
    catch (error) { }

});

app.post("/followsub", async (req, res) => {
    const { token, sname } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
        if (user) {
            const email = user.email;
            const newuser = await Sub.findOne({ sname });
            const owner = newuser.owner;
            // console.log(email, owner);
            const pending = newuser.pending;
            const followers = newuser.follower;
            const blocked = newuser.blocked;
            // console.log(newuser.pending, email);
            const find1 = pending.includes(email);
            const find2 = followers.includes(email);
            const find3 = blocked.includes(email);


            // console.log(find1);
            if (find2) {
                return res.send({ status: "user already following" })
            }
            if (find1) {
                return res.send({ status: "request already sent" })
            }
            if (find3) {
                return res.send({ status: "cant join user blocked" })
            }
            if (owner == email) {

                return res.send({ status: "you are owner of this grediit" })
            }

            console.log(newuser.stats);
            await Sub.updateOne(
                {
                    sname
                },
                {
                    $addToSet: { pending: email },
                }

            );

            res.send({ status: "ok" });
            // if(owner!=email)
            // {
            //     }
        }

    } catch (error) {
        console.log(error);
    }
})

app.post("/open", async (req, res) => {
    const { token, _id } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
        if (!user) {
            return res.send({ status: "User not verified" });
        }
        let date = new Date();
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        const check= await Sub.findOne({ _id });
        const report = check.reported;
        let d2=date.split("-");
        let date2=new Date(d2[2],d2[1],d2[0]);
        // console.log(report.date);
        for (let i of report)
        {
            let d=i.date.split("-");
            let date1=new Date(d[2],d[1],d[0]);
            var Difference_In_Time = (((date2.getTime())) - ((date1.getTime())));
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if(Difference_In_Days>10)
            {
                await Sub?.findByIdAndUpdate({ _id }, { $pull: { reported: { postid: { $in: [i.postid] } } } })
            }
        }
        await Sub.findOne({ _id }).then((data) => {
            res.send({ status: "ok", data: data })
        })
    } catch (error) {
        console.log(error);
    }
})

app.post("/accept", async (req, res) => {
    const { _id, email } = req.body;
    // console.log(sname,email)
    try {

        await Sub.updateOne(
            {
                _id
            },
            {
                $pull: { pending: email },
                $addToSet: { follower: email },
            }
        );

        ///////////////code for stats//////////////////////////////////////////////////////////////////////////////////////////////
        const newuser = await Sub.findById({ _id });
        let date = new Date();
        let find4 = 0;
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        const stats = newuser.stats;
        for (let i = 0; i < stats.length; i++) {
            if (stats[i].date.localeCompare(date) === 0) {
                find4 = 1;
                break;
            }
        }
        if (find4) {
            //date found just updating
            await Sub.updateOne({ _id:newuser._id,"stats": { "$elemMatch": { "date": date } } }, { $inc: { "stats.$.no_of_user": 1 } });
        }
        if (!find4) {
            await Sub.updateOne(
                {
                    _id
                },
                {
                    $push: { "stats": { "date": date, no_of_user: 1 } },
                }

            );
            //date not found + adding date and record
            // await Sub.updateOne({ "stats": { "$elemMatch": { "date": date } } }, { $inc: { "stats.$.no_of_user": 1 } });
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    } catch (error) {
        console.log(error);
    }
})

app.post("/followcheck", async (req, res) => {
    const { token, sname } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
        if (user) {
            const email = user.email;
            const newuser = await Sub.findOne({ sname });
            const owner = newuser.owner;
            // console.log(email, owner);
            const pending = newuser.pending;
            const followers = newuser.follower;
            console.log(newuser.pending, email);
            const find1 = pending.includes(email);
            const find2 = followers.includes(email);
            // console.log(find1);
            if (find2) {
                return res.send({ status: false })
            }
            if (find1) {
                return res.send({ status: false })
            }
            if (owner == email) {
                return res.send({ status: false })
                // console.log("sent")
            }
            return res.send({ status: true })
        }

    } catch (error) {
        console.log(error);
    }
})

app.post("/posted", async (req, res) => {
    const { token, _id, content } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
        // const newuser = await Sub.findById({ _id });

        const newuser = await Sub.findOne({ _id });
        let date = new Date();
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        const stats = newuser.stats;
        let find4 = 0;
        for (let i = 0; i < stats.length; i++) {
            if (stats[i].date.localeCompare(date) === 0) {
                find4 = 1;
                break;
            }
        }
        if (find4) {
            //date found just updating
            await Sub.updateOne({ _id:newuser._id,"stats": { "$elemMatch": { "date": date } } }, { $inc: { "stats.$.no_of_post": 1 } });
        }
        if (!find4) {
            await Sub.updateOne(
                {
                    _id
                },
                {
                    $push: { "stats": { "date": date, no_of_post: 1 } },
                }

            );
            //date not found + adding date and record
            // await Sub.updateOne({ "stats": { "$elemMatch": { "date": date } } }, { $inc: { "stats.$.no_of_user": 1 } });
        }
        // console.log(req.body,user.email);
        await Post.create(
            {
                sname: newuser.sname,
                postedby: user.email,
                post: content,
            }
        );
        res.send({ status: "ok" })

    } catch (error) {
        console.log(error)
    }
})

app.post("/fetchpost", async (req, res) => {

    const { token, _id } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);

        const newuser = await Sub.findOne({ _id });

        await Post.find({ sname: newuser.sname }).then((data) => {
            // console.log(newuser.owner,user.email);
            if (newuser.owner == user.email)
                res.send({ status: true, data: data })
            else
                res.send({ status: false, data: data })
        })
        { res.send({ error: "Error", data: error }); }

    }
    catch (error) { }

});

app.post("/like", async (req, res) => {

    const { token, _id, postid } = req.body;
    console.log(req.body);
    try {
        const user = jwt.verify(token, JWT_SCERET);
        console.log(user.email);
        // const newuser =await Sub.findOne({_id});
        const check = await Post.findById({ _id: postid })
        console.log(check.liked.includes(user.email));
        console.log(check.disliked.includes(user.email));
        //  console.log(newuser.)
        if (check.liked.includes(user.email)) {
            await Post.findOneAndUpdate({ _id: postid }, { $pull: { liked: user.email } }).then((data) => {
                return res.send({ status: "ok", data: data })
            })
        }
        else if (check.disliked.includes(user.email)) {
            await Post.findOneAndUpdate({ _id: postid }, { $pull: { disliked: user.email } }).then((data) => {
                // console.log(data);
                return res.send({ status: "ok", data: data })
            })
            await Post.findOneAndUpdate({ _id: postid }, { $push: { liked: user.email } }).then((data) => {
                // console.log(data);
                res.send({ status: "ok", data: data })
            })
        }
        else {
            await Post.findOneAndUpdate({ _id: postid }, { $push: { liked: user.email } }).then((data) => {
                // console.log(data);
                res.send({ status: "ok", data: data })
            })
        }
        // { res.send({ error: "Error", data: error }); }

    }
    catch (error) { console.log(error); }

});

app.post("/dislike", async (req, res) => {

    const { token, _id, postid } = req.body;
    console.log(req.body);
    try {
        const user = jwt.verify(token, JWT_SCERET);
        // const newuser =await Sub.findOne({_id});
        const check = await Post.findById({ _id: postid })
        //  console.log(newuser.)
        if (check.disliked.includes(user.email)) {
            await Post.findOneAndUpdate({ _id: postid }, { $pull: { disliked: user.email } }).then((data) => {
                // console.log(data);
                return res.send({ status: "ok", data: data })
            })
        }
        else if (check.liked.includes(user.email)) {
            await Post.findOneAndUpdate({ _id: postid }, { $pull: { liked: user.email } }).then((data) => {
                // console.log(data);
                return res.send({ status: "ok", data: data })
            })
            await Post.findOneAndUpdate({ _id: postid }, { $push: { disliked: user.email } }).then((data) => {
                // console.log(data);
                res.send({ status: "ok", data: data })
            })
        }
        else {
            await Post.findOneAndUpdate({ _id: postid }, { $push: { disliked: user.email } }).then((data) => {
                // console.log(data);
                res.send({ status: "ok", data: data })
            })
        }
        // { res.send({ error: "Error", data: error }); }

    }
    catch (error) { console.log(error); }

});

app.post("/comment", async (req, res) => {

    const { token, _id, postid, comment } = req.body;
    console.log(req.body)
    try {
        const user = jwt.verify(token, JWT_SCERET);
        // const newuser =await Sub.findOne({_id});

        await Post.findOneAndUpdate({ _id: postid }, { $push: { comment: { commented_by: user.email, msg: comment } } })
        // .then((data) => {
        // console.log(data);
        res.send({ status: "ok" })
        // })
        // { res.send({ error: "Error", data: error }); }

    }
    catch (error) { console.log(error) }

});

app.post("/allcomment", async (req, res) => {

    const { token, _id, postid, comment } = req.body;
    // console.log(req.body)
    try {
        // const user = jwt.verify(token, JWT_SCERET);
        // const newuser =await Sub.findOne({_id});

        await Post.findOne({ _id: postid }).then((data) => {
            // console.log(data);
            res.send({ status: "ok", data: data })
        })
        { res.send({ error: "Error", data: error }); }

    }
    catch (error) { console.log(error) }

});

app.post("/userfollow", async (req, res) => {

    const { token, email } = req.body;
    // console.log(req.body)
    try {
        const user = jwt.verify(token, JWT_SCERET);
        const find1 = await User.findOne({ email });
        const find2 = await User.findOne({ email: user.email })
        if (user.email == email) {
            return res.send({ status: "dont follow yourself" })
        }
        if (find1.followers.includes(user.email)) {
            return res.send({ status: "Already Following" })
        }
        if (find2.followings.includes(email)) {
            return res.send({ status: "Already Following" })
        }
        await User.findOneAndUpdate({ email: email }, { $push: { followers: user.email } })
        await User.findOneAndUpdate({ email: user.email }, { $push: { followings: email } })
        // .then((data) => {
        //     // console.log(data);
        res.send({ status: "following Successful" })
        // })
        // { res.send({ status: "Error" }); }

    }
    catch (error) { console.log(error) }

});

app.post("/save", async (req, res) => {

    const { token, _id, postid } = req.body;
    console.log(req.body);
    try {
        const user = jwt.verify(token, JWT_SCERET);
        console.log(user.email);
        // const newuser =await Sub.findOne({_id});
        const check = await Post.findOne({ _id: postid })
        if (check.saved.includes(user.email)) {

            await User.findOneAndUpdate({ email: user.email }, { $pull: { saved: postid } });
            await Post.findOneAndUpdate({ _id: postid }, { $pull: { saved: user.email } }).then((data) => {
                res.send({ status: "Post unsaved", data: data })
            })
        }
        else {
            await Post.findOneAndUpdate({ _id: postid }, { $push: { saved: user.email } })
            await User.findOneAndUpdate({ email: user.email }, { $push: { saved: postid } }).then((data) => {
                console.log(data.saved)
            }
            )
            res.send({ status: "ok" })

        }
        // { res.send({ status: "Error"}); }

    }
    catch (error) { console.log(error); }

});

app.post("/fetchsavedpost", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
        // console.log(user.email);
        await User.findOne({ "email": user.email }).then((data) => {
            return res.send({ status: "ok", data: data })
        })
    } catch (error) {
        console.log(error);
    }
});

app.post("/fetchallpost", async (req, res) => {

    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
        // const newuser =await Sub.findOne({_id});

        await Post.find({}).then((data) => {
            res.send({ status: "ok", data: data })
        })
        { res.send({ error: "Error", data: error }); }

    }
    catch (error) { }

});

app.post("/report", async (req, res) => {
    const { postid, report, token } = req.body;
    console.log(req.body);
    try {
        const reportedby = jwt.verify(token, JWT_SCERET);

        const post = await Post.findById({ _id: postid });
        // console.log(post)
        const newuser = await Sub.findOne({ sname: post.sname });
        let date = new Date();
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        // console.log(date)
        const stats = newuser.stats;
        let find4 = 0;
        for (let i = 0; i < stats.length; i++) {
            if (stats[i].date.localeCompare(date) === 0) {
                find4 = 1;
                break;
            }
        }
        if (find4) {
            //date found just updating
            await Sub.updateOne({ _id:newuser._id,"stats": { "$elemMatch": { "date": date } } }, { $inc: { "stats.$.no_of_report": 1 } });
            // res.send({ status: "ok" });
        }
        if (!find4) {
            await Sub.updateOne(
                {
                    sname: post.sname
                },
                {
                    $push: { "stats": { "date": date, no_of_report: 1 } },
                }

            );
        }
            await Sub.findOneAndUpdate({ sname: post.sname }, { $push: { reported: { reportedby: reportedby.email, postid, report, reportedto: post.postedby, post: post.post ,date} } }).then((data) => {
                res.send({ status: "ok", data: data });
            })

        
    }
    catch (error) {console.log(error);}
});

app.post("/ignore", async (req, res) => {
    const { _id, cvalue } = req.body;

    // await Sub.findByIdAndUpdate({_id},{$pull:{reported:cvalue}}).then((data)=>{
    // })

    await Sub.findByIdAndUpdate(
        {
            _id
        },
        {
            $set: { "reported.$[ele].fade": false },

        },
        {
            arrayFilters: [{ "ele.postid": cvalue.postid, "ele.post": cvalue.post, "ele._id": cvalue._id }]
        });
    res.send({ status: "ok" });

});

app.post("/deletepost", async (req, res) => {
    try {
        const { _id, cvalue } = req?.body;
        const post = await Post?.findById({_id:cvalue.postid});
        console.log(post.sname)
        const newuser = await Sub?.findOne({ _id});
        let date = new Date();
        date = date?.getDate() + "-" + (date?.getMonth() + 1) + "-" + date?.getFullYear();
        const stats = newuser?.stats;
        let find4 = 0;
        for (let i = 0; i < stats.length; i++) {
            if (stats[i].date?.localeCompare(date) === 0) {
                find4 = 1;
                break;
            }
        }
        if (find4) {
            //date found just updating
            await Sub?.updateOne({ _id:newuser._id,"stats": { "$elemMatch": { "date": date } } }, { $inc: { "stats.$.no_of_delete": 1 } });
            // res.send({ status: "ok" });
        }
        if (!find4) {
            await Sub?.updateOne(
                {
                   _id
                },
                {
                    $push: { "stats": { "date": date, no_of_delete: 1 } },
                }

            );
        }

        await Post?.deleteOne({ _id: cvalue.postid })
        // await Sub.findByIdAndUpdate({_id},{})
        await Sub?.findByIdAndUpdate({ _id }, { $pull: { reported: { postid: { $in: [cvalue.postid] } } } })?.then((data) => {
            res.send({ status: "ok" });
        })
    }
    catch (e) { console.log(e) }

});

app.post("/blockuser", async (req, res) => {
    const { _id, countdown, newid } = req.body;
    // await Post.deleteOne({_id:cvalue.postid})
    // console.log(req.body);
    // const user=await Sub.findById({_id});
    // console.log(user.blocked,cvalue.reportedto)
    // if(user.blocked.includes(cvalue.reportedto))
    // {
    //     return  res.send({status:"user already blocked"});
    // }
    // await Sub.findByIdAndUpdate({_id},{$push:{blocked:cva/urllue.reportedto}});
    await Sub.findByIdAndUpdate(
        {
            _id
        },
        {
            $set: { "reported.$[ele].countdown": !countdown },
        },
        {
            arrayFilters: [{ "ele._id": newid }]
        });
    // await Sub.findByIdAndUpdate({_id},{$pull:{reported:cvalue,follower:cvalue.reportedto}}).then((data)=>{
    res.send({ status: "ok" });
    // }) 
});

app.post("/reject", async (req, res) => {
    const { _id, email } = req.body;
    console.log(_id, email)
    try {

        await Sub.findByIdAndUpdate(
            {
                _id
            },
            {
                $pull: { pending: email },
                // $addToSet: { follower: email },
            }
        );


    } catch (error) {
        console.log(error);
    }
});

app.post("/blockuserend", async (req, res) => {
    const { _id, cvalue, token } = req.body;
    // console.log(cvalue,_id)
    // await Post.deleteOne({_id:cvalue.postid})
    const owner = jwt.verify(token, JWT_SCERET);
    try {
        const user = await Sub.findById({ _id });
        if (owner.email == cvalue.reportedto) {
            await Sub.findByIdAndUpdate({ _id }, { $pull: { reported: cvalue } });
            //  await Sub.findByIdAndUpdate({_id},{$pull:{blocked:cvalue.reportedto}});
            return res.send({ status: "owner reported" });
        }
        if (user.blocked.includes(cvalue.reportedto)) {
            await Sub.findByIdAndUpdate({ _id }, { $pull: { reported: cvalue } });
            return res.send({ status: "user already blocked" });
        }
        // console.log(req.body);
        await Sub.findByIdAndUpdate({ _id }, { $push: { blocked: cvalue.reportedto } });

        await Sub.findByIdAndUpdate({ _id }, { $pull: { reported: cvalue, follower: cvalue.reportedto } }).then((data) => {
             // let testAccount=await nodemailer.createTestAccount();

        var transporter = nodemailer.createTransport({
            service: 'gmail',

            auth: {
                user: 'kabirshamlani04@gmail.com',
                pass: 'yyebhnwpdvlimbzn',
            },
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: cvalue.reportedby,
            subject: 'Your Post :-' + cvalue.post + "doesn't follow our gudelines ",
            text:  "Hence you have been blocked by the sub-grediit owner",
        };
        var mailOptions1 = {
            from: 'youremail@gmail.com',
            to: cvalue.reportedto,
            subject: 'Reported Post :-' + cvalue.post + "doesn't follow our gudelines ",
            text:  "User Blocked hence reported",
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        transporter.sendMail(mailOptions1, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
            res.send({ status: "ok" });
        })
    }

    catch {
        console.log(error);
    }
});

app.post("/Userprofilebyemail", async (req, res) => {
    const { cvalue } = req.body;
    try {
        User.findOne({ email: cvalue }).then((data) => {
            // console.log(data,cvalue);
            res.send({ status: "ok", data: data })
        })

        { res.send({ error: "Error", data: error }); }

    }
    catch (error) { }
});

app.post("/leave", async (req, res) => {
    const { sname, token } = req.body;
    // console.log(req.body)
    try {
        const owner = jwt.verify(token, JWT_SCERET);
        const email = owner.email;
        console.log(email);
        Sub.findOneAndUpdate({ sname }, { $pull: { follower: email }, $addToSet: { blocked: email } }).then((data) => {
            res.send({ status: "done👍", data: data })
        })

        { res.send({ error: "Error", data: error }); }

    }
    catch (error) { console.log(error) }
});

app.post("/maximize", async (req, res) => {
    const { _id } = req.body;
    console.log(req.body);
    try {
        const newuser = await Sub?.findOne({ _id });
        let date = new Date();
        date = date?.getDate() + "-" + (date?.getMonth() + 1) + "-" + date?.getFullYear();
        const stats = newuser?.stats;
        let find4 = 0;
        for (let i = 0; i < stats?.length; i++) {
            if (stats[i].date?.localeCompare(date) === 0) {
                find4 = 1;
                break;
            }
        }
        if (find4) {
            //date found just updating
            console.log("yes")
            await Sub?.updateOne({_id:newuser._id, "stats": { "$elemMatch": {"date":date } } }, { $inc: { "stats.$.no_of_visitor": 1 } });
            // res.send({ status: "ok" });
        }
        if (!find4) {
            console.log("no")
            await Sub?.updateOne(
                {
                    _id
                },
                {
                    $push: { "stats": { "date": date, no_of_visitor: 1 } },
                }

            );
            console.log("done");
            //date not found + adding date and record
            // await Sub.updateOne({ "stats": { "$elemMatch": { "date": date } } }, { $inc: { "stats.$.no_of_user": 1 } });
        }
        console.log(newuser.stats);
            res.send({ status: "ok" });

    }
    catch (error) {
        console.log(error);
    }
});

app.get("/auth/:email", async (req, res) => {
    const { email } = req.params;

    try {
        // res.send("User Verified");
        res.render("index1", { email:email, status: "Not Verified" });

    } catch (error) {
        console.log(error);
        res.send("User Not verfied");

    }
    // console.log(req.params);
    // res.send("done");

});

app.post("/auth/:email", async (req, res) => {
    const { email } = req.params;
    const { username,contact,age } = req.body;
    
   console.log(email,username,contact,age );
    try {
      
        await User.updateOne(
            {
                email,
            },
            {
                $set:
                {
                    username,
                    contact,
                    age,
                },
            }

        );
        // res.json({status:"Password Updated Successfully"});
        res.render("index1", { email:email, status: "verified" });

    } catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
    }
   
});

app.post("/chat_users", async (req, res) => {
    const { token } = req.body;
    try {
        const owner = jwt.verify(token, JWT_SCERET);
        const email = owner.email;
        const user_data=await User.findOne({email});
        following = user_data.followings;
        follower = user_data.followers;
        mem=[];
        
        for(let i of following)
        {
            for(let j of follower)
            {
                if(i==j)
                {
                    mem.push(i);
                }
            }
        }

        // console.log(mem);
        res.send({data:mem})
    }
    catch (error) { console.log(error) }
});

app.post("/getchat", async (req, res) => {
    const { token ,email } = req.body;
    try {
        const owner = jwt.verify(token, JWT_SCERET);

        const oemail = owner.email;
        const owner_data = await Chat.find({});
        
        // console.log("owner" + owner_data);

        res.send({data:owner_data});
    }
    catch (error) { console.log(error) }
});

app.post("/sendchat", async (req, res) => {
    console.log(req.body)
    const { token, email , message} = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
       const useremail=user.email;
       await Chat.create({
        sender:useremail,
        reciever:email,
        message:message,
    });
    
    res.send({ status: "ok" });
    } 
    catch (error) {
        console.log(error)
    }
});

app.post("/removefollower", async (req, res) => {
    console.log(req.body)
    const { token, email } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
       const useremail=user.email;
       console.log(useremail);
    await User.updateOne({
        email:useremail,
    },
    {
        $pull:
        {
            followers:email
        }
    })
    await User.updateOne({
        email
    },
    {
        $pull:
        {
            followings:useremail
        }
    })
    res.send({ status: "ok" });
    } 
    catch (error) {
        console.log(error)
    }
});

app.post("/removefollowing", async (req, res) => {
    console.log(req.body)
    const { token, email } = req.body;
    try {
        const user = jwt.verify(token, JWT_SCERET);
       const useremail=user.email;
       console.log(useremail);
    await User.updateOne({
        email:useremail,
    },
    {
        $pull:
        {
            followings:email
        }
    })
    await User.updateOne({
        email
    },
    {
        $pull:
        {
            followers:useremail
        }
    })
    res.send({ status: "ok" });
    } 
    catch (error) {
        console.log(error)
    }
});