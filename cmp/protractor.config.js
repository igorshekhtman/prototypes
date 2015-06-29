exports.config={
	capabilities: {
		browserName: 'chrome'
	},

	mochaOpts:{
		reporter:'spec',
		enableTimeouts:false
	},
	framework:'mocha',
	specs:['specs/00*.spec.js']
};