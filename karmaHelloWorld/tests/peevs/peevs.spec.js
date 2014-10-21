/**
 * Created by rezaalemy on 2014-10-11.
 */
describe("Testing Peeves Application",function(){
    var $scope;
    var $httpBackend;
    var serverResponse='';
    beforeEach(module('Peeves'));
    beforeEach(inject(function($rootScope,_$httpBackend_){
        $scope=$rootScope.$new();
        $httpBackend=_$httpBackend_;
        jasmine.getFixtures().fixturesPath='base/tests/';
        var f=readFixtures('serverResponse.txt');
        serverResponse=f;
        $httpBackend.when('GET','/api/reportData').respond(200,serverResponse);
    }));
    it("should have a factory to query the report data", inject(function (reportService) {
            //will fail if no report Service
    }));
    it("should get data from the server after querying the report resource",function(done){
        inject(function(reportService) {
            var query = '';
            expect(serverResponse.length).toBeGreaterThan(0);
            $httpBackend.expectGET('/api/reportData').respond(200, serverResponse);
            reportService.get({},function(data){
                query=data;
                expect(query.length).toEqual(serverResponse.length);
            });
            $httpBackend.flush();
        });
    });

    xit("should Have a controller that instantiates the factory and gets report data",inject(function($controller,reportService){
        $httpBackend.expectGET('/api/reportData').respond(200,serverResponse);

        var controller=$controller('reportController',{$scope:$scope,reportService:reportService});
        $httpBackend.flush();
        expect($scope.rawData.length).toEqual(serverResponse.length);
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

