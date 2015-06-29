/**
 * Created by ishekhtman on 6/29/15.
 */
var login = require('../pages/login'),
    mock = require("../mock-helper"),
    verbose = true,
    lastLogs = [],
    expect = require('chai').use(require('chai-as-promised')).expect,
    expected_message = {"Method":"POST","Uri":"https:\\/\\/useraccount-stg.apixio.com:7076\\/auths","Response":HTTP/1.1 403 Forbidden};

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

    /**

    it("should also be accessible at " + login.httpAddress, function () {
        return browser.get(login.httpAddress).then(function () {
            return expect(browser.getTitle()).to.eventually.eq(login.pageTitle);
        });
    });

     */



    it("should be able to fill the login form", function () {
        return login.getPage().then(function () {
            return expect(login.getFlashMessage()).to.eventually.eq(false);
        });
    });



    it('should fail to login with bad username and password', function () {
        return login.getPage().then(function () {
            return login.login('someinvaliduser', 'someinvalidpass').then(function () {
                return expect(login.getFlashMessage()).to.eventually.eq(expected_message);
            });
        });
    });

    it('should succeed to login with correct username and password', function () {
        return login.getPage().then(function () {
            return login.validLogin().then(function () {
                return expect(browser.getTitle()).to.eventually.eq(login.appTitle);
            });
        });
    });

    /**

    it('should successfully logout after login', function () {
        return login.getPage().then(function () {
            return login.login(this.validUser, this.validPass).then(function () {
                return login.logout().then(function () {
                    return expect(login.getFlashMessage()).to.eventually.include('Successfully Logged Out');
                });
            });
        });
    });

    it("should have a health check link", function () {
        return login.getHealthCheck().then(function (response) {
            var version = JSON.parse(response);
            return [
                expect(version.data).to.be.ok,
                expect(version.data.application).to.equal(login.appTitle),
                expect(version.data.version).to.match(new RegExp(".+ <br>.{40}", "i"))
            ];
        });
    });
    */
});