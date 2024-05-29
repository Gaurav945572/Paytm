const express = require('express');
const {User,Account} = require("../Database/index");

const {UserZod} = require("../Zod/index.js")
const {SignInBody} = require("../Zod/SignInBody.js")
const {updateBody} = require("../Zod/update.js")

const router = express.Router();
const jwt = require("jsonwebtoken");
const {jwtPassword} = require("../config")

const {authMiddleware}  = require("../MiddleWare/middleware.js")

//sign up
router.post("/signup", async (req, res) => {
    const { success } = UserZod.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        userName: req.body.userName
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const token = jwt.sign({userId:user._id}, jwtPassword);
    /// ----- Create new account ------
    await Account.create({
        userId:user._id,
        balance: 1 + Math.random() * 10000
    })
    /// -----  ------

    res.json({
        message: "User created successfully",
        token: token
    })
});



//sign in
router.get("/signin" ,async(req,res)=>{
    let userName = req.body.userName;
    let password = req.body.password;
    let parsedInput = SignInBody.safeParse({userName,password});
    if(parsedInput.success){
        let user =await  User.find({userName,password});
        if(user){
            const token = jwt.sign({userId:user._id},jwtPassword);
            res.status(200).json({
               "token":token,
               "payload":jwt.verify(token,jwtPassword).userId
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
    const parsedInput = updateBody.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(400).json({
            message: "Error while updating information",
        });
    }

    try {
        let user=await User.updateOne({ _id: req.userId }, req.body);
        res.status(200).json({
            message: "Updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating information",
            error: error.message,
        });
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