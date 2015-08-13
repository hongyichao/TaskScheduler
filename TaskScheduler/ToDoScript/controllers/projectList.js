var projectList = angular.module("projectListModule", []);

projectList.controller('projectListCtrl', ['$scope','projectReq', function ($scope, projectReq) {

    $scope.projectName = "Projects";

    $scope.myData = [];

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
        totalServerItems: 'totalProjects',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [
            { displayName: 'Project Name', field: 'Name' },
            { displayName: 'Description', field: 'Description' }
        ],
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.populateGridData = function (newPageSize, newPage) {
        /*
        projectReq.getProjects({ pageSize: newPageSize, page: newPage }, function (projectData) {
            $scope.totalProjects = projectData.TotalNumber;
            $scope.myData = projectData.Projects;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        */
        
        projectReq.getProjects({ pageSize: newPageSize, page: newPage }
            ).$promise.then(function (projectData) {
                if (projectData.TotalNumber) {
                    $scope.totalProjects = projectData.TotalNumber;
                }
                else {
                    $scope.totalProjects = projectData.Projects.length;
                }
                
                $scope.myData = projectData.Projects;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        
    };

    $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watchCollection('pagingOptions', function (newOption, oldOption) {
        if (newOption.pageSize !== oldOption.pageSize) {
            $scope.pagingOptions.currentPage = 1;
            $scope.populateGridData(newOption.pageSize, $scope.pagingOptions.currentPage);
        }
        else if(newOption.currentPage !== oldOption.currentPage) {
            $scope.populateGridData($scope.pagingOptions.pageSize, newOption.currentPage);
        }
    });

}]);