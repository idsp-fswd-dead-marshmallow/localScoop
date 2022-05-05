const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const db = require("../fake-db");
const router = express.Router();



/* express */
const app = express();
app.use(express.json())

// GET orders/orders_1
router.get("/orders_1", (req, res) => {

    let carouselSliderData = [
        { updateTime : 'Yesterday', productName : 'Nike Sage Lows', productPrice : '$125' },
        { updateTime : '2 Days Ago', productName : 'Red Luxury Hoodie', productPrice : '$105' },
        { updateTime : '3 Days Ago', productName : 'Nike Air Force One-Blue', productPrice : '$175' },
        { updateTime : '3 Days Ago', productName : 'Nike Lebron Air 1', productPrice : '$130' },
        { updateTime : '5 Days Ago', productName : 'Herschel White Backpack', productPrice : '$125' },
        { updateTime : 'Last Week', productName : 'Baseball Cap', productPrice : '$105' },
    ]

    let numberOfCards = carouselSliderData.length

    res.render("./orders/orders_1", {
        carouselSliderData, numberOfCards
    })
})

router.get("/orders_2", (req, res) => {
    let productListInfo = [
        { itemName: "Ultra Boost 912", deliveryStatus: "Pending Delivery", feedbackStatus: "", time: "Today" },
        { itemName: "Nike AirMax", deliveryStatus: "Delivered", feedbackStatus: "You have new feedback", time: "2 Days Ago" },
        { itemName: "Nike AirForce", deliveryStatus: "Delivered", feedbackStatus: "You have new feedback", time: "3 Days Ago" },
        { itemName: "Nike Blazer", deliveryStatus: "Delivery Pending", feedbackStatus: "", time: "4 Days Ago" },
        { itemName: "Mens Leather Boots", deliveryStatus: "Delivered", feedbackStatus: "", time: "1 Week Ago" },
        { itemName: "Ultra Boost 912", deliveryStatus: "Pending Delivery", feedbackStatus: "", time: "1 Week Ago" },
        { itemName: "Nike AirMax", deliveryStatus: "Delivered", feedbackStatus: "You have new feedback", time: "1 Week Ago" },
        { itemName: "Nike AirForce", deliveryStatus: "Delivered", feedbackStatus: "You have new feedback", time: "1 Week Ago" },
        { itemName: "Nike Blazer", deliveryStatus: "Delivery Pending", feedbackStatus: "", time: "2 Weeks Ago" },
        { itemName: "Mens Leather Boots", deliveryStatus: "Delivered", feedbackStatus: "", time: "2 Weeks Ago" }, 
    ]
    
    
    
    res.render("./orders/orders_2", {
        productListInfo
    })
})


module.exports = router;

