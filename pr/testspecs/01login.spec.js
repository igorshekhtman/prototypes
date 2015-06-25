/**
 * Created by igorshekhtman on 25-06-15.
 */
 
 
//console.log("progress report test spec - Igor");

//describe('Apixio HCC homepage', function() {

//  it('should open HCC application', function() {
  //  browser.get('google.com');
//    browser.driver.get('https://hccstage2.apixio.com/account/login/');
    
//    console.log("progress report test spec - Igor");    


//  });

//});


describe('Apixio HCC homepage', function() {
  it('should open HCC application', function() {
    browser.driver.get('https://hccstage2.apixio.com/account/login/');

    //element(by.model('yourName')).sendKeys('Julie');
    //element(by.css('input[name="username"]')).getAttribute('value');

    //var greeting = element(by.binding('yourName'));

    //expect(greeting.getText()).toEqual('Hello Julie!');
    expect(browser.driver.getTitle()).toEqual('Apixio Login Page');
  });
});
