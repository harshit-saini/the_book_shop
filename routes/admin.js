const express = require("express");
const adminController = require("../controller/adminController")


const router = express.Router();

router.get("/addproducts", adminController.GETaddProductsPage);


module.exports  = router;
