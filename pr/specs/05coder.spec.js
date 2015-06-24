/**
 * Created by rezaalemy on 15-04-19.
 * Specs for coder page of progress report
 */

var login = require("../pages/login"),
    mockData = require("../fixtures/mock_data.json"),
    coder = require("../pages/coder")(mockData),
    mock = require("../mock-helper"),
    verbose = false,
    lastLogs = [],
    expect = require('chai').use(require('chai-as-promised')).expect;

describe("Progress Report Coder Breakdown page", function () {
    before(function () {
        return login.getPage().then(function () {
            return login.validLogin().then(function () {
                return coder.mockRestCall().then(function (result) {
                    expect(result).to.equal("Success");
                    return coder.go().then(function () {
                        return expect(coder.coderTable.isPresent()).to.be.ok;
                    });
                });
            });
        })
    });

    var errorLog;
    afterEach(function () {
        mock.getBrowserLogs().then(function (logs) {
            lastLogs = lastLogs.concat(logs);
            errorLog = mock.findErrorLog(logs);
            if (verbose)
                mock.printLogs(lastLogs);
            return expect(errorLog).to.not.be.ok;
        });
    });

    after(function () {
        if (errorLog)
            mock.printLogs(errorLog);
    });

    describe("Structure of the page", function () {

        it("Should have three breadcrumbs on top of page", function () {
            return expect(coder.getCrumbs().count()).to.eventually.eql(3);
        });
        it("Should have the first crumb as a link to overview page", function () {
            return expect(coder.getCrumbs(0).getText()).to.eventually.equal("Overview");
        });
        it("Should have the second crumb as a link to coder detail page", function () {
            return expect(coder.getCrumbs(1).getText()).to.eventually.equal("Project Detail");
        });
        it("Should have last crumb set to coder breakdown", function () {
            return expect(coder.getCrumbs(2).getText()).to.eventually.equal("Coder Breakdown");
        });

        it("Should have one row per coder", function () {
            expect(coder.coderRows.count()).to.eventually.equal(coder.getCoderCount());
        });
    });

    describe("Coder breakdown page functionality", function () {

        it("Should link the first crumb to overview page", function () {
            expect(coder.getCrumbs(0).element(by.css("a")).getAttribute("href"))
                .to.eventually.contain("/#/Overview");
        });

        it("Should link the second crumb to project detail page", function () {
            expect(coder.getCrumbs(1).element(by.css("a")).getAttribute("href"))
                .to.eventually.contain("/#/ProjectDetail/" + mockData.project_coder.projectId);
        });
    });

    var tableSuite = function () {

        var items = [];
        it("Should have the correct row information for each coder", function () {
            return coder.coderRows.each(function (row) {
                var item = coder.getRowItems(row);
                return item.name.getText().then(function (email) {
                    item.model = coder.getModel(email);
                    items.push(item);
                    return expect(item.model).to.be.ok;
                });
            });
        });

        it("should display coder hours for each coder", function () {
            items.forEach(function (item) {
                item.hours.getText().then(function (hours) {
                    expect(hours).to.equal(coder.getCoderHours(item.model));
                })
            });
        });

        it("should display CWIAnnotated for each coder", function () {
            items.forEach(function (item) {
                item.annotated.getText().then(function (metric) {
                    expect(metric).to.equal(coder.getCWIAnnotated(item.model));
                })
            });
        });

        it("should display CWI Accepted for each coder", function () {
            items.forEach(function (item) {
                item.accepted.getText().then(function (metric) {
                    expect(metric).to.equal(coder.getCWIAccepted(item.model));
                })
            });
        });

        it("should display Coding Rate for each coder", function () {
            items.forEach(function (item) {
                item.codeRate.getText().then(function (metric) {
                    expect(metric).to.equal(coder.getCodingRate(item.model));
                })
            });
        });

        it("should display Coding Yield for each coder", function () {
            items.forEach(function (item) {
                item.codeYield.getText().then(function (metric) {
                    expect(metric).to.equal(coder.getCodingYield(item.model));
                })
            });
        });
    };

    describe("Table Structure", tableSuite);

    describe("Coder breakdown time slice", function () {

        before(function () {
            coder.mode = "slice";
            return coder.tsCheckbox.click();
        });

        after(function () {
            coder.mode = "total";
            return coder.tsCheckbox.click();
        });

        describe("Coder Table in Slice", tableSuite);
    });

});