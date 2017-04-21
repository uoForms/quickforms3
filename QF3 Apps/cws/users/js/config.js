define(function(){ 
	var config = {};
	config.app = 'cws';
	//config.debug = false;
	config.loginLocation = '../index.html';
	config.extraScripts=['../js/authCws.js'];
	//config.quickformsUrl = 'http://quickforms3.eecs.uottawa.ca/quickforms/';
	config.dataTransferType = "text";
	return config;
});
