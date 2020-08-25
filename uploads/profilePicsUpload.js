const path = require("path")
const multer = require("multer");

const aws =  require("aws-sdk");
const multerS3 = require("multer-s3");

// aws.config.update({
//   secretAccessKey : process.env.AWSSecretKey,
//   accessKeyId : process.env.AWSAccessKeyId,
//   region : "us-east-2"
// })


const S3Bucket = new aws.S3({
  secretAccessKey : process.env.AWSSecretKey,
  accessKeyId : process.env.AWSAccessKeyId,
  region : "us-east-2"
});


const profilePic = multer({

  storage : multerS3({
    acl : "public-read",
    s3 : S3Bucket,
    bucket : "the-book-shop",
    filename:function(req,file,cb){
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
    metadata: function (req, file, cb) {
      // console.log(file);
      cb(null, {fieldName: file.fieldname});
    },
    key : function(req, file, cb){
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
  })

})


// const storage = multer.diskStorage({
//   destination :path.join(__dirname, '..', 'public', 'userProfilePics'),
//   filename:function(req,file,cb){
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   }
// })

// const profilePic = multer({
//   storage:storage
// })


module.exports = profilePic;