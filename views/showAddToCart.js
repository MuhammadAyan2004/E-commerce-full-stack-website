import product from "./api/products.json";
import { cartvalue } from "./cartvalue";
import { incrementDecrement } from "./incrementDecrement";
import { finalPrice } from "./finalPrice"
import { fetchquantityfromLs } from "./fetchquantityfromLs";
import { removeCart } from "./removecart";

let arrFromLS = cartvalue()
// console.log(arrFromLS);
let filteredArray = product.filter((currElem)=>{
    return arrFromLS.some((currProd)=> currElem.id == currProd.id)
})
// console.log(filteredArray);

let prodTemp = document.querySelector("#productCartTemplate")
let prodContain = document.querySelector(".cartContent")

function showCart(){
    filteredArray.forEach((currProd)=>{

        const {id,name,price,img,stock} = currProd;
        let tempclone = document.importNode(prodTemp.content,true);
        tempclone.querySelector("#cardvalue").setAttribute("id", `card${id}`)
        tempclone.querySelector(".img").src = img;
        tempclone.querySelector(".product_name").textContent = name
        tempclone.querySelector(".product_price").textContent = `$${price}`
        
        const lsActualData = fetchquantityfromLs(id,price)
        tempclone.querySelector(".final_price").textContent = `$${lsActualData.price}`
        tempclone.querySelector("#numbers").textContent = lsActualData.quantity;

        tempclone.querySelector(".quanta-btn2").addEventListener("click",(event)=>{
            incrementDecrement(event,id,stock,price)
        })

        tempclone.querySelector('.remove').addEventListener("click",()=>{
            removeCart(id);
        })


        prodContain.appendChild(tempclone)

    })
}
finalPrice()
showCart()