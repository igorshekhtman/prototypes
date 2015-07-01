var express = require('express'),
    exec = require('child_process').exec,
    router = express.Router();

var basePath = '/usr/local/share/protractor/',
    protractorScript = "run_protractor.sh",
    runningSuites = "running_suites",
    appTitle = "Apixio QA Server";

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: appTitle, angularApp: ""});
});


router.get('/runtest/:test_suite', function (req, res) {
    var ts = req.params.test_suite;

    req.redis.getItemFromSet(runningSuites, req.params.test_suite).then(function (id) {
        if (id)
            return showSuite();
        else
            return runSuite();
    });

    function showSuite() {
        res.render("test_results", {title: appTitle, test_suite: ts, angularApp: "TestResults"});
    }

    function runSuite() {
        exec(basePath + ts + protractorScript, function () {
        });
        showSuite();
    }
});

module.exports = router;
