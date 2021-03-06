/* libraries */
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')

const { append } = require("express/lib/response");



// GET /follow_business/follow_business_1
router.get("/follow_business_1", async(req, res) => {
    let cardItemsTotal = 0
    let storeId = 1

    //we need  function to give a list of all products and their images
    //we need  function to give a list of all stores and their images


    let storeInfo = await mysqlDB.getStoreInfoByStoreId(storeId)
    let productInfo = await mysqlDB.getProductsAndImagesByStoreID(storeId)
    let storeImages = await mysqlDB.getShopPhotoByStoreId(storeId)

    console.log(productInfo)


    res.render("follow_business/follow_business_1", { storeInfo:storeInfo[0], productInfo:productInfo, storeImages:storeImages, cardItemsTotal:cardItemsTotal })
})


// GET /follow_business/follow_business_2
router.get("/follow_business_2", async (req, res) => {
    // res.send("jgqfjkeqg")
    // let storeId = req.session.storeId
    let storeId = 1

    let storeInfo = await mysqlDB.getStoreInfoByStoreId(storeId)
    let productInfo = await mysqlDB.getProductsAndImagesByStoreID(storeId)
    let storeImages = await mysqlDB.getShopPhotoByStoreId(storeId)


    res.render("follow_business/follow_business_2",{ storeInfo:storeInfo[0], productInfo:productInfo, storeImages:storeImages })

})



router.post("/follow_business_2", async (req, res) => {


    //the function that adds to the th follower to number of followers
    //the function that get the new followers quantity

    // let storeId = 1
    let followersNum = 3
    // await mysqlDB.addToCart(buyer_id, product_id)
    // let followersNum =  await mysqlDB.getStoreInfoByStoreId(storeId).followers


    res.json( {quantity: followersNum})

})



module.exports = router;