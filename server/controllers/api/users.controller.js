require('rootpath')();
var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('server/services/user/user.service');

//routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

function authenticateUser(req,res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function(token) {
            console.info("Token returned from user auth: ", token)
            if(token) {
                res.send({token: token});
            } else {
                res.sendStatus(401);
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.error("Error: ", err)
            res.status(400).send(err);
        });
}
 
function getCurrentUser(req, res) {
    console.info("getCurrentUser - request token: ", req.user)
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params.id !== userId) {
        // can only update own account
        // return res.status(401).send('You can only update your own account');
    }
 
    userService.update(userId, req.body)
        .then(function (data) {
            console.info("After user update: ", data)
            if(data.error) {
                res.status(400).send(err);
            } else {
                res.sendStatus(200);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params.id !== userId) {
        // can only delete own account
        //return res.status(401).send('You can only delete your own account');
    }
 
    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.error("Error: ", err)
            res.status(400).send(err);
        });
}