// require
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const db = require("../fake-db");
const router = express.Router();
// const axios = require('axios')



/* Global Variables */

// GET /seller_landing/seller_landing
// router.get("/seller_landing/:id", (req, res) => {
//     res.render("seller_landing/seller_landing")
// })



// GET /seller_landing/seller_landing
router.get("/seller_landing", (req, res) => {
    res.render("seller_landing/seller_landing")
})






module.exports = router;