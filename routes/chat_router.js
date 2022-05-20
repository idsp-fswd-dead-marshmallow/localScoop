/* libraries */
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')

//formating the message shown
// const formatMessage = require('../views/chat/utils/messages')

const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')





router.get("/store",  async (req, res) => {

    //Change this later
    // let storeId = req.session.seller.seller_id

    let storeId = 2
    let storeChatList = mysqlDB.getBuyerChats(storeId)


  res.render("chat/store_index",{storeChatList});

})







router.get("/buyer",  async (req, res) => {

    //Change this later
    // let buyerId = req.session.buyer.buyer_id

    let buyerId = 3
    let buyerChatList = await mysqlDB.getBuyerChats(buyerId)
    console.log(buyerChatList)

    res.render("chat/buyer_index", {buyerChatList:buyerChatList});
})





router.get("/room/:id",  async (req, res) => {
    let buyerId = 3
    let roomId = req.params.id

    console.log('render room')
    
    res.render("chat/buyer_room",{buyerId:buyerId, roomId:roomId});

})

// router.get("/room",  async (req, res) => {
//     console.log('render room')
//     res.render("chat/room");
//
// })

module.exports = router;