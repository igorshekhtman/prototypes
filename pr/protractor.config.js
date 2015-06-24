exports.config={
	capabilities: {
		'browserName': 'chrome'
	},
	framework : 'mocha',
	
	
	//specs:['empty.spec.js']
	specs:['/specs/*.spec.js']
};
