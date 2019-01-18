var bhavcopy = require('../models/bhavcopy.js');
var dateFormat = require('dateformat');
const logger = require('winston');

logger.add(new logger.transports.Console({
    format: logger.format.simple()
  }));

var populateChart = function(req, res){
	bhavcopy.bhavCopyData(req.params.scrip,
			req.params.monthweek,req.params.num,
			(err, entities) => {
				if (err) {
					logger.error('Error in getScripData: ' + req.params.scrip + ' ' + err);
					res.status(500);
				} 
				else {
					labels = entities.map((entity) => { 
						return [dateFormat(new Date(entity['FILE_DATE']),'dd-mmm')]
						});
					cp = entities.map((entity) => { return [entity['CLOSE']] });
			        vol = entities.map((entity) => { return [entity['NO_OF_SHRS']] });
					res.send([labels, cp, vol])
				}	
			})
}

module.exports = {
		populateChart: populateChart
}