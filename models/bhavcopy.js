// Imports the Google Cloud client library
const Datastore = require('@google-cloud/datastore');
const moment = require('moment');
const logger = require('winston');

// Your Google Cloud Platform project ID
const projectId = process.env.PROJECT_ID;
//The kind for the new entity
const kind = process.env.DS_KIND;

var lastloaddate = null;

logger.add(new logger.transports.Console({
    format: logger.format.simple()
  }));

// Creates a client
const datastore = new Datastore({
  projectId: projectId,
  keyFilename : process.env.DATASTORE_KEYFILE
});

//API to return data for a given scrip and duration
var bhavCopyData = function(scrip,monthweek,num, cb) {
	query = datastore.createQuery(kind);
	var d = moment().subtract(num, monthweek == 'm' ? 'months' : 'weeks');
	query.
		filter('SC_NAME',scrip).	
		filter('FILE_DATE', '>=',d.toDate()).
		order('FILE_DATE',{ descending: false }).
		limit(400).
		run(cb);
  };
  
  //Functions returns 52 week High and Low values for Scrip
  var get52WeekLowHigh = function(scrip, cb) {
	  	bhavCopyData(scrip,'m',12, function (err, entities, info) {
	  		if(err) {
	  			logger.error('Error in get52WeekLowHigh: ' + scrip + ' ' + err);
	  			cb(err, null);
	  		}
	  		else {
	  		    close_list = entities.map((entity) => { return entity['CLOSE']*1.0 });
	  			min52wk = Math.min.apply( Math, close_list);
	  			max52wk = Math.max.apply( Math, close_list);
	  			cb(null, [min52wk,max52wk]);
	  		}	
	  	 });
	    };
	 
//API to return average volume for a given scrip - for 3 months
 var getAvgVolume = function(scrip, cb) {
  	bhavCopyData(scrip,'m',3, function (err, entities, info) { 
  		if (err) {
  			logger.error('Error in getAvgVolume from bhavCopyData: ' + err);
  			cb(err,null);
  		}
  		else {
  			try {
  				vol = entities.map((entity) => { return entity['NO_OF_SHRS']*1.0 }).
  				reduce((total,vol) => { return total + vol});
  				cb(null,{'avgVol': Math.round(vol/entities.length)});
  			} catch(err) {
  				logger.error('Error in getAvgVolume while averaging: ' + err);
  	  			cb(err,null);
  			}	
  		}	
  	 });
    };
    
  //This gets latest low and high for a scrip  
  var getScripLowHigh = function(scrip, cb) {
		query = datastore.createQuery(kind);
		query.
			filter('SC_NAME',scrip).	
			order('FILE_DATE',{ descending: true }).
			limit(1).
			run(cb);
	  };

//Stores last load date for the app	  
  var  getLastLoadDate = function(cb) {
	  query = datastore.createQuery(kind);
	    query.select('FILE_DATE').
	    	order('FILE_DATE',{ descending: true }).
	    	limit(1).
	    	run(cb);
	  };

  //API to return list of scrips to frontend
  var getScrips = function(filter, cb) {
	  if(!lastloaddate) {
			  getLastLoadDate((err,entities,info) => {
				  if(err) {
					  logger.error('Error in getScrips: ' + err);
					  return cb(err,null);
					}
				  else {
					  var data = entities.map((entity) => { return entity['FILE_DATE'] });
					  lastloaddate = new Date(data/1000);
					  return this.getScrips(filter,cb);
				  }
			  })
		  }
	  else {		  
		  query = datastore.createQuery(kind);
		    query.select('SC_NAME').
		    	filter('FILE_DATE',lastloaddate).
		    	filter('SC_NAME','>=',filter.toUpperCase()).
		    	order('SC_NAME',{ descending: false }).
		    	limit(10)
		    	return query.run(cb);
	  }	    
	  };

	  module.exports = {
				 bhavCopyData: bhavCopyData, 
				 getScrips: getScrips,
				 getScripLowHigh: getScripLowHigh,
				 getAvgVolume: getAvgVolume,
				 get52WeekLowHigh: get52WeekLowHigh
				 } 