const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());


const {User} = require("./Database");
const jwt = require("jsonwebtoken");
const jwtPassword = require("./config")



const rootRouter = require("./Routes/index");
app.use("/api/v1", rootRouter);





//sign in
app.get("/signin" ,async(req,res)=>{
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password = req.body.password;
    let parsedInput = UserZod.safeParse({firstName,lastName,password});
    if(parsedInput.success){
        let user =await  User.find({firstName,lastName,password});
        if(user.length !=0){
            const token = jwt.sign({username},jwtPassword);
            res.json({
               "token":token,
            })
        }
        else{
            res.status(404).json({
                "message":"wrong email and password",
            })
        }    
    }
    else{
        res.status(404).json({
            "message":"invalid inputs",
        })
        return;
    }
})


//update
app.post("/update",async(req,res)=>{
    let updateFirstName = req.body.firstName;
    let updateLastName = req.body.lastName;
    let updatePassword = req.body.Password;
    let token = req.headers.token;
    let user = await User.find({_id:token});
    user.updateMany({},{
        $set:{
            firstName:updateFirstName,
            lastName: updateLastName,
            password:updatePassword
        }
    })

})




app.listen(3000,()=>{
    console.log("Listening on 3000");
})