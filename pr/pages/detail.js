/**
 * Created by rezaalemy on 15-04-15.
 */

var mock = require("../mock-helper"),
    _ = require("lodash"),
    meta = require("../fixtures/metadata");

function decorate(el) {
    el.noSlice = function () {
        return el.element(by.css(".glyphicon-minus")).isPresent();
    };
    el.getParent = function (tag) {
        if (!tag) tag = "*";
        return el.element(by.xpath("ancestor::" + tag + "[1]"));
    };
    return el;
}

function getPanel(panel) {
    return element(by.cssContainingText("h4", panel))
        .element(by.xpath("ancestor::div" +
        "[contains(concat(' ', normalize-space(@class), ' '), ' panel ')]"));
}

function getSelect(el) {
    el.options = el.all(by.css("option"));
    el.selectedOption = el.element(by.css("option[selected]"));
    el.selectedValue = el.selectedOption.getAttribute("value");
    return el;
}

function decorateDate(el) {
    el.Value = el.getAttribute("value");
    el.hourValue = el.Value.then(function (time) {
        if (time && time.indexOf(":") > -1)
            return time.split(":")[0].trim();
        return "";
    });
    el.minValue = el.Value.then(function (time) {
        if (time && time.indexOf(":") > -1)
            return time.split(":")[1].split(" ")[0].trim();
        return "";
    });
    return el;
}

function DetailPage(data) {
    this.data = data;
}

DetailPage.prototype = {
    go: function () {
        return mock.changeState("ProjectDetail.view",
            {projectId: this.data.project.projectId},
            {location: false});
    },

    mockRestCall: function () {
        return meta.mockRestCall(this.data);
    },

    customerList: function () {
        var self = this;
        return this.data.projects.reduce(function (m, project) {
            var ref = self.getReference(project.projectId);
            if (!ref)
                return m;
            if (!m[ref.customerId])
                m[ref.customerId] = [];
            m[ref.customerId].push(project);
            return m;
        }, {});
    },

    countCustomers: function () {
        return Object.keys(this.customerList(this.data)).length;
    },

    dosStart: function (reference) {
        return meta.to.date(reference.dosStart, true);
    },

    dosEnd: function (reference) {
        return meta.to.date(reference.dosEnd, true);
    },

    getAcceptanceRate: function (project) {
        return meta.to.rate(project.metrics.submittableCodes / project.metrics.coderHours);
    },

    getAcceptanceRatio: function (project) {
        return meta.to.ratio(project.metrics.oppsAccepted / project.metrics.oppsAnnotated);
    },

    getActiveCoders: function (project) {
        return this.projectActiveCoders(this.data.coders, project.projectId).length.toString();
    },

    getAssignedCoders: function () {
        return Object.keys(this.getCoderMap(this.data.project_coder)).length.toString();
    },

    getCodingRate: function (project) {
        return meta.to.rate(project.metrics.CWIAnnotated / project.metrics.coderHours);
    },

    getCodingYield: function (project) {
        return meta.to.ratio(project.metrics.CWIAccepted / project.metrics.CWIAnnotated);
    },

    getCoderCost: function (project) {
        return meta.to.dollar(project.metrics.coderCost);
    },

    getCoderHours: function (project) {
        return meta.to.number(project.metrics.coderHours) + " Hrs";
    },

    getCoderMap: function (project_coder) {
        return _.reduce(project_coder.metrics, function (result, metric, id) {
            _.each(metric, function (v, coder) {
                if (!result[coder])
                    result[coder] = {};
                result[coder][id] = v;
            });
            return result;
        }, {});
    },

    getCodersActive: function (panel) {
        return decorate(panel.element(by.binding("activeCoders()")));
    },

    getCodersAssigned: function (panel) {
        return decorate(panel.element(by.binding("assignedCoders()")));
    },

    getCodingStart: function (project, format) {
        if (!format) format = "M/D/YYYY, h:mm:ss A";
        return meta.to.date(project.metrics.coderStartDate, format);
    },

    getCWIAccepted: function (project) {
        return meta.to.number(project.metrics.CWIAccepted, 0);
    },

    getCwiAcceptRate: function (project) {
        return meta.to.rate(project.metrics.CWIAccepted / project.metrics.coderHours);
    },

    getCWIAnnotated: function (project) {
        return meta.to.number(project.metrics.CWIAnnotated, 0);
    },

    getCwiProgress: function (project) {
        return meta.to.ratio(project.metrics.CWIAnnotated /
        (project.metrics.CWIRemaining + project.metrics.CWIAnnotated));
    },

    getCWIRejected: function (project) {
        return meta.to.number(project.metrics.CWIRejected, 0);
    },

    getCWIRemaining: function (project) {
        return meta.to.number(project.metrics.CWIRemaining, 0);
    },

    getCWISkipped: function (project) {
        return meta.to.number(project.metrics.CWISkipped, 0);
    },

    getItem: function (panel, metric, slice) {
        var binding = 'cloud("' + metric + '"' + (slice ? ",true)" : ")");
        return decorate(panel.element(by.binding(binding)));
    },

    getOppsAccepted: function (project) {
        return meta.to.number(project.metrics.oppsAccepted, 0);
    },

    getOppsAnnotated: function (project) {
        return meta.to.number(project.metrics.oppsAnnotated, 0);
    },

    getOppsCreated: function (project) {
        return meta.to.number(project.metrics.oppsCreated, 0);
    },

    getOppsReviewedRatio: function (project) {
        return meta.to.ratio(project.metrics.oppsAnnotated / project.metrics.oppsCreated);
    },

    getOverturnRatio: function (project) {
        return meta.to.ratio(project.metrics.overturns / project.metrics.oppsAnnotated);
    },

    getOverturns: function (project) {
        return meta.to.number(project.metrics.overturns, 0);
    },

    getPercentBudget: function (project) {
        return meta.to.ratio(project.metrics.coderCost / project.budget);
    },

    getProjectYield: function (project) {
        return meta.to.ratio(project.metrics.submittableCodes / project.metrics.oppsCreated);
    },

    getQWIAnnotated: function (project) {
        return meta.to.number(project.metrics.QWIAnnotated, 0);
    },

    getRafPerHour: function (project) {
        var ref = this.getReference(project.projectId);
        return meta.to.rate(project.metrics.submittableCodes * ref.rawRaf / project.metrics.coderHours);
    },

    getReference: function (projectId) {
        return _.find(this.data.reference, function (ref) {
            return ref.id === projectId;
        });
    },

    getReferenceDeadline: function (reference) {
        return "Deadline: " + meta.to.date(reference.deadline, true);
    },

    getSubmittableCodes: function (project) {
        return meta.to.number(project.metrics.submittableCodes, 0);
    },

    getTimeDetails: function (value) {
        return _.reduce(["h", "hh", "H", "HH", "m", "mm", "DD",
            "M/D/YY", "h:mm A", "MM/DD/YYYY", "hh:mm A"], function (r, key) {
            r[key] = meta.to.date(value, key);
            return r;
        }, {});
    },

    getTooltip: function (panel) {
        return panel.element(by.css("div.tooltip"));
    },

    getTotalBudget: function (project) {
        return meta.to.dollar(project.budget, 0);
    },

    getTotalCWI: function (project) {
        return meta.to.number(project.metrics.CWIAnnotated + project.metrics.CWIRemaining, 0);
    },

    getTotalRAF: function (project) {
        var ref = this.getReference(project.projectId);
        return meta.to.number(project.metrics.submittableCodes * ref.rawRaf);
    },

    lastActivity: function (project) {
        return meta.to.date(project.metrics.coderLastDate);
    },

    projectActiveCoders: function (coders, projectId) {
        return _.filter(coders, function (coder) {
            return coder.projectId === projectId;
        });
    }
};

Object.defineProperties(DetailPage.prototype, {
    project: {
        get: function () {
            return this.data.project;
        }
    },
    breadcrumb: {
        get: function () {
            return element(by.css("ol.breadcrumb"));
        }
    },
    header: {
        get: function () {
            return element(by.css("div[from-template='partial/project_header']"));
        }
    },
    summary: {
        get: function () {
            return getPanel("Project Detail");
        }
    },
    productivity: {
        get: function () {
            return getPanel("Productivity");
        }
    },
    progress: {
        get: function () {
            return getPanel("Coding Progress");
        }
    },
    quality: {
        get: function () {
            return getPanel("Quality");
        }
    },
    customerSelector: {
        get: function () {
            return getSelect(element(by.model("cloudData.selectedCustomer")));

        }
    },
    projectSelector: {
        get: function () {
            return getSelect(element(by.model("cloudData.selectedProject")));
        }
    },
    projectInfo: {
        get: function () {
            return element(by.css("span.project-info"));
        }
    },
    tsCheckbox: {
        get: function () {
            return element(by.model("$state.slice.active"));
        }
    },
    tsBox: {
        get: function () {
            return decorate(this.tsCheckbox).getParent("div");
        }
    },
    tsStartDate: {
        get: function () {
            return decorateDate(this.tsBox.element(by.css('[ng-model="$state.slice.start"][bs-datepicker]')));
        }
    },
    tsStartTime: {
        get: function () {
            return decorateDate(this.tsBox.element(by.css('[ng-model="$state.slice.start"][bs-timepicker]')));
        }
    },
    tsToNow: {
        get: function () {
            return this.tsBox.element(by.css("button.time-slice"));
        }
    },
    tsEndDate: {
        get: function () {
            return decorateDate(this.tsBox.element(by.css('[ng-model="$state.slice.end"][bs-datepicker]')));
        }
    },
    tsEndTime: {
        get: function () {
            return decorateDate(this.tsBox.element(by.css('[ng-model="$state.slice.end"][bs-timepicker]')));
        }
    },
    lastCoderActivity: {
        get: function () {
            return element(by.binding('cloud("coderLastDate",true)'));
        }
    },
    deadline: {
        get: function () {
            return element(by.binding('cloud("deadline",true)'));
        }
    },
    passType: {
        get: function () {
            return element(by.binding('cloud("passType",true)'));
        }
    },
    dataSource: {
        get: function () {
            return element(by.binding('cloud("dataSource",true)'));
        }
    },
    dateOfService: {
        get: function () {
            return element(by.binding('cloud("dosStart",true)'));
        }
    },
    paymentYear: {
        get: function () {
            return element(by.binding('cloud("paymentYear",true)'));
        }
    }
});

module.exports = function (data) {
    return new DetailPage(data);
};
