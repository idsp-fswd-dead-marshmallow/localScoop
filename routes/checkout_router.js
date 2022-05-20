/* libraries */
const help = require("../help")
const express = require("express");
const ejs = require('ejs');
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')
var nodemailer = require('nodemailer');


const { append } = require("express/lib/response");


/* express */
const app = express();
app.use(express.json())


router.get("/checkout_1", help.buyerAuthorized, async (req, res) => {
    let buyer_id = req.session.buyer.buyer_id
    let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)
    let cartItems = await mysqlDB.getCartItemsByBuyer(buyer_id)
    let subtotal = 0
    for (let cartItem of cartItems) {
        subtotal = subtotal + (parseInt(cartItem.product_quantity) * parseInt(cartItem.product_price))
    }
    res.render("checkout/checkout_1", { buyer_id, cartItems, cartQuantity, subtotal })
})


router.get("/checkout_confirmation", help.buyerAuthorized, async (req, res) => {
    let buyer_id = req.session.buyer.buyer_id
    let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)

    res.render("checkout/checkout_confirmation", { cartQuantity })
})



router.post("/checkout_confirmation", help.buyerAuthorized, (req, res) => {
    let buyer_id = req.session.buyer.buyer_id
    let deliveryAddress = req.body.deliveryAddress
    let postalCode = req.body.postalCode
    let province = req.body.province
    let city = req.body.city
    let paymentMethod = req.body.paymentMethod

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASS
        }
    });

    var mailOptions = {
        from: process.env.MY_EMAIL,
        to: 'yoyochen68@yahoo.ca',
        subject: 'Order Confirmation',
        html: '<h1>Thank you for supporting local business</h1><p>order confirmation</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    res.redirect("/checkout/checkout_confirmation")
})




module.exports = router;