require(['server/getMultiData','server/updateLookup'],function(){
quickforms.designer = {
	values : {}
};
//This function reload the form to be edited adding the edit button beside each select field
$(function(){
	if(getCookie('userRole') == 'Administrator')
	{
		$('.buttons').append('<a href="#" rel="external" onClick="quickforms.design()" data-role="button" data-inline="true" data-icon="gear">Design</a>'); 
		$('.buttons').trigger('create');
	}
})
quickforms.design = function(){

	//Hide the top and bottom buttons that appear on the original form 
	$('div.buttons').hide();
	
	//add back button to go back to the original page
	$('div.buttons').before('<a href="#" rel="external" onClick="location.reload();" data-role="button" data-inline="true" data-icon="back" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-hover-c ui-btn-down-c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Back</span><span class="ui-icon ui-icon-back ui-icon-shadow">&nbsp;</span></span></a><br/>');
	
	//Search for each select field
	$('div.ui-select').find('SELECT').each(function(){
		
		//Get the id of the select field
        var thisDom = $(this);
		var id= thisDom.attr('id');
		
		//find the label associated to the SELECT element and append the edit button 
		$('label').each(function(){
		
			var thisLabel=$(this);
			var LabelID=thisLabel.attr('for');
			
			if(LabelID==id)
			{
				thisLabel.append('<a href="#" rel="external" id="'+id+'" onclick="editOption('+id+')" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-gear ui-icon-shadow"></span></span></a>')
			}
				
		   });
		
		});
		
		$('body').wrapInner('<p></p>');
	
}

// This function direct the user to the page where he/she can edit the options of a specific field
window.editOption = function(domId){

	//save current field's label id for later use when redirecting back to the main editing page
	labelID= domId.id;
	//Hide everything in the page except for the label of the specified field
	$('label').each(function(){
		var thisDom = $(this);
		var DomFor= thisDom.attr('for');
		if(DomFor==domId.id)
		{
			//hide the main editing page
			$('p').hide();
			//append the label of the specific field was selected for editing to the specific editing page
			var labelText= thisDom.text();
			$('body').append('<h3 id="labelText" style="margin-left:20px">'+labelText+'</h3>');
			//append the back button that redirects the user to the main editing page
			$('h3').before('<button onClick="designPage()" data-icon="back" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-hover-c ui-btn-down-c" style="margin-left:20px; margin-top:10px;" ><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Back</span><span class="ui-icon ui-icon-back ui-icon-shadow">&nbsp;</span></span></button>');
			
		}
	});
	var formId = $('#'+labelID).parents('form').attr('id');
	var factName = quickforms['currentForm'+formId].fact;
	getFieldOptions(quickforms.app,factName, labelID, location);
	

}

//This function retrieves the fields options from the database
//It accepts the application name, form name, paramid, callback
function getFieldOptions(appName, factName,paramid, callback) {
   //appName,fact, field, lookup,updateId, callback
   $('table').remove();
	  quickforms.getMultiData(appName,factName,paramid,'1=1','',
		function(data){
			displayEditingPage(data,paramid);
		});
	  /*
	  var url = '/'+quickforms+'/getFieldSelection.aspx?app='+appName+'&factTable='+factName+'&field='+paramid+'&updateId='+paramid;
         // Asynchronously get the fields from the controller 
		  $.ajax({
                type: 'GET',
                async: true,
                cache: false,
                timeout: 3000,
                url: url,
                data: {},
                success: function(data,status,xhr){
                    if(data != ""){
						 
							displayEditingPage(data,paramid);
						
					}
                },
                error: function(data,status,xhr){
                    console.log(e1+e2+e3);
					   
					}
                }
        );*/
         
      
}

//This function is used to dynamically generate the edit mode of the design page of the form
function displayEditingPage(data, domId)
{
	
    if(isJSONString(data)){
		
        var json = JSON.parse(data);
		
		quickforms.designer.lookup = domId;
		//If the list of fields is less than 9 fields display the fields without the scrolling box
		//if(json.length<9)
		//{
			$('#labelText').append('<table id=\x27'+domId+'\x27 style="margin-left:10px;"></table>');
		//Go through each option of a specific field and display it in a text box with the delete, up and down buttons beside it
        quickforms.designer.values = {};
		for(i=0;i<json.length;i++)
        {
			
			var id= json[i][domId+'Key']; //this variable is the id of the option
			var label= json[i][domId+'Label'];// this variable is the label of the option
			var selected= json[i]['selected'];
            var formName= 'design.html';
			var app = quickforms.app;
			
			quickforms.designer.values[id] = json[i];
			if(i==0){
			
				$('table').append('<tr id="'+id+'"><td></td><td><input id="'+id+'" class="'+domId+'" value="'+label+'" style="width: 300px; margin-left:20px;"></td></tr>');
		    }
			else if(i==1){
			
			    $('table').append('<tr id="'+id+'"><td><a href="#" rel="external" onClick="moveDown(\x27'+id+'\x27,\x27'+domId+'\x27)" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c" style="margin-left:40px;"><span class="button-ui"><span class="ui-icon ui-icon-arrow-d ui-icon-shadow"></span></span></a><a href="#" rel="external" onClick="deleteLkup(\x27'+app+'\x27,\x27'+domId+'\x27,'+id+',\x27\x27)" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-delete ui-icon-shadow"></span></span></a> </td> <td><input id="'+id+'" class="'+domId+'" value="'+label+'" style="width: 300px; margin-left:20px;"></td></tr>');
			
			}
			else if(i==json.length-1){
			
				$('table').append('<tr id="'+id+'"><td><a href="#" rel="external" onClick="moveUp(\x27'+id+'\x27,\x27'+domId+'\x27)" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-arrow-u ui-icon-shadow"></span></span></a><a href="#" rel="external" onClick="deleteLkup(\x27'+app+'\x27,\x27'+domId+'\x27,'+id+',\x27\x27)" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c" style="margin-left:39px;"><span class="button-ui"><span class="ui-icon ui-icon-delete ui-icon-shadow"></span></span></a> </td> <td><input id="'+id+'" class="'+domId+'" value="'+label+'" style="width: 300px; margin-left:20px;"></td></tr>');
			
			}
			else{
			
				$('table').append('<tr id="'+id+'"><td><a href="#" rel="external" onClick="moveUp(\x27'+id+'\x27,\x27'+domId+'\x27)" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-arrow-u ui-icon-shadow"></span></span></a><a href="#" rel="external" onClick="moveDown(\x27'+id+'\x27,\x27'+domId+'\x27)" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-arrow-d ui-icon-shadow"></span></span></a><a href="#" rel="external" onClick="deleteLkup(\x27'+app+'\x27,\x27'+domId+'\x27,'+id+',\x27\x27)" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-delete ui-icon-shadow"></span></span></a></td> <td><input id="'+id+'" class="'+domId+'" value="'+label+'" style="width: 300px; margin-left:20px;"></td></tr>');
			}
		}
		//Display the new option textbox,add, and save buttons under the options of the field
		$('table').append('<tr><td><a href="#" rel="external" onClick="putLookup(\x27'+app+'\x27,\x27'+domId+'\x27,\x27design.html\x27)" data-role="button" data-inline="true"data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c" style="margin-left:73px;"><span class="button-ui"><span class="ui-icon ui-icon-add ui-icon-shadow"></span></span></a></td><td><input id="'+domId+'" placeholder="New option..."  style="width: 300px; margin-left:20px;"></td></tr>');
		$('table').append('<tr><td></td><td><a href="#" rel="external" onClick="editLookup(\x27'+app+'\x27,\x27'+domId+'\x27,\x27design.html\x27)"  data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c" style="margin-left:20px;"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Save</span></span></a></td></tr>');
		
		//}
		
	/*	//otherwise display the options in a scrolling box
		else
		{
			
			for(i=0;i<json.length;i++)
        {
			var id= json[i].id;
			var label= json[i].label;
			var selected= json[i].selected;
            var formName= 'design.html';
			
		    $('table').append('<tr><td><a href="#" rel="external" onClick="deleteLkup(\x27'+app+'\x27,\x27'+domId+'\x27,'+id+',\x27design.html\x27)" data-role="button" data-inline="true" data-icon="delete" data-iconpos="notext"></a> <a href="#" rel="external" onClick="" data-role="button" data-inline="true" data-icon="arrow-u" data-iconpos="notext"></a> <a href="#" rel="external" onClick="" data-role="button" data-inline="true" data-icon="arrow-d" data-iconpos="notext"></a></td> <td><input id="'+id+'" class="'+domId+'" value="'+label+'" style="width: 300px;"></td></tr>');
		   
		}
		//Put the fields in a scrolling box
		var containerID= "container"+domId;
		$('table').wrap('<div id=\x27'+containerID+'\x27 class=\x27container\x27></div>');
		var containerId= '#'+containerID;
		//Display the new option textbox, add, and save buttons outside the scrolling box
		$( containerId ).after('<a href="#" rel="external" onClick="putLookup(\x27'+app+'\x27,\x27'+domId+'\x27,\x27design.html\x27)" data-role="button" data-inline="true" style="margin-left:145px;">Add</a><a href="#" rel="external" onClick="editLookup(\x27'+app+'\x27,\x27'+domId+'\x27,\x27design.html\x27)" data-role="button" data-inline="true" ">Save</a>');
		$( containerId ).after('<input id="'+domId+'" placeholder="New option..."  style="width: 300px; margin-left:145px;">');
		}*/
    }
    else
    {
        alertJSONError(data);
    }
}

//This function directs the user back to the main editing page
window.designPage = function(){
	//remove everything in the specific editing page
	$('button').remove();
	$('table').remove();
	$('h3').remove();
	//show the main editing page
	$('p').show();
	
}


//This function is used to make an ajax request to the controller in order to add a new option to a specific field
//The function accepts the application name, lookup table name, and the html page name
window.putLookup = function(appName, lkupName, location)
{
	
	//Look for the textbox where the option is added
	$("input").each(function(){
         var thisDom = $(this);
         var domId = thisDom.attr("id");
		 var option;
		 //when the textbox is found, get the label of the new option
		 if(domId== lkupName)
		 {
			option= thisDom.val();
			//If the label is empty notify the user that he's attempting to add an empty option
			if(option=="")
			{
				alert("The field's option is empty");
				return "";
			}
			else
			{
				var newId = 0,newOrder = 0;
				for(var key in quickforms.designer.values) // Find unused Key
				{
					newId = parseInt(key)+1;
					if(!quickforms.designer.values[newId])
					{
						break;
					}
				}
				for(var key in quickforms.designer.values) // Find maximum row order
				{		
					var rowOrder = parseInt(quickforms.designer.values[key][lkupName+'Order']);
					if(rowOrder >= newOrder)
					{
						newOrder = rowOrder+1;
					}
				}
				var newRow = {};
				newRow[lkupName+"Key"] = newId;
				newRow[lkupName+"Label"] = option;
				newRow[lkupName+"Order"] = newOrder;
				quickforms.designer.values[newId] = newRow;
			//make an ajax request and add the new option
			/*$.ajax({
					type: 'POST',
					url: '/'+quickforms+'/putLkup.aspx',
					data: {app:appName,tbl: lkupName, label : option},
					//In successful addition refresh the page
					success: function(data,status,xhr){
					
							refreshTable(lkupName);
							return status;
					},
					//In case of error alert the user
					error: function(xhr, status, e)
					{
						alert('Sorry, Palis seems to be having some technical difficulties at the moment. Please contact lpeyton@uottawa.ca to resolve the issue.');
						if(queryServer)
						{
							window.alert("Row not saved, could not connect to server: "+e);
						}
						else
						{
							window.location.href = location;
						}
					}
					});*/
					
		 }}
		 })
   refreshTable(lkupName);
}

//This function is used to make an ajax request to the controller in order to edit an option to a specific field
//The function accepts the application name, lookup table name, and the html page name
window.editLookup = function(appName, lkupName, location)
{
	//Look for the textbox where the option is edited
	$("input").each(function(){
         var thisDom = $(this);
         var domClass = thisDom.attr("class");
		 var option;
		 var rowId;
		 //when the textbox is found, get the label of the edited option
		 if(domClass == lkupName)
		 {
			option= thisDom.attr("value");
			rowId= thisDom.attr("id");
			quickforms.designer.values[rowId][lkupName+'Label'] = option;
			
			//make an ajax request and edit the label of the option
			/*$.ajax({
					type: 'POST',
					url: '/'+quickforms+'/editLkup.aspx',
					data: {app:appName,tbl: lkupName, label : option, id : rowId},
					success: function(data,status,xhr){
					
							
					},
					error: function(xhr, status, e)
					{
						alert('Sorry, Palis seems to be having some technical difficulties at the moment. Please contact lpeyton@uottawa.ca to resolve the issue.');
						if(queryServer)
						{
							window.alert("Row not saved, could not connect to server: "+e);
						}
						else
						{
							window.location.href = location;
						}
					}
					});*/
		 }
		 });
		var newJson = [];
		for(var row in quickforms.designer.values)
		{
			if(quickforms.designer.values[row][quickforms.designer.lookup+'Order'] >=0)
				newJson.push(quickforms.designer.values[row]);
		}
	//refresh the option list
		var query = new quickforms.updateLookupServer(quickforms.app,
												quickforms.designer.lookup,
												JSON.stringify(newJson),
												function(){
													getFieldOptions(appName,'education',quickforms.designer.lookup)
												});
   // refreshTable(lkupName);
}
window.deleteLkup = function(app,lookup,id) 
{
	quickforms.designer.values[id][lookup+'Order'] = -1;
	refreshTable();
}

window.moveUp = function(rowID, lkup){
	
	var prevRowID;
	
	$('#'+lkup+' tr').each(function() {
	
		var trID = $(this).attr('id');  
		
		if(trID==rowID)
		{
			var prevRow = $(this).prev();
			prevRowID = prevRow.attr('id');
			
			var row = quickforms.designer.values[rowID];
			var prevRow = quickforms.designer.values[prevRowID];
			
			row[quickforms.designer.lookup+'Order']=parseInt(row[quickforms.designer.lookup+'Order'])-1;
			prevRow[quickforms.designer.lookup+'Order']=parseInt(prevRow[quickforms.designer.lookup+'Order'])+1;				
			
		}
			
	});
	
	refreshTable(lkup);
	
}

window.moveDown = function(rowID, lkup){

    var nextRowID;
	
	$('#'+lkup+' tr').each(function() {
	
		var trID = $(this).attr('id');  
		
		if(trID==rowID)
		{
			var nextRow = $(this).next();
			nextRowID = nextRow.attr('id');
			
			var row = quickforms.designer.values[rowID];
			var nextRow = quickforms.designer.values[nextRowID];
			
			row[quickforms.designer.lookup+'Order']=parseInt(row[quickforms.designer.lookup+'Order'])+1;
			nextRow[quickforms.designer.lookup+'Order']=parseInt(nextRow[quickforms.designer.lookup+'Order'])-1;
			 
		}
			
	});
	
	refreshTable(lkup);
}

//This function refresh the options field on display after editing one of them
function refreshTable(domId){

	//Remove the current table
	$('table').remove();
	var app = quickforms.app;
	//Append the new table with the new options list
	var newJson = [];
	for(var row in quickforms.designer.values)
	{
		if(quickforms.designer.values[row][quickforms.designer.lookup+'Order'] >=0)
			newJson.push(quickforms.designer.values[row]);
	}
	newJson.sort(function(a,b){
		return parseInt(a[quickforms.designer.lookup+'Order']) - parseInt(b[quickforms.designer.lookup+'Order']);
	});
	displayEditingPage(JSON.stringify(newJson),quickforms.designer.lookup);
}
});