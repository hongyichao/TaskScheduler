
var app = angular.module("toDoApp", ['ngRoute', 'ngResource', 'ngGrid', 'ui.bootstrap',
'itemListModule','projectListModule'
]);


app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/Home/ItemList',
        controller: 'itemListCtrl'
    }).when('/projects', {
        templateUrl: '/Home/Projects',
        controller: 'projectListCtrl'
    }).when('/login', {
        templateUrl: '/User/Login',
        controller: 'loginCtrl'

    }).when('/register', {
        templateUrl: '/User/Register',
        controller: 'loginCtrl'

    });
}]);

app.factory('userInfo', function () {

    var userInfo = { userName: "" };

    return {
        getUserName: function () {
            return userInfo.userName;
        },
        setUserName: function (userName) {
            userInfo.userName = userName;
        }
    };

})

app.controller('userCtrl', ['$scope', 'userInfo', function ($scope, userInfo) {
    
    $scope.userName = userInfo.getUserName();

    $scope.$watch(function () {
        return userInfo.getUserName();
    },
    function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.userName = newVal;
        }
    });

    $scope.logout = function () {
        sessionStorage.clear();        
        userInfo.setUserName("");
    };

}]);

app.service('loginservice', function ($http) {

    this.register = function (userInfo) {
        var resp = $http({
            url: "/api/Account/Register",
            method: "POST",
            data: userInfo,
        });
        return resp;
    };

    this.login = function (userlogin) {

        var resp = $http({
            url: "/Token",
            method: "POST",
            data: $.param({ grant_type: 'password', username: userlogin.username, password: userlogin.password }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return resp;
    };

});

app.controller('loginCtrl', ['$scope', 'loginservice', 'userInfo',
function ($scope, loginservice, userInfo) {

    $scope.userName = "";

    $scope.userLoginEmail = "";
    $scope.userLoginPassword = "";

    $scope.userRegisterEmail = "";
    $scope.userRegisterPassword = "";
    $scope.userRegisterConfirmPassword = "";

    $scope.registerUser = function () {

        $scope.responseData = "";

        //The User Registration Information
        var userRegistrationInfo = {
            Email: $scope.userRegisterEmail,
            Password: $scope.userRegisterPassword,
            ConfirmPassword: $scope.userRegisterConfirmPassword
        };

        var promiseregister = loginservice.register(userRegistrationInfo);

        promiseregister.then(function (resp) {
            $scope.registerResponseData = "User registration is Successfully";
            $scope.userRegisterEmail = "";
            $scope.userRegisterPassword = "";
            $scope.userRegisterConfirmPassword = "";
            window.location.href = '#/login';
        }, function (err) {
            $scope.registerResponseData = "* " + err.statusText +". ";
            if (err.data)
            {
                if (err.data.Message) {
                    $scope.registerResponseData += err.data.Message;
                }
            }
        });

    };

    $scope.loginUser = function () {

        //This is the information to pass for token based authentication
        var userLogin = {
            grant_type: 'password',
            username: $scope.userLoginEmail,
            password: $scope.userLoginPassword
        };

        var promiselogin = loginservice.login(userLogin);

        promiselogin.then(function (resp) {

            $scope.userName = resp.data.userName;
            //Store the token information in the SessionStorage
            //So that it can be accessed for other views
            sessionStorage.setItem('userName', resp.data.userName);
            userInfo.setUserName(resp.data.userName);
            sessionStorage.setItem('accessToken', resp.data.access_token);
            sessionStorage.setItem('refreshToken', resp.data.refresh_token);
            window.location.href = '#/';
        }, function (err) {

            $scope.loginResponseData = "* Invalid username or password";
        });

    };

}]);



app.factory("projectReq", ["$resource", function ($resource) {
    return $resource("api/project/:id/:pageSize/:page", null, {
        'getAllProjects': { method: 'GET', isArray: true },
        'getProjects': { method: 'GET' },
        'addProject': { method: 'POST' },
        'updateProject': { method: 'PUT' },
        'deleteProject': { method: 'DELETE' }
    });
}]);

app.service('itemReqService', ["$http", "$q", "userInfo" ,function ($http, $q, userInfo) {

    return {
        getAllItems: getAllItems,
        getItems: getItems,
        searchItems: searchItems,
        deleteItem: deleteItem,
        addItem: addItem,
        updateItem: updateItem
    };

    function getAllItems() {
        return sendRequest("/api/items", "GET", {}, {});
    }

    function getItems(pageSize, page) {
        return sendRequest("/api/items", "GET", { page: page, pageSize: pageSize }, {});        
    }

    function searchItems(projectName, pageSize, page) {        
        return sendRequest("/api/searchItems", "GET", { projectName: projectName, pageSize: pageSize, page: page },{});        
    }

    function addItem(newItem) {
        return sendRequest("/api/items", "POST", {}, newItem);
    }

    function updateItem(id, item) {
        return sendRequest("/api/items", "PUT", { id: id }, item);
    }

    function deleteItem(Id) {
        return sendRequest("/api/items", "DELETE", { Id: Id },{});
    }


    /////////////////////////////////////////////////
    function sendRequest(url, method, params, data) {
        var def = $q.defer();

        var request = $http({
            url: url,
            method: method,
            headers: getAuthHeaders(),
            params: params, 
            data: $.param(data)
        }).then(
            function (response) {
                def.resolve(response);
            },
            function (err) {                
                def.reject("Error ==> Status code: " + err.status + ". Text: " + err.statusText);
            }
        );
        return def.promise;
    }


    function getAuthHeaders() {

        var accesstoken = sessionStorage.getItem('accessToken');

        var authHeaders = {
            'Content-type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        };
        if (accesstoken) {
            authHeaders.Authorization = 'Bearer ' + accesstoken;

            userInfo.setUserName(sessionStorage.getItem('userName'));
        }

        return authHeaders
    }


    function redirectToLogin() {
        window.location.href = '#/login';
    }


}]);