var infopanelctrl = require('../controllers/infoPanelController.js');
var chartctrl = require('../controllers/chartController.js');
var scriplistctrl = require('../controllers/scripListController.js');
var webjobs = require('../webjobs/downloaddailybhavcopy.js');

module.exports = function(app){
	
app.get('/', function(req, res) {
	res.render('webapp');
});

app.get('/login', function(req, res) {
	res.render('firebase_ui',{layout: 'firebase_login'});
});

app.get('/getScripData/:scrip/:monthweek/:num', chartctrl.populateChart);

app.get('/get52WeekLowHigh/:scrip', infopanelctrl.populate52WeekLowHigh);

app.get('/getScripLowHigh/:scrip', infopanelctrl.populateScripLowHigh);

app.get('/getAvgVolume/:scrip', infopanelctrl.populateAvgVolume);

app.get('/getScrips/:filter', scriplistctrl.populateScripList);

app.get('/initiateFileDownload', webjobs.initiateFileDownload);

// 404 
app.use(function(req, res, next) {
	res.status(404);
	res.render('404');
});
// 500 
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

}