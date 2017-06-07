require('rootpath')()
var express = require('express')
var router = express.Router()
var request = require('request')
var config = require('config.json')

router.get('/', function(req,res) {
    res.render('register')
})

router.post('/', function(req,res) {
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (err, response, body) {
        if(err) {
            return res.render('register', { 
                error: 'An error occurred'
            })
        }
        if(response.statusCode !== 200) {
            return res.render('register', {
                error: response.body,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                password: req.body.password,
            })
        }
        if(response.statusCode === 200) {
            req.session.success = 'User created successfully'
            res.redirect('/login');
        }
    })
})

module.exports = router;