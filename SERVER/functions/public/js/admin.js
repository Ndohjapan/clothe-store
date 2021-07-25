var rtabsGlobalOptions = {
    event: "click", //"click", or "mouseover"
    autoAdvance: 0,
    animate: 0.5, //duration in seconds.
    license: "6580t"
};


var tabbers = tabbers || (function() {
    var delay = 50,
        offset = 50,
        a = "length",
        d = "className",
        c = document,
        n = "getElementById",
        f = "innerHTML",
        h = "getElementsByTagName",
        i = "addEventListener",
        e = "parentNode",
        g = "style",
        l = "location",
        k = "getAttribute",
        m = "hash",
        q = '<div class="ajaxLoading">&nbsp;</div>',
        b = [],
        E = [],
        y = 0;
    if (!Array.prototype.indexOf) Array.prototype.indexOf = function(d, c) { for (var b = c || 0, e = this[a]; b < e; b++)
            if (this[b] === d) return b;
        return -1 };
    var F = function() {
            var a = window[l][m].match(/#([\-\w]+)/);

            let closeModal = document.querySelectorAll(".close-modal")
            let updateInfoBtn = document.querySelectorAll(".update-info-btn")
            let sendUpdateInfo = document.querySelector(".updateInfoBtn")
            let updateImageBtn = document.querySelectorAll(".update-images-btn")
            let deleteBtn = document.querySelectorAll(".delete-btn")
            let categoryBtn = document.querySelector(".categoryBtn")
            let createProductBtn = document.querySelector("#createProduct")
            let infoUpdateModal = document.querySelector(".update-modal")
            let yesDeleteBtn = document.querySelector(".deleteChanges")
            let uploadMoreImagesBtn = document.querySelector(".moreImagesBtn")
            let imageUpdateModal = document.querySelector(".update-image-modal")
            let createCategoryBtn = document.querySelector(".createCategory")
            let loadingModal = document.querySelector(".loading-modal")
            let errorModal = document.querySelector(".error-modal")
            let successModal = document.querySelector(".success-modal")
            let newCategoryModal = document.querySelector(".newCategory-modal")
            let warningModal = document.querySelector(".warning-modal")
            let newProduct = document.querySelectorAll(".newProduct")
            let createModal = document.querySelector(".create-modal")
            const error_div = document.querySelector(".error_div");
            const done_div = document.querySelector(".done_div");
            let section = "kids"
            let productId
            let imageId


            // Check for the info tin the form for empty ones
            function checkEmptyForm(name, quantity){
                let changes = 2
                let allInput = document.forms[`${name}`].querySelectorAll(".form-control")

                for(input of allInput) {
                    if(input.value === "" && quantity === 1){
                        console.log("Should Exit")
                        return false
                    }

                    else if((input.value != "" && quantity === 0) || (input.value != "" && quantity === 1) ){
                        console.log("One Change Recorded")
                        changes += 1
                    }
                }

                if(changes != 2){
                    return true
                }

                else{
                    return false
                }
            }

            // For All the X button on any modal
            closeModal.forEach(btn => {
                btn.addEventListener("click", () => {
                    btn.parentElement.classList.toggle("open-modal")
                    btn.parentElement.classList.remove("row")

                })
            })

            // For every Update Info button
            updateInfoBtn.forEach(btn => {
                btn.addEventListener("click", () => {
                    productId = btn.getAttribute("productId")
                    infoUpdateModal.classList.toggle("open-modal")
                })
            })

            // For every update image button
            updateImageBtn.forEach(btn => {
                btn.addEventListener("click", () => {
                    productId = btn.getAttribute("productId")
                    imageUpdateModal.classList.toggle("open-modal")
                    imageUpdateModal.classList.toggle("row")

                })
            })

            // For all the delete product button
            deleteBtn.forEach(btn => {
                btn.addEventListener("click", () => {
                    warningModal.classList.toggle("open-modal")
                    productId = btn.getAttribute("productId")

                    if(btn.getAttribute("imageId")){
                        imageId = btn.getAttribute("imageId")
                        console.log(imageId)
                    }
                    else{
                        imageId = null
                        console.log(imageId)
                    }

                })
            })

            // Create new Catergory button 
            categoryBtn.addEventListener("click", () => {

                newCategoryModal.classList.toggle("open-modal")

            })

            // Create New Category
            createCategoryBtn.addEventListener("click", () => {
                let result = checkEmptyForm("Category", 1)
                if(result){

                    new_category()
                }
            })

            // For all the add new product button
            newProduct.forEach(btn => {
                btn.addEventListener("click", () => {
                    section = btn.getAttribute("section")
                    console.log(section)
                    createModal.classList.toggle("open-modal")
                })
            })

            // Click Submit button for creating new Product
            createProductBtn.addEventListener("click", () => {
                let result = (checkEmptyForm("Create", 1))
                console.log(result)
                if(result){
                    add_product_function()
                }
            })

            // Click Submit button for updating product info
            sendUpdateInfo.addEventListener("click", () => {
                let result = checkEmptyForm("UpdateInfo", 0)
                console.log(result) 
                if(result){
                    update_product_info()
                }
            })

            // Click the Yes button on the confirmation modal
            yesDeleteBtn.addEventListener("click", () => {
                warningModal.classList.toggle("open-modal")
                if(imageId){
                    console.log("Delete Images")
                    delete_image()
                }

                else{
                    console.log("Delete Product")
                    delete_product()
                }
            })

            //Click the upload button to add more images to existing product
            uploadMoreImagesBtn.addEventListener("click", () => {
                let result = (checkEmptyForm("moreImages", 1))
                if(result){
                    more_images_for_product()
                }


            })

            // -----------------
            // Functions for CRUD
            // -----------------
            

            // Add New category
            function new_category(){
                const data = new FormData()

                data["category"] = document.querySelector("#product_section").value.trim()
                data["description"] = document.getElementById("new_category_name").value.trim()

                console.log(data)
                loadingModal.classList.toggle("open-modal")

                        fetch("/admin/newCategory", {
                            method: "post",
                            credentials: "include",
                            body: data
                        })
                        .then(response => {
                            response.text()
                                .then(data => {
                                    loadingModal.classList.toggle("open-modal")
                                    if (data === "done") {
                                        done_div.querySelector("p").innerText = `Category Added`
                                        successModal.classList.add("open-modal")
                                        setTimeout(() => {
                                            successModal.classList.remove("open-modal")
                                        }, 5000);
                                        console.log("done:  broo")
                                    } else {
                                        error_div.querySelector("p").innerText = `An Error Ocurred`
                                        errorModal.classList.add("open-modal")
                                        setTimeout(() => {
                                            errorModal.classList.remove("open-modal")
                                        }, 5000);
                                        console.log("ErRoR:   ", data)
                                    }
                                })
                        })
            }

            // Upload More Images for existing products
            function more_images_for_product(){
                
                const fileList = document.querySelector(".product_update_images").files;
                const fileList_input = document.querySelector(".product_update_images");
                let check = true

                console.log(fileList)
                console.log(fileList_input)

                if (fileList.length > 3) {
                    error_div.querySelector("p").innerText = `Please Choose only 3 images`
                    errorModal.classList.add("open-modal")
                    setTimeout(() => {
                        errorModal.classList.remove("open-modal")
                    }, 5000);
                }

                else {
                    for (file of fileList) {

                        // Check for the image file types to prevent sending wrong file types
                        console.log(file.type, "type")
                        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/webp') {
            
                        } else {
                            check = false
                            error_div.querySelector("p").innerText = `Only image file are allowed`
                            error_div.classList.add("open-modal")
                            setTimeout(() => {
                                error_div.classList.remove("open-modal")
                            }, 5000);
                        }
            
                    }
    
                    // Include the images to the form data
                    if(check){

                        const data = new FormData();
                        for (let i = 0; i < fileList_input.files.length; i++) {
                            data.append('filess', fileList_input.files[i]);
                        } 
    
                        data.append("Product Id", productId)
                        data.append("Section", section)

                        for (key of data.keys()) {
                            console.log("keyss: ", key)
                        }

                        for (key of data.values()) {
                            console.log("value: ", key)
                        }

                        loadingModal.classList.toggle("open-modal")

                        fetch("/admin/moreImages", {
                            method: "post",
                            credentials: "include",
                            body: data
                        })
                        .then(response => {
                            response.text()
                                .then(data => {
                                    loadingModal.classList.toggle("open-modal")
                                    if (data === "done") {
                                        done_div.querySelector("p").innerText = `Images Added`
                                        successModal.classList.add("open-modal")
                                        setTimeout(() => {
                                            successModal.classList.remove("open-modal")
                                        }, 5000);
                                        console.log("done:  broo")
                                    } else {
                                        error_div.querySelector("p").innerText = `An Error Ocurred`
                                        errorModal.classList.add("open-modal")
                                        setTimeout(() => {
                                            errorModal.classList.remove("open-modal")
                                        }, 5000);
                                        console.log("ErRoR:   ", data)
                                    }
                                })
                        })

                    }
                }
            }

            // Delete Image
            function delete_image(){
                const data = new FormData();

                data["Product Id"] = productId
                data["Image Id"] = imageId

                loadingModal.classList.toggle("open-modal")

                fetch(`/admin/deleteImage`, {
                    method: "post",
                    credentials: "include",
                    body: data
                })
                .then(response => {
                    response.text()
                        .then(data => {
                            loadingModal.classList.toggle("open-modal")
                            if (data === "done") {
                                done_div.querySelector("p").innerText = `Image Deleted`
                                successModal.classList.add("open-modal")
                                setTimeout(() => {
                                    successModal.classList.remove("open-modal")
                                }, 5000);
                                console.log("done:  broo")
                            } else {
                                error_div.querySelector("p").innerText = `An Error Ocurred`
                                errorModal.classList.add("open-modal")
                                setTimeout(() => {
                                    errorModal.classList.remove("open-modal")
                                }, 5000);
                                console.log("ErRoR:   ", data)
                            }
                        })
                })

            }

            // Delete Product
            function delete_product(){
                const data = new FormData();

                data["Product Id"] = productId

                loadingModal.classList.toggle("open-modal")

                fetch(`/admin/deleteProduct`, {
                    method: "post",
                    credentials: "include",
                    body: data
                })
                .then(response => {
                    response.text()
                        .then(data => {
                            loadingModal.classList.toggle("open-modal")
                            if (data === "done") {
                                done_div.querySelector("p").innerText = `Product Deleted`
                                successModal.classList.add("open-modal")
                                setTimeout(() => {
                                    successModal.classList.remove("open-modal")
                                }, 5000);
                                console.log("done:  broo")
                            } else {
                                error_div.querySelector("p").innerText = `An Error Ocurred`
                                errorModal.classList.add("open-modal")
                                setTimeout(() => {
                                    errorModal.classList.remove("open-modal")
                                }, 5000);
                                console.log("ErRoR:   ", data)
                            }
                        })
                })

            }

            // Update Product Info
            function update_product_info(){
                const data = new FormData();

                data["Product Id"] = productId
                data['Name'] = document.getElementById("product_name_updated").value.trim()
                data['Product Size'] = document.getElementById("productSize_updated").value.trim()
                data["Price"] = document.getElementById("product_price_updated").value.trim()
                data["Slashed Price"] = document.getElementById("slashed_price_updated").value.trim()
                data["category"] = document.getElementById("category_updated").value.trim()
                data["description"] =  document.getElementById("product_description_updated").value.trim()

                console.log(data)

                loadingModal.classList.toggle("open-modal")

                fetch(`/admin/update/345678998765/8hd72/${productId}`, {
                    method: "post",
                    credentials: "include",
                    body: data
                })


                .then(response => {
                    response.text()
                        .then(data => {
                            loadingModal.classList.toggle("open-modal")
                            if (data === "done") {
                                done_div.querySelector("p").innerText = `Changes Saved`
                                successModal.classList.add("open-modal")
                                setTimeout(() => {
                                    successModal.classList.remove("open-modal")
                                }, 5000);
                                console.log("done:  broo")
                            } else {
                                error_div.querySelector("p").innerText = `An Error Ocurred`
                                errorModal.classList.add("open-modal")
                                setTimeout(() => {
                                    errorModal.classList.remove("open-modal")
                                }, 5000);
                                console.log("ErRoR:   ", data)
                            }
                        })
                })

                
            }

            // Create a new product
            function add_product_function(){
                const fileList = document.querySelector(".product_image").files;
                const fileList_input = document.querySelector(".product_image");
                let check = true
                
                // Check if the number of images is more than 6
                if (fileList.length > 6) {
                    error_div.querySelector("p").innerText = `Please Choose only 6 images`
                    errorModal.classList.add("open-modal")
                    setTimeout(() => {
                        errorModal.classList.remove("open-modal")
                    }, 5000);
                }

                else {
                    for (file of fileList) {

                        // Check for the image file types to prevent sending wrong file types
                        console.log(file.type, "type")
                        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/webp') {
            
                        } else {
                            check = false
                            error_div.querySelector("p").innerText = `Only image file are allowed`
                            error_div.classList.add("open-modal")
                            setTimeout(() => {
                                error_div.classList.remove("open-modal")
                            }, 5000);
                        }
            
                    }
    
                    // Include the images to the form data
                    if(check){
                        const data = new FormData();
                        for (let i = 0; i < fileList_input.files.length; i++) {
                            data.append('filess', fileList_input.files[i]);
                        } 

                        data['NamE'] = document.getElementById("product_name").value.trim()
                        data['Product Size'] = document.getElementById("productSize").value.trim()
                        data["Price"] = document.getElementById("product_price").value.trim()
                        data["Slashed Price"] = document.getElementById("slashed_price").value.trim()
                        data["category"] = document.getElementById("category").value.trim()
                        data["description"] = document.getElementById("product_description").value.trim()
                        data["Section"] = section

                        for (key of data.keys()) {
                            console.log("keyss: ", key)
                        }

                        for (key of data.values()) {
                            console.log("value: ", key)
                        }

                        loadingModal.classList.toggle("open-modal")

                        fetch("/admin/product/iudi7486GFY", {
                            method: "post",
                            credentials: "include",
                            body: data
                        })
                        .then(response => {
                            response.text()
                                .then(data => {
                                    loadingModal.classList.toggle("open-modal")
                                    if (data === "done") {
                                        done_div.querySelector("p").innerText = `New Product Added`
                                        successModal.classList.add("open-modal")
                                        setTimeout(() => {
                                            successModal.classList.remove("open-modal")
                                        }, 5000);
                                        console.log("done:  broo")
                                    } else {
                                        error_div.querySelector("p").innerText = `An Error Ocurred`
                                        errorModal.classList.add("open-modal")
                                        setTimeout(() => {
                                            errorModal.classList.remove("open-modal")
                                        }, 5000);
                                        console.log("ErRoR:   ", data)
                                    }
                                })
                        })

                    }
                }

                
            }


            // carousel js starts here 
            $(".owl-carousel").owlCarousel({
                loop: true,
                margin: 10,
                nav: true,
                dots: true,
                navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
                smartSpeed: 1200,
                autoHeight: true,
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
            // carouse js ends here 


            // tabs js starts here 
            function onTabSelected(tab, panelId) {
                history.pushState("", document.title, window.location.pathname + window.location.search + window.location.hash);
                setTimeout(function() {
                    window.location.hash = '';
                }, 10);
            }
            // tabs ja ends here 


            // Add the following code if you want the name of the file appear on select
            $(".custom-file-input").on("change", function() {
                var fileName = $(this).val().split("\\").pop();
                $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
            });
            // file input ends here 



            if (a) a = a[1];
            return a
        },
        K = function(a) { if (a && a.stopPropagation) a.stopPropagation();
            else if (window.event) window.event.cancelBubble = true },
        u = function(b) { var a = b || window.event; if (a.preventDefault) a.preventDefault();
            else if (a) a.returnValue = false },
        A = function() { var a = c.documentElement; return [window.pageXOffset || a.scrollLeft, window.pageYOffset || a.scrollTop] },
        w = function(a, c, b) { if (a[i]) a[i](c, b, false);
            else a.attachEvent && a.attachEvent("on" + c, b) },
        B = function(c, d) { var b = {}; for (var a in c) b[a] = c[a]; for (var a in d) b[a] = d[a]; return b },
        H = [/(?:.*\.)?(\w)([\w\-])[^.]*(\w)\.[^.]+$/, /.*([\w\-])\.(\w)(\w)\.[^.]+$/, /^(?:.*\.)?(\w)(\w)\.[^.]+$/, /.*([\w\-])([\w\-])\.com\.[^.]+$/, /^(\w)[^.]*(\w)$/],
        L = function(a) { return a.replace(/(?:.*\.)?(\w)([\w\-])?[^.]*(\w)\.[^.]*$/, "$1$3$2") },
        I = ["$1$2$3", "$1$2$3", "$1$24", "$1$23", "$1$22"],
        J, C = function() { var c = 50,
                b = navigator.userAgent,
                a; if ((a = b.indexOf("MSIE ")) != -1) c = parseInt(b.substring(a + 5, b.indexOf(".", a))); return c },
        x = C(),
        j = function(c, a) { var b = new RegExp("(^| )" + a + "( |$)"); return b.test(c[d]) ? true : false },
        v = function(a, b) { if (!j(a, b))
                if (a[d] == "") a[d] = b;
                else a[d] += " " + b },
        r = function(a, b) { var c = new RegExp("(^| )" + b + "( |$)");
            a[d] = a[d].replace(c, "$1");
            a[d] = a[d].replace(/ $/, "") },
        G = function(e, d) { for (var c = [], b = 0; b < e[a]; b++) c[c[a]] = String.fromCharCode(e.charCodeAt(b) - (d ? d : 3)); return c.join("") },
        p = function() { if (!y)
                for (var d, c = 0, e = b[a]; c < e; c++) d = b[c].s() };
    if ("onhashchange" in window) w(window, "hashchange", p);
    else { var s = window[l][m];
        window.setInterval(function() { if (window[l][m] != s) { s = window[l][m];
                p() } }, 100) }
    var t = function(b) { var a = this;
        a.P;
        a.b;
        a.c;
        a.d = 0;
        a.a;
        a.e = [];
        a.f;
        a.g;
        a.h;
        a.i = {};
        a.j = null;
        a.p(b[k]("data-options"));
        a.q(b) };
    t.prototype = { k: function() { for (var b = 0, c = this.a[a]; b < c; b++)
                if (j(this.a[b][e], "selected")) return b;
            return 0 }, m: function(c, b) { var a = this;
            clearTimeout(a.c);
            a.c = setTimeout(function() { a.w(b) }, delay); return false }, n: function(b, a) { u(b);
            this.w(a) }, o: function() { var b = this;
            b.f = []; for (var f, d = 0; d < b.a[a]; d++) { f = c[n](b.a[d].a); if (f) { if (!b.b) b.b = f[e]; if (x < 7) f[g].padding = "26px";
                    b.f.push(f); if (this.P.b == "mouseover") { b.a[d].onmouseover = function(a) { b.m(a, this) };
                        b.a[d].onmouseout = function() { clearTimeout(b.c) };
                        b.a[d].onclick = u } else b.a[d].onclick = function(a) { b.n(a, this) } } } }, p: function(a) { if (a && typeof a === "string") { a = eval("(" + a + ")");
                a = B(rtabsGlobalOptions, a) } else a = rtabsGlobalOptions;
            this.P = { a: a.license, b: a.event, c: a.autoAdvance, d: function() { typeof onTabSelected === "function" && onTabSelected(arguments[0], arguments[1]) } } }, q: function(l) { var e = this;
            e.a = []; for (var j = l[h]("a"), c, b, f, d, g = 0; g < j[a]; g++) { b = j[g];
                f = b[k]("data-ajax"); if (f) { try { d = eval("(" + f + ")") } catch (m) { alert("data-ajax syntax error."); return }
                    d.cache = d.cache || 1;
                    b.b = d;
                    b.a = c = d.target } else { b.b = 0;
                    c = b[k]("href", 2); if (c == null) continue; var i = c.match(/#([^?]+)/); if (!i) continue;
                    c = i[1];
                    b.a = c }
                e.a.push(b);
                E.push(c);
                e.e.push(c) }
            e.o() }, r: function(d) { for (var c = 0, b = 0; b < this.a[a]; b++)
                if (this.a[b].a == d) { c = this.a[b]; break }
            return c }, s: function() { var b = this,
                a = F(); if (a) { var d = c[n](a); if (!d) a = 0 } if (a) b.t(d);
            else b.v();
            b.P.c && !b.d && b.z(); return a }, t: function(c) {
            function b(a, d) { var c = a.id; return c && d.indexOf(c) != -1 ? c : a[e].nodeName == "BODY" ? 0 : b(a[e], d) } var f = b(c, this.e); if (f) var g = this.r(f); if (g) { this.w(g);
                c.scrollIntoView(); var d = A(),
                    a = d[1]; if (a > offset) a -= offset;
                setTimeout(function() { window.scrollTo(d[0], a) }, 50) } else this.v() }, v: function() { var b = this,
                c = b.k(); if (c >= b.a[a]) c = 0;
            b.w(b.a[c]) }, w: function(h) { var d = this; if (h.b)
                if (!d.i[h.a]) { var i = c[n](h.a);
                    i[f] = q;
                    d.h = i.id;
                    d.x(h[k]("href"), h.b, i) }
            for (var j = 0, b = 0; b < this.a[a]; b++)
                if (d.a[b].a == h.a) { v(d.a[b][e], "selected");
                    j = b } else r(d.a[b][e], "selected");
            for (b = 0; b < d.f[a]; b++)
                if (d.f[b].id == h.a) { r(d.f[b], "inactive");
                    d.f[b][g].display = "block" } else { v(d.f[b], "inactive");
                    d.f[b][g].display = "none" }
            d.P.d(h, h.a) }, x: function(i, d, c) { var b = this,
                g, e, k, m, l, j;
            e = d.success || 0;
            g = d.responseType || "html";
            k = d.context && e ? d.context : 0;
            m = d.fail || 0;
            l = d.cache;
            j = d.id || 0;
            b.j = this.y(); if (!l && x < 9) i = i + (i.indexOf("?") == -1 ? "?" : "&") + (new Date).getMilliseconds();
            b.j.open("GET", i, true);
            b.j.onreadystatechange = function() { if (b.j && b.j.readyState == 4) { if (b.h == c.id)
                        if (b.j.status == 200) { var d = g.toLowerCase() == "xml" ? b.j.responseXML : b.j.responseText; if (g.toLowerCase() == "json") { var n = d; try { n = eval("(" + d + ")");
                                    d = n } catch (p) { d = "json parsing failed or 404 error.";
                                    e = 0 } } if (j && g == "html") { var o = function(d, e) { for (var c = e[h]("*"), b = 0, f = c[a]; b < f; b++)
                                        if (c[b].id == d) return c[b];
                                    return 0 };
                                c[f] = d; var i = o(j, c); if (i) d = i[f] } if (e) d = e(d, k, b.r(c.id));
                            c[f] = d;
                            b.i[c.id] = l ? 1 : 0 } else { c[f] = m ? m(k) : q + "Failed to get data.";
                            b.i[c.id] = 0 }
                    b.j = null } }; try { b.j.send(null) } catch (n) {} }, y: function() { try { if (window.ActiveXObject) return new window.ActiveXObject("Microsoft.XMLHTTP") } catch (a) {} return new window.XMLHttpRequest }, z: function() { var b = this; if (b.f[a] > 1) { b.b.onmouseover = function() { this.g = 1 };
                b.b.onmouseout = function() { this.g = 0 } }
            this.d = setInterval(function() { if (b.b.offsetWidth && !b.b.g) { for (var d = 0, c = 0; c < b.f[a]; c++)
                        if (!j(b.f[c], "inactive")) { d = c; break }
                    var e = b.a[++d % b.f[a]];
                    b.w(e) } }, b.P.c * 1e3) } };

    function z(f, e) { if (e) { if (typeof f[g].webkitAnimationName != "undefined") var b = "-webkit-";
            else if (typeof f[g].animationName != "undefined") b = "";
            else return; var h = "@" + b + "keyframes panelFadeIn {from{opacity:0;} to{opacity:1;}}",
                i = "div.panel-container > div {" + b + "animation: panelFadeIn " + e + "s;}"; if (c.styleSheets && c.styleSheets[a]) { var d = c.styleSheets[0]; if (d.insertRule) { d.insertRule(i, 0);
                    d.insertRule(h, 0) } } } }
    var D = function(d) { var a = 0;

            function b() { if (a) return;
                a = 1;
                setTimeout(d, 4) } if (c[i]) c[i]("DOMContentLoaded", b, false);
            else w(window, "load", b) },
        o = function() { for (var e = c[h]("ul"), d = 0, i = e[a]; d < i; d++) j(e[d], "rtabs") && e[d][h]("a")[a] > 0 && b.push(new t(e[d], d)); if (b[a]) {
                (new Function("a", "b", "c", "d", "e", "f", "g", function(c) { for (var b = [], a = 0, d = c.length; a < d; a++) b[b.length] = String.fromCharCode(c.charCodeAt(a) - 4); return b.join("") }("zev$nAjyrgxmsr,|0}-zev$eAjyrgxmsr,f-zev$gAf2glevGshiEx,4-2xsWxvmrk,-?vixyvr$g2wyfwxv,g2pirkxl15-?\u0081?vixyvr$|/e,}_4a-/e,}_6a-/}_5a?\u0081?zev$qAe2T2e\u0080\u0080+:+0rAtevwiMrx,q2glevEx,4--0vAQexl2verhsq,-0sA,hsgyqirx_h,+kvthpu+-a\u0080\u0080+pijx+-2vitpegi,g_r16a0f_r16a-2wtpmx,++-?mj,q%An,r/+9+0s--zev$wAh,+[hiz'[yphs']lyzpvu+-?mj,v@27-j_4a_iaAw?ipwi$mj,v@28-k_iaAw?\u0081vixyvr$e?"))).apply(this, [b[0], I, H, G, f, b[0].a, b[0].f[0]]).s(); for (var g = 1, k = b[a]; g < k; g++) b[g].s();
                z(b[0].a[0], rtabsGlobalOptions.animate) } };
    D(o);
    b.init = function() {!b[a] && o() };
    return b
}())