/*  ---------------------------------------------------
    Template Name: Fashi
    Description: Fashi eCommerce HTML Template
    Author: Colorlib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /*------------------
        Hero Slider
    --------------------*/
    $(".hero-items").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
    });

    /*------------------
        Product Slider
    --------------------*/
   $(".product-slider").owlCarousel({
        loop: true,
        margin: 25,
        nav: true,
        items: 1,
        dots: true,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 2,
            },
            992: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        }
    });

    /*------------------
       logo Carousel
    --------------------*/
    $(".logo-carousel").owlCarousel({
        loop: false,
        margin: 30,
        nav: false,
        items: 5,
        dots: false,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        mouseDrag: false,
        autoplay: true,
        responsive: {
            0: {
                items: 3,
            },
            768: {
                items: 5,
            }
        }
    });

    /*------------------
        Testimonial Carousel
    --------------------*/
    $(".testimonial-slider").owlCarousel({
        loop: true,
        margin: 25,
        nav: true,
        items: 4,
        dots: true,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 2,
            },
            992: {
                items: 2,
            },
            1200: {
                items: 2,
            }
        }
    });

    /*-----------------------
       Product Single Slider
    -------------------------*/
    $(".ps-slider").owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        items: 1,
        dots: false,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
    });
    
    /*------------------
        CountDown
    --------------------*/
    // For demo preview
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    if(mm == 12) {
        mm = '01';
        yyyy = yyyy + 1;
    } else {
        mm = parseInt(mm) + 1;
        mm = String(mm).padStart(2, '0');
    }
    var timerdate = mm + '/' + dd + '/' + yyyy;
    // For demo preview end

    console.log(timerdate);
    

    // Use this for real timer date
    /* var timerdate = "2020/01/01"; */

	$("#countdown").countdown(timerdate, function(event) {
        $(this).html(event.strftime("<div class='cd-item'><span>%D</span> <p>Days</p> </div>" + "<div class='cd-item'><span>%H</span> <p>Hrs</p> </div>" + "<div class='cd-item'><span>%M</span> <p>Mins</p> </div>" + "<div class='cd-item'><span>%S</span> <p>Secs</p> </div>"));
    });

        
    /*----------------------------------------------------
     Language Flag js 
    ----------------------------------------------------*/
    $(document).ready(function(e) {
    //no use
    try {
        var pages = $("#pages").msDropdown({on:{change:function(data, ui) {
            var val = data.value;
            if(val!="")
                window.location = val;
        }}}).data("dd");

        var pagename = document.location.pathname.toString();
        pagename = pagename.split("/");
        pages.setIndexByValue(pagename[pagename.length-1]);
        $("#ver").html(msBeautify.version.msDropdown);
    } catch(e) {
        // console.log(e);
    }
    $("#ver").html(msBeautify.version.msDropdown);

    //convert
    $(".language_drop").msDropdown({roundedBorder:false});
        $("#tech").data("dd");
    });
    /*-------------------
		Range Slider
	--------------------- */
	var rangeSlider = $(".price-range"),
		minamount = $("#minamount"),
		maxamount = $("#maxamount"),
		minPrice = rangeSlider.data('min'),
		maxPrice = rangeSlider.data('max');
	    rangeSlider.slider({
		range: true,
		min: minPrice,
        max: maxPrice,
		values: [minPrice, maxPrice],
		slide: function (event, ui) {
			minamount.val('$' + ui.values[0]);
			maxamount.val('$' + ui.values[1]);
		}
	});
	minamount.val('$' + rangeSlider.slider("values", 0));
    maxamount.val('$' + rangeSlider.slider("values", 1));

    /*-------------------
		Radio Btn
	--------------------- */
    $(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").on('click', function () {
        $(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").removeClass('active');
        $(this).addClass('active');
    });
    
    /*-------------------
		Nice Select
    --------------------- */
    $('.sorting, .p-show').niceSelect();

    /*------------------
		Single Product
	--------------------*/
	$('.product-thumbs-track .pt').on('click', function(){
		$('.product-thumbs-track .pt').removeClass('active');
		$(this).addClass('active');
		var imgurl = $(this).data('imgbigurl');
		var bigImg = $('.product-big-img').attr('src');
		if(imgurl != bigImg) {
			$('.product-big-img').attr({src: imgurl});
			$('.zoomImg').attr({src: imgurl});
		}
	});

    $('.product-pic-zoom').zoom();
    
    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
	proQty.prepend('<span class="dec qtybtn">-</span>');
	proQty.append('<span class="inc qtybtn">+</span>');
	proQty.on('click', '.qtybtn', function () {
		var $button = $(this);
		var oldValue = $button.parent().find('input').val();
		if ($button.hasClass('inc')) {
			var newVal = parseFloat(oldValue) + 1;
		} else {
			// Don't allow decrementing below zero
			if (oldValue > 0) {
				var newVal = parseFloat(oldValue) - 1;
			} else {
				newVal = 0;
			}
		}
		$button.parent().find('input').val(newVal);
	});

})(jQuery);

let mobileMenuToggle = document.querySelector(".site-menu-toggle")
let mobileMenu = document.querySelector(".mobile-menu")
let productModal = document.querySelectorAll(".product-card-modal")
let productCard = document.querySelectorAll(".product-card")
let loadingModal = document.querySelector(".loading-modal")
let cartButton = document.querySelectorAll(".cart-button")
let productId
let productImages = []
let imageModal 

mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open-menu")
    if(mobileMenuToggle.children[0].classList.contains("fa-bars")){
        mobileMenuToggle.innerHTML = `<span class="fa fa-times"></span>`
    }
    else{
        mobileMenuToggle.innerHTML = `<span class="fa fa-bars"></span>`
    }
})


productCard.forEach(modal => {
    modal.addEventListener("click", () => {
        productId = modal.getAttribute("product-id")
        console.log(productId)
        viewProduct()
    })
})


function closeProductModal(){
    productModal[0].classList.toggle("open-modal")
}

function closePictureModal(){
    productModal[1].classList.toggle("open-modal")
}

function viewProduct(){

    // Display the loading modal before calling function for fetch request
    loadingModal.classList.toggle("toggle-loading-modal")

    getProductInfo()

}

// Function to get the products from the server using fetch request

// Fetch request will return object with info about that product
function getProductInfo(){


    fetch(`/detail/${productId}`, {
        method: "get",
        credentials: "include"
    })
    .then(response => {
        response.text()
            .then(data => {

                
                data = JSON.parse(data)

                // Check if there is a response from the server
                if (Object.keys(data).length > 6) {
                    
                    // Close the loading modal
                    loadingModal.classList.toggle("toggle-loading-modal")

                    // Store the product images in order to disaplay all when clicked
                    productImages = data.images

                    // data.images should be an array of links to the product image

                    console.log(data)

                    displayProductInfo(data)   // Display the modal with the gotten data


                } else {

                    // If there is an error, then call the function a gain to make the request again
                    console.log("I think something happened")
                }
            })
    })
}

function displayProductInfo(data){

    productModal[0].innerHTML = ""

    productModal[0].innerHTML = `
        <div class="container mt-5 mb-5">
            <div class="d-flex justify-content-center row">
                <div class="col-md-10">
                    <div class="row p-2 bg-white border rounded">
                        <div class="col-md-3 mt-1 modal-image">
                            <img class="img-fluid img-responsive rounded product-image" src="${data.images[0].secure_url}">
                        </div>
                        <div class="col-md-6 mt-1">
                            <h5>${data.name}</h5>
                            <div class="d-flex flex-row">
                                <div class="ratings mr-2"><i class="fa fa-star text-pink"></i><i class="fa fa-star text-pink"></i><i class="fa fa-star text-pink"></i><i class="fa fa-star text-pink"></i></div><span class="text-pink">310</span>
                            </div>
                            <div class="mt-1 mb-1 spec-1"><span> <strong> Is Available: </strong> </span><span class="dot"></span><span> ${data.isAvailable}  </span></div>
                            <div class="mt-1 mb-1 spec-1"><span> <strong> Category: </strong> </span><span class="dot"></span><span> ${data.category}   </span></div>
                            <div class="mt-1 mb-1 spec-1"><span> <strong> Description: </strong> </span><span class="dot"></span><span> ${data.description}  </span></div>
                        </div>
                        <div class="align-items-center align-content-center col-md-3 border-left mt-1">
                            <div class="d-flex flex-row align-items-center">
                                <h4 class="mr-1">NGN ${data.price}</h4><span class="strike-text">${data.slashed_price}</span>
                            </div>
                            <h6 class="text-success">Free shipping</h6>
                            <div class="d-flex flex-column mt-4">
                                <button class="btn btn-primary btn-sm" type="button" product-id="${data.id}" >Add to Bag <span class="fa fa-shopping-bag"></span> </button>
                                <button class="btn btn-sm mt-2 close-modal" type="button">Close <i class="fa fa-times"></i> </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `

    // Display the product info once the innerHTMl is set
    productModal[0].classList.toggle("open-modal")

    // Add event listener on that product image to display the remainng product image in carousel
    let modalImage = document.querySelector(".modal-image")

    modalImage.addEventListener("click", () => {
        
        console.log("I was clicked")

        // Close the product info modal
        // productModal[0].classList.toggle("open-modal")

        displayImageModal()

    })

    // Add event listeners on the close button on the modal
    let closeModal = document.querySelector(".close-modal")

    closeModal.addEventListener("click", () => {
        closeProductModal()
    })

                    
}


function displayImageModal(){
    // Insert all the product images to the image modal

    productModal[1].innerHTML = `<button class="btn btn-sm mt-2 close-modal close-image-modal" type="button">Close <i class="fa fa-times"></i> </button>`

    imageModal = `<div class="image-slider product-card-slider owl-carousel container">`

    productImages.forEach(image =>{

        imageModal += `
        <div class="  testimonial-section-card  row">
            <div class=" col-12 pl-center">
                <img src="${image.secure_url}" alt="" width="50%" class="img-fluid">
            </div>
        </div>
        ` 
    })

    imageModal += "</div>"

    productModal[1].innerHTML += imageModal

    $(".image-slider").owlCarousel({
        loop: true,
        margin: 25,
        nav: true,
        items: 4,
        dots: true,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 2,
            },
            992: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        }
    });

    let closeImageModal = document.querySelector(".close-image-modal")
    closeImageModal.addEventListener("click", () =>{
        closePictureModal()
    })

    // Display the image modal
    productModal[1].classList.toggle("open-modal")
}


// Event listener on the add to cart button
cartButton.forEach(btn => {
    btn.addEventListener("click", (e) => {
        changeCardDesign(e)
    })
})


// This will change the design of the product card to add plus and minus 
function changeCardDesign(e){
    let alpha = document.getElementsByClassName(`${e.target.getAttribute('product-id')}`)
    console.log(alpha)

    for(let ul=0; ul < alpha.length; ul++) {
        alpha[ul].innerHTML = `<li class="w-icon active minus-button" product-id="${e.target.getAttribute('product-id')}"><a href="#" product-id="${e.target.getAttribute('product-id')}"><i class="fa fa-minus"></i></a></li>
        <li class="quick-view product-card" product-id="${e.target.getAttribute('product-id')}"><a href="#" product-id="${e.target.getAttribute('product-id')}" class="num-selected">1</a></li>
        <li class="w-icon active plus-button" product-id="${e.target.getAttribute('product-id')}"><a href="#" product-id="${e.target.getAttribute('product-id')}"><i class="fa fa-plus"></i></a></li>`
    }


    // Add event listener on the plus and minus button
    let minusBtn = document.querySelectorAll(".minus-button")
    let plusBtn = document.querySelectorAll(".plus-button")

    minusBtn.forEach(btn => {
    	btn.addEventListener("click", (e) => {
            reduceAmount(e)
        })
    })
    
    plusBtn.forEach(btn => {
        btn.addEventListener("click", (e) => {
            increaseAmount(e)
        })
    })
}

// function to reduce the number by -1 
function reduceAmount(e){
    let alpha = e.target.parentElement.nextElementSibling.firstChild
    console.log(alpha.innerHTML)

    // Check if the number is less than 2 to avoid updating to 0 or -1
    if(parseInt(alpha.innerHTML) < 2){
        returnState(e)
    }
    else{
        alpha.innerHTML = parseInt(alpha.innerHTML) - 1
    }
}

// function to increase the number by +1
function increaseAmount(e){


    let alpha = e.target.parentElement.previousElementSibling.firstChild
    console.log(alpha.innerHTML)
    alpha.innerHTML = parseInt(alpha.innerHTML) + 1
}

// Return the product card to normal state of only add to cart button
function returnState(e){
    let alpha = document.getElementsByClassName(`${e.target.getAttribute('product-id')}`)
    console.log(alpha)

    for(let ul=0; ul < alpha.length; ul++) {
        alpha[ul].innerHTML = `<li class="w-icon active cart-button" product-id="${e.target.getAttribute('product-id')}"><a href="#" product-id="${e.target.getAttribute('product-id')}"><i class="fa fa-shopping-bag" product-id="${e.target.getAttribute('product-id')}" ></i></a></li>`
    }

    cartButton = document.querySelectorAll(".cart-button")
    cartButton.forEach(btn => {
        btn.addEventListener("click", (e) => {
            changeCardDesign(e)
        })
    })
}
