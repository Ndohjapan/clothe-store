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
        items: 3,
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
let imageModal = document.querySelectorAll(".product-card-slider")
let closeModal = document.querySelector(".close-modal")
let closeImageModal = document.querySelector(".close-image-modal")
let quickView = document.querySelectorAll(".quick-view")
let productCard = document.querySelectorAll(".product-card")
let loadingModal = document.querySelector(".loading-modal")
let productId
let productImages = []

mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open-menu")
    if(mobileMenuToggle.children[0].classList.contains("fa-bars")){
        mobileMenuToggle.innerHTML = `<span class="fa fa-times"></span>`
    }
    else{
        mobileMenuToggle.innerHTML = `<span class="fa fa-bars"></span>`
    }
})

closeModal.addEventListener("click", () => {
    productModal[0].classList.toggle("open-modal")
})

productCard.forEach(modal => {
    modal.addEventListener("click", () => {
        productId = modal.getAttribute("product-id")
        console.log(productId)
        viewProduct()
    })
})

quickView.forEach(btn => {
    // btn.addEventListener("click", () => {
    //     console.log("I clicked on view")
    //     viewProduct()
    // })
})


closeImageModal.addEventListener("click", () =>{
    productModal[0].classList.toggle("open-modal")
    productModal[1].classList.toggle("open-modal")
})

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

                // Check if there is a response from the server
                if (Object.keys(data) > 0) {
                    
                    // Close the loading modal
                    loadingModal.classList.toggle("toggle-loading-modal")

                    // Store the product images in order to disaplay all when clicked
                    productImages = data.images

                    // data.images should be an array of links to the product image

                    console.log(data)

                    displayProductInfo(data)   // Display the modal with the gotten data


                } else {

                    // If there is an error, then call the function a gain to make the request again
                    getProductInfo()
                }
            })
    })
}

function displayProductInfo(data){
    productModal[0].innerHTML = `
        <div class="container mt-5 mb-5">
            <div class="d-flex justify-content-center row">
                <div class="col-md-10">
                    <div class="row p-2 bg-white border rounded">
                        <div class="col-md-3 mt-1 modal-image">
                            <img class="img-fluid img-responsive rounded product-image" src="${data.images[0].seure_url}">
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
        
        // Close the product info modal
        productModal[0].classList.toggle("open-modal")

        displayImageModal()

    })

                    
}


function displayImageModal(){
    // Insert all the product images to the image modal
    for(image of productImages){

        imageModal.innerHTML += `
        <div class="  testimonial-section-card  row">
            <div class=" col-12 pl-center">
                <img src="${image.secure_url}" alt="" width="50%" class="img-fluid">
            </div>
        </div>
        ` 
    }

    // Display the image modal
    productModal[1].classList.toggle("open-modal")
}