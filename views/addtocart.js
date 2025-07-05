import { cartvalue } from "./cartvalue";

export const addtocart = (Event,id,stock)=>{

    let arrcart = cartvalue();

    const currentcard = document.querySelector(`#card${id}`)
    let price = currentcard.querySelector(".price").innerHTML;
    let quantity = 1
    price = price.replace("$","");

    let existingProd = arrcart.find((currelem)=> currelem.id === id)
    console.log(existingProd);

    if(existingProd){
        return false
    }

    arrcart.push({id,price,quantity})
    localStorage.setItem("cartProduct",JSON.stringify(arrcart))

}