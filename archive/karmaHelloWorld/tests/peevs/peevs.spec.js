/**
 * Created by rezaalemy on 2014-10-11.
 */
describe("Testing Peeves Application", function () {
    var $scope;
    var $httpBackend;
    var serverResponse = '';
    beforeEach(module('Peeves'));
    beforeEach(inject(function ($rootScope, _$httpBackend_) {
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        jasmine.getFixtures().fixturesPath = 'base/tests/';
        serverResponse = readFixtures('serverResponse.txt');
        $httpBackend.when('GET', '/api/reportData').respond(200, serverResponse);
    }));
    it("should have a factory to query the report data", inject(function (reportService) {
        //will fail if no report Service
    }));
    it("should get data from the server after querying the report resource", inject(function (reportService) {
        var query = '';
        expect(serverResponse.length).toBeGreaterThan(0);
        $httpBackend.expectGET('/api/reportData').respond(200, ["some data"]);
        reportService.query(function (data) {
            query = data;
            expect(query[0].length).toEqual(9);
        });
        $httpBackend.flush();
    }));

    it("should Have a controller that instantiates the factory and gets report data", inject(function ($controller, reportService) {
        $httpBackend.expectGET('/api/reportData').respond(200, [serverResponse]);

        var controller = $controller('reportController', {$scope: $scope, reportService: reportService});
        $httpBackend.flush();
        expect($scope.rawData[0].length).toEqual(serverResponse.length);
        expect(controller).toBeDefined();
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

