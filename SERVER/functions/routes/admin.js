const express = require("express");
const router = express.Router()
const DBdebug = require("debug")("app:db")
const auth = require("../middleware/auth")
const admin = require("firebase-admin");
const serviceAccount = require("../service.json")
const { validate_add_cat, validate_add_product } = require("../model/category")
const FireStore = require("@google-cloud/firestore");
const fireStore = new FireStore()
const fireStoreClient = require("../db");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const fs = require("fs")
const dotenv = require("dotenv");
dotenv.config();
const Busboy = require("busboy")
const path = require("path")
const fileUploadMiddleware = require("busboy-firebase")
let streamifier = require('streamifier');



const expiresIn = 60 * 60 * 24 * 3 * 1000;
const options = { maxAge: expiresIn, httpOnly: true, secure: true };
const db = admin.firestore();



router.get("/amdin/pl8457ABF18", async(req, res) => {
    let products;
    let products_list = []
    let categories_list = [];
    let data;
    const get_products = async() => {
        console.log("abput sending products to firrestore")
        products = await fireStoreClient.get("Products")
        products.forEach((doc) => {
            console.log("\n\nid\n\n", doc.id)
            data = doc.data()
            data.id = doc.id
                // doc.data().id = doc.id
            console.log(data)
            products_list.push(data)
        });
    }
    await get_products()

    // const get_orders = async() => {
    //     console.log("abput sending orders to firrestore")
    //     orders = await fireStoreClient.get("Orders")
    //     console.log(orders)
    //     orders.forEach((doc) => {
    //         data = doc.data()
    //         data.id = doc.id
    //         console.log(data, "\n\nORDERS")
    //         order_list.push(data)
    //     });
    // }
    // await get_orders()

    const get_category = async() => {
        console.log("abput sending category to firrestore")
        categories = await fireStoreClient.get("Category")
        categories.forEach((doc) => {
            categories_list.push(doc.data())
        });
    }
    await get_category()

    console.log(categories_list)
    console.log("\n\nproduvt list", products_list)
    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).render("admin", { products_list, categories_list })
});

router.get("/login", async(req, res) => {
    res.render("login")
});

router.post("/cookie/:cookie", async(req, res) => {
    console.log(req.params.cookie)
    console.log('\n\n\n\noPTIOns: ', options)
    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.params.cookie, options).redirect("/admin/amdin/pl8457ABF18")
})

router.post("/cat/iufruAUOU7785ujh", async(req, res) => {
    const body = JSON.parse(req.body);
    console.log(body)
    const sections = ["Kids", "Women", "Materials"];
    const { error } = validate_add_cat(body)
    if (error) return res.send(error.details[0].message)
    if (sections.indexOf(body.section) === -1) return res.send(`invalid ${body.section}`)

    body.date = Date.now()
    const add = async() => {
        console.log("abput sending to firrestore")
        console.log(await fireStoreClient.add("Category", body))
    }
    await add()
    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).send("done")
});

router.post("/product/iudi7486GFY", fileUploadMiddleware, async(req, res) => {
    const body = req.body
    const files = req.files;
    let product_images = []
    console.log(body)
    let cld_upload_stream;
    let count = 0;

    for await (let file of files) {
        cld_upload_stream = await cloudinary.uploader.upload_stream(async(error, result) => {
            console.log("Error:  ", error)
            if (error) {
                product_images.forEach(img => {
                    cloudinary.uploader.destroy(img.public_id)
                })
                return res.send("Error");
            }
            product_images.push({
                secure_url: result.secure_url,
                public_id: result.public_id
            })
            count += 1
            if (count === files.length) {
                await add()
                res.setHeader('Cache-Control', 'private');
                res.cookie("__session ", req.token, options).send("done")
            }
        });
        streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
        console.log("cld_upload_stream")
    }


    const add = async() => {
        console.log("produvt images: \n\n", product_images)
        let product_data = {
            name: body.name,
            price: body.price,
            slashed_price: body.slashed_price,
            category: body.category,
            root_category: body.root_category,
            size: body.size,
            description: body.description,
            isAvailable: body.isAvailable,
            date: Date.now(),
            images: product_images
        }
        console.log(product_data)
        console.log("abput sending to firrestore")
        console.log(await fireStoreClient.add("Products", product_data))
    }

})

router.post("/get/ususGYIIYF53783/8hd72", auth, async(req, res) => {
    const body = JSON.parse(req.body);
    let product;

    const get_product = async() => {
        console.log("abput sending product from firrestore")
        product = await fireStoreClient.findById("Products", body.id)
        return product.data()
    }
    product = await get_product()

    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).send(product)
})

router.post("/del/3iuehohf98oIYYLYFKJ8297/8hd72/:id", async(req, res) => {
    const id = req.params.id
    console.log(id, "\n\n")
    let product;

    let get_product = async() => {
        console.log("abput getting product from firrestore")
        product = await fireStoreClient.findById("Products", id)
        for (let i = 0; i < 4000; i++) {}
        console.log(product.exists)
        return product.data()
    }
    product = await get_product()
    for (img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
    }

    delete_product = async() => {
        console.log("abput deleting product from firrestore")
        await fireStoreClient.delete("Products", id)
    }
    product = await delete_product()

    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).send("done");
})

router.post("/add/3iuehohf98oIYYLYFKJ829", fileUploadMiddleware, async(req, res) => {
    const body = req.body
    const files = req.files;
    let product_images = []
    let count = 0;

    console.log(body)
    const id = body.Id.trim()
    console.log(id, "\n\n")
    let product;

    for await (let file of files) {
        cld_upload_stream = await cloudinary.uploader.upload_stream(async(error, result) => {
            console.log("Error:  ", error)
            if (error) {
                product_images.forEach(img => {
                    cloudinary.uploader.destroy(img.public_id)
                })
                return res.send("Error");
            }
            product_images.push({
                secure_url: result.secure_url,
                public_id: result.public_id
            })
            count += 1
            if (count === files.length) {
                await get_product()
            }
        });
        streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
        console.log("cld_upload_stream")
    }

    let get_product = async() => {
        console.log("abput sending product from firrestore")
        product = await fireStoreClient.findById("Products", id)
        product = product.data()
        product.images = product.images.concat(product_images)
        await save()
    }

    const save = async() => {
        console.log("Saving to firrestore")
        console.log(await fireStoreClient.save("Products", id, product))
        res.setHeader('Cache-Control', 'private');
        res.cookie("__session ", req.token, options).send("done")
    }
})

router.post("/update/345678998765/8hd72/:id", async(req, res) => {
    const body = JSON.parse(req.body);
    console.log(body)
    const id = req.params.id
    let product;
    let del_images = [];

    let get_product = async() => {
        console.log("abput sending product from firrestore")
        product = await fireStoreClient.findById("Products", id)
        return product.data()
    }
    product = await get_product()
    console.log("produict: ", product)

    let product_data = {}
    product_data.name = body.name ? body.name : product.name
    product_data.category = body.category ? body.category : product.category
    product_data.root_category = body.root_category ? body.root_category : product.root_category
    product_data.slashed_price = body.slashed_price ? body.slashed_price : product.slashed_price
    product_data.price = body.price ? body.price : product.price
    product_data.size = body.size ? body.size : product.size
    product_data.images = body.images ? body.images : product.images
    product_data.description = body.description ? body.description : product.description
    product_data.isAvailable = body.isAvailable ? body.isAvailable : product.isAvailable
    product_data.date = Date.now()

    const save = async() => {
        console.log("Saving to firrestore")
        console.log(await fireStoreClient.save("Products", id, product_data))
    }
    await save()

    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).send("done")
})

router.post("/del/:productid/:imgid", async(req, res) => {
    const imageid = req.params.imgid;
    const productid = req.params.productid
    let product;
    console.log(productid)
    console.log(imageid)

    let get_product = async() => {
        console.log("abput sending product from firrestore")
        product = await fireStoreClient.findById("Products", productid)
        return product.data()
    }
    product = await get_product()
    console.log(product)

    if (product.images.length <= 1) {
        return res.send("error")
    }

    const { result } = await cloudinary.uploader.destroy(imageid)
    console.log(result)
    if (result === 'not found') return res.send("error")

    for (let i = 0; i < product.images.length; i++) {
        console.log("PUBLIC_ID: ", product.images[i].public_id)
        if (product.images[i].public_id === imageid) {
            console.log("YESSSSSS")
            product.images.splice(i, 1);
        }
    }

    console.log(product)
    const save = async() => {
        console.log("Saving to firrestore")
        console.log(await fireStoreClient.save("Products", productid, product))
    }
    await save()
    return res.send("done")
})

router.post("/update/img/kajjdf9983y/:id", fileUploadMiddleware, async(req, res) => {
    const body = JSON.parse(req.body);
    console.log(typeof body.delete)
    const id = req.params.id
    let product;
    let del_images = [];

    let get_product = async() => {
        console.log("abput sending product from firrestore")
        product = await fireStoreClient.findById("Products", id)
        return product.data()
    }
    product = await get_product()



    if (body.delete) {
        for (img of body.delete) {
            await cloudinary.uploader.destroy(img);
        }
        del_images.push(img)

        for (img of del_images) {
            for (let i = 0; i < product.images.length; i++) {
                if (img === product.images[i].public_id) {
                    product.images.splice(i, 1);
                    break;
                }
            }
        }
    }

    if (body.upload) {
        const files = req.files;
        for await (let file of files) {
            let cld_upload_stream = await cloudinary.uploader.upload_stream(async(error, result) => {
                product.images.push({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                })
            })
            streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
        }

    }
})

router.get("/uv67983IUGFY/order/:id", async(req, res) => {
    const id = req.params.id
    let get_order = async() => {
        console.log("abput sending product from firrestore")
        order = await fireStoreClient.findById("Orders", id)
        return res.send(order.data())
    }
})

router.post("/orders/UFY8^&gi", async(req, res) => {
    let orders_list = []
    const get_orders = async() => {
        console.log("abput sending orders to firrestore")
        let orders = await fireStoreClient.get("Orders")
        orders.forEach((doc) => {
            orders_list.push(doc.data())
        });
        return res.send(orders_list)
    }
    await get_orders()
})




module.exports = router