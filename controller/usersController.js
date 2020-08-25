const bcrypt = require("bcryptjs")
const Mail = require('../config/mail');
const passport = require('passport');



const User  = require("../models/User")



// **** GET ****

// ---- GET login Page
exports.GETLoginPage = function(req, res, next){
  res.render('login',{
    path: req.route.path,
    loggedIN : req.isAuthenticated(),
    title: "login",
  })
}

// ---- GET Regiser page
exports.GETRegisterPage = function(req, res, next) {
  res.render('register',{
    path : req.route.path,
    loggedIN : req.isAuthenticated(),
    title: "SignUp"
  })
}

// ---- GET profile page
exports.GETProfilePage = function(req,res,next){

  res.render('profile',{
    user : req.user,
    path : req.route.path,
    loggedIN : req.isAuthenticated(),
    title: "profile"
  })
}
// ---- GET edit profile page
exports.GETEditProfilePage = function(req,res,next){
  res.render('editProfile',{
    user : req.user,
    path : req.route.path,
    loggedIN : req.isAuthenticated(),
    title: "Edit Profile"
  })
}


// ---- logout
exports.LogOut = function(req, res, next){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
}




// **** POST ****

// ---- POST registration Form
exports.POSTRegistrationForm = function(req, res, next){
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          title : "SignUp"
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          cart : {item : []}
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
                Mail.userRegistered(email);
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
}

// ---- POST Login Form
exports.POSTLoginForm = function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}


// ---- POST profile edits
exports.POSTEditProfile = async function(req, res, next){

  try{
    const user  = await User.findOne({_id: req.user._id})
    if(req.file) {
      console.log(req.file);
      user.profilePicPath = `${req.file.location}`;
    }
    user.name = req.body.name;
    await user.save();
    res.redirect("/users/profile");

  }catch(error){
    console.log(error)
  }

}
