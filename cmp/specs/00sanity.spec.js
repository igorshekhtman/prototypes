/**
 * Created by ishekhtman on 6/29/15.
 */

var config=require("../pages/config");
var expect=require('chai').use(require('chai-as-promised')).expect;
describe("Sanity Test to ensure the correctness of protractor tests",function(){
    it("Should be able to see the login page",function(){
        browser.get(config.serverAddress).then(function(){
            expect(browser.getTitle()).to.eventually.equal(config.loginTitle);
        });
    });
    it("Should be able to see the login page",function(){
        browser.get(config.serverAddress).then(function(){
            expect(browser.getTitle()).to.eventually.equal(config.loginTitle);
        });
    });
    it("Should be able to see the login page",function(){
        browser.get(config.serverAddress).then(function(){
            expect(browser.getTitle()).to.eventually.equal(config.loginTitle);
        });
    });
});