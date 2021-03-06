var bhavcopy = require('../models/bhavcopy.js');
const logger = require('winston');

//Callback function for route - /get52WeekLowHigh
var populate52WeekLowHigh = function(req, res){
	bhavcopy.get52WeekLowHigh(req.params.scrip, (err, data) => {
		if (err) {
			logger.error('Error in get52WeekLowHigh: ' + req.params.scrip + ' ' + err);
			res.status(500);
		}
			res.send(data)
	 })
}

//Callback function for route - /getScripLowHigh
var populateScripLowHigh = function(req, res){
	bhavcopy.getScripLowHigh(req.params.scrip,
			(err, entities) => {
				if (err) {
					logger.error('Error in getScripLowHigh: ' + req.params.scrip + ' ' + err);
					res.status(500);
				}
				else {
					low = entities.map((entity) => { return entity['LOW'] });
			        high = entities.map((entity) => { return entity['HIGH'] });
			        prevclose = entities.map((entity) => { return entity['PREVCLOSE'] });
			        close = entities.map((entity) => { return entity['CLOSE'] });
					res.send([low, high, prevclose, close]);
				}	
			})
}

//Callback function for route - /getAvgVolume
var populateAvgVolume = function(req, res){
	bhavcopy.getAvgVolume(req.params.scrip, (err = null, data) => {
		if (err) {
			logger.error('Error in app.getAvgVolume: ' + req.params.scrip + ' ' + err);
			res.status(500);
		}
			res.send(data)
	 })
}
module.exports = {
		populate52WeekLowHigh: populate52WeekLowHigh,
		populateScripLowHigh:  populateScripLowHigh,
		populateAvgVolume:     populateAvgVolume
}