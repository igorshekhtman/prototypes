var express = require('express'),
exec = require('child_process').exec;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Apixio QA Server' });
});

router.get('/runtest/:test_suite', function(req, res, next) {
  exec('/usr/local/share/protractor/'+req.params.test_suite+'/run_protractor.sh', function(error, output) {
    if (error)
      res.send('Error has happened when running test suites '+req.params.test_suite+' '+error);
    else 
      res.send('<pre>'+output+'</pre>');  
  });
});

module.exports = router;
