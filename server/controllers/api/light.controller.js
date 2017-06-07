require('rootpath')();
var express = require('express');
var router = express.Router();
const env = process.env.NODE_ENV || 'local'
var config = require('config.json')[env];
var lightService = require('server/services/light/light.service');

//routes
router.post('/login', login);
router.get('/quickcontrol', getQuickControl);
router.get('/group/:id', getGroupStatus);
router.get('/group', getGroupList);
router.post('/quickcontrol', updateQuickControl);
router.post('/group', updateGroup);

module.exports = router;

function login(req,res) {
    lightService.login(req.body)              
        .then(function (data) {
            console.info("Data received: ", data)
            res.send(data);
        })
        .catch(function (err) {
            console.error("Error occurred: ", err)
            res.status(400).send({
                code: 400,
                error: err.message
            });
        }); 
}

function getQuickControl(req, res) {
    lightService.getQuickControl()              
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.error("Error: ", err)
            res.send({
                status: 400,
                error: err
            });
        }); 
}

function getGroupStatus(req, res) {
    lightService.getGroupStatus(req.params.id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.error("Error: ", err)
            res.status(400).send(err);
        });
}

function getGroupList(req, res) {
    console.log(req.query)
    lightService.getGroupList(req.query.start, req.query.length)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.error("Error: ", err)
            res.status(400).send(err);
        });
}
 
function updateQuickControl(req, res) {
    lightService.updateQuickControl(req.body)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            console.error("Error: ", err)
            res.status(400).send(err);
        });
}
 
function updateGroup(req, res) {
    if(req.body.stringGroupName) {
        lightService.updateGroupName(req.body)
            .then(function (user) {
                if (user) {
                    res.send(user);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function (err) {
                console.error("Error: ", err)
                res.status(400).send(err);
            });
    } else {
        lightService.updateGroupStatus(req.body)
            .then(function (user) {
                if (user) {
                    res.send(user);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function (err) {
                console.error("Error: ", err)
                res.status(400).send(err);
            });
    }
}
 