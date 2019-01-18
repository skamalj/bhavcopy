//Defines a backend job to download a daily file.  x-appengine-cron header is used to restrict 
// usage to appengine only.  This function cannot be run from external web

var df = require('dateformat')
const {Storage} = require('@google-cloud/storage');

var initiateFileDownload = function(req, res) {
	if (req.headers['x-appengine-cron']) {
		var storage = new Storage({
			projectId: 'bhavcopy'
		});
		var bucket = storage.bucket('bhavcopy-store');
		var d = new Date();
		
		var prev_date = new Date(d.setDate(d.getDate() - 1))
		
		var filename = 'EQ' + df(prev_date,'ddmmyy') + '.trg';
		var file = bucket.file(filename);
		file.save('', function(err) { 
			if (err) { 
				console.log(err) 
				res.status(500).send(err);
			} else {
				res.status(200).send('File download Initiated');
			}
		});
	} else {
		res.status(500).send('Not Authorised');
	}	
}	

module.exports = {
		initiateFileDownload: initiateFileDownload
}