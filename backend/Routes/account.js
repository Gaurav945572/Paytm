const express = require('express');
const { Account } = require('../Database');

const router = express.Router();

//account balance
router.get("/balance", async(req,res)=>{
    const userId  = req.body.userId;
    let account =await Account.findOne({userID:userId})
    res.status(200).send({
        balance: account.balance
    })

})


//tranfer money
router.post("/tranfer",async(req,res)=>{
    const session = await mongoose.startSession(); //if anywhere betwwen start and end the db server down then all the 
    //process will revert back

    session.startTransaction();// start of transaction
    let transferId = req.body.to;
    let tranferAmount = req.body.amount;
    let userId = req.body.userId;

    let account = await Account.find({userId:userId});
    if (account.balance < tranferAmount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }


    const toAccount = await Account.findOne({
        userId: transferId
    });
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    }).session(session);

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    }).session(session);

    await session.commitTransaction(); //end point of transacrtion

    res.json({
        message: "Transfer successful"
    });


})
module.exports = router;