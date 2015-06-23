var express = require('express'),
exec = require('child_process').exec;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/runtest/minimal', function(req, res, next) {
  exec('/usr/local/share/protractor/minimal/run_protractor.sh', function(error, output) {
    if (error)
      res.send('Error has happened'+error);
    else 
      res.send(output);  
  });
});


module.exports = router;
