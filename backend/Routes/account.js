const express = require('express');
const {UserMiddleware}  = require("../MiddleWare/middleware.js")

const { Account,User } = require('../Database/index');
const mongoose =require("mongoose");
const router = express.Router();




router.get("/balance", UserMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});




router.post("/transfer", UserMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    //console.log(req.userId);
    let userId = req.userId;
    let user = User.findOne({userId:userId}).session(session);
    let _id = user._id;
    //console.log(user);
    let accountDetails = Account.findOne({userId:_id}).session(session);
    if (!accountDetails || accountDetails.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: user._id }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;