const express = require('express');
const router = express.Router();
const crypto = require('crypto')

const userController = require("../controller/usersController");
const profilePicUpload = require("../uploads/profilePicsUpload")



const Mail = require('../config/mail');

// Load User model
const User = require('../models/User');
const Book = require("../models/hot_books");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { route } = require('.');


// **** Login 
router.route("/login")
  .get(forwardAuthenticated, userController.GETLoginPage)
  .post(userController.POSTLoginForm)


// **** Register
router.route("/register")
  .get(forwardAuthenticated, userController.GETRegisterPage)
  .post(userController.POSTRegistrationForm)


// **** edit-profile
router.route("/edit-profile")
  .get(ensureAuthenticated, userController.GETEditProfilePage)
  .post(profilePicUpload.single("profilePic") , userController.POSTEditProfile)

// Logout
router.get('/logout', userController.LogOut);

// profile
router.get("/profile", ensureAuthenticated, userController.GETProfilePage);


router.route("/edit-profile")
  .get(ensureAuthenticated, userController.GETEditProfilePage)
  .post(profilePicUpload.single("profilePic") , userController.POSTEditProfile)


// reset password : get page
router.get("/reset-password", (req, res, next) => {
  res.render("resetPassword",{
    title : "reser password",
  })
})

// reset password  : post
router.post("/reset-password", async (req, res, next) => {
  const emailEntered  = req.body.email;
  const resultUser  = await User.findOne({email: emailEntered})


  // if no user found
  if (!resultUser) {
    return res.render("resetPassword",{
      title : "reser password",
      error_msg : "Invalid Email",
    });
  }

  //if user found
  var token;
  crypto.randomBytes(32, (error, buffer) => {
    if(error){
      console.log(error);
     return res.redirect('/reset-password');
    }
    token  = buffer.toString('hex');
    // because crypto is async
    resultUser.passwordResetToken = token;
    resultUser.passwordResetTokenExpiresAt = new Date(Date.now() + 3600000);
    resultUser.save();
    Mail.passwordReset(emailEntered,token, req);

  })

  res.render("checkEmail", {
    title : "reset password"
  });

})



router.get("/enter-reset-password/:token", async (req, res, next) => {
  // find the user with this token
  const tokenReceived = req.params.token;
  const resultUser = await User.findOne({
    passwordResetToken : tokenReceived,
    passwordResetTokenExpiresAt : {$gt : Date.now()}
  })
  // if there is no such user 
  res.render("enterResetPassword", {
    user : resultUser,
    title : 'password reset'
  })

})


router.post('/cart', async (req,res,next) => {
  const bookId = req.body.bookId;
  req.user.addToCart(bookId);
  res.redirect('/users/cart')
})



router.get("/cart",async (req,res,next) => {
  await req.user
  .populate('cart.items.itemId')
  .execPopulate()

  res.render("cart", {
    user : req.user,
    path : req.route.path,
    loggedIN : req.isAuthenticated(),
    title: "cart",
  })
})

router.post("/modify-cart", (req, res, next) => {

  const addBookId = req.body.addBook;
  const deleteBookId = req.body.deleteBook;
  const deleteAllBookId = req.body.deleteAllBook;

  if(addBookId) {
    req.user.addToCart(addBookId)
  }
  if(deleteBookId) {
    req.user.deleteFromCart(deleteBookId)
  }
  if(deleteAllBookId) {
    req.user.removeFromCart(deleteAllBookId)
  }

  res.redirect("/users/cart")
})

module.exports = router;
