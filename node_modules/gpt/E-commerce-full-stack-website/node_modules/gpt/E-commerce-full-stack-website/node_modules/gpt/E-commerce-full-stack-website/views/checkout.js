import product from "./api/products.json";
import { cartvalue } from "./cartvalue";
import { fetchquantityfromLs } from "./fetchquantityfromLs";
import { finalPrice2 } from "./finalPrice2";

let arrFromLS = cartvalue()
console.log(arrFromLS);
let filteredArray = product.filter((currElem)=>{
    return arrFromLS.some((currProd)=> currElem.id == currProd.id)
})
console.log(filteredArray);

let prodTemp = document.querySelector("#productCartTemplates")
let prodshowid = document.querySelector(".productIDshow")

function showCart(){
    filteredArray.forEach((currProd)=>{
        const {id,price,name,quantity} = currProd;
        let tempclone = document.importNode(prodTemp.content,true);
        
        const lsActualData = fetchquantityfromLs(id,price);
        tempclone.querySelector(".actualid").textContent = name;
        tempclone.querySelector(".final-quantity").textContent = lsActualData.quantity;
        tempclone.querySelector(".actualvalue").textContent = `$${price}`;

        prodshowid.appendChild(tempclone)

    })
}
finalPrice2()
showCart()