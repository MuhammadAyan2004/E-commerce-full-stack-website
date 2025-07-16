import { addtocart } from "./addtocart"

export const shop_cart = (product) => {
    const productcontainer3 = document.querySelector(".productContainer3")
    const productTemps = document.getElementById("productTemp")
    const prebtn = document.querySelector(".pre")
    const nextbtn = document.querySelector(".next")
    const pagesdiv = document.querySelector(".pages");
    let currentPage = 1;
    let itemsPerPage = 12;
    let totalPages = Math.ceil(product.length / itemsPerPage)

    // firstpage
    const firstPageBtn = document.createElement("button")
    firstPageBtn.classList.add("n_page", "first_page")
    firstPageBtn.textContent = "1";
    pagesdiv.appendChild(firstPageBtn)

    // lastpage
    const lastpagebtn = document.createElement("button")
    lastpagebtn.classList.add("n_page", "last_page")
    lastpagebtn.textContent = totalPages;
    pagesdiv.appendChild(lastpagebtn)

    // dynamically create middle btton    
    function middlePage() {
        let middleBtn = pagesdiv.querySelector(".n_page:not(.first_page):not(.last_page)");

        for (let i = 2; i <= totalPages; i++) {
            const pageBtn = document.createElement("button")
            pageBtn.classList.add("n_page")
            pageBtn.textContent = i
            pageBtn.addEventListener("click", () => {
                currentPage = i;
                renderProduct()
            })
            pagesdiv.insertBefore(pageBtn, lastpagebtn)
        }
        lastpagebtn.remove()
    }
    // render products
    function renderProduct() {
        productcontainer3.innerHTML = "";
        let start = (currentPage - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        if (!product) {
            return false;
        }
        product.slice(start, end).forEach((currelem) => {
            const { id, img, name, price, brand, stock, details } = currelem;
            const tempClone_S = document.importNode(productTemps.content, true)

            tempClone_S.querySelector("#cardvalue").setAttribute("id", `card${id}`);
            tempClone_S.querySelector(".img").src = img;
            tempClone_S.querySelector(".brands").innerHTML = brand;
            tempClone_S.querySelector(".product_name").innerHTML = name;
            tempClone_S.querySelector(".price").textContent = `$${price}`
            tempClone_S.querySelector(".addToCart").addEventListener("click", (event) => {
                addtocart(event, id , stock)
            })
            productcontainer3.appendChild(tempClone_S)
        })
    }

    nextbtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++
            renderProduct()
        }
    });

    prebtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--
            renderProduct()
        }
    })

    firstPageBtn.addEventListener("click", () => {
        currentPage = 1;
        renderProduct()
    });

    lastpagebtn.addEventListener("click", () => {
        currentPage = totalPages;
        renderProduct()
    });

    middlePage()
    renderProduct()
}
