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

    var keys = Object.keys(data)
        , values = keys.map(function(key) { return "'" + data[key] + "'" });

    pool.query('INSERT INTO ' + 'users' + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', function(err){
        if (err) {
            console.log('error while inserting user data');
            done(err);
        }
        done(null);
    });

}

exports.findUserByEmail = function (email, done){
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    pool.query('select * from users where user_email = '+"'"+email+"'", function(err, result){
        if (err) {
            console.log('error while finding by email');
            console.log(err);
            done(err,null);
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
            };

        }
    })
}