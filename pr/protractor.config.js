exports.config={
	capabilities: {
		browserName: 'chrome'
	},
	
	onPrepare: function() {
    // 1920x1200
    // 1280x1024
    // var width = 1920;
    // var height = 1200;
     
     //global.isAngularSite = function(flag){
     //       browser.ignoreSynchronization = !flag;
     //};
      
    
     browser.ignoreSynchronization = true;
    // browser.driver.manage().window().setSize(width, height);
     
     browser.driver.manage().window().maximize();
     
     browser.getCapabilities().then(function (cap) {
  	 browser.browserName = cap.caps_.browserName;
  	 browser.browserVersion = cap.caps_.version;
	 });
	
	//mochaOpts:{
	//	reporter:'spec',
	//	enableTimeouts:false
	//},
	//framework:'mocha',
	//specs:['empty.spec.js']
	specs:['testspecs/*.spec.js']
};

