exports.config={
	capabilities: {
		browserName: 'chrome'
	},
	
	seleniumAddress: 'http://localhost:9000/wd/hub',
	
	//mochaOpts:{
	//	reporter:'spec',
	//	enableTimeouts:false
	//},
	//framework:'mocha',
	//specs:['empty.spec.js']
	specs:['testspecs/*.spec.js']
};

