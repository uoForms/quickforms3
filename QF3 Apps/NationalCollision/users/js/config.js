define(function(){ 
	var config = {};
	config.app = 'NationalCollision'; 
	config.debug = false;
	config.loginLocation = '../index.html';
	config.extraScripts=['../js/auth.js'];
	//config.quickformsUrl = 'http://quickforms3.eecs.uottawa.ca/quickforms/';
	config.dataTransferType = "text";
	return config;
});