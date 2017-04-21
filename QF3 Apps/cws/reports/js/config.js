define(function(){ 
	var config = {};
	config.app = 'cws'; 
	config.build = 101;
	config.version = 1.0;
	config.debug = false;
	config.loginLocation = '../index.html';
	config.extraScripts=['../js/authCws.js'];
	config.dataTransferType = "text";
	return config;
});