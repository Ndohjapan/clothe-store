
// This function increases a particular item by 1 in the cart , "prodixt_id" should hold the id to the product that should be increased by one

function add_no() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach(item => {
        console.log("item: ", item)
        if (item.id === prodixt_id) {
            console.log("item found: ", item)
            item.quantity += 1
            return true
        }
    })
    console.log(cart)
    cart = JSON.stringify(cart)
    localStorage.setItem("cart", cart)
}



// This function decreases a particular item by 1 in the cart , "prodixt_id" should hold the id to the product that should be decreased by one

function sub_no() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach(item => {
        console.log("item: ", item)
        if (item.id === prodixt_id) {
            console.log("item found: ", item)
            if (item.quantity > 1) {
                item.quantity -= 1
                return true
            }
        }
    })
    console.log(cart)
    cart = JSON.stringify(cart)
    localStorage.setItem("cart", cart)
}



// This function should be called whenever the add to cart button is clicked , it first checks if the user has a cart object in local storage, after which it create one if the user does not HashChangeEvent. if the user has it then adds the partivular product to cart

function add_to_bag_function() {
    cart_button.innerHTML = '<p> <i class="fas fa-plus plus_ sign"></i> <span>1</span> <i class="fas fa-minus minus_ sign"></i> </p>'
    cart_button.querySelector(".plus_").addEventListener("click", add_no)
    cart_button.querySelector(".minus_").addEventListener("click", sub_no)
    if (localStorage.getItem("cart")) {
        let cart = JSON.parse(localStorage.getItem("cart"));
        cart.push({
            id: prodixt_id,
            quantity: 1
        })
        cart = JSON.stringify(cart)
        localStorage.setItem("cart", cart)
    } else {
        let cart = []
        cart.push({
            id: prodixt_id,
            quantity: 1
        })
        cart = JSON.stringify(cart)
        localStorage.setItem('cart', cart)
    }

}



// This is a sample of where I checked for a partivula product in cart while rendering the product detail page

// localStorage.removeItem("cart");
if (localStorage.getItem("cart")) {
    console.log("Cart here .....")
    const cart = JSON.parse(localStorage.getItem("cart"));
    console.log(cart)
    cart.forEach(item => {
        console.log(item)
        if (item.id === prodixt_id) {
            console.log("..................")
            cart_button.innerHTML = `<p><i class="fas fa-plus plus_ sign"></i> <span> ${item.quantity} </span> <i class="fas fa-minus minus_ sign"></i> </p>`
            cart_button.querySelector(".plus_").addEventListener("click", add_no)
            cart_button.querySelector(".minus_").addEventListener("click", sub_no)
            return true
        }
    })
} else {
    console.log("NOOOOO CARTTT")
}



// THis is the function that is called when the user clickd the checkout button for making oreder ie to whatsapp

function checkout_function() {
    if (localStorage.getItem("cart")) {
        let cart = localStorage.getItem("cart")
        fetch("/order/add", {
                method: "POST",
                body: cart
            })
            .then(response => {
                response.text()
                    .then(data => {
                        cart = JSON.parse(cart)
                        if (data) {
                            let whatsapp_message = 'https://api.whatsapp.com/send?phone=2348147663563&text=Hello%20Ma,%20I%20want%20to%20buy:%20'
                            for (let i = 0; i < products.length; i++) {
                                whatsapp_message += `${products[i].name},%20%20Quantity%20%20${cart[i].quantity},`
                            }
                            whatsapp_message += `%20%20%20%20ORDER%20ID%20=%20${data}%20%20%20%20%20What%20are%20there%20prices?%20and%20have%20a%20nice%20day%20ahead%20%20%20%20%20%20%20preview%20order:%20%20https://nwokeji-global-interbiz.web.app/order/detail/${data}`
                            localStorage.removeItem("cart")
                            window.location = whatsapp_message
                        }
                    })
            })
    } else {
        window.location = '/'
    }
}



// This function is used for deleting a partivular product from the cart add_no, can be called from a delete button or icon ans as usual prodixt_id should hold the product's id

function delete_item() {
    // I was just trying to get the product's id here 
    const prodixt_id = this.parentElement.parentElement.querySelector(".id").innerText.trim();
    let cart = JSON.parse(localStorage.getItem("cart"));
    const this_ = this
    cart.forEach((item, count) => {
        if (item.id === prodixt_id) {
            console.log(count)
            console.log("item minus: ", item)
            cart.splice(count, 1)
            this_.parentElement.parentElement.style.display = 'none'
            return true
        }
    })
    console.log(cart)
    if (cart.length === 0) {
        localStorage.removeItem("cart")
        shopping_bag.innerHTML = '<img class="no_cart" src="/assets/cart.jpeg" alt="">'
        document.querySelectorAll(".checkout .row").forEach(div => {
            div.style.display = 'none'
        });
        document.querySelector(".checkout .buttons").innerHTML = '<a href="/"><p> Cart empty, shop now! <i class="fas fa-home"></i></p></a>'
    } else {
        cart = JSON.stringify(cart)
        localStorage.setItem("cart", cart)
    }
}


// This one runs the chel on the rendering of the cart page using the cart object to get the main products from database if there is no item in the users cart it displays an image of an empty cart.  READ the code well you will uunderstand iti bro . I don;t have much time with me

if (localStorage.getItem("cart")) {
    let cart = localStorage.getItem("cart")
    console.log("cart\n\n", cart)
    let total = 0
    fetch("/cart", {
            method: "POST",
            body: cart,
        })
        .then(response => {
            response.json()
                .then(data => {
                    cart = JSON.parse(cart)
                    let html = ''
                    for (let i = 0; i < data.length; i++) {
                        products.push(data[i])
                        total += cart[i].quantity
                        html += `<div class="row">
                <div class="img">
                    <img src='${data[i].images[0].secure_url}' alt="">
                </div>
                <div class="info">
                    <h3> ${data[i].name} </h3>
                    <button> <i class="fas fa-trash"></i> </button>
                </div>
                <div class="quatity">
                    <p class='id' style="display: none;"> ${cart[i].id} </p>
                    <i class="fas fa-minus minus_"></i>
                    <p class='size'> ${cart[i].quantity} </p>
                    <i class="fas fa-plus add"></i>
                </div>
            </div>`
                    }
                    shopping_bag.innerHTML = html
                    checkout.querySelector(".one p").innerText = data.length
                    checkout.querySelector(".two p").innerText = total
                    document.querySelectorAll(".minus_").forEach(minus => {
                        console.log("yess")
                        minus.addEventListener("click", sub_no)
                    })
                    document.querySelectorAll(".add").forEach(add => {
                        add.addEventListener("click", add_no)
                    })
                    document.querySelectorAll(".info button").forEach(icon => {
                        icon.addEventListener("click", delete_item)
                    })
                })
        })
} else {
    shopping_bag.innerHTML = '<img class="no_cart" src="/assets/cart.jpeg" alt="">'
    document.querySelectorAll(".checkout .row").forEach(div => {
        div.style.display = 'none'
    });
    document.querySelector(".checkout .buttons").innerHTML = '<a href="/"><p> Cart empty, shop now! <i class="fas fa-home"></i></p></a>'
}
