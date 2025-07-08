import { cartvalue } from "./cartvalue"
import { finalPrice } from "./finalPrice"

export const incrementDecrement = (event,id,stock,price)=>{

    let arrFromLS = cartvalue() 

    let currentcard = document.querySelector(`#card${id}`)
    let productQuantity = currentcard.querySelector("#numbers")
    let final_price = currentcard.querySelector(".final_price");
    let quantity = parseInt(productQuantity.getAttribute("data-quantity")) || 1;


    let localStoragePrice = 0 
    let existingProd = arrFromLS.find((currelem)=> currelem.id === id);

    if(existingProd){
        quantity = existingProd.quantity
        localStoragePrice = existingProd.price;
    }else{
        localStoragePrice = price
    }
    if(event.target.id == "increase"){
        if(quantity < stock){
            quantity+=1
        }else if(quantity === stock){
            quantity = stock;   
            localStoragePrice = price * quantity
        }
    }
    if(event.target.id == "decrease"){
        if(quantity > 1){
            quantity-=1
        }
    }
    localStoragePrice = (price * quantity).toFixed(2)

    let updatedArray = {id,price:localStoragePrice,quantity}
        updatedArray = arrFromLS.map((currelem)=>{
        return currelem.id === id ? updatedArray : currelem
    });
    
    localStorage.setItem("cartProduct",JSON.stringify(updatedArray))

    productQuantity.innerHTML = quantity;
    productQuantity.setAttribute("data-quantity",quantity)
    final_price.innerHTML = `$${localStoragePrice}` 
    finalPrice()
}