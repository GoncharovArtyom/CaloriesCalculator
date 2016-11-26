/**
 * Created by Артем on 06.11.2016.
 */
var mysql = require('mysql')
    , async = require('async')

var PRODUCTION_DB = 'calories_calc'
    , TEST_DB = 'calories_calc'

exports.MODE_TEST = 'app_prod_database'
exports.MODE_PRODUCTION = 'app_test_database'

var state = {
    pool: null,
    mode: null,
}

exports.connect = function(mode, done) {
    state.pool = mysql.createPool({
        host: 'localhost',
        port: '3307',
        user: 'root',
        password: 'ArTyOm73',
        database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
    });

    state.mode = mode
    done()
}

exports.get = function() {
    return state.pool
}

exports.fixtures = function(data, done) {
    var pool = state.pool
    if (!pool) return done(new Error('Missing database connection.'))

    var names = Object.keys(data.tables)
    async.each(names, function(name, cb) {
        async.each(data.tables[name], function(row, cb) {
            var keys = Object.keys(row)
                , values = keys.map(function(key) { return "'" + row[key] + "'" })

            pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', function(err){
                if (err) {
                    console.log('error while inserting data');
                    throw err;
                }
                cb();
            })
        }, cb)
    }, done)
}

exports.drop = function(tables, done) {
    var pool = state.pool
    if (!pool) return done(new Error('Missing database connection.'))

    async.each(tables, function(name, cb) {
        pool.query('delete from ' + name, function(err){
            if (err) {
                console.log('error while erasing data');
                throw err;
            }
            cb();
        })
    }, done)
}

exports.insertUser = function (data, done) {
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    pool.getConnection(function(err, connection)
    {
        if(err) return done(new Error('Missing database connection.'));

        var keys = Object.keys(data)
            , values = keys.map(function (key) {
            return "'" + data[key] + "'"
        });

        connection.query('INSERT INTO ' + 'users' + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', function (err, result) {
            if (err) {
                console.log('error while inserting user data');
                done(err);
            } else {
                done(null);
            }
        });
        connection.release();
    });

}

exports.findUserByEmail = function (email, done){
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    pool.getConnection(function(err, connection) {
        if (err) return done(new Error('Missing database connection.'));
        connection.query('select * from users where user_email = ' + "'" + email + "'", function (err, result) {
            if (err) {
                console.log('error while finding by email');
                console.log(err);
                done(err, null);
            } else {
                if (result.length == 0) {
                    done(null, null);
                } else {
                    var user = {
                        user_id: result[0].user_id,
                        user_name: result[0].user_name,
                        user_password: result[0].user_password,
                        user_email: result[0].user_email
                    }
                    done(null, user);
                }
                ;

            }
        })
        connection.release();
    })
}

exports.findRecipesByUserId = function(user_id, done){
    var pool = state.pool;
    pool.getConnection(function(err, connection) {
        if (err) return done(new Error('Missing database connection.'));
        connection.query('select * from recipes where user_id = ' + "'" + user_id + "'", function (err, result) {
            if (err) {
                console.log("Error while finding recipes by user_id");
                done(new Error("Error while finding recipes by user_id"));
            } else {
                done(null, result);
            }
        });
        connection.release();
    })
}

exports.findFoodByListOfRecipeIds = function(recipe_id, done){
    var pool = state.pool;
    pool.getConnection(function(err, connection) {
        if (err) return done(new Error('Missing database connection.'));
        connection.query('select recipe_id, food_name, amount from recipes_food ' +
            'join food on food.food_id = recipes_food.food_id ' +
            'where recipe_id in (' + recipe_id.join(', ') + ') ' +
            'order by recipe_id',
            function (err, result) {
                if (err) {
                    console.log(err);
                    done(new Error("Error while finding food by recipe_id"));
                } else {
                    done(null, result);
                }
            });
        connection.release();
    });
}

exports.deleteRecipeById = function(recipe_id, done){
    var pool = state.pool;
    pool.getConnection(function(err, connection) {
        if (err) return done(new Error('Missing database connection.'));
        connection.query('delete from recipes where recipe_id = ' + "'" + recipe_id + "'", function (err, result) {
            if (err) {
                console.log('error while deleting recipe');
                done(new Error('error while deleting recipe'), null);
            } else {
                done(false, true);
            }
        })
        connection.release();
    })
}

exports.getFood = function( done){
    var pool = state.pool;
    pool.getConnection(function(err, connection) {
        if (err) return done(new Error('Missing database connection.'));
        connection.query('select * from food', function (err, result) {
            if (err) {
                console.log('error while finding food');
                done(new Error('error while finding food'), null);
            } else {
                done(false, result);
            }
        })
        connection.release();
    })
}

exports.insertNewRecipe = function(recipeInf, ingridientsInf, done){
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));
    pool.getConnection(function(err, connection) {

        //Начало транзакции
        connection.query("begin work;", function (err){
            if(err) return done(new Error("err in starting transaction"))

            var sql = "insert into recipes (user_id, recipe_name, proteins, lipids, carbs, calories) " +
                "values(" + recipeInf.user_id +', ' +'"' + recipeInf.recipe_name +'"'+ ', ' + recipeInf.proteins + ', ' + recipeInf.lipids + ', '+recipeInf.carbs +', ' + recipeInf.calories + ');'
            connection.query(sql,
            function (err, result) {
                if(err) return done(new Error("err in inserting recipe transaction"))
                var recipe_id = result.insertId;
                var sql = 'insert into recipes_food values '
                var rows =[]
                for (var i=0; i<ingridientsInf.length; ++i){
                    rows.push('(' + recipe_id +', ' + ingridientsInf[i].food_id + ', ' + ingridientsInf[i].amount + ')');
                }
                sql = sql + rows.join(', ') + ';';


                connection.query(sql, function(err){
                    if(err) return done(new Error("err in inserting recipe_table transaction"));

                    connection.query('commit;', function(err){
                        if (err) {
                            return done(new Error("err in commiting"));
                        }
                        done(null, recipe_id);
                    })
                })
            })
        });
        connection.release();
    })
};
