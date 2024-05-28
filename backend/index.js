const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());


const {User,Account} = require("./Database");
const jwt = require("jsonwebtoken");
const jwtPassword = require("./config")



const rootRouter = require("./Routes/index");
app.use("/api/v1", rootRouter);



app.listen(3000,()=>{
    console.log("Listening on 3000");
})