/**
 * Created by rezaalemy on 15-04-19.
 * page object for coder breakdown page of progress report
 */

var mock = require("../mock-helper"),
    _ = require("lodash"),
    meta = require("../fixtures/metadata");

function mapCoders(data) {
    return _.reduce(data.metrics, function (r, metric, id) {
        _.each(metric, function (v, coder) {
            if (!r[coder])
                r[coder] = {};
            r[coder][id] = v;
        });
        return r;
    }, {});
}

function CoderPage(data) {
    this.data = data;
    this.totalMap = mapCoders(data.project_coder);
    this.sliceMap = mapCoders(data.coder_sliced);
    this.mode="total";
}

CoderPage.prototype = {
    go: function () {
        return mock.changeState("ProjectDetail.coder",
            {projectId: this.data.project.projectId},
            {location: false});
    },

    mockRestCall: function () {
        return meta.mockRestCall(this.data);
    },

    getModel: function (email) {
        return this.map[email.trim()];
    },

    getCoderCount: function () {
        return Object.keys(this.map).length;
    },

    getCoderHours: function (model) {
        var zero=this.mode==="total"?"No Coder Hours" : "0";
        return (model.coderHours!==undefined) ?
        meta.to.number(model.coderHours) + " Hrs" :
            zero;
    },

    getCWIAnnotated: function (model) {
        var zero=this.mode==="total"?"No CWIs Annotated" : "0";
        return model.CWIAnnotated !== undefined ?
            meta.to.number(model.CWIAnnotated, 0) :
            zero;
    },

    getCWIAccepted: function (model) {
        var zero=this.mode==="total"?"No CWIs Accepted" : "0";
        return model.CWIAccepted !== undefined ?
            meta.to.number(model.CWIAccepted, 0) :
            zero;
    },

    getCodingRate: function (model) {
        var zero=this.mode==="total"?"No CWIs Annotated" : "0";
        if(!model.CWIAnnotated)
            return zero;
        return model.coderHours ?
            meta.to.rate(model.CWIAnnotated / model.coderHours):
            "Zero Coder Hours";
    },

    getCodingYield: function (model) {
        var zero=this.mode==="total"?"No CWIs Accepted" : "0";
        if(model.CWIAccepted === undefined)
            return zero;
        return model.CWIAnnotated?
            meta.to.ratio(model.CWIAccepted / model.CWIAnnotated):
            "Zero CWI Annotated";
    },

    getCrumbs: function (idx) {
        if(idx!==undefined)
            return this.breadcrumb.all(by.css("li")).get(idx);
        return this.breadcrumb.all(by.css("li"));
    },

    getRowItems: function (row) {
        var cells = row.all(by.css("td"));
        return {
            name: cells.get(0),
            hours: cells.get(1),
            annotated: cells.get(2),
            accepted: cells.get(3),
            codeRate: cells.get(4),
            codeYield: cells.get(5)
        }
    }
};

Object.defineProperties(CoderPage.prototype, {
    coderTable: {
        get: function () {
            return this.container.element(by.css("table"));
        }
    },
    coderRows: {
        get: function () {
            return this.coderTable.all(by.css("tbody tr"));
        }
    },
    container: {
        get: function () {
            return element(by.css(".coder-breakdown"));
        }
    },
    breadcrumb: {
        get: function () {
            return element(by.css(".breadcrumb"));
        }
    },
    map:{
        get:function(){
            return this.mode==="total"? this.totalMap:this.sliceMap;
        }
    },
    tsCheckbox:{
        get:function(){
            return element(by.css("input[type='checkbox']"));
        }
    }
});

module.exports = function (data) {
    return new CoderPage(data);
};
