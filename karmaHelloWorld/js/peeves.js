/**
 * Created by rezaalemy on 2014-10-11.
 */
var peeves=angular.module('Peeves',['ngResource']);
peeves.controller('reportController',['$scope','reportService',function($scope,server){
    $scope.rawData=server.get();
}])
.factory("reportService",function($resource){
        return $resource('/api/reportData',{});
    });