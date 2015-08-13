
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
    });
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

app.factory("itemReq", ["$resource", function ($resource) {
    return $resource("api/items/:id/:pageSize/:page", null, {
        'getAllItems': { method: 'GET', isArray: true },
        'getItems':{method:'GET'},
        'addItem': { method: 'POST' },
        'updateItem': { method: 'PUT' },
        'deleteItem': { method: 'DELETE' },
        'searchItems': { method: 'GET', url: 'api/searchItems' }
    });
}]);