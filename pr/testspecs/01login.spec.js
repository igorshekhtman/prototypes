/**
 * Created by igorshekhtman on 25-06-15.
 */
 
var user_field = element(by.css('input[name="username"]'));
var pswd_field = element(by.css('input[name="password"]'));
var login_btn  = element(by.css('input[name="login"]'));


describe('Apixio HCC homepage', function() {
  it('should open HCC application', function() {
    browser.driver.get('https://hccstage2.apixio.com/account/login/');  
    expect(browser.driver.getTitle()).toEqual('Apixio HCC Optimizer');
    expect(browser.driver.getTitle()).toEqual('Apixio HCC Optimizer');
    user_field.sendKeys('opprouterpl5@apixio.net');
    pswd_field.sendKeys('apixio.123');
    login_btn.click();
    expect(browser.driver.getTitle()).toEqual('HCC');   
    
  });
});
