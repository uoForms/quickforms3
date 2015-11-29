define(function(){ 
	var config = {};
	config.app = 'boatsafe'; 
	
	config.loginLocation = '../index.html';
	config.extraScripts=['../users/js/authUser.js'];
	//config.quickformsUrl = "http://quickforms3.eecs.uottawa.ca/quickforms/";
	config.dataTransferType = "jsonp";
	config.debug = true;
	return config;
});