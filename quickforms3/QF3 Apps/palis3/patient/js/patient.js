var patient={}


var patientid=getCookie('patientId');



$(function(){
	var username = getCookie('username');
      var header = $('#header');
	header.append('Patient - '+username);
	var pid=getCookie('patientId');
	var km=getCookie('Kilometers');
        if(pid=='' || pid=='null' || pid==null)
        {
            pid = getParameterByName('id');
            setCookie('patientId',pid,1);
        }
	if(pid != null)
	{
            getResultSet(app, 'get_patient_details', 'PatientsKey='+pid, function(data){
               var json = JSON.parse(data)[0];
               var headerLeft = $('#headerLeft');
               //var title = $('#title');
               var bDate = new Date.fromISO(json.birth);
               var cDate = new Date();
			   var age = cDate.getFullYear() - bDate.getFullYear();
			   //var lastDigits = bDate.getFullYear();
               headerLeft.append(json.last_name +", "+ json.first_name+", "+ json.gender_label + ", " + age+"Yr ");
			   patient.first_name=json.first_name;
			   patient.last_name=json.last_name;
			   patient.Kilometers=json.Kilometers;
			   patient.age=json.age;
			   patient.gender_label=json.gender_label;
				if(setValue)
				setValue();
				setCookie('kms',json.Kilometers,1);
               //title.append(json.first_name +" "+ json.last_name);
            });

		if($('form').length>0 && document.location.pathname != "/palis3/patient/patientinfo.html")
		{
			$('form').append('<input type=hidden id=PatientKey name=PatientKey value='+pid+' />');
		}
	}
});
function setValue()
		{
		$('#Kilometers').val(patient.Kilometers);	
		
		}
function goBack()
{
    setCookie('patientId','',1);
    window.location='../patients.html';
}
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function loadEsasReport()
{	
var patientid=getCookie('patientId');
		var l=1;
		loadReportInTable(app,'education','EsasTable','PatientKey:'+patientid,function(rData1){
		
		var clipData = loadSummaryClipboardData(rData1,l);
				$('#clipEsasTable').val(clipData);
			});
       // loadReportInTable(app,'education','AgeSexStatsTotal','fYear:'+jsonYear+';MonthNum:'+jsonMonth);
	   
	    
		
		
	   var j= new Array();
	  
	  var json=	   getResultSet(app,'EsasTopRow','PatientKey:'+patientid,function(data){
        if(isJSONString(data))
        {
           json = JSON.parse(data);
		        j[0]=json[0].Pain;
		j[2]=json[0].Mood;
		j[3]=json[0].Nausea;
		j[1]=json[0].Tiredness;
		j[4]=json[0].Anxiety;
		j[5]=json[0].Drowsiness;
		j[6]=json[0].Appetite;
		j[7]=json[0].WellBeing;
		j[8]=json[0].ShortnessOfBreath;
        
				  }
				  /**
				 0. [Pain] 1
      1. [Tiredness]3
      2. [Mood]4
      3. [Nausea] 2
      4. [Anxiety] 5
      5.[Drowsiness]9
      6. [Appetite]6
      7. [WellBeing]7
      8. [ShortnessOfBreath]8
      
				  */
				  drawVisualization(parseInt(j[0]),parseInt(j[3]),parseInt(j[1]),parseInt(j[2]),parseInt(j[4]),parseInt(j[6]),parseInt(j[7]),parseInt(j[8]),parseInt(j[5]));
				     // Create and populate the data table.
     	
		});
	 
      	 j[4]=j[2];       
		
		
	
}

function loadSummaryClipboardData(d1,l)
{
	var clipData = "";
	$(d1).each(function(i,dom){
		var j = 0;
		var k= d1.length;
		
		for(var prop in dom)
		{
			if(j>0)
				clipData += dom[prop]+"\t";
			j++;
		}
		if(l<=k-1)
		{
		clipData += "\n";
		l++;
		}
	});
	//clipData = clipData.substring(0,clipData.length - 2)
		return clipData;

}


function patientFieldSelection()
{
    var pid=getCookie('patientId');
    if(pid=='')
        getFieldSelection(app,'patients');
    else
        getFieldSelection(app,'patients',pid);
}