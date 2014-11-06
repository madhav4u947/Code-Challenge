var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'maddy',
        database : 'project',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

app.get('/',function(req,res){
    res.send('Welcome');
});


//RESTful route
var router = express.Router();


/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/user');


//show the CRUD interface | GET
curut.get(function(req,res){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('select user.user_id,user.name,photo.url from user as user,photo as photo where photo.user_id=user.user_id',function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('user',{title:"HTTP service using Node.js & Mysql",data:rows});

         });

    });

});
//post data to DB | POST
curut.post(function(req,res){

    //validation
    req.assert('user_id','User ID is required').notEmpty();
    req.assert('name','Name is required').notEmpty();
    req.assert('photo','Select an image').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data1 = {
        user_id:req.body.user_id,
        name:req.body.name,
     };

    var data2 = {
        photo:req.body.photo,
        user_id:req.body.user_id,
        photo:req.body.photo
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO user set ? ",data1, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });
        var query = conn.query("INSERT INTO photo set ? ",data2, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });


     });

});


//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/user/:user_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
curut2.all(function(req,res,next){
//  console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
curut2.get(function(req,res,next){

    var user_id = req.params.user_id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("select user.user_id,user.name,photo.url from user as user,photo as photo where photo.user_id= ? ",[user_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('edit',{title:"Edit user",data:rows});
        });

    });

});

//update data
curut2.put(function(req,res){
    var user_id = req.params.user_id;

    //validation
    req.assert('user_id','User ID is required').notEmpty();
    req.assert('name','Name is required').notEmpty();
    req.assert('photo','Select an image').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data1 = {
        user_id:req.body.user_id,
        name:req.body.name,
     };

    var data2 = {
        photo:req.body.photo,
        user_id:req.body.user_id,
        photo:req.body.photo
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE user set ? WHERE user_id = ? ",[data1,user_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

        var query = conn.query("UPDATE photo set ? WHERE user_id = ? ",[data2,user_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

//delete data
curut2.delete(function(req,res){

    var user_id = req.params.user_id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM user  WHERE user_id = ? ",[user_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });

        var query = conn.query("DELETE FROM photo  WHERE user_id = ? ",[user_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});

//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(3000,function(){

   console.log("Listening to port %s",server.address().port);
   console.log("Visit http://localhost:3000/api/user");	

});
