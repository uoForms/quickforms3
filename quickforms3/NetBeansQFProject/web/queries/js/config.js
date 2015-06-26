define(function(){
	var config = {};
	
	config.debug = false; // kills cache of js/css files if true
	
	config.extraScripts = ['/quickforms/queries/js/authenticate.js']; // set to empty array if app does not require login
	
	return config;
});
