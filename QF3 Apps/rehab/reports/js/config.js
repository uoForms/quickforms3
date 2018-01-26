define(function(){ 
	var config = {};
	config.app = 'rehab'; 
	config.build = 101;
	config.version = 1.0;
	config.debug = false;
	config.loginLocation = '../index.html';
	config.extraScripts=['../js/authRehab.js'];
	config.dataTransferType = "text";
	return config;
});