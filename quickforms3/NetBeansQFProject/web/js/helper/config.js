/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(function(){
	var config = {};
	config.jqueryVersion="1.11.1.min";
	config.jqueryMobileVersion="1.3.2.min";
	config.jqueryMobileCss = quickforms.cssUrl+"jquery/jquery.mobile-1.3.2.min.css";
	config.jqueryDataTableCss = quickforms.cssUrl+"jquery/jquery.dataTables.css";
        config.jqueryPath = quickforms.jsUrl+"jquery/jquery-"+config.jqueryVersion;
        config.jqueryMobilePath = quickforms.jsUrl+"jquery/jquery.mobile-"+config.jqueryMobileVersion;
        config.jqueryMobileEnable = true;
	config.jqueryMobileTheme = "";
	config.jqueryUITheme = "";
	
	config.loginCss = quickforms.cssUrl+"quickforms/login.css";
	
	config.dataNativeMenu = false;
	config.app = 'test';             ////////////////////** Required//////////////////////////
        config.database = 'testDatabase';
	config.quickformsEnding = ""; // "" or ".asp"
	config.defaultPageTransition = "none"; // slide, pop, none
	config.defaultDialogTransition = "none"; // slide, pop, none
	config.rememberLength = 365;
        config.dataTransferType = "text"; // text, jsonp (for cross domain);
        config.qfEmail = 'quickforms.server@gmail.com';
        config.loginLocation = 'index.html';
        
	config.version = '1.0';
	config.build = '1001';
	config.debug = false; // kills cache of js/css files if true
	
	config.extraScripts = ['dom/authenticate']; // set to empty array if app does not require login
	
	config.offline = false;
	return config;
});
