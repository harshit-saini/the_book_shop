exports.GETaddProductsPage = (req, res, next) => {
  res.render("admin/addproducts",{
    loggedIN:null,
    path : null
  });
} 