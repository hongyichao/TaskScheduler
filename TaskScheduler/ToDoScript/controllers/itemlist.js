var itemList = angular.module('itemListModule', []);

itemList.controller('itemListCtrl', ['$scope', 'itemReqService', '$modal', '$log', '$timeout', '$location', 'userInfo', 
function ($scope, itemReqService, $modal, $log, $timeout, $location, userInfo) {
    
    $scope.userName = userInfo.getUserName();

    $scope.redirectToLogin = function () {        
        $location.path('/login')
    }
    if (!sessionStorage.getItem('userName')) {
        userInfo.setUserName("");
        $scope.userName = "";
        $scope.redirectToLogin();
    }
    else if (userInfo.getUserName().length == 0) {
        $scope.redirectToLogin();
    }
    else {
        itemListCtrlAction($scope, itemReqService, $modal, $log, $timeout, $location, userInfo);
    }
    
}]);

function itemListCtrlAction($scope, itemReqService, $modal, $log, $timeout, $location, userInfo) {

    $scope.setSelectedMenuItem = function () {
        $timeout(function () {
            $('#tsnavbar ul li').removeClass('active');
            $('#taskMenuItem').addClass('active');
        });
    };

    $scope.setSelectedMenuItem();

    $scope.selectedItems = [{}];
    $scope.myData = [];
    $scope.totalItems = $scope.myData.length;
    $scope.pagingOptions = { pageSizes: [10, 20, 30], pageSize: 10, currentPage: 1 };
    $scope.filterOptions = { filterText: '', useExternalFilter: false };
    $scope.filters = { projectName: "" };

    var toDoEditButtonsTemplate = '<div class="ngCellText"  data-ng-model="row">';
    toDoEditButtonsTemplate = toDoEditButtonsTemplate + '<button class="btn-warning" data-ng-click="showItemModal(\'update\',row)">Edit</button> ';
    toDoEditButtonsTemplate = toDoEditButtonsTemplate + '<button class="btn-danger" data-ng-click="showItemModal(\'delete\',row)">Delete</button> ';
    toDoEditButtonsTemplate = toDoEditButtonsTemplate + '</div>';

    $scope.$watchCollection('filters', function (newVal, oldVal) {
        if (newVal !== oldVal) {

            if ($scope.pagingOptions.currentPage === 1) {
                $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            }
            else {
                //change current page to triget the Grid to be repopulated since $scope.pagingOptions is $watched
                $scope.pagingOptions.currentPage = 1;
            }
        }
    });

    $scope.itemGridOptions = {
        data: 'myData',
        selectedItems: $scope.selectedItems,
        enableRowSelection: true,
        multiSelect: false,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        rowHeight: 35,
        columnDefs: [
            { displayName: 'Project Name', field: 'ProjectName', width: 110 },
            { displayName: 'Task Name', field: 'TaskName', width: 110 },
            { displayName: 'Assign To', field: 'By', width: 110 },
            { displayName: 'Start Time', field: 'StartTime', cellFilter: "date:'yyyy-MM-dd'", width: 100 },
            { displayName: 'End Time', field: 'EndTime', cellFilter: "date:'yyyy-MM-dd'", width: 100 },
            { displayName: 'Total Hours', field: 'TotalHours', width: 100 },
            { displayName: 'Hours Per Day', field: 'HoursPerDay', width: 110 },
            { cellTemplate: toDoEditButtonsTemplate, width: 150 }
        ],
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.populateGridData = function (newPageSize, newCurrentPage) {
        if ($scope.isFilterSet() === true) {
            itemReqService.searchItems($scope.filters.projectName, newPageSize, newCurrentPage)
                .then(
                    function (response) {
                        var itemData = response.data;
                        $scope.totalItems = itemData.totalItems;
                        $scope.myData = itemData.items;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    },
                    function (err) {
                        console.log(err);
                    }
                );

        } else {

            itemReqService.getItems(newPageSize, newCurrentPage).then(
                function (response) {
                    itemData = response.data;
                    $scope.totalItems = itemData.totalItems;
                    $scope.myData = itemData.items;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                },
                function (err) {
                    console.log(err);
                }
            );
        }
    }

    $scope.isFilterSet = function () {
        for (x in $scope.filters) {
            if ($scope.filters[x].length > 0) {
                return true;
            }
        }
        return false;
    };
    $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.$watchCollection('pagingOptions', function (newOption, oldOption) {
        if (newOption.pageSize !== oldOption.pageSize) {
            $scope.pagingOptions.currentPage = 1;
            $scope.populateGridData(newOption.pageSize, $scope.pagingOptions.currentPage);
        }

        if (newOption.currentPage !== oldOption.currentPage) {
            $scope.populateGridData($scope.pagingOptions.pageSize, newOption.currentPage);
        }
    });



    $scope.showItemModal = function (action, row) {
        var itemModalInstance = $modal.open({
            templateUrl: "/Home/ItemModal",
            controller: "itemModalCtrl",
            resolve: {
                reqObj: function () {
                    if (action === "add") {
                        return { action: "add", itemInstance: {} }
                    }
                    else if (action === "update") {
                        $scope.selectedItem = {};
                        if (row.entity !== "undefined") {
                            $scope.selectedItem = row.entity;
                        }
                        return { action: "update", itemInstance: $scope.selectedItem }
                    }
                    else if (action === "delete") {
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
                itemReqService.addItem(anItem).then(
                    function () {
                        $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                    }
                );
                //$log.info(anItem.ProjectName + " | " + anItem.TaskName +" added");
            });
        }

        if (action === "update") {
            itemModalInstance.result.then(function (updatedItem) {
                itemReqService.updateItem(updatedItem.Id, updatedItem).then(
                    function () {
                        $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                    }
                );
            });
        }

        if (action === "delete") {
            itemModalInstance.result.then(function (deletedItem) {
                itemReqService.deleteItem(deletedItem.Id).then(
                    function () {
                        $scope.populateGridData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            });
        }
    }

}


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
        var isItemValid = true;
        if (reqObj.action === "add") {
            itemToReturn = {
                ProjectName: $scope.projectName,
                TaskName: $scope.taskName,
                By: $scope.assignee,
                StartTime: $scope.convertDateObjectToString($scope.startTime),
                EndTime: $scope.convertDateObjectToString($scope.endTime),
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
                StartTime: $scope.convertDateObjectToString($scope.startTime),
                EndTime: $scope.convertDateObjectToString($scope.endTime),
                TotalHours: $scope.totalHours,
                HoursPerDay: $scope.hoursPerDay
            }
        }

        if (reqObj.action === "add" || reqObj.action === "update") {
            isItemValid = $scope.validateRequiredFields();
            if (isItemValid) {
                isItemValid = $scope.validateIntFields();
                if(isItemValid) {
                    isItemValid = $scope.validateDateFields();
                }
            }
        }

        if (isItemValid) {
            $modalInstance.close(
                itemToReturn
            );  
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancelled');
    }

    $scope.validateRequiredFields = function () {
        if($scope.projectName.length === 0) {
            alert('Project Name is required');
            return false;
        }

        if ($scope.assignee.length === 0) {
            alert('Project assignee is required');
            return false;
        }
        return true;
    }

    $scope.validateIntFields = function()
    {
        var reg = new RegExp('^[0-9]*$');
        
        if(!reg.test($scope.totalHours)) {
            alert('Invalid total hours');
            return false;
        }

        if (!reg.test($scope.hoursPerDay)) {
            alert('Invalid hours per day');
            return false;
        }

        return true;
    }

    $scope.validateDateFields = function() {
        
        var startDtTest = new Date($scope.startTime);

        if (startDtTest.toString() === 'Invalid Date')
        {
            alert('Invalid start time: ' + $scope.startTime);
            return false;
        }

        var endDtTest = new Date($scope.endTime);

        if (endDtTest.toString() === 'Invalid Date') {
            alert('Invalid end time: ' + $scope.endTime);
            return false;
        }
        return true;
    }

    $scope.validateDateValue = function (dt) {

        if(dt instanceof Date) {
            
        }
        
    }

    $scope.convertDateObjectToString = function (dtObj)
    {
        var aDate = new Date(dtObj);
        return aDate.getFullYear() + '-' + (aDate.getMonth() + 1) + '-' + aDate.getDate();
    }
    

}]);