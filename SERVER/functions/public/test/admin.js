const add_cat_fetch = document.getElementById("add_cat");
const add_product_fetch = document.getElementById("add_product_fetch");
const error_div = document.querySelector(".error_div");
const done_div = document.querySelector(".done_div");
const selected_images = document.querySelector(".selected_images");
const image_input = document.getElementById("product_image")
const del_icons = document.querySelectorAll(".trash_bin")
const del_modal = document.querySelector(".del_modal")
const del_modal_buttons = document.querySelectorAll(".del_modal .buttins p")
const cat_image = document.getElementById("cat_image")
const product = document.querySelector(".product");
const each_project = document.querySelectorAll(".each_project");
const update_product_fetch = document.getElementById("update_product_fetch");
const selected_update_images = document.querySelector(".selected_update_images")
const product_update_image = document.querySelector(".product_update_image")

let add_cat_input
let data

add_cat_fetch.addEventListener("click", add_cat_function)
add_product_fetch.addEventListener("click", add_product_function)
image_input.addEventListener("change", image_input_change)
cat_image.addEventListener("change", cat_image_change)
del_icons.forEach(icon => {
    icon.addEventListener("click", delete_prodduct)
});
// each_project.forEach(each => {
//     each.addEventListener("click", each_prodduct)
// });



function add_cat_function() {
    add_cat_input = document.getElementById("add_cat_input").value.trim();
    add_cat_desc = document.getElementById("add_cat_desc").value.trim();
    const filelist = document.getElementById("cat_image").files[0]
    const element = this
    if (filelist.type === 'image/jpeg' || filelist.type === 'image/jpg' || filelist.type === 'image/png') {

        const data = new FormData();
        data.append('filess', filelist);
        data.append("category_name", add_cat_input)
        data.append("description", add_cat_desc)

        console.log("ABout to add:  ", add_cat_input)
        for (key of data.keys()) {
            console.log("keyss: ", key)
        }
        for (key of data.values()) {
            console.log("valie: ", key)
        }
        element.style.background = '#635e5e'
        fetch("/admin/cat/iufruAUOU7785ujh", {
                method: "POST",
                credentials: "include",
                body: data
            })
            .then(response => {
                element.style.background = "#7e7676"
                add_cat_input = add_cat_input
                response.text()
                    .then(data => {
                        if (data === "done") {
                            done_div.querySelector("p").innerText = `${add_cat_input} sucessfully added`
                            done_div.classList.add("display_modal")
                            setTimeout(() => {
                                done_div.classList.remove("display_modal")
                            }, 5000);
                            console.log("done:  broo")
                        } else {
                            error_div.querySelector("p").innerText = `An Error Ocurred`
                            error_div.classList.add("display_modal")
                            setTimeout(() => {
                                error_div.classList.remove("display_modal")
                            }, 5000);
                            console.log("ErRoR:   ", data)
                        }
                    })
            })

    } else {
        check = false
        error_div.querySelector("p").innerText = `Only image file are allowed`
        error_div.classList.add("display_modal")
        setTimeout(() => {
            error_div.classList.remove("display_modal")
        }, 5000);
    }

}

function image_input_change() {
    selected_images.innerHTML = ''
    console.log(this.files)
    for (i of this.files) {
        selected_images.innerHTML = selected_images.innerHTML + ' <i class="fas fa-image"></i>'
    }
}

function cat_image_change() {
    document.querySelector(".cat_image").innerHTML = '<i class="fas fa-check"></i>'
}

function add_product_function() {

    const fileList = document.getElementById("product_image").files;
    const fileList_input = document.getElementById("product_image");
    if (fileList.length > 4) {
        error_div.querySelector("p").innerText = `Please Choose only 4 images`
        error_div.classList.add("display_modal")
        setTimeout(() => {
            error_div.classList.remove("display_modal")
        }, 5000);
    } else {
        let check = true
        for (file of fileList) {
            console.log(file.type, "type")
            if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {

            } else {
                check = false
                error_div.querySelector("p").innerText = `Only image file are allowed`
                error_div.classList.add("display_modal")
                setTimeout(() => {
                    error_div.classList.remove("display_modal")
                }, 5000);
            }

        }

        if (check) {
            // add_product_fetch.style.background = '#7e7676'
            // add_product_fetch.innerHTML = '<i class="fas fa-spinner"></i>'
            const data = new FormData();
            for (let i = 0; i < fileList_input.files.length; i++) {
                data.append('filess', fileList_input.files[i]);
            }

            console.log('NAmE:  ', document.getElementById("product_name").value.trim())
            data.append("name", document.getElementById("product_name").value.trim())
            data.append("category", document.getElementById("category_chosen").value.trim())
            data.append("description", document.getElementById("product_desciption").value.trim())

            for (key of data.keys()) {
                console.log("keyss: ", key)
            }
            for (key of data.values()) {
                console.log("valie: ", key)
            }
            add_product_fetch.style.background = '#635e5e'
            fetch("/admin/product/iudi7486GFY", {
                    method: "post",
                    credentials: "include",
                    body: data
                })
                .then(response => {
                    add_product_fetch.style.background = "#2b2b2b"
                        // add_product_fetch.style.background = '#2b2b2b'
                    response.text()
                        .then(data => {
                            if (data === "done") {
                                done_div.querySelector("p").innerText = `sucessfully added`
                                done_div.classList.add("display_modal")
                                setTimeout(() => {
                                    done_div.classList.remove("display_modal")
                                }, 5000);
                                console.log("done:  broo")
                            } else {
                                error_div.querySelector("p").innerText = `An Error Ocurred`
                                error_div.classList.add("display_modal")
                                setTimeout(() => {
                                    error_div.classList.remove("display_modal")
                                }, 5000);
                                console.log("ErRoR:   ", data)
                            }
                        })
                })

        }
    }
}

function each_prodduct() {
    const id = this.querySelector(".top p").innerText
    product.style.top = 0
    update_product_fetch.addEventListener("click", function() {
        const fileList = document.getElementById("product_update_image").files;
        const fileList_input = document.getElementById("product_image");
        const already_images = document.querySelector(".product .left .left img")

        if (already_images.length + fileList.length > 4) {
            error_div.querySelector("p").innerText = `Cna not have more than four images for a product`
            error_div.classList.add("display_modal")
            setTimeout(() => {
                error_div.classList.remove("display_modal")
            }, 5000);
        } else {
            let check = true
            for (file of fileList) {
                console.log(file.type, "type")
                if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {} else {
                    check = false
                    error_div.querySelector("p").innerText = `Only image file are allowed`
                    error_div.classList.add("display_modal")
                    setTimeout(() => {
                        error_div.classList.remove("display_modal")
                    }, 5000);
                }
            }

            if (check) {
                add_product_fetch.style.background = '#7e7676'
                add_product_fetch.innerHTML = '<i class="fas fa-spinner"></i>'
                const data = new FormData();
                for (let i = 0; i < fileList_input.files.length; i++) {
                    data.append('filess', fileList_input.files[i]);
                }

                console.log('NAmE:  ', document.getElementById("product_name").value.trim())
                data.append("name", document.getElementById("product_name").value.trim())
                data.append("category", document.getElementById("category_chosen").value.trim())
                data.append("description", document.getElementById("product_desciption").value.trim())

                for (key of data.keys()) {
                    console.log("keyss: ", key)
                }
                for (key of data.values()) {
                    console.log("valie: ", key)
                }
                fetch(`/admin/update/345678998765/8hd72/${id}`, {
                        method: "post",
                        credentials: "include",
                        body: data
                    })
                    .then(response => {
                        add_product_fetch.style.background = '#2b2b2b'
                        response.text()
                            .then(data => {
                                if (data === "done") {
                                    done_div.querySelector("p").innerText = `${add_cat_input} sucessfully added`
                                    done_div.classList.add("display_modal")
                                    setTimeout(() => {
                                        done_div.classList.remove("display_modal")
                                    }, 5000);
                                    console.log("done:  broo")
                                } else {
                                    error_div.querySelector("p").innerText = `An Error Ocurred`
                                    error_div.classList.add("display_modal")
                                    setTimeout(() => {
                                        error_div.classList.remove("display_modal")
                                    }, 5000);
                                    console.log("ErRoR:   ", data)
                                }
                            })
                    })

            }
        }

    })

}

function delete_prodduct() {
    const id = this.nextElementSibling.querySelector("p").innerText.trim();
    const this_ = this
    console.log("id is: ", id)
    const name = this.nextElementSibling.nextElementSibling.querySelector("h4").innerText.trim()
    del_modal.style.transform = "scale(100%)"
    del_modal_buttons.forEach(button => {
        button.addEventListener("click", function() {
            if (this.innerText === "cancel") {
                console.log("Cloding tan.....")
                del_modal.style.transform = "scale(0%)"
            } else {
                console.log("fetching.....")
                fetch("/admin/del/3iuehohf98oIYYLYFKJ8297/8hd72", {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({ id })
                    })
                    .then(response => {
                        response.text()
                            .then(data => {
                                if (data === "done") {
                                    done_div.querySelector("p").innerText = `${name} sucessfully deleted`
                                    done_div.classList.add("display_modal")
                                    setTimeout(() => {
                                        done_div.classList.remove("display_modal")
                                    }, 5000);
                                    del_modal.style.transform = "scale(0%)"
                                    this_.parentElement.style.display = 'none'
                                } else {
                                    error_div.querySelector("p").innerText = `An Error Ocurred`
                                    error_div.classList.add("display_modal")
                                    setTimeout(() => {
                                        error_div.classList.remove("display_modal")
                                    }, 5000);
                                    del_modal.style.transform = "scale(0%)"
                                    console.log("ErRoR:   ", data)
                                }
                            })
                    })
            }
        })
    });

}