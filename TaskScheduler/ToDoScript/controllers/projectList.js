var projectList = angular.module("projectListModule", []);

projectList.controller('projectListCtrl', ['$scope', 'projectReq', '$modal', '$log', '$timeout',
function ($scope, projectReq, $modal, $log, $timeout) {

    $scope.setSelectedMenuItem = function () {
        $timeout(function () {
            $('#tsnavbar ul li').removeClass('active');
            $('#projectMenuItem').addClass('active');
        });
    };

    $scope.setSelectedMenuItem();

    $scope.projectName = "Projects";

    $scope.myData = [];

    $scope.totalProjects = $scope.myData.length;
    $scope.pagingOptions = { pageSizes: [10, 20, 30], pageSize: 10, currentPage: 1 };
    $scope.filterOptions = { filterText: '', userExternalFilter: false };
    $scope.selectedItems = [{}];

    var projectEditButtonsTemplate = '<div class="ngCellText"  data-ng-model="row">';
    projectEditButtonsTemplate = projectEditButtonsTemplate + '<button class="btn-warning" data-ng-click="showProjectModal(\'update\',row)">Edit</button> ';
    projectEditButtonsTemplate = projectEditButtonsTemplate + '</div>';

    $scope.projectGridOptions = {
        data: 'myData',
        selectedItems: $scope.selectedItems,
        enableRowSelection: true,
        multiSelect: false,
        enablePaging: true,
        showFooter: true,
        rowHeight: 35,
        totalServerItems: 'totalProjects',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [
            { displayName: 'Project Name', field: 'Name' },
            { displayName: 'Description', field: 'Description' },
            { cellTemplate: projectEditButtonsTemplate, width: 150 }
        ],
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.populateGridData = function (newPageSize, newPage) {        
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

    $scope.showProjectModal = function (action, row) {
        var projectModalInstance = $modal.open({
            templateUrl: "/Home/ProjectModal",
            controller: "projectModalCtrl",
            resolve: {
                reqObj: function () {                    
                    if (action === "update") {
                        $scope.selectedProject = {};
                        if (row.entity !== "undefined") {
                            $scope.selectedProject = row.entity;
                        }
                        return { action: "update", projectInstance: $scope.selectedProject }
                    }
                }
            }
        });

        if (action === "update") {
            projectModalInstance.result.then(function (updatedProject) {
                projectReq.updateProject({ Id: updatedProject.Id }, updatedProject).$promise.then(function () {
                    $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                });
            });
        }

    }

}]);

projectList.controller('projectModalCtrl', ['$scope', '$modalInstance', 'reqObj',
function ($scope, $modalInstance, reqObj) {

    $scope.projectName = reqObj.projectInstance.Name;

    $scope.projectDescription = reqObj.projectInstance.Description;

    $scope.ok = function () {
        var projectToReturn = {
            Id:reqObj.projectInstance.Id,
            Name: $scope.projectName, 
            Description: $scope.projectDescription
        };

        $modalInstance.close(
                projectToReturn
            );
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancelled');
    }

}]);