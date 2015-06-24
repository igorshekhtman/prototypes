/**
 * Created by rezaalemy on 15-04-14.
 */

var mock = require("../mock-helper"),
    _ = require("lodash"),
    meta = require("../fixtures/metadata");

function LandingPage() {

}


function turnToHours(input) {
    var hours = Math.floor(input);
    if (hours < 10) hours = "0" + hours;
    var mins = Math.floor((input % 1) * 60);
    if (mins < 10) mins = "0" + mins;
    return hours + ":" + mins;
}

LandingPage.prototype = {
    to: meta.to,
    mockRestCall: function (mockData) {
        return mock.mockServiceFunction("modelServer", "restCall", meta.restCallSpy, ["$q"]).then(function (result) {
            if (result !== "Success")
                throw result;
            return mock.injectData("modelServer", "restCall", "end", JSON.stringify(mockData));
        });
    },
    forceReload: function () {
        return browser.executeAsyncScript(function (cb) {
            var scope = angular.element(document.querySelector(".ng-scope")).scope();
            if (!scope)
                return cb("Failed to get scope");
            scope.$emit("forceReload");
            scope.$emit("showAlert", false);
            cb("Success");
        });
    },
    hoursAgo: function (input) {
        var d = new Date(parseInt(input));
        return turnToHours(((new Date()).getTime() - d.getTime()) / 3600000);
    },
    getMostRecent: function (coders) {
        return _.max(coders, function (coder) {
            return coder.last;
        });
    },
    getProjectName: function (projectId, data) {
        return _.find(data, function (project) {
            return project.projectId === projectId;
        }).projectName;
    },
    validProjects: function (data) {
        return _.filter(data.projects, function (project) {
            return _.find(data.reference, function (ref) {
                return ref.id === project.projectId;
            });
        });
    },
    getHeader: function (projectBox) {
        return projectBox.element(by.css(".panel-heading .panel-title"));
    },
    getBody: function (box) {
        return box.element(by.css(".panel-body"));
    },
    getRecentProject: function (projects) {
        return meta.getRecentProject(projects);
    },
    getCells: function (header) {
        return header.all(by.css("td"));
    },
    getPanelName: function (project) {
        return project.element(by.css(".panel-title h4 a[ui-sref]")).getText();
    },
    getMatchingReference: function (panel, projects) {
        return this.getPanelName(panel).then(function (name) {
            return _.find(projects, function (project) {
                return project.name.toUpperCase() === name.toUpperCase();
            });
        });
    },
    getMatchingProject: function (panel, projects) {
        return this.getPanelName(panel).then(function (name) {
            return _.find(projects, function (project) {
                    return project.projectName.toUpperCase() === name.toUpperCase();
                }) || console.log(name, "Not found!!");
        });
    },
    getPassType: function (panel) {
        return this.getCells(this.getHeader(panel)).get(0);
    },
    getRafTarget: function (panel) {
        return this.getCells(this.getHeader(panel)).get(1);
    },
    getTotalBudget: function (panel) {
        var header = this.getCells(this.getHeader(panel));
        return header.count().then(function (count) {
            return header.get(count - 1).getText();
        });
    },
    getCWIAnnotated: function (panel) {
        return this.getCells(this.getBody(panel)).get(0);
    },
    getOppsAccepted: function (panel) {
        return this.getCells(this.getBody(panel)).get(1);
    },
    getSubmittableCodes: function (panel) {
        return this.getCells(this.getBody(panel)).get(2);
    },
    getCoderHours: function (panel) {
        return this.getCells(this.getBody(panel)).get(3);
    },
    getCoderCost: function (panel) {
        return this.getCells(this.getBody(panel)).get(4);
    },
    getLastDate: function (panel) {
        return this.getBody(panel).element(by.css(".pull-right small"));
    },
    showMetric: function (p, m) {
        return meta[m].show(p, this);
    },
    clickOnProject: function (idx) {
        return this.projects.get(idx).element(by.css(".panel-heading .panel-title a")).click();
    },
    perpCoders: function (mockData) {
        //TODO:touch coder first and last to test the colors of activity icon;
        var coders = mockData.coders.sort(function (a, b) {
            var l = b.last || 0,
                r = a.last || 0;
            return l - r;
        }),
            t=new Date().getTime();
        _.each(coders,function(coder,index){
            if(index<2)
                coder.last= t-(3 * (index +1) * 60000);
            else
                coder.last= t-(31 * 60000);
        });
        return mockData.coders;
    },
    getCoder: function (index) {
        var el = this.activeCoders.get(index);
        el.icon = el.element(by.css(".glyphicon-user"));
        el.getModel = function (coders) {
            return el.element(by.css("span.nowrap")).getText().then(function (email) {
                email = email.trim();
                return _.find(coders, function (coder) {
                    return coder.coderId === email
                });
            });
        };
        return el;
    },
    getTooltip: function () {
        return element(by.css("div.tooltip"));
    }
};
Object.defineProperties(LandingPage.prototype, {
    coderList: {
        get: function () {
            return element(by.css(".col-sm-3.contained-list"));
        }
    },
    projectList: {
        get: function () {
            return element(by.css(".col-sm-9.contained-list"));
        }
    },
    activeCoders: {
        get: function () {
            return this.coderList.all(by.css("li.coder-item"));
        }
    },
    projects: {
        get: function () {
            return this.projectList.all(by.css(".panel"));
        }
    },
    breadcrumb: {
        get: function () {
            return element(by.css("ol.breadcrumb"));
        }
    }
});

module.exports = new LandingPage();