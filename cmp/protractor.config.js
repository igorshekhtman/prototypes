exports.config={
	capabilities: {
		browserName: 'chrome'
	},

    //restartBrowserBetweenTests: true,

	onPrepare: function() {

        //var width = 1280;
        //var height = 1024;
        //browser.ignoreSynchronization = true;
        //browser.driver.manage().window().setSize(width, height);
	},

	apxOpts:{
		enableTimeouts:false,
		suiteKey:"cmp"
	},
	framework:'custom',
	frameworkPath:"../mocha.js",
	specs:['specs/00*.spec.js']
};