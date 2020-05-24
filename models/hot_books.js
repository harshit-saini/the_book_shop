const mongoose = require("mongoose")

const hotBooksSchema = new mongoose.Schema({
  title :{
    type: String,
    required : true
  },
  Author : {
    type : String,
    required : true
  },
  genere:{
    type: String,
    required : true
  },
  Description :{
    type : String,
  }

})

const Books = mongoose.model('hot_books',hotBooksSchema);

module.exports = Books;