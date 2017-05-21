define(['dom/form/form','server/executeQuery'],function(){

		$('#patient-button').click(function(){
			$('#patient').change(function(){
				 localStorage.setItem('selected',$('#patient').val());

				 if(localStorage.getItem('selected')!= -100 && localStorage.getItem('selected')!= null){
						$('#newDoc1').show();

						if(localStorage.getItem('nav') == 0 ){
							quickforms.loadNav('nav.html','nav');
							localStorage.setItem('nav',1);
							}
						 $('#documentlist').show();
						 //$('#newDoc2').show();
				 }else{
						$('#newDoc1').hide();
						//$('#newDoc2').hide();
				 }

				$('#patientInfo').text($('#patient').find(':selected').text());
				$($('#patient-button').children('span').children('span')[0]).text('SELECT A PATIENT');
				if(document.URL.indexOf('documents.html') >= 0){
					var whereclause = 'deleteFlag = 0 AND patient='+ localStorage.getItem('selected');
					quickforms.loadTable(
					{queryName:'getDocumentsInfo',whereclause:whereclause, callback:function(){$('.top').hide();  $('.bottom').hide();}});
				}else if(document.URL.indexOf('reports.html')  >= 0){
				   var domain = getParameterByName('domain');
						var whereclause = 'f.deleteFlag = 0 AND ';
						if(domain === 'capacity'){
							 whereclause += "f.patient = " + localStorage.getItem('selected') + " and e.evaluationCategory = 'CAPACITY AND PERFORMANCE'";
						}
						else if(domain === 'environment'){
							 whereclause += "f.patient = " + localStorage.getItem('selected') + " and e.evaluationCategory = 'ENVIRONMENT'";
						}
						else{
							 whereclause += "f.patient = " + localStorage.getItem('selected') + " and e.evaluationCategory = 'IMPAIRMENTS OF BODY FUNCTIONS'";
						}
						quickforms.loadTableReport(
						  {queryName:'getScoresByPatientAndCategory',
							whereclause: whereclause,
							configFile:'js/scoreTable'
							})
				}else if (document.URL.indexOf('summaryReport.html')  >= 0){
					 var domain = getParameterByName('domain');
						var whereclause = 'f.deleteFlag = 0 AND ';
						if(domain === 'capacity'){
							 whereclause += "f.patient = " + localStorage.getItem('selected') + " and e.evaluationCategory = 'CAPACITY AND PERFORMANCE'";
						}
						else if(domain === 'environment'){
							 whereclause += "f.patient = " + localStorage.getItem('selected') + " and e.evaluationCategory = 'ENVIRONMENT'";
						}
						else{
							 whereclause += "f.patient = " + localStorage.getItem('selected') + " and e.evaluationCategory = 'IMPAIRMENTS OF BODY FUNCTIONS'";
						}
						quickforms.loadTableReport(
						  {queryName:'getSummaryByPatientAndCategory',
							whereclause: whereclause,
							configFile: 'js/summaryTable'
							})
				}else if (document.URL.indexOf('summaryUpdatedScores.html#&ui-state=dialog')  >= 0){
						var whereclause =  "patientsKey = " + localStorage.getItem('selected') ;
						quickforms.loadTableReport(
						  {queryName:'getSummaryOfUpdatedScoresByPatient',
							whereclause: whereclause,
							configFile: 'js/fsTable'
							})			
				}else if (document.URL.indexOf('team.html')  >= 0){
					var whereclause = "p.patientsKey = " + localStorage.getItem('selected');
					quickforms.loadTable(
					{queryName:'getTeamMembersByPatient',
					whereclause:whereclause,
					callback: function(){
							$('#mainData').undelegate('tbody tr','click');$('.top').hide();  $('.bottom').hide();
					}
					});
				}


			});
		})


	 if(getCookie('userRole') != 'Administrator' && getCookie('userRole') != null) {
		 
     quickforms.getFactData({app:quickforms.app,
			                       queryName:'getPatientsByProvider',
														 params: null,
														 whereclause:'teamMembersMultiValue='+getCookie('userid'),
														 callback: function(data){
															 var obj = jQuery.parseJSON(data);
																if(!localStorage.getItem('selected')){
																	$('#patient').append('<option value="-100" selected= "selected">SELECT A PATIENT</option>');
																	$(obj).each(function(i, val){
																		$('#patient').append('<option value="' + val['patientsKey']  + '">' + val['info'] + '</option>');

																})
																}else{
																    //$('#patient').append('<option value="-100">SELECT A PATIENT</option>');
																	$(obj).each(function(i, val){
																	     if(localStorage.getItem('selected') == val['patientsKey'] )
																			$('#patient').append('<option value="' + val['patientsKey']  + '" selected = "selected">' + val['info'] + '</option>');
																		 else
																			$('#patient').append('<option value="' + val['patientsKey']  + '">' + val['info'] + '</option>');
																  })
																}

																$('#patient').selectmenu('refresh');
														 }// end of callback
													 })// end of getFactData
	}
	
	 if(getCookie('userRole') == 'Administrator' && getCookie('userRole') != null) {
     quickforms.getFactData({app:quickforms.app,
			                       queryName:'getAllPatientsWithFunctionalScores',
														 params: null,
														 callback: function(data){
															 var obj = jQuery.parseJSON(data);
																if(!localStorage.getItem('selected')){
																	$('#patient').append('<option value="-100" selected= "selected">SELECT A PATIENT</option>');
																	$(obj).each(function(i, val){
																		$('#patient').append('<option value="' + val['patientsKey']  + '">' + val['info'] + '</option>');

																})
																}else{
																    //$('#patient').append('<option value="-100">SELECT A PATIENT</option>');
																	$(obj).each(function(i, val){
																	     if(localStorage.getItem('selected') == val['patientsKey'] )
																			$('#patient').append('<option value="' + val['patientsKey']  + '" selected = "selected">' + val['info'] + '</option>');
																		 else
																			$('#patient').append('<option value="' + val['patientsKey']  + '">' + val['info'] + '</option>');
																  })
																}

																$('#patient').selectmenu('refresh');
														 }// end of callback
													 })// end of getFactData
	}
});
