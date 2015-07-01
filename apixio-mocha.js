/**
 * Created by ishekhtman on 6/30/15.
 */

var q = require('q'),
    redis = require("./qaserver/modules/redis"),
    _ = require("lodash");
var redisPromise = redis.connect("127.0.0.1", 6379, {}).then(function (client) {
    return redis.initialize(client);
});
/**
 * Execute the Runner's test cases through Mocha.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function (runner, specs) {
    var Mocha = require('mocha'),
        apxOpts= _.extend({suiteKey:"apixio_suite"},runner.getConfig().apxOpts),
        mocha = new Mocha(apxOpts),
        config = _.extend({
            onStart: function () {
                redisPromise.then(function(db){
                    db.putItemInSet("running_suites", new Date().getTime(),apxOpts.suiteKey);
                });
            },
            onComplete:function(result){
                redisPromise.then(function(db){
                    db.putItemInSet(apxOpts.suiteKey+"_results",JSON.stringify(result),new Date().getTime());
                });
            }
        }, runner.getConfig());

    config.onStart();

    var deferred = q.defer();

// Mocha doesn't set up the ui until the pre-require event, so
// wait until then to load mocha-webdriver adapters as well.
    mocha.suite.on('pre-require', function (protractor, file) {
        console.log("PRE REQUIRE");
        redisPromise.catch(function (err) {
            deferred.reject(err);
        });
        try {
            // We need to re-wrap all of the global functions, which selenium-webdriver/
            // testing only does when it is required. So first we must remove it from
            // the cache.
            delete require.cache[require.resolve('selenium-webdriver/testing')];
            var mochaAdapters = require('selenium-webdriver/testing');
            global.after = mochaAdapters.after;
            global.afterEach = mochaAdapters.afterEach;
            global.before = mochaAdapters.before;
            global.beforeEach = mochaAdapters.beforeEach;

            // The implementation of mocha's it.only uses global.it, so since that has
            // already been wrapped we must avoid wrapping it a second time.
            // See Mocha.prototype.loadFiles and bdd's context.it.only for more details.
            var originalOnly = global.it.only;
            global.it = mochaAdapters.it;
            global.it.only = global.iit = originalOnly;

            global.it.skip = global.xit = mochaAdapters.xit;
        } catch (err) {
            deferred.reject(err);
        }
    });

    mocha.loadFiles();

    runner.runTestPreparer().then(function () {

        specs.forEach(function (file) {
            mocha.addFile(file);
        });

        var testResult = [];

        var mochaRunner = mocha.run(function (failures) {
            try {
                var result={
                    failedCount: failures,
                    specResults: testResult
                };
                config.onComplete(result);
                deferred.resolve(result);
            } catch (err) {
                deferred.reject(err);
            }
        });

        mochaRunner.on('pass', function (test) {
            var testInfo = {
                name: test.title,
                category: test.fullTitle().slice(0, -test.title.length).trim()
            };
            runner.emit('testPass', testInfo);
            testResult.push({
                description: test.title,
                assertions: [{
                    passed: true
                }],
                duration: test.duration
            });
        });

        mochaRunner.on('fail', function (test) {
            var testInfo = {
                name: test.title,
                category: test.fullTitle().slice(0, -test.title.length).trim()
            };
            runner.emit('testFail', testInfo);
            testResult.push({
                description: test.title,
                assertions: [{
                    passed: false,
                    errorMsg: test.err.message,
                    stackTrace: test.err.stack
                }],
                duration: test.duration
            });
        });

        mochaRunner.on("start", function () {
            console.log("START");
        });

        mochaRunner.on("suite", function () {
            console.log("SUITE");
        });
        mochaRunner.on("suite end", function () {
            console.log("SUITE end");
        });
        mochaRunner.on("test", function () {
            console.log("Test");
        });
        mochaRunner.on("test end", function () {
            console.log("Test end");
        });
        mochaRunner.on("hook", function () {
            console.log("hook");
        });
        mochaRunner.on("hook end", function () {
            console.log("hook end");
        });
    }).catch(function (reason) {
        deferred.reject(reason);
    });

    return deferred.promise;
}
;