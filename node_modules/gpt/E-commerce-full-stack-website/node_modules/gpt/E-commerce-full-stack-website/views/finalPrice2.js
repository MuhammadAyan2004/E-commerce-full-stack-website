import { cartvalue } from "./cartvalue";

export const finalPrice2 = ()=>{
    let subTotal = document.querySelector(".subtotal-price");
    let finalprice = document.querySelector(".total-price2");
    let arrFromLS = cartvalue()
    let initialvalue = 0;

    let finaltotal = arrFromLS.reduce((acc, currElem)=>{
        let productPrice = parseFloat(currElem.price) ||0
        return acc + productPrice;
    },initialvalue)

    let discount = 20;

    subTotal.innerHTML = `$${finaltotal.toFixed(2)}`

    if(finaltotal > 0){
        finalprice.innerHTML = `$${(finaltotal-discount).toFixed(2)}`
    }else{
        finalprice.innerHTML = 0.00;
    }

}