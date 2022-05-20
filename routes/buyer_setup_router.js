/* libraries */
const help = require("../help")
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const db = require("../fake-db");
const router = express.Router();



const { append } = require("express/lib/response");
const mysqlDB = require("../database/databaseAccessLayer");


/* express */
const app = express();
app.use(express.json())

//
// router.get("/buyer_setup", (req, res) => {
//
//
//   // res.render("shopping_cart/shopping_cart", {
//   // })
// })



router.get("/login_signup", async (req, res) => {
    res.render("buyer_setup/login_signup")
})



router.get("/buyer_login", async (req, res) => {
    res.render("buyer_setup/buyer_login", {
    })
})



// POST /buyer_setup/buyer_login
router.post("/buyer_login", async (req, res) => {
    let email = req.body.buyer_email;
    let password = req.body.buyer_password;
    let buyer = await mysqlDB.authenticateBuyer(email, password)
    if (buyer.length === 0) {
        res.redirect("/buyer_setup/buyer_login")
        return
    }
    const id = buyer[0].buyer_id
    req.session.buyer = {
        buyer_id: id,
        buyer_email: email
    }

    // let store_email = req.session.store_email ? req.session.store_email : null;
    res.redirect("/follow_business/follow_business_1")
})



module.exports = router;