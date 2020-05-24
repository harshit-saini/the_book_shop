const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Books = require("../models/hot_books");


// Home Page
router.get('/', async (req, res, next) => {

  const hotBooks = await Books.find();
  res.render('index',{
    user : req.user,
    hotBooks: hotBooks,
    path : req.route.path,
    loggedIN : req.isAuthenticated(),
    title: "Home"

  })
})

// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user,
    path : req.route.path,
    loggedIN : req.isAuthenticated(),
    title: "dashboard"

  })
);

router.get("/shop",ensureAuthenticated, (req, res, next) => {
  res.render("index", {
    name : req.user.name,
    path:req.route.path,
    title: "shop"

  })
})

module.exports = router;
