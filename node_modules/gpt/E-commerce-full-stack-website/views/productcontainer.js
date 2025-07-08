import { addtocart } from "./addtocart"

export const showProductContainer = (product)=>{
    
    const productcontainer = document.querySelector(".productContainer")
    const productcontainer2 = document.querySelector(".productContainer2")
    const productTemp = document.querySelector("#productTemp")

    if(!product || product.length === 0){
        return false
    }
    const shuffledProducts = [...product].sort(() => Math.random() - 0.5);
    const randomProducts = shuffledProducts.slice(0, 8);

    randomProducts.forEach((currElem)=>{
        const {id, img, name, price, brand, stock, details} = currElem;
        const tempClone = document.importNode(productTemp.content,true)

        tempClone.querySelector("#cardvalue").setAttribute("id",`card${id}`);
        tempClone.querySelector(".img").src = img;
        tempClone.querySelector(".brands").innerHTML = brand;
        tempClone.querySelector(".product_name").innerHTML = name;
        tempClone.querySelector(".price").textContent = `$${price}`
        tempClone.querySelector(".addToCart").addEventListener("click",(event)=>{
            addtocart(event,id)
        })

        productcontainer.appendChild(tempClone)
    })
    product.slice(0,8).forEach((currelem)=>{
        const {id, img, name, price, brand, stock, details} = currelem;
        const tempClone = document.importNode(productTemp.content,true)

        tempClone.querySelector("#cardvalue").setAttribute("id",`card${id}`);
        tempClone.querySelector(".img").src = img;
        tempClone.querySelector(".brands").innerHTML = brand;
        tempClone.querySelector(".product_name").innerHTML = name;
        tempClone.querySelector(".price").textContent = `$${price}`
        tempClone.querySelector(".addToCart").addEventListener("click",(event)=>{
            addtocart(event,id)
        })

        productcontainer2.appendChild(tempClone) 
    })
}
