/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['google/google-jsapi','server/getFactData'],function(){
quickforms.tableControl = quickforms.tableControl || {list:{}};
quickforms.loadGraphReport = function(params) //appName , queryName*, parameterList, divId ,callback, whereclause, graphParamFile
{
	params.appName = params.appName || quickforms.app;
	params.parameterList = params.parameterList || '';
	params.divId = params.divId || 'chart';
	params.callback = params.callback || function(){};
	params.whereclause = params.whereclause || '1=1';
	params.graphParamFile = params.graphParamFile || 'dom/report/graphConfig';
	
	require([params.graphParamFile],function(graphParams){
	
		quickforms.tableControl.list[params.domId]=quickforms.tableControl.list[params.domId]||{
			params:params,
			dom:$('#'+params.domId),
			callback:quickforms.loadGraphReport
		};
		var apiLoadCallback = function()
		{
			var chartDiv = $('#'+params.divId);
			chartDiv.html('');
			quickforms.getFactData({app:params.appName,
											queryName:params.queryName,
											params:params.parameterList,
											whereclause:params.whereclause,
				callback:function(data){
					if(isJSONString(data))
					{
						var json = JSON.parse(data);
						//var columns
						var dataTable = new google.visualization.arrayToDataTable(convertObjectToArray(json));
						var options = {
						 height: dataTable.getNumberOfRows() * 40,
						 title: params.queryName
						};
						quickforms.mixin(options,graphParams);
						var chart = new google.visualization[''+graphParams.visType](chartDiv[0]);
						chart.draw(dataTable, options);
					}
					else
					{	
						if(data.indexOf(']')==0)
							quickforms.hideLoadingGif();
					}
				}
			});
		}
		var convertObjectToArray = function(json)
		{
			var retArray=[],
				header=[];
			for(var col in json[0])
			{
				header.push(col);
			}
			retArray.push(header);
			for(var i=0;i<json.length;i++)
			{
				var row = json[i];
				var rowArray = [];
				for(var col in row)
				{
					if(isNumber(row[col]))
						rowArray.push(parseInt(row[col]));
					else
						rowArray.push(row[col]);
				}
				retArray.push(rowArray);
			}
			return retArray;
		}
		google.load('visualization', '1', {callback:apiLoadCallback,packages: ['corechart']});
	});
	
};
quickforms.extendClass('ServerQuery',function(obj){
	var oldRun = obj.run;
	obj.run = function()
	{
		obj.fakeData='[{"Car":"Mazda","Rating (%)":"60"},{"Car":"Audi","Rating (%)":"30"},{"Car":"Volvo","Rating (%)":"10"}]';
		oldRun.call(obj);
	}
	//multiObj.fakeData='[{"id":"1","selected":"selected","label":"Not Specified"},{"id":"2","selected":"","label":"Audi"},{"id":"3","selected":"","label":"Volvo"}]';
	//console.log('extending multi data');
});
});