const express = require('express');
const router = express.Router();



const config = require('../config.js');
const checkAuth = require('../modules/auth/checkAuth.js');
const debug = config.debug;




// pour ne pas afficher une page vide moche
router.get('/', checkAuth, function(req, res) {
    res.render("main.ejs", {

    })
});


// pour ne pas afficher une page vide moche
router.get('/login', function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect("/")
    } 

    res.render("login.ejs", {

    })

});




module.exports = router;