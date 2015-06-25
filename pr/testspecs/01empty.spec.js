/**
 * Created by rezaalemy on 15-04-15.
 */


var login = require('../pages/login'),
    verbose = true,
    lastLogs = [];
//    expect = require('chai').use(require('chai-as-promised')).expect;

//    mock = require("../mock-helper"),

console.log("progress report test spec");

/**
describe("Progress report Login page", function () {

    afterEach(function () {
        mock.getBrowserLogs().then(function (logs) {
            lastLogs = lastLogs.concat(logs);
            var errorLog = mock.findErrorLog(logs);
            if (verbose)
                mock.printLogs(lastLogs);
            return expect(errorLog).to.not.be.ok;
        });
    });

    it("should be accessible at " + login.httpsAddress, function () {
        return browser.get(login.httpsAddress).then(function () {
            return expect(browser.getTitle()).to.eventually.eq(login.pageTitle);
        });
    });

    it("should also be accessible at " + login.httpAddress, function () {
        return browser.get(login.httpAddress).then(function () {
            return expect(browser.getTitle()).to.eventually.eq(login.pageTitle);
        });
    });

});
*/

