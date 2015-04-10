define([],function(){
	var config = {};
        config.bProcessing= true;
        config.iDisplayLength= 50;
        config.sPaginationType= "full_numbers";
        config.aaSorting= [[0,"desc"]];
		config.aLengthMenu=[ 10, 25, 50, 100, 200];
        config.sScrollX= "100%";
		config.sScrollXInner= "101%";
		config.bScrollCollapse= true;
		config.columnWidths = ['50%','15%','15%','15%'];
        config.sDom= '<"top"lf<"clear">ip<"clear">>rt<"bottom"ip<"clear">';
        
	return config;
});