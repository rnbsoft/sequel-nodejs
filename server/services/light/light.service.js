require('rootpath')()
const db = require('server/models')
const request = require('request-promise')
const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV || 'local'
const config = require('config.json')[env]

var service = {};
 
service.login = login;
service.getQuickControl = getQuickControl;
service.getGroupStatus = getGroupStatus;
service.getGroupList = getGroupList;
service.updateQuickControl = updateQuickControl;
service.updateGroupName = updateGroupName;
service.updateGroupStatus = updateGroupStatus;
 
module.exports = service;

var simpleLogger = {
    init: function(scriptName) {
        this.scriptName = scriptName
    },
    log: function(func, contents) {
        const timestamp = new Date().YYYYMMDDHHMMSS();
        console.log(this);
        // 파일명 생성
        const fileName = this.scriptName + '-' + func + '_result_' + timestamp + '.log'
        fs.writeFile('logs/'+fileName, contents, function(err) {
            if(err) {
                console.err(err)
            }
        })
    },
    error: function(func, contents) {
        const timestamp = new Date().YYYYMMDDHHMMSS();
        console.log(this);
        // 파일명 생성
        const fileName = this.scriptName + '-' + func + '_error_' + timestamp + '.log'
        fs.writeFile('logs/'+fileName, contents, function(err) {
            if(err) {
                console.err(err)
            }
        })
    }
}
const scriptName = path.basename(__filename, '.js')
simpleLogger.init(scriptName)

function login(param) {
    // booleanAdmin 값으 없을경우 false로 지정
    if(!param.booleanAdmin) param.booleanAdmin = 'false';
    // timestamp 생성
    param.dateProperty = new Date().toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');

    console.info("POST Url: ", config.licyUrl + '/Login')
    console.info("POST data: ", param)

    const options = {
        method: 'POST',
        //uri: config.licyUrl + '/Login',
        uri: config.licyUrl + '/posts',
        body: param,
        json: true,
        timeout: 1000
    };

    return request(options).then(function(result) {
        var contents = {
            options: options,
            contents: result
        }
        simpleLogger.log('login', JSON.stringify(contents,null,2))
        return result;
    }).catch(function(err) {
        var contents = {
            options: options,
            error: "Network Request Error",
            contents: err
        }
        simpleLogger.error('login', JSON.stringify(contents,null,2))
        throw new Error(err);
    })
}
 
function getQuickControl() { 
    const options = {
        method: 'GET',
        //uri: config.licyUrl + '/QuickControl',
        uri: config.licyUrl + '/posts',
        json: true,
        timeout: 3000
    };

    return request(options).then(function(result) {
        var contents = {
            options: options,
            contents: result
        }
        simpleLogger.log('getQuickControl', JSON.stringify(contents,null,2))
        return result;
    }).catch(function(err) {
        var contents = {
            options: options,
            error: "Network Request Error",
            contents: err
        }
        // third parameter set true to declare it is error
        simpleLogger.error('getQuickControl', JSON.stringify(contents,null,2))
        throw new Error(err);
    })
}
 
function getGroupStatus(id) { 
    const options = {
        method: 'GET',
        //uri: config.licyUrl + '/group/'+id,
        uri: config.licyUrl + '/posts/'+id,
        json: true,
        timeout: 3000
    };

    return request(options).then(function(result) {
        var contents = {
            options: options,
            contents: result
        }
        simpleLogger.log('getGroupStatus', JSON.stringify(contents,null,2))
        return result;
    }).catch(function(err) {
        var contents = {
            options: options,
            error: "Network Request Error",
            contents: err
        }
        // third parameter set true to declare it is error
        simpleLogger.error('getGroupStatus', JSON.stringify(contents,null,2))
        throw new Error(err);
    })
}
 
function getGroupList(start, length) { 
    const options = {
        method: 'GET',
        //uri: config.licyUrl + '/group',
        uri: config.licyUrl + '/posts',
        qs: {
            s: start,
            l: length
        },
        json: true,
        timeout: 3000
    };

    return request(options).then(function(result) {
        var contents = {
            options: options,
            contents: result
        }
        simpleLogger.log('getGroupList', JSON.stringify(contents,null,2))
        return result;
    }).catch(function(err) {
        var contents = {
            options: options,
            error: "Network Request Error",
            contents: err
        }
        // third parameter set true to declare it is error
        simpleLogger.error('getGroupList', JSON.stringify(contents,null,2))
        throw new Error(err);
    })
}

function updateQuickControl(param) {
    console.info("POST Url: ", config.licyUrl + '/QuickControl')
    console.info("POST data: ", param)

    const options = {
        method: 'POST',
        //uri: config.licyUrl + '/QuickControl',
        uri: config.licyUrl + '/posts',
        body: param,
        json: true,
        timeout: 1000
    };

    return request(options).then(function(result) {
        var contents = {
            options: options,
            contents: result
        }
        simpleLogger.log('updateQuickControl', JSON.stringify(contents,null,2))
        return result;
    }).catch(function(err) {
        var contents = {
            options: options,
            error: "Network Request Error",
            contents: err
        }
        simpleLogger.error('updateQuickControl', JSON.stringify(contents,null,2))
        throw new Error(err);
    })
}

function updateGroupName(param) {
    var groupId = param.id;
    console.info("POST Url: ", config.licyUrl + '/Group/' + groupId)
    console.info("POST data: ", param)
    delete param.id

    const options = {
        method: 'PUT',
        //uri: config.licyUrl + '/Group/' + groupId,
        uri: config.licyUrl + '/posts/' + groupId,
        body: {
            stringGroupName: param.stringGroupName
        },
        json: true,
        timeout: 1000
    };

    return request(options).then(function(result) {
        var contents = {
            options: options,
            contents: result
        }
        simpleLogger.log('updateGroupName', JSON.stringify(contents,null,2))
        return result;
    }).catch(function(err) {
        var contents = {
            options: options,
            error: "Network Request Error",
            contents: err
        }
        simpleLogger.error('updateGroupName', JSON.stringify(contents,null,2))
        throw new Error(err);
    })
}

function updateGroupStatus(param) {
    var groupId = param.id;    
    console.info("POST Url: ", config.licyUrl + '/Group/' + groupId)
    console.info("POST data: ", param)
    delete param.id

    const options = {
        method: 'PUT',
        //uri: config.licyUrl + '/Group/' + groupId,
        uri: config.licyUrl + '/posts/' + groupId,
        body: param,
        json: true,
        timeout: 1000
    };

    return request(options).then(function(result) {
        var contents = {
            options: options,
            contents: result
        }
        simpleLogger.log('updateGroupStatus', JSON.stringify(contents,null,2))
        return result;
    }).catch(function(err) {
        var contents = {
            options: options,
            error: "Network Request Error",
            contents: err
        }
        simpleLogger.error('updateGroupStatus', JSON.stringify(contents,null,2))
        throw new Error(err);
    })
}

// 날자를 yyyymmddhhmmss 형식으로 지정할수 있게 Date 클래스를 확장함
Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function() {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return this.getFullYear() +
               pad2(this.getMonth() + 1) + 
               pad2(this.getDate()) +
               pad2(this.getHours()) +
               pad2(this.getMinutes()) +
               pad2(this.getSeconds());
    }
});