let checkoutBtn = document.querySelector(".checkout-btn")

let cartContent = JSON.parse(localStorage.getItem("cart"))

let cartDetails = {}

if(cartContent){
    filterCartContent()
}

// Function to get the exact products from cart that is in the localstorage
function filterCartContent(){
    let validContent = {}
    Object.keys(cartContent).forEach(id => {

        if(cartContent[id]){
            validContent[id] = cartContent[id]
        }

    })

    getCartDetails(validContent)
}

// Function to get Details of available products from the server 
function getCartDetails(validContent){
    loadingModal.classList.toggle("toggle-loading-modal")
    console.log(validContent, typeof validContent)
    fetch("/cartProduct", {
        method: "POST",
        body: JSON.stringify(validContent),
    })
    .then(response => {
        loadingModal.classList.toggle("toggle-loading-modal")
        response.json()
        .then(data => {
            console.log(data)
            cartDetails = data 
            updateCartPage()   
        })
    })
}

// Function to insert data deom fetch into the DOM
function updateCartPage(){
    document.getElementsByTagName("tbody")[0].innerHTML = ""
    cartDetails.forEach(product => {
        let price = parseInt(product.price)
        let quantity = parseInt(cartContent[product.id])
        document.getElementsByTagName("tbody")[0].innerHTML += `<tr>

        <td class="product-thumbnail">
          <img src="${product.images[0].secure_url}" alt="Image" class="img-fluid">
        </td>
        <p class="product-root_category" product-category="${product.root_category}" hidden></p>
        <td class="" product-id="${product.id}">
          <h2 class="h5 text-black product-main-name" product-id="${product.id}">${product.name}</h2>
        </td>
        <td>NGN <span class="product-main-price" product-id="${product.id}" >${parseInt(price).toLocaleString()}</span></td>
        <td>
          <div class="input-group mb-3" style="max-width: 120px;">
            <div class="input-group-prepend" product-id="${product.id}" >
              <button class="btn btn-outline-primary js-btn-minus" product-id="${product.id}"  type="button">&minus;</button>
            </div>
            <input type="text" product-id="${product.id}" class="form-control text-center product-main-quantity" value="${quantity}" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
            <div class="input-group-append" product-id="${product.id}" >
              <button class="btn btn-outline-primary js-btn-plus" product-id="${product.id}"  type="button">&plus;</button>
            </div>
          </div>
        </td>
        <td product-id="${product.id}" class="product-totalCost" >NGN ${(price * quantity).toLocaleString()}</td>
        <td product-id="${product.id}" ><a href="#" class="btn btn-primary height-auto btn-sm remove-product" product-id="${product.id}"  >X</a></td>
      </tr>`
    })
    
    addSubBtns()
    totalCost()

}

// This calculates Total of everything annd inserts it into that bottom part
function totalCost(){
    let total = 0
    let prices = document.querySelectorAll(".product-main-price") 
    let quantities = document.querySelectorAll(".product-main-quantity")

    for(let i=0; i<quantities.length; i++){
        let price = prices[i].innerHTML
        console.log(price)
        let searchRegExp = /,/g
        price = price.replace(searchRegExp, "")
        total += (parseInt(price) * parseInt(quantities[i].value))
    }

    document.querySelector(".total-cost").innerHTML = "NGN " + total.toLocaleString()
    
}

// This function inserts eventlisteners on the buttons in each row (plus, minus and remove)
function addSubBtns(){
    let plus = document.querySelectorAll(".js-btn-plus")

    let minus = document.querySelectorAll(".js-btn-minus")

    let remove = document.querySelectorAll(".remove-product")

    console.log(remove)

    plus.forEach(btn => {
        btn.addEventListener("click", increase)
    })

    minus.forEach(btn => {
        btn.addEventListener("click", reduce)
    })

    remove.forEach(btn => {
        console.log("Hello")
        btn.addEventListener("click", removeFromCart)
    })
}

// Function to increase the quantity
function increase(){
    this.parentElement.previousElementSibling.value = parseInt(this.parentElement.previousElementSibling.value)  + 1
    
    add_no(this.getAttribute("product-id"), this.parentElement.previousElementSibling.value)
    changeProductTotal(this.getAttribute("product-id"), this.parentElement.previousElementSibling.value)
    totalCost()
}

// Function to reduce the quantity
function reduce(){
    console.log(this.parentElement.nextElementSibling)
    this.parentElement.nextElementSibling.value = parseInt(this.parentElement.nextElementSibling.value) > 1 ? parseInt(this.parentElement.nextElementSibling.value) - 1 : 1

    add_no(this.getAttribute("product-id"), this.parentElement.nextElementSibling.value)
    changeProductTotal(this.getAttribute("product-id"), this.parentElement.nextElementSibling.value)
    totalCost()
}


// Function to remove a product from cart
function removeFromCart(){
    console.log(this)
    add_no(this.getAttribute("product-id"), 0)

    cartContent = JSON.parse(localStorage.getItem("cart"))

    filterCartContent()
}

// Function that updates each product total and overall total once their is increase in quantity
function changeProductTotal(productId, quantity){
    // Get the product cost
    let cost = document.querySelector(`.product-main-price[product-id='${productId}']`).innerHTML
    // Get the quantity
    // Do the maths
    let newtotal = 0
    cost = cost.replace(",", "")
    let searchRegExp = /,/g
    cost = cost.replace(searchRegExp, "")
    console.log(cost)
    newtotal = (parseInt(cost) * parseInt(quantity)).toLocaleString()
    // Replace in product totalbox
    document.querySelector(`.product-totalCost[product-id='${productId}']`).innerHTML = "NGN " + newtotal
}





checkoutBtn.addEventListener("click", sendMessage)

// Function for sending whatsapp message
function sendMessage(){

    // Get list of all the product names
    // Get list of all quantity
    // Get list of all categories
    // Get list of Price

    let whatsapp_message = 'https://api.whatsapp.com/send?phone=2348147663563&text=Hello%20Ma,%20%0a%0aI%20placed%20Order%20for:%20%0a'
    
    let TOTAL = document.querySelector(".total-cost")
    if(TOTAL.innerHTML != "NGN 00"){

        let productNames = document.querySelectorAll(".product-main-name")
        let productQuantities = document.querySelectorAll(".product-main-quantity")
        let productCategories = document.querySelectorAll(".product-root_category")
        let productPrices = document.querySelectorAll(".product-totalCost")
    
        for(let i=0; i<productNames.length; i++){
            let searchRegExp = /\s/g
            let name = productNames[i].innerHTML
            name = name.replace(searchRegExp, "%20")
            let price = productPrices[i].innerHTML
            price = price.replace(searchRegExp, "%20")
            whatsapp_message += `Product%20Name%20:%20${name}%0a`
            whatsapp_message += `Quantity%20:%20${productQuantities[i].value}%0a`
            whatsapp_message += `Category%20:%20${productCategories[i].getAttribute("product-category")}%0a`
            whatsapp_message += `Price%20:%20${price}%0a%0a`
            
        }
        let searchRegExp = /\s/g
        let totalPrice = TOTAL.innerHTML
        totalPrice = totalPrice.replace(searchRegExp, "%20")
        whatsapp_message += `%0a%0aTOTAL%20:%20${totalPrice}`
    
        console.log(whatsapp_message)
        window.location = whatsapp_message
    }

}