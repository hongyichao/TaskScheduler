var itemList = angular.module('itemListModule', []);

itemList.controller('itemListCtrl', ['$scope', 'itemReq', '$modal', '$log', function ($scope, itemReq, $modal, $log) {
    $scope.filters = {projectName:""};
    $scope.$watchCollection('filters', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            itemReq.searchItems({
                projectName: newVal.projectName,
                pageSize: $scope.pagingOptions.pageSize,
                page: 1
            }).$promise.then(function (itemData) {
                $scope.totalItems = itemData.totalItems;
                $scope.myData = itemData.items;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }
    });
    $scope.selectedItems = [{}];
    $scope.myData = [
    ];
    $scope.totalItems = $scope.myData.length;
    $scope.pagingOptions = { pageSizes: [10, 20, 30], pageSize: 10, currentPage: 1 };
    $scope.filterOptions = { filterText: '', useExternalFilter: false };
    
    var toDoUpdateButtonCellTemplate = '<div class="ngCellText"  data-ng-model="row">';
    toDoUpdateButtonCellTemplate = toDoUpdateButtonCellTemplate + '<button data-ng-click="showItemModal(\'update\',row)">Edit</button> ';
    toDoUpdateButtonCellTemplate = toDoUpdateButtonCellTemplate + '</div>';

    var toDoDeleteButtonCellTemplate = '<div class="ngCellText"  data-ng-model="row">';
    toDoDeleteButtonCellTemplate = toDoDeleteButtonCellTemplate + '<button data-ng-click="showItemModal(\'delete\',row)">Delete</button> ';
    toDoDeleteButtonCellTemplate = toDoDeleteButtonCellTemplate + '</div>';

    $scope.itemGridOptions = {
        data: 'myData',
        selectedItems : $scope.selectedItems,
        enableRowSelection: true,
        multiSelect: false,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [
            { displayName: 'Project Name', field: 'ProjectName' },
            { displayName: 'Task Name', field: 'TaskName' },
            { displayName: 'Assign To', field: 'By' },
            { displayName: 'Start Time', field: 'StartTime', cellFilter: "date:'yyyy-MM-dd'" },
            { displayName: 'End Time', field: 'EndTime', cellFilter: "date:'yyyy-MM-dd'" },
            { displayName: 'Total Hours', field: 'TotalHours' },
            { displayName: 'Hours Per Day', field: 'HoursPerDay' },
            { cellTemplate: toDoUpdateButtonCellTemplate },
            { cellTemplate: toDoDeleteButtonCellTemplate }
        ],
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.populateGridData = function(newPageSize, newCurrentPage)
    {
        alert('test2');
        if ($scope.isFilterSet() === true) {
            itemReq.searchItems({
                projectName: $scope.filters.projectName,
                pageSize: newPageSize, page: newCurrentPage
            }).$promise.then(function (itemData) {
                $scope.totalItems = itemData.totalItems;
                $scope.myData = itemData.items;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
                
        } else {
            itemReq.getItems({ pageSize: newPageSize, page: newCurrentPage }, function (itemData) {
                $scope.totalItems = itemData.totalItems;
                $scope.myData = itemData.items;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }
    }

    $scope.isFilterSet = function() {
        for (x in $scope.filters)
        {
            if ($scope.filters[x].length > 0) {
                return true;
            }
        }
        return false;
    };

    $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watchCollection('pagingOptions', function (newOption, oldOption) {
        if(newOption.pageSize!==oldOption.pageSize) {
            $scope.pagingOptions.currentPage = 1;
            $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }

        if(newOption.currentPage !== oldOption.currentPage) {
            $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    });

    $scope.showItemModal = function (action, row) {
        var itemModalInstance = $modal.open({
            templateUrl: "/Home/ItemModal",
            controller: "itemModalCtrl",
            resolve: {
                reqObj: function () {
                    if(action==="add") {
                        return {action:"add",itemInstance:{}}
                    } 
                    else if (action === "update") {
                        $scope.selectedItem = {};
                        if (row.entity !== "undefined") {
                            $scope.selectedItem = row.entity;
                        }
                        return { action: "update", itemInstance: $scope.selectedItem }
                    }
                    else if (action === "delete"){
                        $scope.selectedItem = {};
                        if (row.entity !== "undefined") {
                            $scope.selectedItem = row.entity;
                        }
                        return { action: "delete", itemInstance: $scope.selectedItem }
                    }
                }
            }
        });

        if (action === "add") {
            itemModalInstance.result.then(function (anItem) {
                itemReq.addItem(anItem).$promise.then(function () {                    
                    $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                });
                $log.info(anItem.ProjectName + " | " + anItem.TaskName +" added");
            });
        }
        
        if(action==="update") {
            itemModalInstance.result.then(function (updatedItem) {
                itemReq.updateItem({ Id: updatedItem.Id },updatedItem).$promise.then(function () {
                    $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                });
            })
        }

        if (action === "delete") {
            itemModalInstance.result.then(function (deletedItem) {
                itemReq.deleteItem({ Id: deletedItem.Id }).$promise.then(function () {
                    $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                });
            })
        }
    }
}]);

itemList.controller('itemModalCtrl', ['$scope', '$modalInstance','reqObj', function ($scope, $modalInstance, reqObj) {
    $scope.isItemDisabled = false;

    if (reqObj.action === "delete")
    {
        $scope.isItemDisabled = true;
    }

    $scope.projectName = "";
    $scope.taskName = "";
    $scope.assignee = "";
    $scope.startTime = "";
    $scope.endTime = "";
    $scope.totalHours = "";
    $scope.hoursPerDay = "";

    $scope.showStartTimeCalander = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.isStartTimeCalanderOpened = true;
    }

    $scope.showEndTimeCalander = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.isEndTimeCalanderOpened = true;
    }

    if (reqObj.action === "add") {
        //alert('add');
        $scope.modalAction = "Add New Task";
        $scope.okBtnDisplayName = "Add";
    }

    if (reqObj.action === "update") {
        //alert('update');
        $scope.modalAction = "Edit Task";
        $scope.okBtnDisplayName = "Update";

        var itemInstance = reqObj.itemInstance;
        $scope.id = itemInstance.Id;
        $scope.projectName = itemInstance.ProjectName;
        $scope.taskName = itemInstance.TaskName;
        $scope.assignee = itemInstance.By;
        $scope.startTime = itemInstance.StartTime;
        $scope.endTime = itemInstance.EndTime;
        $scope.totalHours = itemInstance.TotalHours;
        $scope.hoursPerDay = itemInstance.HoursPerDay;
    }

    if (reqObj.action === "delete") {
        //alert('delete');
        $scope.modalAction = "Delete Task";
        $scope.okBtnDisplayName = "Delete";

        var itemInstance = reqObj.itemInstance;
        $scope.id = itemInstance.Id;
        $scope.projectName = itemInstance.ProjectName;
        $scope.taskName = itemInstance.TaskName;
        $scope.assignee = itemInstance.By;
        $scope.startTime = itemInstance.StartTime;
        $scope.endTime = itemInstance.EndTime;
        $scope.totalHours = itemInstance.TotalHours;
        $scope.hoursPerDay = itemInstance.HoursPerDay;
    }


    $scope.ok = function () {
        var itemToReturn = {};
        if (reqObj.action === "add") {
            itemToReturn = {
                ProjectName: $scope.projectName,
                TaskName: $scope.taskName,
                By: $scope.assignee,
                StartTime: $scope.startTime,
                EndTime: $scope.endTime,
                TotalHours: $scope.totalHours,
                HoursPerDay: $scope.hoursPerDay
            }
        }
        else {
            itemToReturn = {
                Id: $scope.id,
                ProjectName: $scope.projectName,
                TaskName: $scope.taskName,
                By: $scope.assignee,
                StartTime: $scope.startTime,
                EndTime: $scope.endTime,
                TotalHours: $scope.totalHours,
                HoursPerDay: $scope.hoursPerDay
            }
        }
        $modalInstance.close(
            itemToReturn
        );
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancelled');
    }

}]);