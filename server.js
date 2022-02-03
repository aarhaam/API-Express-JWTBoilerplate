var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var app = express();
var router = express.Router();
var cors = require('cors');


var config  = require('./app/config');
var User = require('./app/models/user');
var port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(config.database);
app.set('secretKey', config.secret);
app.use(cors());

router.get('/', function(req, res){
    res.send('ini di route home!');
});

router.post('/login', function(req ,res){
    User.findOne({
        email: req.body.email
    }, function(err, user){
        if(err) throw err;
        if(!user){
            res.json({
                success: false,
                message: 'User tidak ada di database'
            });
        } else {
            if(user.password != req.body.password){
                res.json({success: false, message : 'Password user salah'});
            } else {
                //create token
                var token = jwt.sign({user}, app.get('secretKey'), {
                    expiresIn: "24h"
                });
                res.json({
                    success: true,
                    message: 'Token berhasil didapatkan',
                    token : token
                })
            }
        }
    })
})

router.use(function(req,res,next){
    var token = req.body.token || req.query.token || req.headers['authorization'];

    if(token){

        jwt.verify(token, app.get('secretKey'), function(err, decoded){
            if(err){
                 return res.json({
                     success: false,
                     message: 'problem dengan token'
                 })
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success : false,
            message : 'token tidak tersedia'
        })
    }
})

router.get('/users', function(req,res){
    User.find({}, function(err, users){
        res.json(users);
    })
});

//prefix api
app.use('/api', router);

app.listen(port);