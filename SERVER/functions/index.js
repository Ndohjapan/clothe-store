const functions = require("firebase-functions");
const DBdebug = require("debug")("app:db")
const express = require("express");
const cookieParser = require("cookie-parser")
const FireStore = require("@google-cloud/firestore");
const dotenv = require("dotenv")
dotenv.config()
const fireStore = new FireStore()
const fireStoreClient = require("./db");
const cloudinary = require("./utils/cloudinary");


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(cookieParser())
app.disable("x-powered-by")


const admin = require("./routes/admin");
const router = require("./routes/admin");

app.use("/admin", admin)

app.get("/check", (req, res) => {
    res.render("admin")
})

app.get("/", async(req, res) => {

    let Female = await fireStoreClient.get_with_limit("Products", "root_category", "Female")
    let Kids = await fireStoreClient.get_with_limit("Products", "root_category", "Kids")
    let Material = await fireStoreClient.get_with_limit("Products", "root_category", "Material")

    console.log("KIDS: \n", Kids, '\n\n\n')
    console.log("FEMALE: \n", Female, '\n\n\n')
    console.log("MATERIAL: \n", Material, '\n\n\n')

    res.render("index", {Kids, Female, Material})
        // res.render("index.ejs", { Kids, Female, Material })
})

app.get("/kids", async(req, res) => {
    const products_list = []
    let categories_list = []

    let products = await fireStoreClient.array_contains("Products", "root_category", "Kids")
    products.forEach((doc) => {
        data = doc.data()
        data.id = doc.id
        products_list.push(data)
    });

    let categories = await fireStoreClient.array_contains("Category", "section", "Kids")
    categories.forEach((doc) => {
        data = doc.data()
        data.id = doc.id
        categories_list.push(data)
    });

    console.log("products_list: \n", products_list, '\n\n\n')
    console.log("categories_list: \n", categories_list, '\n\n\n')

    const section = "Kids"

    res.render("product", {products_list, categories_list, section})

})

app.get("/Female", async(req, res) => {
    const products_list = []
    let categories_list = []

    let products = await fireStoreClient.array_contains("Products", "root_category", "Female")
    products.forEach((doc) => {
        data = doc.data()
        data.id = doc.id
        products_list.push(data)
    });

    let categories = await fireStoreClient.array_contains("Category", "section", "Female")
    categories.forEach((doc) => {
        data = doc.data()
        data.id = doc.id
        categories_list.push(data)
    });

    console.log("products_list: \n", products_list, '\n\n\n')
    console.log("categories_list: \n", categories_list, '\n\n\n')

    const section = "Women's"

    res.render("product", {products_list, categories_list, section})

})

app.get("/Material", async(req, res) => {
    const products_list = []
    let categories_list = []

    let products = await fireStoreClient.array_contains("Products", "root_category", "Material")
    products.forEach((doc) => {
        data = doc.data()
        data.id = doc.id
        products_list.push(data)
    });

    let categories = await fireStoreClient.array_contains("Category", "section", "Material")
    categories.forEach((doc) => {
        data = doc.data()
        data.id = doc.id
        categories_list.push(data)
    });

    console.log("products_list: \n", products_list, '\n\n\n')
    console.log("categories_list: \n", categories_list, '\n\n\n')

    const section = "Materials / Applique"

    res.render("product", {products_list, categories_list, section})

})

app.post("/cartProduct", async(req, res) => {
    const body = JSON.parse(req.body);
    console.log("body: \n\n", body)
    const products = []
    let item

    for await (let product of body) {
        console.log("abput sending product from firrestore")
        let product_ = await fireStoreClient.findById("Products", product.id)
        item = product_.data()
        item.id = product_.id
        products.push(item)
    };

    console.log("\n\nproducts", products)
    res.send(products)
})

app.get("/cart", async(req, res) => {
    res.render("cart")
})

app.get("/contact", async(req, res) => {
    res.render("contact")
})

app.get("/detail/:id", async(req, res) => {
    const id = req.params.id
    let get_product = async() => {
        console.log("abput sending product from firrestore")
        product = await fireStoreClient.findById("Products", id)
        let data = product.data()
        data.id = product.id
        return data
    }
    let product = await get_product();

    console.log(product)

    return res.send(product)
})

app.get("/search/:query/:value", async(req, res) => {
    const query = req.params.query
    const value = req.params.value
    const search_prodocts = []
    let categories_list = []
    let products;

    const get_category = async() => {
        console.log("abput sending category to firrestore")
        let categories = await fireStoreClient.get("Category")
        categories.forEach((doc) => {
            categories_list.push(doc.data())
        });
    }
    await get_category()

    const get_related_products = async() => {
        console.log("Fetting related produsrs- from firrestore")
        if (query === "all") {
            let products = await fireStoreClient.get("Products")
            products.forEach((doc) => {
                data = doc.data()
                data.id = doc.id
                search_prodocts.push(data)
            });
            res.render("search", { search_prodocts, categories_list })
        } else {
            let products = await fireStoreClient.array_contains("Products", query, value)
            products.forEach((doc) => {
                data = doc.data()
                data.id = doc.id
                search_prodocts.push(data)
            });
            res.render("search", { search_prodocts, categories_list })
        }
    }
    await get_related_products()
})

app.get("/cartitems", async(req, res) => {
    res.render("cart")
})

app.post("/order/add", async(req, res) => {
    const body = JSON.parse(req.body);

    let data = {
        products: body,
        date: Date.now()
    }

    const add = async() => {
        console.log("abput sending to firrestore")
        let data_ = await fireStoreClient.add("Orders", data)
        res.send(data_.id)
    }
    await add()
})

app.get("/order/detail/:id", async(req, res) => {
    const id = req.params.id
    let orders;
    let order_items = []
    let total = 0;
    let get_order = async() => {
        console.log("abput sending orders from firrestore")
        orders = await fireStoreClient.findById("Orders", id)
        let data = orders.data()
        data.id = orders.id
        return data
    }
    orders = await get_order();

    for await (let product of orders.products) {
        total += product.quantity
        console.log("abput sending product from firrestore")
        let product_ = await fireStoreClient.findById("Products", product.id)
        data = product_.data()
        data.id = product_.id;
        order_items.push(data)
    };

    console.log(total)
    return res.render("order", { order_items, orders, total })
})



exports.app = functions.https.onRequest(app);