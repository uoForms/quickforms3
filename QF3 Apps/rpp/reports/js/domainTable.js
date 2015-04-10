define([],function(){
	var config = {};
        config.bProcessing= true;
        config.iDisplayLength= 1000;
        config.sPaginationType= "full_numbers";
        config.aaSorting= [];
		config.aLengthMenu=[ 10, 25, 50, 100, 200];
        config.sScrollX= "100%";
		config.sScrollXInner= "101%";
		config.bScrollCollapse= true;
		config.columnWidths = ['25%','60%','5%','5%','5%'];
        config.sDom= '<"top"i<"filter_result"><"clear"><"filter_button"><"clear">>rt<"bottom"<"clear">>';
        
	return config;
});