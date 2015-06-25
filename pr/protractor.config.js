exports.config={
	capabilities: {
		'browserName': 'chrome'
	},
	framework : 'mocha',
	
	
	//specs:['empty.spec.js']
	specs:['testspecs/*.spec.js']
};
