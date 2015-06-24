var login = require("../pages/login"),
    overview = require("../pages/overview"),
    mock = require("../mock-helper"),
    mockData = require("../fixtures/mock_data.json"),
    verbose = false,
    lastLogs = [],
    expect = require('chai').use(require('chai-as-promised')).expect;

describe("Progress report Overview page", function () {

    before(function () {
        return login.getPage().then(function () {
            return login.validLogin().then(function () {
                overview.perpCoders(mockData);
                expect(browser.getTitle()).to.eventually.eq(login.appTitle);
            });
        })
    });

    afterEach(function () {
        mock.getBrowserLogs().then(function (logs) {
            lastLogs = lastLogs.concat(logs);
            var errorLog = mock.findErrorLog(logs);
            if (verbose)
                mock.printLogs(lastLogs);
            return expect(errorLog).to.not.be.ok;
        });
    });

    describe("Mockup the backend", function () {
        it("should mock the restCall function of the modelServer", function () {
            overview.mockRestCall(mockData).then(function (result) {
                expect(result).to.equal("Success");
            });
        });
        it("should automatically refresh the page every minute", function () {
            overview.forceReload().then(function (result) {
                expect(result).to.equal("Success");
                return mock.flushBrowserLogs();
            });
        });
        it("should have intercepted restCall Function", function () {
            var calls = {};
            mock.findInfoLog(lastLogs, function (params) {
                if (params.length === 3)
                    if (params[0].value.indexOf("Intercepted restCall") > -1)
                        if (params[1].value === "/cloud/coders")
                            calls.coders = true;
                        else if (params[1].value === "/cloud/project/")
                            calls.projects = true;
                        else if (params[1].value === "/services/project")
                            calls.services = true;
            });
            return [
                expect(calls.coders).to.be.ok,
                expect(calls.projects).to.be.ok,
                expect(calls.services).to.be.ok
            ];
        });
    });


    describe("Structure of Landing Page", function () {

        it("should have a left column of active coders", function () {
            return expect(overview.coderList.isPresent()).to.eventually.be.ok;
        });

        it("should have a right column of project summaries", function () {
            return expect(overview.projectList.isPresent()).to.eventually.be.ok;
        });

        it("should have correct number of active coders on left column", function () {
            return expect(overview.activeCoders.count()).to.eventually.be.equal(mockData.coders.length);
        });

        it("should have the correct structure for each coder cell", function () {
            return overview.getCoder(0).getText().then(function (text) {
                var coder = overview.getMostRecent(mockData.coders);
                expect(text).to.contain(coder.coderId);
                expect(text).to.contain("Working on: ");
                expect(text).to.match(new RegExp(overview.getProjectName(coder.projectId, mockData.projects), "i"));
            });
        });

        it("Should set class of coder icons based on idle time",function(){
            expect(overview.getCoder(0).icon.getAttribute("class")).to.eventually.contain("working");
            expect(overview.getCoder(1).icon.getAttribute("class")).to.eventually.contain("idle");
            expect(overview.getCoder(2).icon.getAttribute("class")).to.eventually.contain("stopped");
        });

        it("Should show a tooltip when user points on the icon of coder",function(){
            return browser.actions().mouseMove(overview.getCoder(0).icon).perform().then(function(){
                return expect(overview.getTooltip().isDisplayed()).to.eventually.be.ok;
            });
        });

        it("Should show the correct contents for tooltip ",function(){
            return overview.getCoder(0).getModel(mockData.coders).then(function(model){
                return overview.getTooltip().getText().then(function(text){
                    expect(text).to.contain("Session Started:");
                    expect(text).to.contain("Idle Since:");
                    expect(text).to.contain(overview.hoursAgo(model.last));
                    expect(text).to.contain(overview.hoursAgo(model.first));
                });
            });
        });

        it("should have the correct number for valid projects", function () {
            expect(overview.projects.count()).to.eventually.be.equal(overview.validProjects(mockData).length);
        });

        it("should show the most recent project first", function () {
            var project = overview.getRecentProject(mockData.projects);
            var header = overview.getHeader(overview.projects.get(0));
            expect(header.getText()).to.eventually.match(new RegExp(project.projectName, "i"));
            expect(header.getText()).to.eventually.match(new RegExp(project.customerName, "i"));
        });
        it("should have the correct data in each project header", function () {
            return overview.projects.each(function (panel) {
                return overview.getMatchingReference(panel, mockData.reference)
                    .then(function (project) {
                        expect(overview.getPassType(panel).getText())
                            .to.eventually.equal(project.passType || "No Project Type");
                        if (project.passType == "Second Pass")
                            expect(overview.getRafTarget(panel).getText())
                                .to.eventually.equal(overview.to.number(project.raf));
                        expect(overview.getTotalBudget(panel))
                            .to.eventually.equal(overview.to.dollar(project.budget, 0) || "No Budget");
                    });
            });
        });

        it("should have the correct data in each project body", function () {
            return overview.projects.each(function (panel) {
                return overview.getMatchingProject(panel, mockData.projects)
                    .then(function (project) {
                        return [
                            expect(overview.getCWIAnnotated(panel).getText())
                                .to.eventually.equal(overview.showMetric(project, "CWIAnnotated")),
                            expect(overview.getOppsAccepted(panel).getText())
                                .to.eventually.equal(overview.showMetric(project, "oppsAccepted")),
                            expect(overview.getSubmittableCodes(panel).getText())
                                .to.eventually.equal(overview.showMetric(project, "submittableCodes")),
                            expect(overview.getCoderHours(panel).getText())
                                .to.eventually.equal(overview.showMetric(project, "coderHours")),
                            expect(overview.getCoderCost(panel).getText())
                                .to.eventually.equal(overview.showMetric(project, "coderCost")),
                            expect(overview.getLastDate(panel).getText())
                                .to.eventually.equal(overview.showMetric(project, "coderLastDate"))
                        ];
                    });
            });
        });
    });

    describe("Functionality of Landing Page", function () {
        it("Should change to the project detail page when clicked on project page", function () {
            lastLogs = [];
            return overview.clickOnProject(0).then(function () {
                return mock.flushBrowserLogs().then(function () {
                    return expect(overview.breadcrumb.isPresent()).to.eventually.be.ok;
                });
            });
        });
        it("should be in project detail page and have made correct calls", function () {
            var called = {};
            mock.findInfoLog(lastLogs, function (params) {
                if (params[0].value)
                    if (params[0].value.indexOf("Intercepted restCall") > -1)
                        if (params[1].value === "/services/project")
                            called.services = true;
                        else if (params[1].value === "/cloud/coders")
                            called.coders = true;
                        else if (params[1].value === "/cloud/project/")
                            called.projects = true;
                        else if (params[1].value.match(/.cloud.project.[^/]+$/))
                            called.project = true;
                        else if (params[1].value.match(/.cloud.project.[^/]+.coder/))
                            called.project_coder = true;
            });
            return [
                expect(called.services).to.be.ok,
                expect(called.coders).to.be.ok,
                expect(called.projects).to.be.ok,
                expect(called.project).to.be.ok,
                expect(called.project_coder).to.be.ok
            ];
        });
    });
});
