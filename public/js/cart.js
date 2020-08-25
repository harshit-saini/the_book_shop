// const axios = require("axios").default;

const cartItmes  = document.getElementById("cart-items");
cartItmes.addEventListener("click", cartItemClicked);

const userId = document.getElementById("user-id").innerText;






//
function cartItemClicked(e){
  if(e.target.id == "add-btn") addBtnClicked(e);
  if(e.target.id == "delete-btn") deleteBtnCliked(e);
  if(e.target.id == "delete-all-btn") deleteAllBtnClicked(e);
}


async function addBtnClicked(e){
  const productId = e.target.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.innerText;
  try{
    const response = await axios.post(`/cart/add/${ userId  }/${ productId }`);
    if(response.data === "product quantity increased") increaseProductQuantity(e);
  }catch(error){
    console.log(error);
  }
}

async function deleteBtnCliked(e){
  const productId = e.target.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.innerText;
  try{
    const response = await axios.post(`/cart/delete/${ userId  }/${ productId }`);
    if(response.data === "product quantity decreased") decreaseProductQuantity(e);
  }catch(error){
    console.log(error);
  }
}

async function deleteAllBtnClicked(e){
  const productId = e.target.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.innerText;
  try{
    const response = await axios.post(`/cart/delete-product/${ userId  }/${ productId }`);
    if(response.data === "product deleted") deleteProductFromCart(e);
  }catch(error){
    console.log(error);
  }
}
























// UI manipulations funtions 
function increaseProductQuantity(e){
  const quantity = e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.nextElementSibling;
  // console.log(quantity);
  quantity.innerText = `Quantity : ${parseInt(quantity.innerText.split(":")[1])+1}`
}


function decreaseProductQuantity(e){
  const quantity = e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.nextElementSibling;
  if(parseInt(quantity.innerText.split(":")[1] == 0)) deleteProductFromCart(e);
  if(parseInt(quantity.innerText.split(":")[1]) != 0){
    quantity.innerText = `Quantity : ${parseInt(quantity.innerText.split(":")[1])-1}`;
  }
}

function deleteProductFromCart(e){
  const product = e.target.parentElement.parentElement.parentElement;
  product.remove();
}