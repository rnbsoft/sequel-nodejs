(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('Light.IndexController', Controller)
        .directive('reset', Reset);

    /**
     * LiCy API Test Controller
     * 
     * @param {any} $window 
     * @param {any} LightService 
     * @param {any} FlashService 
     */
    function Controller($window, LightService, FlashService) {
        var vm = this;       
        vm.login = login;      
        vm.getQuickControl = getQuickControl;      
        vm.getGroupStatus = getGroupStatus;      
        vm.getGroupList = getGroupList;      
        vm.updateQuickControl = updateQuickControl;      
        vm.updateGroupStatus = updateGroupStatus;    
        vm.updateGroupName = updateGroupName;

        initController();

        function initController() {
        }

        function login() {
            console.log(vm.loginForm)
            LightService.login(vm.loginForm).then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

        function getQuickControl() {
            LightService.getQuickControl().then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

        function getGroupStatus() {
            console.log(vm.getForm)
            LightService.getGroupStatus(vm.getForm.id).then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

        function getGroupList() {
            console.log(vm.getForm)
            LightService.getGroupList(vm.getForm.start, vm.getForm.length).then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

        function updateQuickControl(value) {
            console.log(vm.quickControl, value)
            LightService.updateQuickControl(vm.quickControl).then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

        function updateGroupStatus() {
            LightService.updateGroupStatus(vm.setGroup).then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

        function updateGroupName() {
            LightService.updateGroupName(vm.setGroup).then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

        vm.modes = [
            {value: 1, text: "센서모드"},
            {value: 2, text: "주야센서모드"},
            {value: 3, text: "주변밝기모드"},
            {value: 4, text: "상시등모드"},
        ]

    }

    function Reset() {
        return function(scope, elem, attrs) {
            scope.$on('$destroy', function() {
                //console.log(scope.vm.setGroup)
                //console.log(attrs.ngModel)
                // destroy된 element 안에 변수명을 파악하기 위한 꼼수
                var key = attrs.ngModel
                Object.prop(scope, key, true)
                console.log(scope.vm.setGroup)
            })
        }
    }
})();

// get the value of the prop(dot-notated string) from obj
// delete prop if del flag is set to true
Object.prop = function(obj, prop, del){
    var props = prop.split('.')
    , final = props.pop(), p 
    while(p = props.shift()){
        if (typeof obj[p] === 'undefined')
            return undefined;
        obj = obj[p]
    }
    if(del) {
        delete obj[final]
        return undefined
    } else {
        return obj[final]
    }
}