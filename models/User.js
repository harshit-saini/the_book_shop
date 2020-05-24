const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profilePicPath :{
    type:String,
    default : "/images/site/default-user.jpg"
  },
  passwordResetToken: {
    type : String
  },
  passwordResetTokenExpiresAt:{
    type : Date
  },
    password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  cart:{
    items:[
      {
        itemId:{
          type : Schema.Types.ObjectId,
          ref : 'hot_books',
          required:true
         
        },
        quantity:{
          type:Number,
          required:true
          
        }

      }
    ]
  }
});



// add item to cart
UserSchema.methods.addToCart = function(productId){
  // find that product in the cart || find the index of that product in the cart
  const productIndex = this.cart.items.findIndex(item => {
    return item.itemId.toString() === productId.toString();
  })

  let newQuantity = 1;

  //make a new array of items including the previous items 

  const updatedItems = [...this.cart.items];

  // if you found the index means that item is already present 
  // just increase the quantiy 

  if(productIndex >= 0){
    newQuantity = this.cart.items[productIndex].quantity + 1;
    updatedItems[productIndex].quantity = newQuantity;
  }else{
    updatedItems.push({
      itemId : productId,
      quantity : newQuantity,
    })
  }

  this.cart = {
    items : updatedItems
  }

  return this.save()

}

// remove from cart
UserSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.itemId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};


// delete one item to cart
UserSchema.methods.deleteFromCart = function(productId){
  // find that product in the cart || find the index of that product in the cart
  const productIndex = this.cart.items.findIndex(item => {
    return item.itemId.toString() === productId.toString();
  })

  let newQuantity;

  //make a new array of items including the previous items 

  let updatedItems = [...this.cart.items];



  newQuantity = this.cart.items[productIndex].quantity - 1;
  updatedItems[productIndex].quantity = newQuantity;
  
  if(newQuantity > 0){
    this.cart = {
      items : updatedItems
    }

    return this.save()

  }else{

    updatedItems = this.cart.items.filter(item => {
      return item.itemId.toString() !== productId.toString();
    });
    this.cart.items = updatedItems;
    return this.save();
    
  }



}






const User = mongoose.model('User', UserSchema);

module.exports = User;
