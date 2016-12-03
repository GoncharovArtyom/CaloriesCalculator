var express = require('express');
var router = express.Router();
var db = require('../db.js');


var redirectAuth = function(req, res, next){
    if (req.session.auth) {
        res.redirect("http://localhost:3001/mainpage");
    } else {
        next();
    }
}
var checkDataLogin = function(req, res, next){
    if (!(req.body.user_email && req.body.user_password)){
        req.errStatus = 3;
        next(new Error("No data to log in"))
    } else{
        next();
    }
}
var checkDataReg = function(req, res, next){
    if (!(req.body.user_email && req.body.user_name && req.body.user_password)){
        req.errStatus = 3;
        next(new Error("No data to check in"))
    } else{
        next();
    }
}

router.get('/',redirectAuth, function(req, res, next) {
    res.render('index', { title: 'Calculator' });
});

router.post('/login',checkDataLogin, function(req, res, next) {
    var email = req.body.user_email;
    db.findUserByEmail(email, function(err, result){
        if (err){
            req.errStatus = 4;
            next(new Error("database error while finding"));
        } else {
            if (result) {
                if (result.user_password == req.body.user_password) {

                    req.session.auth = true
                    req.session.user_name = result.user_name;
                    req.session.user_id = result.user_id;
                    res.sendStatus(200)

                } else {
                    req.errStatus = 1;
                    next(new Error("Incorrect password"))
                }
            } else {
                req.errStatus = 1;
                next(new Error("No user with such an email"))
            }
        }
    });
});

router.post('/registration',checkDataReg, function(req, res, next) {
    var email = req.body.user_email;
    db.findUserByEmail(email, function(err, result){
        if (err) {
            req.errStatus = 4;
            next(new Error("database error while finding"));
        } else {
            if (result) {
                req.errStatus = 2;
                next(new Error("User already exists"));
            } else {
                var user = {
                    user_name: req.body.user_name,
                    user_password: req.body.user_password,
                    user_email: req.body.user_email
                };
                db.insertUser(user, function (err, user_id) {
                    if (err) {
                        req.errStatus = 4;
                        next(new Error("database error while inserting"));
                    } else {
                        db.get().getConnection(function(err, connection) {

                            console.log('registred!');
                            req.session.auth = true
                            req.session.user_name = user.user_name;
                            req.session.user_id = user_id;
                            res.sendStatus(200);

                        })
                    }
                })
            }
        }
    });
});

/*router.get('/getxml', function(req, res, next){
    var root = builder.create('squares');
    root.com('f(x) = x^2');
    for(var i = 1; i <= 5; i++)
    {
        var item = root.ele('data');
        item.att('x', i);
        item.att('y', i * i);
    }
    var str = root.end({
        pretty: true,
        indent: '  ',
        newline: '\n',
        allowEmpty: false
    });
    console.log(str);
    res.header('Content-Type', 'application/xml');
    res.header('Content-Disposition', 'attachment; filename="recipes.xml"');
    res.send(str);
});*/

module.exports = router;
