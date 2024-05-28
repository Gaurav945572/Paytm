const express = require('express');
const {User} = require("../Database/index");
const UserZod = require("../Zod/index.js")
const SignInBody = require("../Zod/SignInBody.js")

const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtPassword = require("../config")

//sign up
router.post("/signup",async(req,res)=>{
    let userName = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    let parsedInput  = UserZod.safeParse({firstName,lastName,password});
    let user = User.find({userName});
    if(user.legnth()!=0){
        res.status(411).send({
            "message":"Email already taken"
        })
    }

    if(parsedInput.success){
        await User.create({
            userName,
            firstName,
            lastName,
            password
        })
        let createdUser = User.find({userName,firstName,lastName,password});
        let UserID = createdUser._id;
        const token = jwt.sign({UserID},jwtPassword);
        res.status(200).json({
            "message":"User created successfully",
            "UserId":token
        })
    }
    else{
        res.status(411).json({
            "message":"Incorrect inputs"
        })
    }
})




//sign in
router.get("/signin" ,async(req,res)=>{
    let userName = req.body.username;
    let password = req.body.password;
    let parsedInput = SignInBody.safeParse({userName,password});
    if(parsedInput.success){
        let user =await  User.find({userName,password});
        if(user.length !=0){
            const token = jwt.sign({userName},jwtPassword);
            res.status(200).json({
               "token":token,
            })
        }
        else{
            res.status(411).json({
                "message":"Error while logging in",
            })
        }    
    }
    else{
        res.status(411).json({
            "message":"Incorrect inputs",
        })
        return;
    }
})

module.exports = router;