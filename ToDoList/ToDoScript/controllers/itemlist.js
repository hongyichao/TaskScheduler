var itemList = angular.module('itemListModule', []);

itemList.controller('itemListCtrl', ['$scope', 'itemReq', function ($scope, itemReq) {
    
    $scope.selectedItems = [{}];
    $scope.myData = [
        { "projectName": "My Angular Project 1", taskDesc: "to do 1", hours: "3", start: "2014-11-12", end: "2015-01-15" }
    ];
    $scope.totalItems = $scope.myData.length;
    $scope.pagingOptions = { pageSizes: [10, 20, 30], pageSize: 20, currentPage: 1 };
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
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.populateGridData = function()
    {
        itemReq.get({},function (itemData) {
            
            $scope.myData = itemData;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }

    $scope.populateGridData();

}]);