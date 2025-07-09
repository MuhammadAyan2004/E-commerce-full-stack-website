import { cartvalue } from "./cartvalue"

export const finalPrice = () => {
    
    let subTotal = document.querySelector(".subtotal-price");
    let finalprice = document.querySelector(".total-price");
    let arrFromLS = cartvalue()
    let initialvalue = 0;

    let totalPrice = arrFromLS.reduce((acc, currElem) => {
        let productPrice = parseFloat(currElem.price) || 0
        return acc + productPrice;
    }, initialvalue)

    subTotal.innerHTML = `$${totalPrice.toFixed(2)}`;
    
    if(totalPrice > 0){
        let discount = 25
        finalprice.innerHTML = `$${(totalPrice-discount).toFixed(2)}`;
    }else{
        finalprice.innerHTML = "0.00"
    }
}  