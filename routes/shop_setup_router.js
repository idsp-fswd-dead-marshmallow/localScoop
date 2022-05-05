/* libraries */
const express = require("express");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto')
const db = require("../fake-db");
const router = express.Router();



const { append } = require("express/lib/response");


/* express */
const app = express();
app.use(express.json())


// GET /shop_setup/a
router.get("/a", (req, res) => {

})



// GET /shop_setUp/shop_setUp_1
router.get("/shop_setup_1", (req, res) => {
  res.render("shop_setup/shop_setup_1", {

  })
})

// GET /shop_setUp/shop_setUp_2
router.get("/shop_setup_2", (req, res) => {
  res.render("shop_setup/shop_setup_2", {

  })
})


// POST /shop_setUp/shop_setUp_2
router.post("/shop_setup_2", (req, res) => {
  // put storeName in cookie session
  req.session.storeName = req.body.storeName;

  let storeId = db.returnNextShopId()
  req.session.storeId = storeId
  // create obj to pass into addShop(), need to add storeId and everything else in req.body
  let addShopObj = {
    storeName: req.body.storeName,
    phoneNum: req.body.phoneNum,
    email: req.body.email,
    password: req.body.password,
    storeId: storeId
  }

  // adds the use input information into the fake-db
  db.addShop(addShopObj)

  // write store name into database
  res.redirect("/shop_setup/shop_setup_3")
})


// GET /shop_setUp/shop_setUp_3
router.get("/shop_setup_3", (req, res) => {
  res.render("shop_setup/shop_setup_3", {

  })
})

// POST /shop_setUp/shop_setUp_3
router.post("/shop_setup_3", (req, res) => {
  // console.log(req.body.address)
  // console.log(req.session.storeName) // works
  // console.log(db.returnShopInfo())

  let shopIdOfSession = db.getStoreIdFromStoreName(req.session.storeName)

  // console.log(db.returnShopInfo())
  db.editShop(shopIdOfSession, req.body)


  res.redirect("/shop_setUp/shop_setUp_4")
})


// GET /shop_setUp/shop_setUp_4
router.get("/shop_setup_4", (req, res) => {
  res.render("shop_setup/shop_setup_4", {

  })
})

// GET /shop_setUp/shop_setUp_5
router.get("/shop_setup_5", (req, res) => {
  res.render("shop_setup/shop_setup_5", {

  })
})


// GET /shop_setUp/shop_setUp_6
router.get("/shop_setup_6", (req, res) => {
  res.render("shop_setup/shop_setup_6", {

  })
})


// GET /shop_setUp/shop_setUp_7
router.get("/shop_setup_7", (req, res) => {
  res.render("shop_setup/shop_setup_7", {

  })
})


// dcs = delete cookie session. unnecessary, but for ease of deleting cookies during dev
router.get("/dcs", (req, res) => {
  req.session = null;
  res.redirect("/");
})

router.post("#", (req, res) => {

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
    res.render('shop_setup/shop_setup_5', {
      msg: 'Error: No File Selected!'
    });
    return
  }

  let shopIdOfSession = db.getStoreIdFromStoreName(req.session.storeName)
  let multeredFilename = '/uploads/' + req.file.filename

  db.editShop(shopIdOfSession, { shopProfilePhoto: multeredFilename })

  // store some info in the database
  res.render('shop_setup/shop_setup_6', {
    msg: 'Image Uploaded!',
    file: `${multeredFilename}`
  });
});



//=============above: handling the store image uploading========

// used by axios request from shop_setup_4.ejs
// "shop_setup/product_type"
router.post('/product_type', (req, res) => {
  let sellerProductTypes = req.body.productTypeList

  let currentStoreId = db.getStoreIdFromStoreName(req.session.storeName)
  db.editShop(currentStoreId, { product:sellerProductTypes} )

  // console.log("back End:", sellerProductTypes)

  res.status(200).send(sellerProductTypes)

})



router.post('/delivery_type', (req, res) => {
  // let storeId = req.session.storeId ? req.session.storeId : null;
  let storeId = 101
  let deliveryMethodList = req.body.deliveryMethodList
  let currentShopInfo
  if (storeId) {
    db.editStore(storeId, deliveryMethodList)
    currentShopInfo = db.getShop(storeId)
  }
  console.log("checking", deliveryMethodList)
  console.log("!backend  !!")

  // res.status(200).json(JSON.stringify(deliveryMethodList))
  res.status(200).json(JSON.stringify(currentShopInfo))

})






module.exports = router;