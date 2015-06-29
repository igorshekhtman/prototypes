/**
 * Created by rezaalemy on 15-04-05.
 */
var _ = require("lodash"),
    util=require("util"),
    q = require("q");

module.exports = {
    //usage: mokServiceFunction
    //@param: serviceName: name of angular component
    //@param: functionName: name of function in component to mock
    //@param: spyFunction: function to replace target with. must .toString() before sending;
    //          the spy function will receive three arguments.
    //              @param: callerArgs: the arguments that the original function was called with
    //              @param: spyArgs: the rest of arguments that the mockServiceFunction was called with
    //              @param: injections: hash map of components from the module injected to the spy.
    //              in the spy, "this" will point to service.
    //@param: injections: array of names of components to inject to the spy
    //@params: rest: the rest of arguments to send to the spy, if any.
    //
    mockServiceFunction: function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(
            function () {

                var args = Array.prototype.slice.call(arguments, 3),
                    serviceName = arguments[0],
                    functionName = arguments[1],
                    fnString = arguments[2],
                    cb = args.pop(),
                    injector = angular.element(document.querySelector(".ng-scope")).injector(),
                    injections = {};

                if (!injector)
                    return cb("Failed to get injector");
                if (!injector.has(serviceName))
                    return cb("No Such Service Name: " + serviceName);
                var service = injector.get(serviceName);
                if (!service[functionName])
                    return cb("Service " + serviceName + " doesn't have a property " + functionName);

                if (arguments.length > 4)
                    angular.forEach(arguments[3], function (di) {
                        injections[di]= injector.has(di) ? injector.get(di) : null;
                    });
                if (!service.mockedProperties)
                    service.mockedProperties = {};
                if (!service.mockedProperties[functionName])
                    service.mockedProperties[functionName] = service[functionName];

                service[functionName] = function () {
                    eval("var fn=" + fnString);
                    return fn.apply(service, [arguments, args, injections]);
                };

                cb("Success");
            });
        return browser.executeAsyncScript.apply(browser, args);
    },
    //usage: injectData
    //@param: serviceName: same as mockServiceFunction
    //@param: functionName: ditto
    //@param: command: final command, can be initial (replaces data), add, end, or json (turns data to object on client side)
    //@param: data: data to send to client, as string
    injectData: function (serviceName, functionName, command, data) {
        var self = this;

        function sendChunk(buffer, cmd) {
            var chunk = buffer.substr(0, 900);
            cmd = cmd || "initial";
            if (buffer.length <= 900)
                cmd = command;
            return self.addDataToMock(serviceName, functionName, cmd, chunk).then(function (result) {
                if (result !== "Success")
                    return q.reject(result);
                if (buffer.length > 900)
                    return sendChunk(buffer.substr(900), "add");
                return result;
            });
        }

        return sendChunk(data);
    },
    addDataToMock: function (serviceName, functionName, cmd, data) {
        return browser.executeAsyncScript(function (serviceName, functionName, cmd, data, cb) {
            var injector = angular.element(document.querySelector(".ng-scope")).injector();
            if (!injector)
                return cb("Failed to get injector");
            if (!injector.has(serviceName))
                return cb("No Such Service Name: " + serviceName);
            var service = injector.get(serviceName);
            if (!service[functionName])
                return cb("Service " + serviceName + " doesn't have a property " + functionName);
            if (!service.mockedProperties)
                return cb("Service has not been mocked yet: " + serviceName);
            if (!service.mockedProperties[functionName])
                return cb("Service " + serviceName + " does not have its function mocked: " + functionName);

            var fn = service[functionName];
            if (!fn.mockData)
                if (cmd == "add")
                    fn.mockData = "";
            if (data)
                if (cmd == "initial")
                    fn.mockData = data;
                else
                    fn.mockData += data;
            if (cmd === "json")
                fn.mockData = JSON.parse(fn.mockData);
            cb("Success");
        }, serviceName, functionName, cmd, data);
    },
    clearMock: function (serviceName, functionName) {
        return browser.executeAsyncScript(function (serviceName, functionName, cb) {
            var injector = angular.element(document.querySelector(".ng-scope")).injector();
            if (!injector)
                return cb("Failed to get injector");
            if (!injector.has(serviceName))
                return cb("No Such Service Name!");
            var service = injector.get(serviceName);
            if (!service[functionName])
                return cb("Service " + serviceName + " doesn't have a property " + functionName);
            if (!service.mockedProperties)
                return cb("Service " + serviceName + " has never been Mocked!");
            if (!service.mockedProperties[functionName])
                return cb("Function " + functionName + " of Service " + serviceName + " has never been Mocked!");

            service[functionName] = service.mockedProperties[functionName];
            delete service.mockedProperties[functionName];
            cb("Success");
        }, serviceName, functionName);
    },
    findInfoLog: function (logs, filter) {
        return this.findLog(logs, "WARNING", filter);
    },
    findErrorLog: function (logs, filter) {
        return this.findLog(logs, "SEVERE", filter);
    },
    flushBrowserLogs: function () {
        return browser.executeAsyncScript(function (cb) {
            cb();
        });
    },
    getBrowserLogs: function (delay) {
        browser.sleep(delay || 10);
        return browser.manage().logs().get('browser');
    },
    findLog: function (logs, level, filter) {
        return _.find(logs, function (log) {
            if (log.level.name === level)
                if (filter)
                    return filter(JSON.parse(log.message).message.parameters, log.message);
                else
                    return true;
            return false;
        });
    },
    printLogs:function(lastLogs){
        console.log("\n", "Log: ", util.inspect(lastLogs) + "\n=========>end of log\n");
    },
    changeState:function(stateName,stateParams,options){
        if(!stateParams) stateParams="{}";
        if(!options) options="{}";
        return browser.executeAsyncScript(function(stateName,stateParams,options,cb){
            var injector = angular.element(document.querySelector(".ng-scope")).injector();
            if(!injector)
                return cb("injector not found");
            if(!injector.has("$state"))
                return cb("$state not found");
            var state=injector.get("$state");
            state.go(stateName,JSON.parse(stateParams),JSON.parse(options));
            cb("Success");
        },stateName,JSON.stringify(stateParams),JSON.stringify(options));
    }
};
