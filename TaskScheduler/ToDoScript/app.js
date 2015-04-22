
var app = angular.module("toDoApp", ['ngRoute', 'ngResource', 'ngGrid', 'ui.bootstrap',
'itemListModule'
]);

app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/Home/ItemList',
        controller: 'itemListCtrl'
    }).when('/projects', {
        templateUrl: '/Home/Projects'
    });
}]);


app.factory("itemReq", ["$resource", function ($resource) {
    return $resource("api/items/:id/:pageSize/:page", null, {
        'getAllItems': { method: 'GET', isArray: true },
        'getItems':{methos:'GET'},
        'addItem': { method: 'POST' },
        'updateItem': { method: 'PUT' },
        'deleteItem': { method: 'DELETE' }
    });
}]);