exports.config={
	capabilities: {
		browserName: 'chrome'
	},
	
	onPrepare: function() {

      
    
     browser.ignoreSynchronization = true;
     browser.driver.manage().window().maximize();
     browser.getCapabilities().then(function (cap) {
  	 browser.browserName = cap.caps_.browserName;
  	 browser.browserVersion = cap.caps_.version;
	 });

	 },
	
	//mochaOpts:{
	//	reporter:'spec',
	//	enableTimeouts:false
	//},
	//framework:'mocha',
	//specs:['empty.spec.js']
	//specs:['testspecs/*.spec.js']
	specs:['testspecs1/*.spec.js']
	//specs:['specs/*.spec.js']
};

