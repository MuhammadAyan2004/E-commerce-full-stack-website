import { cartvalue } from "./cartvalue"

export const fetchquantityfromLs = (id,price)=>{
    let cartProoduct = cartvalue()
    let existingProd = cartProoduct.find((currElem)=> currElem.id === id);
    let quantity = 1

    if (existingProd){
        quantity = existingProd.quantity
        price = existingProd.price
    }

    return {price,quantity}
}