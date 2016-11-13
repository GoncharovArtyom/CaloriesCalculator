var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  req.connection.query('select * from actor;', function(err, rows, fields){
    if (err) throw err;
    res.json(rows);
  });
  //res.render('index', { title: 'Express' });
});

module.exports = router;
