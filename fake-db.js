

const users = {
  1: {
    userId: 1,
    username: 'yasmina',
    password: 'yasmina',
    wishlist:[{productId:1001},{productId:1002}]
  },
  2: {
    userId: 2,
    username: 'kevin',
    password: 'kevin',
    wishlist:[{productId:1001},{productId:1002}]
  },
  3: {
    userId: 3,
    username: 'sam',
    password: 'sam',
    wishlist:[{productId:1001},{productId:1002}]
  },
  4: {
    userId: 4,
    username: 'yoyo',
    password: 'yoyo',
    wishlist:[{productId:1001},{productId:1002}]
  },
};

const shopInfo = {
  101: {
    storeId: 101,
    storeName: "Hayes Studio",
    phoneNum: 23602294563,
    email: "HayesStudio@gmail.com",
    password: "hahayes",
    address: "2310 Main street,Vancouver BC,Canada",
    productCategory: "Handmade Goods",
    delivery: true,
    pickUp: true,
    kmRadius: 20,
    rating:4.94,
    shopProfilePhoto:"/uploads/175f1e62ee34e7f0a81fb56d7ff3517c.jpeg"
  },

  102: {
    storeId: 102,
    storeName: "Les Basics",
    phoneNum: 6042304194,
    email: "lesbasics@gmail.com",
    password: "lesbasics",
    address: "4521 fraser street,Vancouver BC,Canada",
    productCategory: "fashion",
    delivery: true,
    pickUp: true,
    kmRadius: 20,
    rating:4.85,
    shopProfilePhoto:"/uploads/175f1e62ee34e7f0a81fb56d7ff3517c.jpeg"
  },

  103: {
    storeId: 103,
    storeName: "Sage Jewels",
    phoneNum: 6047757246,
    email: "sagejewelss@gmail.com",
    password: "sagejewels",
    address: "2410 pender street,Vancouver BC,Canada",
    productCategory: "Handmade Goods",
    delivery: false,
    pickUp: true,
    kmRadius: 30,
    rating:4.76,
    shopProfilePhoto:"/uploads/175f1e62ee34e7f0a81fb56d7ff3517c.jpeg"
  }
}


const products = {
  1001:{
    productId:1001,
    storeId: 101,
    productName:"Nike Sage Lows",
    category:"shoes",
    description:"Size 8 Womens US shoes, Great condition",
    price:125,
    deliveryFee:10,
    tax:0.12,
    timestamp:16426984492032
  },
  1002:{
    productId:1002,
    storeId: 102,
    productName:"Eco Tee",
    category:"clothing",
    description:"Size Large, men T-shirt",
    price:35,
    deliveryFee:10,
    tax:0.12,
    timestamp:16426955392032
  },

}

const orders = {
  10001: {
    orderId: 10001,
    storeId: 101,
    productId:1001,
    userId:1,
    payment: 150,
    delivery: true,
    pickUp: false,
    timestamp:1642698392032
  },
  10002:{
    orderId: 10002,
    storeId: 102,
    productId:1002,
    userId:2,
    payment: 39.2,
    delivery: false,
    pickUp: true,
    timestamp:1642698373426
  }
}


// const comments = {
//   9001: {
//     id: 9001,
//     post_id: 102,
//     creator: 1,
//     description: "Actually I learned a lot :pepega:",
//     timestamp: 1642691742010,
//   }
// }

// const votes = [
//   { user_id: 2, post_id: 101, value: +1 },
//   { user_id: 3, post_id: 101, value: +1 },
//   { user_id: 4, post_id: 101, value: +1 },
//   { user_id: 3, post_id: 102, value: -1 },
// ]

function debug() {
  console.log("==== DB DEBUGING ====")
  console.log("users", users)
  console.log("posts", posts)
  console.log("comments", comments)
  console.log("votes", votes)
  console.log("==== DB DEBUGING ====")
}

function getUser(userId) {
  return users[userId];
}

function getUserByUsername(username) {
  let relevant_user_object = Object.values(users).filter(user => user.username === username)[0];
  if (relevant_user_object) {
    return getUser(relevant_user_object.userId);
  } else {
    return undefined;
  }
}

function addUser(username, password) {
  
  // get the next userId in sequence, userIds are reused if previous user d
  let storeId = Math.max(...Object.keys(store).map(Number)) + 1;
  let user = {
    userId,
    username,
    password,
  };
  
  return 
}



// function decoratePost(post) {
//   post = {
//     ...post,
//     creator: users[post.creator],
//     votes: getVotesForPost(post.id),
//     comments: Object.values(comments).filter(comment => comment.post_id === post.id).map(comment => ({ ...comment, creator: users[comment.creator] })),
//   }
//   return post;
// }

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} category which sub to fetch, defaults to all categories
 */
function getProducts(n = 5, category = undefined) {
  let allProducts = Object.values(products);
  if (category) {
    allProducts = allProducts.filter(product => product.category === category);
  }
  allProducts.sort((a, b) => b.timestamp - a.timestamp);
  return allProducts.slice(0, n);
}


function getProduct(productId) {
  return products(productId);
}

function addProduct(storeId, productName, category, description,price, deliveryFee,tax) {
  let productId = Math.max(...Object.keys(products).map(Number)) + 1;
  let product = {
    productId,
    storeId,
    productName,
    category,
    description,
    price,
    deliveryFee,
    tax,
    timestamp: Date.now(),
  }
  products[productId] = product;
  return product;
}


function editProduct(productId, changes = {}) {
  let product = products[productId];
  if (changes.productName) {
    product.productName = changes.productName;
  }
  if (changes.category) {
    product.category = changes.category;
  }
  if (changes.description) {
    product.description = changes.description;
  }
  if (changes.price) {
    product.price = changes.price;
  }
  if (changes.deliveryFee) {
    product.deliveryFee = changes.deliveryFee;
  }
  if (changes.tax) {
    product.tax = changes.tax;
  }
}

function deleteProduct(productId) {
  delete products[productId];
}

/**
 * @param {number} storeID 
 * @returns {string} profilePhotoFileName. undefined if no shop with given storeID exists
 */
function getShopProfilePhotoFilename(givenStoreID) {
  // check if givenStoreID is number, if not, return undefined
  if(typeof(givenStoreID) !== 'number' && givenStoreID > 0){
    return;
  }
  let shop = shopInfo[givenStoreID];

  // no shop exists with the given ID
  if(shop == undefined){
    return;
  }
  return shop.shopProfilePhoto;
}

/**
 * @param {object} storeInfoObj 
 * @returns {}
 * Object with store info that will be written into the 
 * shopInfo {} inside fake-db.js.
 * storeId, storeName, phoneNum, email, password, address, 
 * productCategory,
 * delivery, pickUp, kmRadius, rating, shopProfilePhoto
 */
function writeShopIntoDatabase(storeInfoObj){
  // the next userId in sequence
  let userId = Math.max(...Object.keys(shopInfo).map(Number)) + 1;
  
  
}




function getCategory() {
  return Array.from(new Set(Object.values(products).map(product => product.category)))
}


function getOrders(){

}

function getOrder(){
  
}

function getStores(){

}

function getStore(){

}

function getWishList(){
  
}



module.exports = {
  debug,
  addUser,
  getUser,
  getUserByUsername,
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
  getCategory,
  getShopProfilePhotoFilename,
  writeShopIntoDatabase
};

