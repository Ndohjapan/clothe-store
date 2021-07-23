var admin = require('firebase-admin');
const authdebug = require("debug")("app:auth")
const serviceAccount = require("../service.json")



admin.initializeApp({
    // credential: admin.credential.applicationDefault()
    credential: admin.credential.cert(serviceAccount)
});


module.exports = function(req, res, next) {
    const idToken = req.cookies.__session
    if (!idToken) return res.status(401).redirect("/admin/login");
    console.log(`\n\n\n${idToken}\n\n\n`)

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            req.token = idToken
            next()
        })
        .catch((error) => {
            res.status(401).redirect("/admin/login")
        });

}