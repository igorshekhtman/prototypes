/**
 * Created by ishekhtman on 6/29/15.
 */
var expect=require('chai').use(require('chai-as-promised')).expect;
describe("Sanity Test to ensure the correctness of protractor tests",function(){
    it("Should be able to see the login page",function(){
        browser.get("https://portal-stg.apixio.com").then(function(){
            browser.getTitle().then(function(title){
               expect(title).to.be.equal("Apixio Login Pag");
            });
        });
    });
});