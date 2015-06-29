/**
 * Created by ishekhtman on 6/29/15.
 */

describe("Sanity Test to ensure the correctness of protractor tests",function(){
    it("Should be able to see the login page",function(){
        browser.get("https://portal-stg.apixio.com").then(function(){
            console.log(browser.getTitle());
        });
    });
});