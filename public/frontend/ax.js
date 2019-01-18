
function loadScrips(vueObj) {
	  var searchquery = vueObj.message;
	  axios.get("/getScrips/" + searchquery).then(function(response){
		  vueObj.list = response.data;
		  });
}	

function populateInfoPane(infoObj, scrip) {
	axios.get("/getScripLowHigh/" + scrip).then(function(response){
		  infoObj.high = response.data[1][0];
		  infoObj.low = response.data[0][0];
		  infoObj.prevclose = response.data[2][0];
		  infoObj.close = response.data[3][0];
	});
	axios.get("/getAvgVolume/" + scrip).then(function(response){
		  infoObj.avgvol = response.data['avgVol'];
	});
	axios.get("/get52WeekLowHigh/" + scrip).then(function(response){
		  infoObj.low52wk = response.data[0];
		  infoObj.high52wk = response.data[1];
	})	
}
function loadScripData(scripObj) {
	  axios.get("/getScripData/" + scripObj.message +
			  "/" + scripObj.mwval[0] + "/" + scripObj.mwval.slice(1)).
	  	then(function(response){
		  scripObj.chart.data.labels = response.data[0];
		  scripObj.chart.data.datasets[0].data = response.data[1];
		  scripObj.chart.data.datasets[1].data = response.data[2];
		  scripObj.chart.update();
		  });
}	

