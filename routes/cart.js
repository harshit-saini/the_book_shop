const express = require("express");
const router = express.Router();

const User = require("../models/User");


router.route("/add/:userid/:productId")
 .post(async (req, res, next) => {
   try {
     // ---- changes in the database  
     const currentUser = await User.findOne({_id : req.params.userid});
     currentUser.addToCart(req.params.productId);
     // ---- sending response to the front end
    res.send("product quantity increased");
     
   } catch (error) {
     console.log(error)
   }
 })


router.route("/delete/:userId/:productId")
.post( async (req, res, next) => {
  try {
    // ---- changes in the data base
    const currentUser = await User.findOne({_id : req.params.userId});
    currentUser.deleteFromCart(req.params.productId);
    // ---- sending response to the front end
    res.send("product quantity decreased");
    
  } catch (error) {
    console.log(error);
  }
})

router.route("/delete-product/:userId/:productId")
.post(async (req, res, next) => {
  try {
    // ---- changes in the data base
    const currentUser = await User.findOne({_id : req.params.userId});
    currentUser.removeFromCart(req.params.productId);
    // ---- sending response to the front end
    res.send("product deleted");
    
  } catch (error) {
    console.log(error)
  }

})

module.exports = router;



