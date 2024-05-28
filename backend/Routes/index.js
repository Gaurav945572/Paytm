const express = require('express');
const router = express.Router();

//user router
const userRouter = require("./user");
router.use("/user", userRouter)


//account router
const accountRouter = require("./account");
router.use("/account",accountRouter);

module.exports = router;
