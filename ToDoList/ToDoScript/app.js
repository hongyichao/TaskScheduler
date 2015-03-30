
var app = angular.module("toDoApp", ['ngRoute', 'ngGrid', 'ui.bootstrap',
'itemListModule'
]);

app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/Home/ItemList',
        controller: 'itemListCtrl'
    }).when('/project', {
        templateUrl:'/Home/Projects'
    })
}]);