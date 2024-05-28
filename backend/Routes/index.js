
const express = require('express');

const router = express.Router();
const userRouter = require("./user");
router.use("/user", userRouter)

const accountRouter = require("./account");
router.use("/account",accountRouter);

module.exports = router;
