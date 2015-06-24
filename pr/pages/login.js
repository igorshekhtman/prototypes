/**
 * Created by rezaalemy on 15-03-28.
 */


var page=function(){
};
page.prototype={
    httpsAddress : "https://progressreport-stg.apixio.com",
    httpAddress : "http://progressreport-stg.apixio.com",
    validUser : 'sanitytest001@apixio.net',
    validPass : 'apixio.123',
    appTitle :"Apixio Progress Report",
    pageTitle:'Apixio Login Page',

    getPage:function(){
        return browser.get(this.httpsAddress+"/");
    },
    getFlashMessage:function(){
        var f=element(by.css('div.alert.alert-danger'));
        return f.isPresent().then(function(present){
            if(present)
                return f.getText();
            return false;
        });
    },
    getUser: function() {
        return element(by.css('input[name="username"]')).getAttribute('value');
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
    login:function(usr,pass){
        var self=this;
        return this.setUser(usr).then(function(){
            return self.setPass(pass).then(function(){
                return self.submit();
            });
        });
    },
    logout:function(){
        return browser.get(this.httpsAddress+"/logout");
    },
    validLogin:function(){
        var self=this;
        return this.getPage().then(function(){
            return self.login(self.validUser,self.validPass);
        });
    },
    assert_logged_in:function(){
        return browser.getTitle().then(function(title){
            return title===this.appTitle;
        });
    },
    getHealthCheck:function(){
        return browser.executeAsyncScript(function(cb){
            var injector=angular.element(document.querySelector("body")).injector();
            if(!injector)
                return cb('{"error":"No Injector Found"}');
            if(!injector.has("$http"))
                return cb('{"error":"No Http service"}');
            var http=injector.get("$http");
            http.get("/util/version").then(function(response){
                cb(JSON.stringify(response));
                return response;
            },function(response){
                cb(JSON.stringify(response));
                return response;
            })
        });
    }
};
module.exports=new page();