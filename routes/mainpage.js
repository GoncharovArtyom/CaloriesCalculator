var express = require('express');
var router = express.Router();
var db = require('../db.js');
var builder = require('xmlbuilder');
/* GET users listing. */
var restrict = function (req, res, next){
  if (!req.session.auth){
    res.redirect("http://localhost:3001");
  } else {
    next();
  }
}

router.get('/',restrict, function(req, res, next) {
  /*db.findRecipesByUserId(req.session.user_id, function (err, result) {
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
          db.findFoodByListOfRecipeIds( recipe_ids, function (err, result2) {
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
  });*/

  res.render('mainpage', {user_name: req.session.user_name});
});

router.get('/getrecipes',restrict, function(req, res, next) {
  db.findRecipesByUserId(req.session.user_id, function (err, result) {
    if (err) {
      req.errStatus = 4;
      next(err);
    } else {
      if (result.length == 0) {
        res.json([]);
      } else {
        var recipe_ids = [];
        for (var i = 0; i < result.length; ++i)
          recipe_ids.push(result[i].recipe_id);
        db.findFoodByListOfRecipeIds( recipe_ids, function (err, result2) {
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
            res.json(result);
          }
        })

      }
    }
  });
});

router.get('/getrecipesxml',restrict, function(req, res, next) {
  db.findRecipesByUserId(req.session.user_id, function (err, result) {
    if (err) {
      req.errStatus = 4;
      next(err);
    } else {
      if (result.length == 0) {
        res.json([]);
      } else {
        var recipe_ids = [];
        for (var i = 0; i < result.length; ++i)
          recipe_ids.push(result[i].recipe_id);
        db.findFoodByListOfRecipeIds( recipe_ids, function (err, result2) {
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
            var root = builder.create('recipeList', {version: '1.0', encoding: 'UTF-8', standalone: true});
            for (var i=0; i<result.length; ++i){
              var rec = root.ele('recipe');
              rec.ele('name').text(result[i].recipe_name);
              rec.ele('calories').text(String(result[i].calories));
              rec.ele('proteins').text(String(result[i].proteins));
              rec.ele('carbs').text(String(result[i].carbs));
              rec.ele('lipids').text(String(result[i].lipids));
              var ingrList = rec.ele('ingridientsList');
              for (var j=0; j<result[i].data.length; ++j){
                var ingr = ingrList.ele('ingridient');
                ingr.ele('name').text(String(result[i].data[j].name));
                ingr.ele('amount').text(String(result[i].data[j].amount));
              }
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
          }
        })

      }
    }
  });
});

router.post('/delete',restrict, function(req, res, next){
    if (req.body.recipe_id) {
        db.deleteRecipeById( req.body.recipe_id, function(err, result){
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


  var recipeInf = JSON.parse(req.body.recipeInf);
  recipeInf.user_id = req.session.user_id;
  var ingrInf = JSON.parse(req.body.ingridientsInf);
  db.insertNewRecipe(recipeInf, ingrInf, function(err, recipe_id){
    if(err) return next(err);
    console.log('done!');
    res.json({recipe_id: recipe_id});
  })
  //res.json(data);
});

router.post('/getstats', function(req, res, next){
  db.getStats(req.session.user_id, req.body.date, function(err, data){
    if (err) return next(err);
    res.json(data);
  })
});

router.post('/delrecstats', function(req, res, next){
    db.delRecipeStat(req.body.recipe_id, req.body.date, function(err){
      if (err) next(err);
      else res.sendStatus(200);
    })
});

router.post('/delfoodstats', function(req, res, next){
  db.delFoodStat(req.body.food_id, req.body.date, function(err){
    if (err) next(err);
    else res.sendStatus(200);
  })
});

router.post('/addrecstat', function(req, res, next){
  db.addRecStat(req.session.user_id, req.body.recipe_id, req.body.date, req.body.amount, function(err){
    if (err) next(err)
    else res.sendStatus(200);
  })
});

router.post('/addfoodstat', function(req, res, next){
  db.addFoodStat(req.session.user_id, req.body.food_id, req.body.date, req.body.amount, function(err){
    if (err) next(err)
    else res.sendStatus(200);
  })
});

module.exports = router;
