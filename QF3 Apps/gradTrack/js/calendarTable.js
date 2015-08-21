define([],function(){
	var config = {};
		config.sDom='<"top">rt<"bottom"<"clear">';
		config.bProcessing= true;
		//config.iDisplayLength= 50;
		//config.sPaginationType= "full_numbers";
		config.aaSorting= [[0,"asc"]];
		//config.sScrollX= "100%";
		//config.sScrollXInner= "101%";
		config.bScrollCollapse= true;
		config.columnWidths = [];
		config.sDom= '<"clear"><"clear">rt<"clear">';
		/* config.fnDrawCallback = function(oSettings) {
		// hide the bottom add button if the number of records displayed is less than 15 
		if (oSettings._iDisplayEnd % oSettings._iDisplayLength >= 15) {
				$('a.btmAdd').show();
			} else {
				$('a.btmAdd').hide();
			}
		};*/
		//config.columnWidths = ['10%','10%','9%','23%','20%','25%'];
	return config;
});