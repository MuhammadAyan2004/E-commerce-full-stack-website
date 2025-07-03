import { cartvalue } from "./cartvalue";
import { finalPrice } from "./finalPrice";

export const removeCart = (id)=>{
    const removeDiv = document.querySelector(`#card${id}`);
    let cartProduct = cartvalue();
    cartProduct = cartProduct.filter((currprod) => currprod.id !== id);
    localStorage.setItem("cartProduct", JSON.stringify(cartProduct));
    if(removeDiv){
        removeDiv.remove();
    }
    finalPrice()
}