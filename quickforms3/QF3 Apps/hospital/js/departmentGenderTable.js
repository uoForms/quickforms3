define([],function(){
	var config = {};
        config.bProcessing= true;
        config.iDisplayLength= 1000;
        config.sPaginationType= "full_numbers";
        config.aaSorting= [[0,"asc"]];
        config.sScrollX= "100%";
	config.sScrollXInner= "101%";
	config.bScrollCollapse= true;
        config.columnWidths = [];
        config.sDom= '<"top"i<"filter_result"><"clear"><"filter_button"><"clear">>rt<"bottom"<"clear">>';
        config.columnWidths = ['50%','25%','25%','0%','0%','0%'];
	return config;
});