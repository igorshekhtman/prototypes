/**
 * Created by rezaalemy on 15-04-15.
 */
var login = require("../pages/login"),
    header = require("../pages/header"),
    mock = require("../mock-helper"),
    verbose = false,
    lastLogs = [],
    expect = require('chai').use(require('chai-as-promised')).expect;

describe('Progress report Header Functionality', function () {
    before(function () {
        return login.getPage().then(function () {
            return login.validLogin().then(function () {
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

    it('should have a menu with username on it', function () {
        return expect(header.getUserMenu().getText()).to.eventually.contain(login.validUser);
    });
    it('should have a message box which is initially hidden', function () {
        return expect(header.msgBoxStatus()).to.eventually.eq(false);
    });
    it('should open the about dialog when the menu is clicked', function () {
        return header.openAbout().then(function () {
            return expect(header.msgBoxStatus()).to.eventually.eq(true);
        });
    });
    it('should close the dialog when the close button is clicked', function () {
        return header.closeAbout().then(function () {
            return expect(header.msgBoxStatus()).to.eventually.eq(false);
        });
    });
    
    // only with Chrome Browser will fail with Firefox, since 'Successfully Logged Out' is missing in Firefox browser
    //it('should Logout when clicked on log out link', function () {return header.logout().then(function () {return expect(login.getFlashMessage()).to.eventually.include('Successfully Logged Out');});});
    
    it('should Logout when clicked on log out link', function () {return header.logout().then(function () {return expect(browser.getTitle()).to.eventually.eq(login.pageTitle);});});
    
    //expect(browser.getTitle()).to.eventually.eq(login.pageTitle)
    
    
    
    
    //it( 'should successfully logout after login - login', function () {return login.getPage().then(function () {return login.login(this.validUser, this.validPass).then(function () {return login.logout().then(function () {return expect(login.getFlashMessage()).to.eventually.include('Successfully Logged Out');});});});} );
    
    after(function () {
        return login.logout();
    });
});

