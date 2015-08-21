$(function(){
   $.get('/quickforms/getQuickformsAppsStartupInfo',function(data){
	   console.log(data);
	   var appConnection = jQuery.parseJSON(data);
	   jQuery.each(appConnection, function(i, item) {
		   var appCode = '\
			   	<a href="#s' + i + 'h" class="list-group-item" data-toggle="collapse" \
				data-target="#s' + i + '" data-parent="#appsContainer"><h4 class="list-group-item-heading">' + item.name +
				'</h4></a> \
				<div id="s' + i + '" class="sublinks collapse"> \
					<div class="list-group-item"> \
						<span class="glyphicon glyphicon-chevron-right"></span> \
						<a href="/'+ item.name + '" rel="external" class="lead"> Go to the app</a> \
					</div> \
					<a class="list-group-item"> \
							<div class="panel-body"> \
								<strong> Description:  </strong> \
								' + item.description +
					    	'</div> \
					</a> \
					<a class="list-group-item"> \
							<div class="panel-body"> \
								<strong> Default User:  </strong> \
								' + item.defaultUser +
					    	'</div> \
					</a>';
		   
		   	if(item.connected){
		   		appCode = appCode.concat('\
		   				<a class="list-group-item"> \
		   					<div class="panel-body"> \
								<strong> Data Source:  </strong> \
		   						<span class="label label-success">Connected</span> \
							</div> \
						</a>');
		   	}else{
		   		appCode = appCode.concat('\
		   				<a class="list-group-item"> \
		   					<div class="panel-body"> \
								<strong> Data Source:  </strong> \
		   						<span class="label label-warning">Not Connected</span> \
							</div> \
						</a>');
		   	}
			
			appCode = appCode.concat('</div>');
		   $('#apps').append(appCode);
	   });
   }); 
});