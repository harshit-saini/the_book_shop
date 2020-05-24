const path = require("path")
const multer = require("multer");

const storage = multer.diskStorage({
  destination :path.join(__dirname, '..', 'public', 'userProfilePics'),
  filename:function(req,file,cb){
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
})

const profilePic = multer({
  storage:storage
})


module.exports = profilePic;