   define(function(){
      var config = {};
      config.app = 'francine_CCM'; // Your App name
	  config.jqueryMobileTheme = "/francine_CCM/css/theme.css"; 
	  //config.jqueryMobilePath="/francine/js/jquery.mobile-1.2.0";
	  //config.jqueryMobileCss="/francine/css/mobile.css";
	  config.loginLocation = 'index.html';
	  config.extraScripts = ['js/auth.js'];
      config.quickformsEnding = ""; // "" or ".asp"
	  config.defaultPageTransition = "none"; // slide, pop, none
	  config.defaultDialogTransition = "pop"; // slide, pop, none	  
      return config;
	  
   });