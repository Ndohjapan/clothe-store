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



router.get("/amdin/pl8457ABF18", auth, async(req, res) => {
    let products;
    let categories;
    let orders;
    let order_list = [];
    let categories_list = []
    let products_list = []
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

    const get_orders = async() => {
        console.log("abput sending orders to firrestore")
        orders = await fireStoreClient.get("Orders")
        console.log(orders)
        orders.forEach((doc) => {
            data = doc.data()
            data.id = doc.id
            console.log(data, "\n\nORDERS")
            order_list.push(data)
        });
    }
    await get_orders()

    const get_category = async() => {
        console.log("abput sending category to firrestore")
        categories = await fireStoreClient.get("Category")
        categories.forEach((doc) => {
            categories_list.push(doc.data())
        });
    }
    await get_category()

    console.log("\n\nproduvt list", products_list)
    console.log("\n\ncategorry list", categories_list)
    console.log("\n\order_list", order_list)
    let now = Date.now()
    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).render("admin", { products_list, categories_list, order_list, now })
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

router.post("/cat/iufruAUOU7785ujh", auth, async(req, res) => {
    const body = req.body
    body.date = Date.now()

    const add = async() => {
        console.log("abput sending to firrestore")
        console.log(await fireStoreClient.add("Category", body))
    }
    await add()
    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).send("done")
});

router.post("/product/iudi7486GFY", auth, fileUploadMiddleware, async(req, res) => {
    const body = req.body
    const files = req.files;
    let product_images = []
    console.log(body)

    for (const file of files) {
        let cld_upload_stream = await cloudinary.uploader.upload_stream(async(error, result) => {
            console.log(`REsULT is: \n\n ${result}`)
            product_images.push({
                secure_url: result.secure_url,
                public_id: result.public_id
            })
            if (file === files[files.length - 1]) {

                console.log("produvt images: \n\n", product_images)
                let product_data = {
                    name: body.name,
                    price: body.price,
                    slashed_price: body.slashed_price,
                    category: body.category,
                    root_category: body.root_category,
                    size: body.size,
                    available: body.available,
                    description: body.description,
                    date: Date.now(),
                    images: product_images
                }

                const add = async() => {
                    console.log("abput sending to firrestore")
                    console.log(await fireStoreClient.add("Products", product_data))
                }
                return await add()

            }
        });
        streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
        console.log("cld_upload_stream", cld_upload_stream)

    }

    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).send("done")
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

router.post("/del/3iuehohf98oIYYLYFKJ8297/8hd72", auth, async(req, res) => {
    const body = JSON.parse(req.body);
    console.log(body.id, "\n\n")
    let product;

    let get_product = async() => {
        console.log("abput getting product from firrestore")
        product = await fireStoreClient.findById("Products", body.id)
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
        await fireStoreClient.delete("Products", body.id)
    }
    product = await delete_product()

    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).send("done");
})

router.post("/update/345678998765/8hd72/:id", auth, fileUploadMiddleware, async(req, res) => {
    const body = JSON.parse(req.body);
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
                    product.images.slice(i, 1);
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

    let product_data = {}
    product_data.name = body.name ? body.name : product.name
    product_data.category = body.category ? body.category : product.category
    product_data.root_category = body.root_category ? body.root_category : product.root_category
    product_data.slashed_price = body.slashed_price ? body.slashed_price : product.slashed_price
    product_data.price = body.price ? body.price : product.price
    product_data.size = body.size ? body.size : product.size
    product_data.available = body.available ? body.available : product.available
    product_data.images = body.images ? body.images : product.images
    product_data.description = body.description ? body.description : product.description
    product_data.date = Date.now()

    const save = async() => {
        console.log("Saving to firrestore")
        console.log(await fireStoreClient.save("Products", id, product_data))
    }
    await save()

    res.setHeader('Cache-Control', 'private');
    res.cookie("__session ", req.token, options).send(product)
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