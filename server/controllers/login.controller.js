require('rootpath')()
var express = require('express')
var router = express.Router();
var request = require('request')
var config = require('config.json')

router.get('/', function(req,res) {
    delete req.session.token

    var viewData = {success: req.session.success}
    delete req.session.success

    res.render('login', viewData)
})

router.post('/', function(req,res) {
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (err,response,body) {
        if(err) {
            return res.render('login', {error: 'An error occurred' });
        }
        if(body.token) {
            req.session.token = body.token;
        } else {
            return res.render('login', 
                {
                    error: 'Wrong username or password',
                    username: req.body.username
                })
        }

        // redirect to return url
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    })
})

module.exports = router;
