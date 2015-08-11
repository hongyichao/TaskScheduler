var projectList = angular.module("projectListModule", []);

projectList.controller('projectListCtrl', ['$scope', function ($scope) {

    $scope.projectName = "Projects";

    $scope.myData = {};

    $scope.totalProjects = $scope.myData.length;
    $scope.pagingOptions = { pageSizes: [10, 20, 30], pageSize: 10, currentPage: 1 };
    $scope.filterOptions = { filterText: '', userExternalFilter: false };
    $scope.selectedItems = [{}];

    $scope.projectGridOptions = {
        data: 'myData',
        selectedItems: $scope.selectedItems,
        enableRowSelection: true,
        multiSelect: false,
        enablePaging: true,
        showFooter: true,
        totalServerItem: 'totalProjects',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
}]);