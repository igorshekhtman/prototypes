/**
 * Created by rezaalemy on 15-04-15.
 * Specs for detail page of progress report
 */

var login = require("../pages/login"),
    mockData = require("../fixtures/mock_data.json"),
    project=mockData.project,
    project_sliced=mockData.project_sliced,
    detail = require("../pages/detail")(mockData),
    mock = require("../mock-helper"),
    verbose = false,
    lastLogs = [],
    expect = require('chai').use(require('chai-as-promised')).expect;

describe("Progress report Project Detail page", function () {


    before(function () {
        return login.getPage().then(function () {
            return login.validLogin().then(function () {
                return detail.mockRestCall().then(function (result) {
                    expect(result).to.equal("Success");
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

    describe("Structure of Page", function () {

        it("Should have a breadcrumb bar", function () {
            return detail.go().then(function () {
                return expect(detail.breadcrumb.isPresent()).to.eventually.be.ok;
            });
        });

        it("Should have a project header", function () {
            return expect(detail.header.isPresent()).to.eventually.be.ok;
        });

        it("Should have a Project Details panel", function () {
            return expect(detail.summary.isPresent()).to.eventually.be.ok;
        });

        it("Should have a Productivity panel", function () {
            return expect(detail.productivity.isPresent()).to.eventually.be.ok;
        });

        it("Should have a Progress panel", function () {
            return expect(detail.progress.isPresent()).to.eventually.be.ok;
        });

        it("Should have a Quality panel", function () {
            return expect(detail.quality.isPresent()).to.eventually.be.ok;
        });
    });

    describe("Structure of Header", function () {

        it("Should have a dropdown for customers", function () {
            return expect(detail.customerSelector.isPresent()).to.eventually.be.ok;
        });

        it("Should have a dropdown for projects", function () {
            return expect(detail.projectSelector.isPresent()).to.eventually.be.ok;
        });

        it("Should have an icon for project info", function () {
            return expect(detail.projectInfo.isDisplayed()).to.eventually.be.ok;
        });

        it("Should have a checkbox for Time range", function () {
            return expect(detail.tsCheckbox.isPresent()).to.eventually.be.ok;
        });

        it("Should have a place to show last coder activity", function () {
            return expect(detail.lastCoderActivity.isPresent()).to.eventually.be.ok;
        });

        it("Should have project deadline initially hidden", function () {
            return expect(detail.deadline.isDisplayed()).not.to.eventually.be.ok;
        });

        it("Should have project type, initially hidden", function () {
            return expect(detail.passType.isDisplayed()).not.to.eventually.be.ok;
        });

        it("Should have project data source, initially hidden", function () {
            return expect(detail.dataSource.isDisplayed()).not.to.eventually.be.ok;
        });

        it("Should have project date of service range, initially hidden", function () {
            return expect(detail.dateOfService.isDisplayed()).not.to.eventually.be.ok;
        });

        it("Should have project payment year, initially hidden", function () {
            return expect(detail.paymentYear.isDisplayed()).not.to.eventually.be.ok;
        });
    });

    describe("Functionality of Header", function () {

        var reference;
        before(function () {
            reference = detail.getReference(project.projectId);
        });

        it("Should display project info when clicked on icon", function () {
            return detail.projectInfo.click().then(function () {
                return [
                    expect(detail.deadline.isPresent()).to.eventually.be.ok,
                    expect(detail.passType.isPresent()).to.eventually.be.ok,
                    expect(detail.dataSource.isPresent()).to.eventually.be.ok,
                    expect(detail.dateOfService.isPresent()).to.eventually.be.ok,
                    expect(detail.paymentYear.isPresent()).to.eventually.be.ok
                ];
            });
        });

        it("Should display the correct number of customers", function () {
            expect(detail.customerSelector.options.count())
                .to.eventually.equal(detail.countCustomers());
        });

        it("should show the correct customer name in combobox", function () {
            expect(detail.customerSelector.selectedOption.getText())
                .to.eventually.equal(project.customerName);
        });

        it("Should display the correct number of projects for customer", function () {
            return detail.customerSelector.selectedValue.then(function (customerId) {
                var projects = detail.customerList()[customerId];
                expect(detail.projectSelector.options.count())
                    .to.eventually.equal(projects.length);
            });
        });

        it("Should select the correct project in selector", function () {
            expect(detail.projectSelector.selectedOption.getText())
                .to.eventually.equal(project.projectName);
        });

        it("Should show correct project deadline", function () {
            expect(detail.deadline.getText())
                .to.eventually.equal(detail.getReferenceDeadline(reference));
        });

        it("Should show correct project pass type", function () {
            expect(detail.passType.getText())
                .to.eventually.contain(reference.passType);
        });

        it("Should show correct project data source type", function () {
            expect(detail.dataSource.getText())
                .to.eventually.contain(reference.dataSource);
        });

        it("Should show correct project Date of Service", function () {
            expect(detail.dateOfService.getText())
                .to.eventually.contain(detail.dosStart(reference));
            expect(detail.dateOfService.getText())
                .to.eventually.contain(detail.dosEnd(reference));
        });

        it("Should show the correct payment year", function () {
            expect(detail.paymentYear.getText())
                .to.eventually.contain(reference.paymentYear);
        });

        it("Should show the last recorded activity correctly", function () {
            expect(detail.lastCoderActivity.getText())
                .to.eventually.contain(detail.lastActivity(project));
        });

    });

    describe("Project Details Widget", function () {

        var panel;
        before(function () {
            panel = detail.summary;
        });

        it("Should show the correct start of coding ", function () {
            expect(detail.getItem(panel, "coderStartDate", true).getText())
                .to.eventually.equal(detail.getCodingStart(project))
        });

        it("Should show the correct number for opps created", function () {
            expect(detail.getItem(panel, "oppsCreated").getText())
                .to.eventually.equal(detail.getOppsCreated(project));
        });

        it("Should show the correct total CWI", function () {
            expect(detail.getItem(panel, "totalCWI").getText())
                .to.eventually.equal(detail.getTotalCWI(project));
        });

        it("Should show the correct total budget", function () {
            expect(detail.getItem(panel, "totalBudget", true)
                .getText()).to.eventually.equal(detail.getTotalBudget(project));
        });

        it("Should show the correct number of coders assigned", function () {
            expect(detail.getCodersAssigned(panel).getText())
                .to.eventually.equal(detail.getAssignedCoders());
        });

        it("Should show minus signs correctly when time range is clicked", function () {
            return detail.tsCheckbox.click().then(function () {
                return [
                    expect(detail.getItem(panel, "coderStartDate", true).getText())
                        .to.eventually.equal(detail.getCodingStart(project)),

                    expect(detail.getItem(panel, "totalBudget", true).getText())
                        .to.eventually.equal(detail.getTotalBudget(project)),

                    expect(detail.getItem(panel, "totalCWI").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "oppsCreated").noSlice()).to.eventually.be.ok,
                    expect(detail.getCodersAssigned(panel).noSlice()).to.eventually.be.ok
                ];
            });
        });

        after(function () {
            return detail.tsCheckbox.click();
        })
    });

    describe("Project Productivity Widget", function () {

        var panel;
        before(function () {
            panel = detail.productivity;
        });

        it("Should have Acceptance Rate", function () {
            return expect(detail.getItem(panel, "acceptanceRate").getText())
                .to.eventually.equal(detail.getAcceptanceRate(project));
        });

        it("Should have RAF per hour", function () {
            return expect(detail.getItem(panel, "rafPerHour").getText())
                .to.eventually.equal(detail.getRafPerHour(project));
        });

        it("Should have Coding Rate", function () {
            return expect(detail.getItem(panel, "coderRate", true).getText())
                .to.eventually.equal(detail.getCodingRate(project));
        });

        it("Should have Coding Yield", function () {
            return expect(detail.getItem(panel, "coderYield", true).getText())
                .to.eventually.equal(detail.getCodingYield(project));
        });

        it("Should display slice values", function () {
            return detail.tsCheckbox.click().then(function () {
                return [
                    expect(detail.getItem(panel, "acceptanceRate").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "rafPerHour").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "coderRate", true).getText())
                        .to.eventually.equal(detail.getCodingRate(project_sliced)),
                    expect(detail.getItem(panel, "coderYield", true).getText())
                        .to.eventually.equal(detail.getCodingYield(project_sliced))
                ]
            });
        });
        after(function () {
            return detail.tsCheckbox.click();
        })
    });
    describe("Quality Widget", function () {
        var panel;
        before(function () {
            panel = detail.quality;
        });

        it("Should have number of Opps overturned", function () {
            return expect(detail.getItem(panel, "overturns").getText())
                .to.eventually.equal(detail.getOverturns(project));
        });

        it("Should have Quality Work Items Annotated Count", function () {
            return expect(detail.getItem(panel, "QWIAnnotated", true).getText())
                .to.eventually.equal(detail.getQWIAnnotated(project));
        });

        it("Should have ratio of Opportunities Overturned/Opportunities Annotated", function () {
            return expect(detail.getItem(panel, "overturnRatio").getText())
                .to.eventually.equal(detail.getOverturnRatio(project));
        });

        it("Should display slice values correctly", function () {
            return detail.tsCheckbox.click().then(function () {
                return [
                    expect(detail.getItem(panel, "QWIAnnotated", true).getText())
                        .to.eventually.equal(detail.getQWIAnnotated(project_sliced)),

                    expect(detail.getItem(panel, "overturns").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "overturnRatio").noSlice()).to.eventually.be.ok
                ];
            });
        });

        after(function () {
            return detail.tsCheckbox.click();
        })
    });

    describe("Progress Widget", function () {
        var panel;
        before(function () {
            panel = detail.progress;
        });

        it("Should display Submittable Codes", function () {
            expect(detail.getItem(panel, "submittableCodes").getText())
                .to.eventually.equal(detail.getSubmittableCodes(project));
        });

        it("Should display Total Estimated RAF", function () {
            expect(detail.getItem(panel, "totalRAF").getText())
                .to.eventually.equal(detail.getTotalRAF(project));
        });

        it("Should display Project Yield", function () {
            expect(detail.getItem(panel, "projectYield").getText())
                .to.eventually.equal(detail.getProjectYield(project))
        });

        it("Should have a bar under project yield", function () {
            expect(detail.getItem(panel, "projectYield").getParent().getAttribute("class"))
                .to.eventually.contain("section-separator");
        });

        it("Should Display Active Coders for this project", function () {
            expect(detail.getCodersActive(panel).getText())
                .to.eventually.equal(detail.getActiveCoders(project));
        });

        it("Should Display Coder Hours", function () {
            expect(detail.getItem(panel, "coderHours", true).getText())
                .to.eventually.equal(detail.getCoderHours(project));
        });

        it("Should Display Percent Budget", function () {
            expect(detail.getItem(panel, "budgetSpent", true).getText())
                .to.eventually.equal(detail.getPercentBudget(project));
        });

        it("Should Display Coder Cost", function () {
            expect(detail.getItem(panel, "coderCost", true).getText())
                .to.eventually.equal(detail.getCoderCost(project));
        });

        it("Should have a bar under Coder Cost", function () {
            expect(detail.getItem(panel, "coderCost", true).getParent().getAttribute("class"))
                .to.eventually.contain("section-separator");
        });

        it("Should Display Acceptance ratio", function () {
            expect(detail.getItem(panel, "acceptance").getText())
                .to.eventually.equal(detail.getAcceptanceRatio(project));
        });

        it("Should Display Opportunities Reviewed Ratio", function () {
            expect(detail.getItem(panel, "oppsReviewed").getText())
                .to.eventually.equal(detail.getOppsReviewedRatio(project));
        });

        it("Should have a bar under Opps Reviewed Ratio", function () {
            expect(detail.getItem(panel, "oppsReviewed").getParent().getAttribute("class"))
                .to.eventually.contain("section-separator");
        });

        it("Should display a tooltip when hovered over Acceptance Ratio", function () {
            return browser.actions().mouseMove(detail.getItem(panel, "acceptance")).perform().then(function () {
                return expect(detail.getTooltip(panel).isDisplayed()).to.eventually.be.ok;
            })
        });

        it("Should show the number of opps Accepted and opps Annotated in tooltip", function () {
            expect(detail.getTooltip(panel).getText())
                .to.eventually.contain(detail.getOppsAccepted(project));
            expect(detail.getTooltip(panel).getText())
                .to.eventually.contain(detail.getOppsAnnotated(project));
        });

        it("Should display a tooltip when hovered over Opps Reviewed Ratio", function () {
            return browser.actions().mouseMove(detail.getItem(panel, "oppsReviewed")).perform().then(function () {
                return expect(detail.getTooltip(panel).isDisplayed()).to.eventually.be.ok;
            })
        });

        it("Should show the number of opps annotated and opps created in tooltip", function () {
            expect(detail.getTooltip(panel).getText())
                .to.eventually.contain(detail.getOppsAnnotated(project));
            expect(detail.getTooltip(panel).getText())
                .to.eventually.contain(detail.getOppsCreated(project));

        });

        it("Should Display CWI Progress", function () {
            expect(detail.getItem(panel, "cwiProgress").getText())
                .to.eventually.equal(detail.getCwiProgress(project));
        });

        it("Should Display CWI Accepted", function () {
            expect(detail.getItem(panel, "CWIAccepted", true).getText())
                .to.eventually.equal(detail.getCWIAccepted(project));
        });

        it("Should Display CWI Annotated", function () {
            expect(detail.getItem(panel, "CWIAnnotated", true).getText())
                .to.eventually.equal(detail.getCWIAnnotated(project));
        });

        it("Should Display CWI Acceptance Rate", function () {
            expect(detail.getItem(panel, "cwiAcceptRate", true).getText())
                .to.eventually.equal(detail.getCwiAcceptRate(project));
        });

        it("Should Display CWI Rejected", function () {
            expect(detail.getItem(panel, "CWIRejected", true).getText())
                .to.eventually.equal(detail.getCWIRejected(project));
        });

        it("Should Display CWI Skipped", function () {
            expect(detail.getItem(panel, "CWISkipped", true).getText())
                .to.eventually.equal(detail.getCWISkipped(project));
        });

        it("Should Display CWI Remaining", function () {
            expect(detail.getItem(panel, "CWIRemaining").getText())
                .to.eventually.equal(detail.getCWIRemaining(project));
        });

        it("Should display slice values correctly", function () {
            return detail.tsCheckbox.click().then(function () {
                return [
                    expect(detail.getItem(panel, "submittableCodes").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "totalRAF").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "projectYield").noSlice()).to.eventually.be.ok,
                    expect(detail.getCodersActive(panel).noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "coderHours", true).getText())
                        .to.eventually.equal(detail.getCoderHours(project_sliced)),
                    expect(detail.getItem(panel, "budgetSpent", true).getText())
                        .to.eventually.equal(detail.getPercentBudget(project_sliced)),
                    expect(detail.getItem(panel, "coderCost", true).getText())
                        .to.eventually.equal(detail.getCoderCost(project_sliced)),
                    expect(detail.getItem(panel, "acceptance").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "oppsReviewed").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "cwiProgress").noSlice()).to.eventually.be.ok,
                    expect(detail.getItem(panel, "CWIAccepted", true).getText())
                        .to.eventually.equal(detail.getCWIAccepted(project_sliced)),
                    expect(detail.getItem(panel, "CWIAnnotated", true).getText())
                        .to.eventually.equal(detail.getCWIAnnotated(project_sliced)),
                    expect(detail.getItem(panel, "cwiAcceptRate", true).getText())
                        .to.eventually.equal(detail.getCwiAcceptRate(project_sliced)),
                    expect(detail.getItem(panel, "CWIRejected", true).getText())
                        .to.eventually.equal(detail.getCWIRejected(project_sliced)),
                    expect(detail.getItem(panel, "CWISkipped", true).getText())
                        .to.eventually.equal(detail.getCWISkipped(project_sliced)),
                    expect(detail.getItem(panel, "CWIRemaining").noSlice()).to.eventually.be.ok
                ];
            });
        });

        after(function () {
            return detail.tsCheckbox.click();
        })
    });
    describe("Correct Structure and Functionality of Time Slice", function () {
        var coderStartTime, expectedLogCount;
        before(function () {
            lastLogs = [];
            coderStartTime = detail.getTimeDetails(project.metrics.coderStartDate);
            expectedLogCount = 12;
            return detail.tsCheckbox.click();
        });

        after(function () {
            return detail.tsCheckbox.click();
        });

        it("Should have a div wrap around the check box for time slice", function () {
            expect(detail.tsBox.getAttribute("class")).to.eventually.contain("col-md-8");
        });

        it("Should show the data and time selector for slice start after click on the checkbox", function () {
            return [
                expect(expectedLogCount).to.eql(lastLogs.length),
                expect(detail.tsStartDate.isDisplayed()).to.eventually.be.ok,
                expect(detail.tsStartTime.isDisplayed()).to.eventually.be.ok
            ];
        });

        it("Should show the coding start date in the slice start date as default", function () {
            return expect(detail.tsStartDate.Value).to.eventually.equal(coderStartTime["M/D/YY"]);
        });

        it("Should show the coding start time in the slice start time as default", function () {
            return expect(detail.tsStartTime.Value).to.eventually.equal(coderStartTime["h:mm A"]);
        });

        it("Should be able to change the start date", function () {
            expect(expectedLogCount).to.eql(lastLogs.length);
            return detail.tsStartDate.Value.then(function (date) {
                var curDate = (coderStartTime.DD == "10") ? 11 : 10;
                expect(new Date(date).getDate()).to.equal(parseInt(coderStartTime.DD));

                return detail.tsStartDate.click().then(function () {
                    expectedLogCount += 7;
                    return detail.tsBox.element(by.buttonText(curDate.toString())).click().then(function () {
                        return detail.tsStartDate.Value.then(function (date) {
                            expect(new Date(date).getDate()).to.equal(curDate);
                        });
                    });
                });
            });
        });

        it("Should default to coding start hour", function () {
            expect(expectedLogCount).to.eql(lastLogs.length);
            return detail.tsStartTime.hourValue.then(function (hour) {
                return expect(parseInt(hour)).to.equal(parseInt(coderStartTime.h));
            });
        });

        it("Should default to coding start minutes", function () {
            return detail.tsStartTime.minValue.then(function (mins) {
                return expect(parseInt(mins)).to.equal(parseInt(coderStartTime.m));
            });
        });

        it("Should be able to change the start time", function () {
            var selector = "tbody tr:first-child td:first-child button";
            return detail.tsStartTime.click().then(function () {
                return detail.tsBox.element(by.css(selector)).click().then(function () {
                    expectedLogCount += 7;
                    return detail.tsStartTime.hourValue.then(function (hour) {
                        expect(parseInt(hour)).not.to.equal(parseInt(coderStartTime.h));
                    });
                });
            });
        });

        it("Should be able to go back to the coder start time", function () {
            expect(expectedLogCount).to.eql(lastLogs.length);
            expect(detail.tsStartDate.Value).not.to.eventually.equal(coderStartTime["M/D/YY"]);
            expect(detail.tsStartTime.Value).not.to.eventually.equal(coderStartTime["h:mm A"]);
            return detail.tsStartDate.click().then(function () {
                return detail.tsBox.element(by.buttonText("Set To Coder Start Date")).click().then(function () {
                    expectedLogCount += 7;
                    expect(detail.tsStartDate.Value)
                        .to.eventually.equal(coderStartTime["M/D/YY"]);
                    expect(detail.tsStartTime.Value)
                        .to.eventually.equal(coderStartTime["h:mm A"]);
                });
            });
        });

        it("Should have a button showing the current data and time as end of slice by default", function () {
            expect(expectedLogCount).to.eql(lastLogs.length);
            var now = detail.getTimeDetails(new Date());
            expect(detail.tsToNow.getText()).to.eventually.contain(now["MM/DD/YYYY"]);
            expect(detail.tsToNow.getText()).to.eventually.contain(now["hh:mm A"]);
        });

        it("Should remove the button once user clicks it and replace with date and time", function () {
            var initial = [
                expect(detail.tsToNow.isDisplayed()).to.eventually.be.ok,
                expect(detail.tsEndDate.isDisplayed()).not.to.eventually.be.ok,
                expect(detail.tsEndTime.isDisplayed()).not.to.eventually.be.ok
            ];
            return detail.tsToNow.click().then(function () {
                return initial.concat([
                    expect(detail.tsEndTime.isDisplayed()).to.eventually.be.ok,
                    expect(detail.tsEndDate.isDisplayed()).to.eventually.be.ok,
                    expect(detail.tsToNow.isDisplayed()).not.to.eventually.be.ok
                ]);
            });
        });

        it("Should show current date and time in slice end range", function () {
            var now = detail.getTimeDetails(new Date());
            expect(detail.tsEndTime.Value).to.eventually.equal(now["h:mm A"]);
            expect(detail.tsEndDate.Value).to.eventually.equal(now["M/D/YY"]);
        });

        it("Should change the slice end date ", function () {
            expect(expectedLogCount).to.eql(lastLogs.length);
            var now = detail.getTimeDetails(new Date());
            return detail.tsEndDate.Value.then(function (date) {
                var curDate = now.DD == "10" ? 11 : 10;
                expect(new Date(date).getDate()).to.equal(parseInt(now.DD));

                return detail.tsEndDate.click().then(function () {
                    return detail.tsBox.element(by.buttonText(curDate.toString())).click().then(function () {
                        expectedLogCount += 7;
                        return detail.tsEndDate.Value.then(function (date) {
                            expect(new Date(date).getDate()).to.equal(curDate);
                        });
                    });
                });
            });
        });

        it("Should change the slice end time", function () {
            expect(expectedLogCount).to.eql(lastLogs.length);
            var now = detail.getTimeDetails(new Date()),
                selector = "tbody tr:first-child td:first-child button";
            return detail.tsEndTime.click().then(function () {
                return detail.tsBox.element(by.css(selector)).click().then(function () {
                    expectedLogCount += 7;
                    return detail.tsEndTime.hourValue.then(function (hour) {
                        expect(parseInt(hour)).not.to.equal(parseInt(now.h));
                    });
                });
            });
        });

        it("Should be able to revert back to now button ", function () {
            expect(expectedLogCount).to.eql(lastLogs.length);
            var initial = [
                    expect(detail.tsToNow.isDisplayed()).not.to.eventually.be.ok,
                    expect(detail.tsEndDate.isDisplayed()).to.eventually.be.ok,
                    expect(detail.tsEndTime.isDisplayed()).to.eventually.be.ok
                ],
                now = detail.getTimeDetails(new Date());

            return detail.tsEndDate.click().then(function () {
                return detail.tsBox.element(by.buttonText("Now")).click().then(function () {
                    expectedLogCount += 7;
                    return initial.concat([
                        expect(detail.tsEndTime.isDisplayed()).not.to.eventually.be.ok,
                        expect(detail.tsEndDate.isDisplayed()).not.to.eventually.be.ok,
                        expect(detail.tsToNow.isDisplayed()).to.eventually.be.ok,
                        expect(detail.tsToNow.getText()).to.eventually.contain(now["MM/DD/YYYY"]),
                        expect(detail.tsToNow.getText()).to.eventually.contain(now["hh:mm A"])
                    ]);
                });
            });
        });

        it("Should have called the server for new data each time a change was made", function () {
            expect(expectedLogCount).to.eql(lastLogs.length);
        });
    });
});