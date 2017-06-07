(function () {
    'use strict'

    angular
        .module('app')
        .factory('LightService', Service);

        function Service($http, $q) {
            var service = {}
 
            service.login = login;
            service.getQuickControl = getQuickControl;
            service.getGroupStatus = getGroupStatus;
            service.getGroupList = getGroupList;
            service.updateQuickControl = updateQuickControl;
            service.updateGroupStatus = updateGroupStatus;
            service.updateGroupName = updateGroupName;
    
            return service;
    
            function login(data) {
                return $http.post('/api/light/login', data).then(handleSuccess, handleError);
            }
    
            function getQuickControl() {
                return $http.get('/api/light/quickcontrol').then(handleSuccess, handleError);
            }
    
            function getGroupStatus(id) {
                return $http.get('/api/light/group/' + id).then(handleSuccess, handleError);
            }
    
            function getGroupList(start, length) {
                return $http.get('/api/light/group/?start=' + start + '&length=' + length).then(handleSuccess, handleError);
            }
    
            function updateQuickControl(data) {
                return $http.post('/api/light/quickcontrol', data).then(handleSuccess, handleError);
            }
    
            function updateGroupStatus(data) {
                const param = {
                    id: data.id,
                    stringControl: data.stringControl,
                    ControlParam: data.ControlParam
                }
                return $http.post('/api/light/group', param).then(handleSuccess, handleError);
            }
    
            function updateGroupName(data) {
                const param = {
                    id: data.id,
                    stringGroupName: data.stringGroupName
                }
                return $http.post('/api/light/group', param).then(handleSuccess, handleError);
            }
    
            // private functions
    
            function handleSuccess(res) {
                return res.data;
            }
    
            function handleError(res) {
                return $q.reject(res.data);
            }
        }
        
})();