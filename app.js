var express = require('express');
const logger = require('winston');


//set up handlebars view engine and express app
var handlebars = require('express-handlebars').create({
	defaultLayout : 'main'
});
var app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
	logger.info('Express started on http://localhost:' + app.get('port')
			+ '; press Ctrl-C to terminate.');
});

app.use(express.static(__dirname + '/public'));

require('./routes/approutes')(app)

