exports.config={
	capabilities: {
		browserName: 'chrome'
	},
	
	onPrepare: function() {

      
    
     browser.ignoreSynchronization = true;

	 };
	
	//mochaOpts:{
	//	reporter:'spec',
	//	enableTimeouts:false
	//},
	//framework:'mocha',
	//specs:['empty.spec.js']
	specs:['testspecs/*.spec.js']
};

