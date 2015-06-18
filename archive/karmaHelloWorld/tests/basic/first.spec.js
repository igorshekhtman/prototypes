/**
 * Created by rezaalemy on 2014-10-10.
 */
describe("karma should Work",function(){
   it("should pass this test",function(){
       expect(false).toBeFalsy();
   })
});
describe("Angular and Angular mock should be included",function(){
    beforeEach(module('ngResource'));
    it("should include Angular and Angular mock", function () {
        expect(angular).toBeDefined();
        expect(angular.mock).toBeDefined();
    });
    it("should be able to inject",inject(function($resource){
        expect($resource).toBeDefined()
    }));
});
describe("Application Sanity Suite", function () {
    beforeEach(module(function($provide,$controllerProvider){
        $controllerProvider.register('mainCtrl',function($scope){
           $scope.someValue=4;
           $scope.someFunction=function(input){
               return input.split('').reverse().join('');
           };
        });
    }));
    it(" should show that the module is present",inject(function(){

    }));
    it("should compile expressions",inject(function($rootScope,$compile){
        var $scope=$rootScope.$new();
        $scope.sum=4;
        var el=$compile("<p>2+2={{sum}}</p>")($scope);
        $scope.$digest();
        expect(el.html()).toBe("2+2=4");
    }));
    it("should get the main controller", inject(function ($rootScope,$controller) {
        var $scope=$rootScope.$new();
        var ctrl=$controller('mainCtrl',{$scope:$scope});
        expect($scope.someValue).toEqual(4);
        expect($scope.someFunction('havij')).toBe('jivah');
    }));
});
