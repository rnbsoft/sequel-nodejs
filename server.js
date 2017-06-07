require('rootpath')();

const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const session = require('express-session')
const bodyParser = require('body-parser')
const expressJwt = require('express-jwt')
const env = process.env.NODE_ENV || 'local'
const config = require('config.json')[env]
const sequelize = require('server/models').sequelize

console.log("process.env.NODE_ENV ----> " + process.env.NODE_ENV)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/server/views')
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({secret: config.secret, resave: false, saveUninitialized: true}))
app.use(express.static('public'))
// use JWT auth
app.use('/api', expressJwt({secret: config.secret}).unless({path: ['/api/users/authenticate', '/api/users/register']}))

// routes
app.use('/login', require('server/controllers/login.controller'))
app.use('/register', require('server/controllers/register.controller'))
app.use('/app', require('server/controllers/app.controller'))
app.use('/api/users', require('server/controllers/api/users.controller'))
app.use('/api/light', require('server/controllers/api/light.controller'))


// make '/app' default routes
app.get('/', function(req, res) {
    return res.redirect('/app');
})

// server start
const server = app.listen(3000, function() {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
})