exports.config={
	capabilities: {
		browserName: 'chrome'
	},
	
	//mochaOpts:{
	//	reporter:'spec',
	//	enableTimeouts:false
	//},
	//framework:'mocha',
	//specs:['empty.spec.js']
	specs:['testspecs/*.spec.js']
};

