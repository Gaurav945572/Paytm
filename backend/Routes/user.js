const express = require('express');
const {User} = require("../Database/index");
const UserZod = require("../Zod/index.js")
const SignInBody = require("../Zod/SignInBody.js")

const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtPassword = require("../config")

const {authMiddleware}  = require("../MiddleWare/middleware.js")

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



//update
router.put("/update",authMiddleware, async(req,res)=>{
    let userID = req.userID;
    let updateFirstName = req.body.firstName;
    let updateLastName = req.body.lastName;
    let updatePassword = req.body.password;
     //input validation
    if(updateFirstName.length!=0){
        let parsedFirstName = UserZod.safeParse({updateFirstName});
        if(!parsedFirstName.success){
            res.status(411).send({
                message: "Error while updating information"
            })
        }
    }
    if(updateLastName.length!=0){
        let parsedLastName = UserZod.safeParse({updateLastName});
        if(!parsedLastName.success){
            res.status(411).send({
                message: "Error while updating information"
            })
        }
    }
    if(updatePassword.length!=0){
        let parsedPassword  = UserZod.safeparse({updatePassword});
        if(!parsedPassword.success){
            res.status(411).send({
                message: "Error while updating information"
            })
        }
    }
   
    try{
        let user =await User.find({userID});
        user.updateOne({},{
            $set:{
                firstName : (updateFirstName.length!=0) ?updateFirstName: firstName ,
                lastName :( updateLastName.length!=0) ? updateLastName :lastName,
                password:(updatePassword.length()!=0) ? updatePassword : password
            }
        })
        res.status(200).send({
            message: "Updated successfully"
        })
    }
    catch(error){
        res.status(411).send({
            message: "Error while updating information"
        })
    }
})

//router to get users from backend
router.get("/bulk", async(req,res)=>{
    try {
        // Retrieve the filter query parameter from the request
        let filter = req.query.filter;

        // Use the filter to find users whose firstName or lastName matches the regex pattern
        let users = await User.find({
            $or: [
                { firstName: { "$regex": filter, "$options": "i" } },
                { lastName: { "$regex": filter, "$options": "i" } }
            ]
        });

        // Initialize an empty array to store user details
        let userDetails = [];

        // Loop through the found users and format their details
        users.forEach((user) => {
            let p = {
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id // Use MongoDB's default _id field
            };
            userDetails.push(p);
        });

        // Send the formatted user details in the response with a status code of 200
        res.status(200).send({
            users: userDetails
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        res.status(500).send({
            message: 'An error occurred while fetching users',
            error: error.message
        });
    }
});
module.exports = router;