require('rootpath')()
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('server/models')
const config = require('config.json')

const ENCRYPT_HASH = 10;

var service = {};
 
service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
 
module.exports = service;

function authenticate(username, password) {
 
    return db.user
        .findOne({ where: {username: username }})
        .then(
            function (result) {
                var user = result.dataValues
                console.info("User being authenticated: ", user)
                if (user && bcrypt.compareSync(password, user.password)) {
                    // authentication successful
                    return jwt.sign({ sub: user.id }, config.secret)
                } else {
                    // authentication failed
                    return false;
                }
            },
            function (err) {
                return false;
            })
}
 
function getById(id) { 
    return db.user
        .findOne({
                where: {id: id},
                attributes: ['id', 'firstname', 'lastname', 'username']
        })
        .then(user => {
            //console.info("Current User: ", user);
            return user;
        });
}
 
function create(userParam) { 
    // setup password
    var user = _.omit(userParam, 'password');
    user.password = encryptPassword(userParam.password);

    // transaction to rollback when user is already present
    return db.sequelize.transaction(function(t) {
        return db.user
            .findOrCreate({
                where: {
                    username: userParam.username
                },
                defaults: user,
                transaction: t
            })
            .spread((result, created) => {
                console.info("user authentication findOrCreate result object : ", result.get({plain:true}))
                console.info("user authentication findOrCreate created boolean : ", created)
                if(created) {
                    return result.get({plain:true})
                } else {
                    // username already exists
                    return 'Username "' + userParam.username + '" is already taken';
                }
            })
    });
}
 
function update(id, userParam) {
    // set encrypted password when password needs change
    if(userParam.password) userParam.password = encryptPassword(userParam.password)
    // transaction for the update process
    return db.sequelize.transaction(function(t) {
        var result = {};          
        return db.user
            .find({
                    where: {username: userParam.username},
                    attributes: ['username'],
                    transaction: t
            })
            .then(user => { 
                // when user with the username is found
                if(user) {
                    console.info("update.findOne user: ", user)
                    // check username is not duplicate     
                    if(user.username !== userParam.username) {
                        // username already exists
                        result.error = 'Username "' + req.body.username + '" is already taken'
                    } else {
                        result = updateUser(t)
                    }
                } else {
                    result = updateUser(t)
                }
                return result;
            })
            // When error occurs
            .catch(function(err) {
                result.error = err
                return result
            })
    });

    function updateUser(t) {
        var result = {};    
        // update password if it was entered
        if (userParam.password) {
            userParam.password = encryptPassword(userParam.password);
        }
        // give fields a null value if value is null
        if (!userParam.firstname) userParam.firstname = null
        if (!userParam.username) userParam.username = null
        if (!userParam.username) userParam.username = null

        return db.user
            .update({
                firstname: userParam.firstname,
                lastname: userParam.lastname,
                username: userParam.username,
                password: userParam.password
            }, {
                where: {
                    id: id
                },
                transaction: t
            })
            .then(function(data) {
                result.success = data
                return result
            })
            .catch(function(err) {
                result.error = err
                return result
            })
    }
}
 
// prefixed function name with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    var result = {};
    return db.sequelize.transaction(function(t) {
        return db.user
            .destroy({ 
                where: { id: id },
                transaction: t
            })
            .then(data => {
                if (data) result.success = id + " row deleted";   
                else result.error = "User was not found"          
                return result;
            })
            .catch(function(err) {
                result.error = err
                return result;
            })
    })
}

function encryptPassword(password) {
    return bcrypt.hashSync(password, ENCRYPT_HASH);
}