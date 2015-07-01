exports.config={
	capabilities: {
		browserName: 'chrome'
	},
	apxOpts:{
		enableTimeouts:false,
		suiteKey:"cmp"
	},
	framework:"custom",
	frameworkPath:"../apixio-mocha.js",
	specs:['specs/00*.spec.js']
};