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
        if (result.length == 0) {
          res.render('mainpage', {user_name: req.session.user_name, recipes: result});
        } else {
          var recipe_ids = [];
          for (var i = 0; i < result.length; ++i)
            recipe_ids.push(result[i].recipe_id);
          db.findFoodByListOfRecipeIds(recipe_ids, function (err, result2) {
            if (err) {
              req.errStatus = 4;
              next(err);
            } else {
              var getRecipeById = {}

              for (var i = 0; i < result.length; ++i)
                getRecipeById[result[i].recipe_id] = result[i];

              for (var key in getRecipeById) {
                getRecipeById[key].data = []
              }

              for (var i = 0; i < result2.length; ++i) {
                var ingridients = {
                  name: result2[i].food_name,
                  amount: result2[i].amount
                }
                getRecipeById[result2[i].recipe_id].data.push(ingridients);
              }
              res.render('mainpage', {user_name: req.session.user_name, recipes: result});
            }
          })

        }
      }
  });
});

router.post('/delete',restrict, function(req, res, next){
    if (req.body.recipe_id) {
        db.deleteRecipeById(req.body.recipe_id, function(err, result){
          if(err){
            next(err);
          } else {
            res.sendStatus(200);
          }
        });
    }
});

router.get('/logout', function(req, res, next){
  req.session.destroy();
  res.sendStatus(200);
});

router.get('/createrecipe', function(req, res, next){
  db.getFood(function(err, data){
    if (err){
      next(err);
    } else {
      res.json(data);
    }
  })
});

router.post('/add', function(req, res, next){
  var data = {recipe_id: 4};
  res.json(data);
});

module.exports = router;
