var itemList = angular.module('itemListModule', []);

itemList.controller('itemListCtrl', ['$scope', 'itemReq', '$modal', '$log', function ($scope, itemReq, $modal, $log) {
    
    $scope.selectedItems = [{}];
    $scope.myData = [
    ];
    $scope.totalItems = $scope.myData.length;
    $scope.pagingOptions = { pageSizes: [10, 20, 30], pageSize: 10, currentPage: 1 };
    $scope.filterOptions = { filterText: '', useExternalFilter: false };
    
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
            { displayName: 'Hours Per Day', field: 'HoursPerDay' }
        ],
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.populateGridData = function(newPageSize, newCurrentPage)
    {
        itemReq.getItems({ pageSize: newPageSize, page: newCurrentPage }, function (itemData) {
            $scope.totalItems = itemData.totalItems;
            $scope.myData = itemData.items;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }

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
                    } else {
                        $scope.selectedItem = {};
                        if ($scope.itemGridOptions.selectedItems[0]==="undefined") {
                            $scope.selectedItems = $scope.itemGridOptions.selectedItems[0];
                        }
                        return { action: "update", itemInstance: $scope.selectedItem }
                    }
                }
            }
        });

        if (action === "add") {
            itemModalInstance.result.then(function (anItem) {
                itemReq.addItem(anItem).$promise.then(function () {                    
                    $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage)
                });
                $log.info(anItem.ProjectName + " | " + anItem.TaskName +" added");
            });
        }
        
        if(action==="update") {
            
        }

        if(action==="delete") {
            
        }
    }
}]);

itemList.controller('itemModalCtrl', ['$scope', '$modalInstance','reqObj', function ($scope, $modalInstance, reqObj) {

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
    }

    if (reqObj.action === "update") {
        //alert('update');
        
    }

    if (reqObj.action === "delete") {
        //alert('delete');
        
    }

    $scope.ok = function() {
        $modalInstance.close({
            ProjectName: $scope.projectName,
            TaskName: $scope.taskName,
            By: $scope.assignee,
            StartTime: $scope.startTime,
            EndTime: $scope.endTime,
            TotalHours: $scope.totalHours,
            HoursPerDay: $scope.hoursPerDay
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancelled');
    }

}]);