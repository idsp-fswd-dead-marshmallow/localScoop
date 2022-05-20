
/** database setup */
const res = require("express/lib/response");
const mysql = require("mysql2");
const { doesShopExist } = require("../fake-db");
const is_heroku = process.env.IS_HEROKU || false;
const { sendFile } = require("express/lib/response");



// environment variables: for hiding api keys and mysql login
const dotenv = require("dotenv")
dotenv.config()


let database;
const dbConfigHeroku = {
    host: process.env.DBCONFIG_HEROKU_HOST,
    user: process.env.DBCONFIG_HEROKU_USER,
    password: process.env.DBCONFIG_HEROKU_PASSWORD,
    database: process.env.DBCONFIG_HEROKU_DATABASE,
    multipleStatements: false,
    namedPlaceholders: true
};


const dbConfigLocal = {
    host: "localhost",
    user: process.env.DBCONFIG_LOCAL_USERNAME,
    password: process.env.DBCONFIG_LOCAL_PASSWORD,
    database: process.env.DBCONFIG_LOCAL_DATABASE,
    port: 3306,
    multipleStatements: false,
    namedPlaceholders: true
};




if (is_heroku) {
    database = mysql.createPool(dbConfigHeroku).promise();
}
else {
    database = mysql.createPool(dbConfigLocal).promise();
}


/*****      Functions     *****/
/**
 * @param {number} store_id 
 * @returns all products belonging to a store
 */
async function getProductsByStoreId(store_id) {
    let query = `
    SELECT product.*, store.store_name, product_photo.photo_file_path
    FROM product
    LEFT JOIN store
    ON store.store_id = product.store_id
    LEFT JOIN product_photo
    ON product.product_id = product_photo.product_id
    WHERE store.store_id = ?
    `

    let [products, fields] = await database.query(query, [store_id])
    return products
}
exports.getProductsByStoreId = getProductsByStoreId



/** 
 * get all the orders by the giving store id in the order table
 * @param {number} store_id. 
 */
async function getOrdersByStoreId(store_id) {
    // has to be single line. because we used a sql keyword as table name. SO we cannot use backticks to wrap the string
    let query = "select * from `order` WHERE store_id = ?";


    let orders = await database.query(query, [store_id]);
    return orders[0];
}
exports.getOrdersByStoreId = getOrdersByStoreId


/**
 * @param {number} store_id 
 * @returns array of objects, orders and info of its products by store_id 
 */
async function getOrdersWithProductsPhotosByStoreId(store_id){
    // if sql command run with no store_id, everything will crash
    if(store_id == undefined){
        return;
    }
    
    let query = 'SELECT * FROM `order` LEFT JOIN product ON `order`.product_id = `product`.product_id LEFT JOIN product_photo on `product_photo`.product_id = `order`.product_id LEFT JOIN order_status ON `order_status`.order_status_id = `order`.order_status_id WHERE `order`.store_id = ?'
    

    let orders = await database.query(query, [store_id]);
    return orders[0];
}
exports.getOrdersWithProductsPhotosByStoreId = getOrdersWithProductsPhotosByStoreId



async function authenticateShopOwner(store_email, store_password) {
    let query = `
        SELECT * 
        FROM store 
        WHERE store_email = ? and store_password = ?;`

    let [validatedShopOwner, filed] = await database.query(query, [store_email, store_password])
    return validatedShopOwner
}
exports.authenticateShopOwner = authenticateShopOwner
// authenticateShopOwner("localscoop@gmail.com", "localscoop").then(console.log)
// authenticateShopOwner("local", "localsc").then(console.log)





async function authenticateBuyer(buyer_email, buyer_password) {
    let query = `SELECT * FROM buyer WHERE buyer_email = ? and buyer_password = ?;`
    let [validatedBuyer, filed] = await database.query(query, [buyer_email, buyer_password])
    return validatedBuyer
}
exports.authenticateBuyer = authenticateBuyer
// authenticateBuyer("localscoop@gmail.com", "localscoop").then(console.log)
// authenticateBuyer("local", "localsc").then(console.log)



async function getAllStores() {
    let sqlQuery = `SELECT * FROM store_photo ORDER BY store_id ASC `
    const [stores, fields] = await database.query(sqlQuery)
    return stores
}
exports.getAllStores = getAllStores
// getAllStores().then(console.log)


async function getAllProducts() {
    let sqlQuery = `SELECT * FROM product_photo ORDER BY product_id ASC `
    const [products, fields] = await database.query(sqlQuery)
    return products
}
exports.getAllProducts = getAllProducts
// getAllProducts().then(console.log)


//there canbe a better way for the store limit
async function getRandomStores(quantity = 100) {

    let sqlQuery = `SELECT * FROM storesAndImages ORDER BY RAND() LIMIT ? `
    const [stores, fields] = await database.query(sqlQuery, [quantity])
    return stores
}
exports.getRandomStores = getRandomStores



async function getRandomProducts(quantity = 100) {
    let sqlQuery = `SELECT * FROM productsAndImages ORDER BY RAND()LIMIT ? `
    const [products, fields] = await database.query(sqlQuery, [quantity])
    return products

}

exports.getRandomProducts = getRandomProducts






/**
 * @param store_id
 * @returns {Promise<*>}
 */
async function getStoreInfoByStoreId(store_id) {

    let query = `
        SELECT store.*, 
        GROUP_CONCAT(DISTINCT category.category_name ORDER BY category.category_id SEPARATOR', ') AS "categories",
        GROUP_CONCAT(DISTINCT store_photo.photo_file_path SEPARATOR', ') AS "photos"

        FROM store
        LEFT JOIN store_category 
        ON store.store_id = store_category.store_id
        LEFT JOIN category
        ON store_category.category_id = category.category_id
        LEFT JOIN store_photo
        ON store.store_id = store_photo.store_id
        WHERE store.store_id = ?
        group by store_id `

    let [store, fields] = await database.query(query, [store_id])
    return store
}
exports.getStoreInfoByStoreId = getStoreInfoByStoreId
// getStoreInfoByStoreId(1).then(console.log)




//===================SHOP SETUP=========================

/**
 *
 * @param store_name
 * @param store_phone_number
 * @param store_email
 * @param store_password
 * @returns {*}
 */
async function addShop(store_name, store_phone_number, store_email, store_password) {
    let query = `
    INSERT INTO store (store_name, store_phone_number, store_email, store_password) 
    VALUES ( ?, ?, ?, ?);`;

    let newStoreInfo = await database.query(query, [store_name, store_phone_number, store_email, store_password]);
    let newStoreId = newStoreInfo[0].insertId

    // console.log(newStoreId)
    return getStoreInfoByStoreId(newStoreId)
}
exports.addShop = addShop
// addShop("store_name", "store_phone_number", "store_email", "store_password_hash").then(console.log)



/**
 * @param store_id
 * @param store_address
 * @returns {Promise<*>}
 */
async function updateShopAddressByStoreId(store_id, store_address = "") {
    let query = `
        UPDATE store
        SET store_address = ?
        WHERE store.store_id  = ?;
        `
    await database.query(query, [store_address, store_id])
    return getStoreInfoByStoreId(store_id)
}
exports.updateShopAddressByStoreId = updateShopAddressByStoreId
// updateShopAddressByStoreId(1,"123 Robson ST").then(console.log)



/**
 *
 * @param categoryNameList
 * @returns {Promise<*[]>}
 */
async function getCategoryIdByCategoryName(categoryNameList) {
    let categoryIdList = []

    // likely problem with query
    let query = `
        SELECT category.category_id
        FROM category
        WHERE category.category_name=?;`

    for (let categoryName of categoryNameList) {
        let [idObjectOfName, fields] = await database.query(query, [categoryName])
        // console.log( "idObjectOfName: ",idObjectOfName)
        let idOfName = JSON.parse(idObjectOfName[0]['category_id'])
        categoryIdList.push(idOfName)
    }
    return categoryIdList
}
exports.getCategoryIdByCategoryName = getCategoryIdByCategoryName






/**
 * @param store_id
 * @param categoryNameList
 * @returns {Promise<*>}
 */
async function updateShopCategoryByStoreId(store_id, categoryNameList) {
    console.log(store_id)
    console.log(categoryNameList)

    let catIdList = await getCategoryIdByCategoryName(categoryNameList)
    let query = `
         INSERT INTO store_category (store_id, category_id)
         VALUES (?, ?);`

    for (let catId of catIdList) await database.query(query, [store_id, catId])
    return getStoreInfoByStoreId(store_id)
}
exports.updateShopCategoryByStoreId = updateShopCategoryByStoreId
// updateShopCategoryByStoreId(1,[2, 3, 4]).then(console.log)
// updateShopCategoryByStoreId(1,["beauty", "stationary", "art"]).then(console.log)



/**
 * @param store_id
 * @param delivery
 * @param pickup
 * @param radius
 * @returns {Promise<*>}
 */
async function updateShopDeliveryByStoreId(store_id, delivery = 0, pickup = 0, radius = 0) {

    let query = `
    UPDATE store
    SET store.delivery = ?,
    store.pickup = ?,
    store.radius = ?
    WHERE store.store_id = ?;`

    await database.query(query, [delivery, pickup, radius, store_id])
    return getStoreInfoByStoreId(store_id)
}
exports.updateShopDeliveryByStoreId = updateShopDeliveryByStoreId
// updateShopDeliveryByStoreId(1,0,1,0).then(console.log)



/**
 * @param store_id
 * @param photo_path
 */
async function updateShopPhotoByStoreId(store_id, photo_path = "") {
    console.log('update shop photo with the id')
    let query = `
    INSERT INTO store_photo(store_id, photo_file_path) 
    VALUE(?, ?)`

    await database.query(query, [store_id, photo_path])
}
exports.updateShopPhotoByStoreId = updateShopPhotoByStoreId


// function update_shop_photo_by_store_id(){
//     let query = `
//     INSERT INTO store_photo(store_id, photo_file_path) 
//     VALUE(?, ?)`

// }
// exports.update_shop_photo_by_store_id = update_shop_photo_by_store_id





//===================SELLER-SHOP =========================


async function getShopPhotoByStoreId(store_id) {

    let query = `
          SELECT store.store_id, 
          JSON_ARRAYAGG(store_photo.photo_file_path) AS "photos"
          FROM store
          LEFT JOIN store_photo
          ON store.store_id = store_photo.store_id
          WHERE store.store_id = ?
          group by store.store_id 
         `

    let [store, fields] = await database.query(query, [store_id])
    const photos = store[0].photos.filter(a => a)
    return photos

    //           GROUP_CONCAT(DISTINCT store_photo.photo_file_path SEPARATOR', ') AS "photos"
    //             FROM store
    //             LEFT JOIN store_photo
    //             ON store.store_id = store_photo.store_id
    //             WHERE store.store_id = ?
    //             group by store_id `

    //     let [store, fields] = await database.query(query,[store_id])
    //     let allPhotosString = store[0].photos
    //     return allPhotosString.split(", ")

}
exports.getShopPhotoByStoreId = getShopPhotoByStoreId
// getShopPhotoByStoreId(1).then(console.log)



async function getProductsAndImagesByStoreID(store_id) {
    let sqlQuery = `SELECT * FROM productsAndImages WHERE store_id = ?`
    const [product, fields] = await database.query(sqlQuery, [store_id])
    return product
}
exports.getProductsAndImagesByStoreID = getProductsAndImagesByStoreID




//works for local database
async function getAllBuyers() {
    let sqlQuery = "SELECT buyer_id, buyer_firstname, buyer_lastname, buyer_email, buyer_phone_number, buyer_gender, buyer_date_of_birth, buyer_profile_photo, buyer_address FROM buyer";
    const [AllBuyers] = await database.query(sqlQuery);
    return AllBuyers;
}
exports.getAllBuyers = getAllBuyers
// getAllBuyers().then(console.log)



//works for local database
async function getBuyer(buyer_id) {
    let sqlQuery = "SELECT buyer_id, buyer_firstname, buyer_lastname, buyer_email, buyer_phone_number, buyer_gender, buyer_date_of_birth, buyer_profile_photo, buyer_address FROM buyer WHERE buyer_id = ? ";
    const [AllBuyers] = await database.query(sqlQuery, [buyer_id]);
    const buyer = AllBuyers[0];
    return buyer;
}
exports.getBuyer = getBuyer
// getBuyer(2).then(console.log)



//works for local database
async function getProductsAndImages(product_id) {
    let sqlQuery = `SELECT * FROM productsAndImages WHERE product_id = ?`
    const [product, fields] = await database.query(sqlQuery, [product_id])
    return product
}
exports.getProductsAndImages = getProductsAndImages
// getProductsAndImages(76).then(console.log)



//works for local database
async function addNewProduct(store_id, product_name, product_category, product_description, product_price, product_delivery_fee) {
    let query = `INSERT INTO product(store_id,product_name, product_category, product_description, product_price, product_delivery_fee) VALUE (?, ?, ?, ?, ?, ?)`
    const [newproductInfo] = await database.query(query, [store_id, product_name, product_category, product_description, product_price, product_delivery_fee])
    return +newproductInfo.insertId
    // const  id = +newproductInfo.insertId
    // console.log(id)
    // return await getProductsAndImages(id)
}
exports.addNewProduct = addNewProduct
// addNewProduct(2,"pp", "food", "olive", 20, 10).then(console.log)


async function addNewProductPhoto(product_id, photo_file_path) {
    let query = `
        INSERT INTO product_photo(product_id, photo_file_path) 
        VALUE(?, ?)`

    const newProductPhoto = await database.query(query, [product_id, photo_file_path])
    return await getProductsAndImages(product_id)
}
exports.addNewProductPhoto = addNewProductPhoto
// addNewProductPhoto(2,"dfgvdfvd444").then(console.log)


async function productsAndImagesViews() {
    let query = `SELECT *  FROM  productsandimages`
    return await database.query(query)
}
exports.productsAndImagesViews = productsAndImagesViews


async function storesAndImagesViews() {
    let query = `SELECT *  FROM  storesandimages`
    return await database.query(query)
}
exports.storesAndImagesViews = storesAndImagesViews


//======yasmina code for add to cart===

async function getCartIdByBuyerId(buyerId) {
    let query = ` SELECT cart.cart_id
        FROM cart
        WHERE buyer_id = ? AND purchased = "no" `

    const [buyerActiveCartId, fields] = await database.query(query, [buyerId])
    return buyerActiveCartId

}
exports.getCartIdByBuyerId = getCartIdByBuyerId
// getCartIdByBuyerId(1).then(console.log)



async function addToCart(buyerId, productId) {

    //finding the cartId
    let cartIdObject = await getCartIdByBuyerId(buyerId);
    let cartId = cartIdObject[0]['cart_id']

    //-----------------------------------create the cart if it soes not exist


    //checking if order exist already
    let sqlQuery = ` SELECT product_quantity FROM cart_product WHERE cart_id = ? AND product_id = ?`
    let [productMatches, fields] = await database.query(sqlQuery, [cartId, productId])
    let cartItemExist = productMatches.length !== 0
    let query;

    if (cartItemExist) {
        //if the item existed change the quantity
        query = `UPDATE cart_product
        SET cart_product.product_quantity = cart_product.product_quantity + 1
        WHERE cart_id = ? AND product_id = ? `

    } else {
        //if the item did not exist insert new row
        query = ` INSERT INTO cart_product(cart_id, product_id, product_quantity)VALUES (?,?,1)`
    }

    await database.query(query, [cartId, productId])
    return getCartItemsCount(buyerId)
    // later you can substitute it with better return value

}

exports.addToCart = addToCart

// addToCart(1,3).then(console.log)
//buyer id 1 has the cart number 2




async function getCartItemsCount(buyerId) {
    let cartIdObject = await getCartIdByBuyerId(buyerId);
    let cartId = cartIdObject[0]['cart_id']

    let query = ` SELECT SUM(product_quantity) AS product_quantity
    FROM cart_product
    WHERE cart_id = ?;`


    const [itemsCountObject, fields] = await database.query(query, [cartId])
    return itemsCountObject[0].product_quantity

}
exports.getCartItemsCount = getCartItemsCount

// getCartItemsCount(1).then(console.log)


//====YOYO CODE FOR ADD TO CART======



async function getCartItemsByBuyer(buyer_id) {

    let query = `
        select cp.cart_product_id,b.buyer_id,c.cart_id,cp.cart_product_id,p.product_id, p.product_name,p.product_price,cp.product_quantity,c.purchased,p.image_file_paths
        from buyer as b
        left join cart as c
        on b.buyer_id = c.buyer_id
        left join cart_product as cp
        on c.cart_id = cp.cart_id
        left join productsandimages as p
        on cp.product_id = p.product_id
        where b.buyer_id = ? and c.purchased = "no";`

    let [cartItems] = await database.query(query, [buyer_id])

    return cartItems
}

exports.getCartItemsByBuyer = getCartItemsByBuyer
// getCartItemsByBuyer(1).then(console.log)



async function getCartItemsLength(buyer_id) {
    let cartItems = await getCartItemsByBuyer(buyer_id)
    // console.log("bew",cartItems)
    let cartQuantity = 0
    cartItems.forEach(item => {
        cartQuantity = cartQuantity + item.product_quantity

    })
    return cartQuantity
}

exports.getCartItemsLength = getCartItemsLength
// getCartItemsLength(1).then(console.log)



async function getCartItemByProduct(buyer_id, product_id) {
    let query = `select cp.cart_product_id,b.buyer_id,c.cart_id,cp.cart_product_id,p.product_id, p.product_name,p.product_price,cp.product_quantity,c.purchased,p.image_file_paths
        from buyer as b
        left join cart as c
        on b.buyer_id = c.buyer_id
        left join cart_product as cp
        on c.cart_id = cp.cart_id
        left join productsandimages as p
        on cp.product_id = p.product_id
        where b.buyer_id = ? and p.product_id = ? and c.purchased = "no";`

    let [cartItem] = await database.query(query, [buyer_id, product_id])
    return cartItem[0]
}
exports.getCartItemByProduct = getCartItemByProduct
// getCartItemByProduct(1,1).then(console.log)

async function getCartItemsLength(buyer_Id) {
    let cartItems = await getCartItemsByBuyer(buyer_Id)
    let cartQuantity = 0
    cartItems.forEach(item => {
        cartQuantity = cartQuantity + item.product_quantity
    })
    return cartQuantity
}
exports.getCartItemsLength = getCartItemsLength
// getCartItemsLength(1).then(console.log)


async function inCartItem(cart_product_id, buyer_id, product_id) {
    // let cartItem = getCartItemByProduct(buyer_id, product_id)
    let query = `UPDATE cart_product SET product_quantity = product_quantity + 1 WHERE cart_product_id = ?`
    await database.query(query, [cart_product_id])
    return await getCartItemByProduct(buyer_id, product_id)
}
exports.inCartItem = inCartItem
// inCartItem(8,1).then(console.log)

async function deCartItem(cart_product_id, buyer_id, product_id) {
    let query = `UPDATE cart_product SET product_quantity = product_quantity - 1 WHERE cart_product_id = ?`
    await database.query(query, [cart_product_id])
    return await getCartItemByProduct(buyer_id, product_id)
}
exports.deCartItem = deCartItem


async function deleteCartItem(cart_product_id, buyer_id) {
    let query = `DELETE FROM cart_product WHERE cart_product_id = ?`
    await database.query(query, [cart_product_id])
    return
}
exports.deleteCartItem = deleteCartItem


// async function getCartItemByProduct(buyer_Id, product_id) {
//     let query = `select cp.cart_product_id,b.buyer_id,c.cart_id,cp.cart_product_id,p.product_id, p.product_name,p.product_price,cp.product_quantity,c.purchased,p.image_file_paths
// from buyer as b
// left join cart as c
// on b.buyer_id = c.buyer_id
// left join cart_product as cp
// on c.cart_id = cp.cart_id
// left join productsandimages as p
// on cp.product_id = p.product_id
// where b.buyer_id = ? and p.product_id = ? and c.purchased = "no";`

//     let [cartItem] = await database.query(query, [buyer_Id,product_id])
//     return cartItem[0]
// }
// exports.getCartItemByProduct = getCartItemByProduct
// getCartItemByProduct(1,1).then(console.log)




//=======searching =============

async function searchProduct(searchedString) {

    let query = `SELECT productsandimages.*
    FROM productsandimages
    WHERE product_name LIKE CONCAT("%", ?, "%") OR product_category LIKE CONCAT("%", ?, "%");
   `

    let [searchResult, fields] = await database.query(query, [searchedString, searchedString])
    return searchResult

}
exports.searchProduct = searchProduct
// searchProduct("s").then(console.log)






// -----------------------------//Chat FUNCTIONs Needed----------------------------------------------
//
//
//
// async function createChat(buyerId, storeId) {
//
// }
//
// exports.createRoom = createRoom
//
//
//
//

async function getBuyerChats(buyerId) {
    let query=`
    SELECT * FROM localscoop.chat
    WHERE chat.buyer_id = ?;`

   let [buyerChat, fields] = await database.query(query, [buyerId])
    return buyerChat

}
exports.getBuyerChats = getBuyerChats



async function getSellerChats(storeId) {
    let query=`
    SELECT * FROM localscoop.chat
    WHERE chat.store_id = ?;`

    let [storeChat, fields] = await database.query(query, [buyerId])
    return storeChat
}

exports.getSellerChats = getSellerChats





// async function getChatContent(chatId) {
//
// }
//
// exports.getChatContent = getChatContent
//
//
//
//
//
// async function addStoreChatContent(chatId, storId, text) {
//
// }
//
// exports.getChatContent = getChatContent
//
//
//
//
//
// async function addBuyerChatContent(chatId, buyerId, text) {
//
// }
//
// exports.getChatContent = getChatContent



