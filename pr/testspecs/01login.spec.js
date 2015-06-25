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
    
    /**
   // getUser: function() {
   //     return element(by.css('input[name="username"]')).getAttribute('value');
    },
    setUser:function(value){
        return element(by.css('input[name="username"]')).sendKeys(value);
    },
    getPass: function() {
        return element(by.css('input[name="password"]')).getAttribute('value');
    },
    setPass:function(value){
        return element(by.css('input[name="password"]')).sendKeys(value);
    },
    submit:function(){
        return element(by.css('input[type="submit"]')).click();
    },
    */
    
    
    
    
    
    //var userlabel = 
    //var pwlabel = 
    
    expect(browser.driver.getTitle()).toEqual('Apixio HCC Optimizer');
    expect(browser.driver.getTitle()).toEqual('Apixio HCC Optimizer');
    
    
    var user_field = element(by.css('input[name="username"]'));
    user_field.sendKeys('opprouterpl5@apixio.net');
    var pswd_field = element(by.css('input[name="password"]'));
    pswd_field.sendKeys('apixio.123');
    var login_btn  = element(by.css('input[name="login"]'));
    //element(by.css('input[name="login"]')).click();
    login_btn.click();
    
    //expect(browser.driver.getLabel()).toEqual('Username');
    //expect(browser.driver.getLabel()).toEqual('Password');
    
    
    
    
  });
});
