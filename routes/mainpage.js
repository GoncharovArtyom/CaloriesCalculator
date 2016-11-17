var express = require('express');
var router = express.Router();
var db = require('../db.js');
/* GET users listing. */
var restrict = function (req, res, next){
  if (!req.session.auth){
    res.redirect("http://localhost:3001");
  } else {
    next();
  }
}

router.get('/',restrict, function(req, res, next) {
  db.findRecipesByUserId(req.session.user_id, function (err, result) {
      if (err) {
        req.errStatus = 4;
        next(err);
      } else {
        console.log(result.length)
        res.render('mainpage',{user_name:req.session.user_name, recipes:result});
      }
  });
});

router.get('/logout', function(req, res, next){
  req.session.destroy();
  res.sendStatus(200);
});

module.exports = router;
