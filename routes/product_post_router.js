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

// GET /product_post/product_post_1
router.get("/product_post_1", (req, res) => {
  res.render("product_post/product_post_1", {

  })
})


// -- NOT MADE YET ---
// GET /product_post/product_post_2
router.get("/product_post_2", (req, res) => {
  res.render("product_post/product_post_2", {

  })
})
router.post("/product_post_2", (req, res) => {
  // let storeId = req.session.storeId ? req.session.storeId : null;
  let productInfo = req.body

  let storeId = 104
  let productName = productInfo.itemName
  let category = productInfo.category
  let description = productInfo.description
  let productPrice = +productInfo.productPrice
  let deliveryFee = +productInfo.deliveryFee
  let imgUrl = productInfo.imgUrl
  // if(storeId){}
  let produt = db.addProduct(storeId, productName, category, description, productPrice, deliveryFee,imgUrl)

  console.log(produt)
  res.render("product_post/product_post_2",{productInfo})
})


/************      handling the store image uploading          **********/


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    const bytes = crypto.randomBytes(16).toString('hex')
    cb(null, bytes + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');
// can do .array() if you want to upload multiple images

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}


// User uploads photo on shop_setup/shop_setup_6
router.post('/upload', upload, (req, res) => {
  if (req.file == undefined) {
    res.render('product_post/product_post_1', {
      msg: 'Error: No File Selected!'
    });
    return
  }

  // let shopIdOfSession = db.getStoreIdFromStoreName(req.session.storeName)
  let multeredFilename = '/uploads/' + req.file.filename
console.log(multeredFilename)
  // db.editShop(shopIdOfSession, { shopProfilePhoto : multeredFilename })

  // store some info in the database
  res.render('product_post/product_post_1', {
    msg: 'Image Uploaded!',
    file: `${multeredFilename}`
  });
});

/************      handling the store image uploading          **********/


module.exports = router;