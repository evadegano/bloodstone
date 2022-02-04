const express = require("express");
const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");

// function to cryptographically sign transactions
const { signTransac } = require("../helpers/blockchain");

// database models
const User = require("../models/User.model");
const Wallet = require("../models/Wallet.model");
const Block = require("../models/Block.model");
const Transaction = require("../models/Transaction.model");


// GET user wallet -> filtre à faire côté client ?
router.get("/user/:walletId", (req, res, next) => {
  // store wallet info
  const walletId = req.params.walletId;
  let walletPublicKey;

  // fetch wallet by wallet id
  Wallet.findById(walletId)
    .then((walletFromDB) => walletPublicKey = walletFromDB.publicKey)
    .catch(() => res.status(500).json({ message: "Something went wrong." }))

  // fetch transactions by wallet public key
  const p1 = Transaction.find({ $or: [{ fromPublicKey: walletPublicKey }, { toPublicKey: walletPublicKey }]});

  // fetch blocks mined by this wallet public key
  const p2 = Block.find({ miner: walletPublicKey });

  Promise.all([p1, p2])
    .then((values) => {
      const [ transactionsFromDB, blocksFromDB ] = values;

      // calculate rank (is it needed?)

      // calculate block mined and rewards
      let rewards = 0;
      let blocksMined = 0;

      for (let block of blocksFromDB) {
        rewards += block.miningReward;
        blocksMined++;
      }

      // return all data
      res.status(200).json({
        transactions: transactionsFromDB,
        rewards,
        blocksMined
      })
    })
    .catch(() => res.status(500).json({ message: "Something went wrong." }))
});


// POST a transaction 
// question: is it ok to use private key like this?
router.post("/user/:walletId/transaction", (req, res, next) => {
  // get transaction data
  const { amount, fromPublicKey, fromPrivateKey, toPublicKey } = req.body;
  const walletId = req.params.walletId;
  let balance = 0;

  // make sure all data has been given
  if (!amount || !fromPublicKey || !toPublicKey) {
    res.status(400).json({ message: "Please fill in all fields." });
    return;
  }

  // make sure wallet address and sender address are the same
  Wallet.findById(walletId)
    .then((walletFromDB) => {
      const walletPublicKey = walletFromDB.publicKey;

      if (walletPublicKey !== fromPublicKey) {
        res.status(400).json({ message: "You cannot send coins from another account." });
        return;
      }
    })
    .catch(() => res.status(500).json({ message: "Something went wrong." }))
  
  // get total balance of this wallet by querying all transactions
  Transaction.find({ fromPublicKey })
    .then((transactionsFromDB) => {
      // deduce debit from balance
      balance = transactionsFromDB.reduce((sum, transac) => sum - transac.amount, balance);
    })
    .catch(() => res.status(500).json({ message: "Something went wrong." }))

  Transaction.find({ toPublicKey: fromPublicKey })
  .then((transactionsFromDB) => {
    // add credit to balance
    balance = transactionsFromDB.reduce((sum, transac) => sum + transac.amount, balance);
  })
  .catch(() => res.status(500).json({ message: "Something went wrong." }))

  // make sure the wallet has enough funds
  if (balance < amount) {
    res.status(400).json({ message: "Insufficient funds." });
    return;
  }

  // sign the transaction
  const transacData = {
    amount,
    fromPublicKey,
    toPublicKey
  }
  const signature = signTransac(transacData, fromPrivateKey);

  // hash transaction (is it needed?)

  // make sure it is valid (is it needed?)

  // create a transaction
  const newTransaction = new Transaction({
    _id: signature,
    amount,
    fromPublicKey,
    toPublicKey
  })

  // add to database
  newTransaction.save()
    .then(() => res.status(200).json(newTransaction))
    .catch(() => res.status(500).json({ message: "Something went wrong." }))
});


// GET user profile
router.get("/user/:userId", (req, res, next) => {
  // get user id
  const userId = req.params.userId;

  // fetch user by _id
  User.findById(userId)
    .then((userFromDB) => {
      // return data
      res.status(200).json(userFromDB);
    })
    .catch(() => res.status(500).json({ message: "Something went wrong." }))
});


// PUT user data
router.put("/user/:userId", (req, res, next) => {
  // get data
  const { email, password, passwordConfirm } = req.body;
  const userId = req.params.userId;

  // make sure that passwords match
  if (password !== passwordConfirm) {
    res.status(400).json({ message: "Confirmation password doesn't match password." });
    return;
  }

  // verify password format
  const pwdRgex = /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,}$/;
  if (!pwdRgex.test(password)) {
    res.status(400).json({ message: "Password must contain at least 8 characters, one cap letter, one number and one special character." });
    return;
  }

  // verify email address format
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Please enter a valid email address."});
    return;
  }

  // get user by _id and update
  User.findByIdAndUpdate(userId, {
    email,
    password
  })
    .then((user) => res.status(200).json(user))
    .catch(() => res.status(500).json({ message: "Something went wrong." }))
});


// DELETE user data
router.delete("/user/:userId", (req, res, next) => {
  // get user id
  const userId = req.params.userId;

  // make sure the id is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "This user id is not valid." });
    return;
  }

  // fetch user by _id and delete
  const p1 = User.findByIdAndRemove(userId);

  // turn wallet's status into inactive
  const p2 = Wallet.findOneAndUpdate({ user_id: userId }, {
    active: false,
    deactivationDate: Date.now()
  });

  Promise.all([p1, p2])
    .then(() => res.status(200).json({ message: "Your account has been removed successfully." }))
    .catch(() => res.status(500).json({ message: "Something went wrong." }))    
});



module.exports = router;