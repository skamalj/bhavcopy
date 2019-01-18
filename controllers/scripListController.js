//Callback function to route - /getScrips
var bhavcopy = require('../models/bhavcopy.js');

var populateScripList = function(req, res){
	bhavcopy.getScrips(req.params.filter, (err, entities,info) => {
		if (err){
			console.log(err.message);
			res.status(500);
		}
		else {
			data = entities.map((entity) => { return entity['SC_NAME'] });
			res.send(data)
		}
	 })
}

module.exports = {
		populateScripList: populateScripList
}