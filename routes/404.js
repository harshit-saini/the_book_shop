const express = require("express")

const router = express.Router();


router.get( (req, res, next) => {
  res.render("error/404", {
    title: "404"
  })
})

module.exports = router;