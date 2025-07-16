export const cartvalue = ()=>{
    let cartProduct = localStorage.getItem("cartProduct");
    if(!cartProduct){
        return []
    }
    cartProduct = JSON.parse(cartProduct)
    return cartProduct
}