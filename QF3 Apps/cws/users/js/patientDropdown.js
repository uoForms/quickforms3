define(['dom/form/form','server/executeQuery'],function(){

	 if(getCookie('userRole') != 'Administrator' && getCookie('userRole') != null) {
     quickforms.getFactData({app:quickforms.app,
			                       queryName:'getPatientsByProvider',
														 params: null,
														 whereclause:'teamMembersMultiValue='+getCookie('userid'),
														 callback: function(data){
															 var obj = jQuery.parseJSON(data);	
																if(!localStorage.getItem('selected')){
																	$('#patient').append('<option value="-100" selected= "selected">SELECT PATE</option>');
																	$(obj).each(function(i, val){
																		$('#patient').append('<option value="' + val['patientsKey']  + '">' + val['info'] + '</option>');
																
																})
																}else{
																    $('#patient').append('<option value="-100">Please select a patient</option>');
																	$(obj).each(function(i, val){
																	     if(localStorage.getItem('selected') == val['patientsKey'] )
																			$('#patient').append('<option value="' + val['patientsKey']  + '" selected = "selected">' + val['info'] + '</option>');
																		 else
																			$('#patient').append('<option value="' + val['patientsKey']  + '">' + val['info'] + '</option>');
																})
																}
																
																$('#patient').selectmenu('refresh');
														 }})
	}
});
