/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['jquery/jquery.dataTables','server/getFactData'],function(){
quickforms.tableControl = quickforms.tableControl || {list:{}};
quickforms.loadTable = function(params) //appName, queryName*, parameterList,whereclause, callback, domId*,configFile 
{
	params.appName = params.appName || quickforms.app;
	params.parameterList = params.parameterList || '';
	params.callback = params.callback || function(){};
	params.domId = params.domId || 'mainData';
	params.whereclause = params.whereclause || '1=1';
	params.orderbyclause = params.orderbyclause || 'fullDate desc';
	params.likeclause = params.likeclause || '';
    params.configFile = params.configFile ||'dom/tableConfig';
	
	quickforms.loadCss(quickforms.jqueryDataTableCss);
	quickforms.tableControl.list[params.domId]=quickforms.tableControl.list[params.domId]||{
		params:params,
		dom:$('#'+params.domId),
		callback:quickforms.loadTable
	};
        require([params.configFile],function(tableConfigFile){
			var start = 1,end = 3,rowsTotal = 0;
			var sortInfo//="asc";
			var columnInfo//="date";
			
            var appendTableData = function(data){
                    var mainTable = $('#'+params.domId);
                    if(mainTable.children().length>0)
                    {
                            mainTable.dataTable().fnDestroy();
                            mainTable.html('');
                    }
                    if(!isJSONString(data))
                    {
                            if(data.indexOf(']')>=0) // returned array is empty
                            {
                                            quickforms.hideLoadingGif();
                                            data = '{"aaData":[["No Data"]]}';
											var obj = {aaData:JSON.parse(data)};
											
											
											
                            }
                            else
                            {
                                            alertJSONError(data);
                                            params.callback();
                                            return;
                            }
                    }
                    var json = JSON.parse(data); 

                    var columns = [];
                    var percentWidth = 0;
                    for(var key in json[0])
                    {
                                    percentWidth+=1;
                    }
                    percentWidth = (100/percentWidth)+"%";
                    //percentWidth = 0;
                    var i=0;
                    for(var key in json[0])
                    {
                                    var obj = { sTitle: key , mData: key, sWidth : tableConfigFile.columnWidths[i] || percentWidth };
                                    if(key == "id" || key == "form")
                                                    obj = { sTitle: key , mData: key, bVisible: false};
                                    else
                                        i++; // only count the columns that are displayed for width
                                     columns.push(obj);
                    } 
                    mainTable.css("max-width","none");
                    mainTable.addClass('display');
                    var tableParameters = {  
									"bStateSave": false,
									"bServerSide": true,
									"bSort":true,
									
									
									"iTotalRecords":rowsTotal,
									"iTotalDisplayRecords":rowsTotal,
									"bLengthChange": true,
									"aLengthMenu": [
										 10, 25, 50, 100, 500, 1000, 2000, 5000
									],
									"aoColumns": columns,
									"sDom": '<"top"lf<"clear">ip<"clear">>rt<"bottom"ip<"clear">',
									"fnServerData": function(sSource,aoData,fnCallback,oSettings){
										if(aoData[40]){
											sortInfo=aoData[40].value;
											if(aoData[aoData[39].value+5].value=='id'){
											columnInfo='visitsKey';
											}else if(aoData[aoData[39].value+5].value=='date'){
											columnInfo='fullDate';
											}else{
											columnInfo=aoData[aoData[39].value+5].value;
											}
										
												quickforms.getFactData({app:params.appName,
														queryName:params.queryName,
														params:"start="+(aoData[3].value+1)+",end="+(aoData[3].value+aoData[4].value+1),
														whereclause:params.whereclause,
														orderbyclause:(columnInfo)+" "+(sortInfo),
														likeclause:aoData[13].value,
														callback:function(data){
															if(isJSONString(data))
															{
															
																var obj = {aaData:JSON.parse(data),
																			iTotalRecords:rowsTotal,
																			iTotalDisplayRecords:rowsTotal};
																quickforms.hideLoadingGif(); 
																fnCallback(obj);
															}else
															{
															data = '{"aaData":[["No Data"]]}';
															var obj = {aaData:JSON.parse(data),iTotalRecords:rowsTotal,
																			iTotalDisplayRecords:'0'};
															fnCallback(obj);
																
															}
															
														}});
										}
										else
										{
											var data = '{"aaData":[["No Data"]]}';
											var obj = {aaData:JSON.parse(data),iTotalRecords:rowsTotal,
															iTotalDisplayRecords:'0'};
											fnCallback(obj);
										}
									},
									
							
									
                    };
                    quickforms.mixin(tableParameters,tableConfigFile);
					if(json.aaData) // No data returned from server
						tableParameters.aoColumns = [null];
                    var oTable = mainTable.dataTable(tableParameters  );	


                    // make the row clickable
                    $('#'+params.domId).delegate('tbody tr','click', function () {
                            var aData = oTable.fnGetData( this );
                            //alert( aData.id ); // assuming the id is in the first column
                            window.location = aData.form+".html?id="+ aData.id;
                    } );
                    quickforms.highlightMostRecent(params);
                    quickforms.hideLoadingGif();
                    oTable.fnDraw(true);


                    params.callback();
            };
           // appendTableData('[["No Data"]]');
            quickforms.initLoadingGif();
            setTimeout(function(){
                    if(isNull(quickforms.tableControl.list[params.domId].filter) || quickforms.tableControl.list[params.domId].filter.completed)
                            quickforms.getFactData({queryName:'getVisitsRowsTotal',whereclause:params.whereclause,callback:function(data){
								rowsTotal = JSON.parse(data)[0].total;
								quickforms.getFactData({app:params.appName,
																				queryName:params.queryName,
																				params:"start="+start+",end="+end,
																				whereclause:params.whereclause,
																				orderbyclause:params.orderbyclause,
																				likeclause:params.likeclause,
																				callback:appendTableData});
							}});
            },1);
        });
};
quickforms.highlightMostRecent = function(params)
{
	var updatedId = getParameterByName('rowId');
	if(isNull(updatedId) == false)
	{
		$('#'+params.domId+' tbody tr').each(function(i, dom)
		{
			var data = $('#'+params.domId).dataTable().fnGetData( dom );
			if(data.id == updatedId)
			{
				dom = $(dom);
				dom.addClass('highlighted');
				window.setTimeout(function(){dom.removeClass('highlighted')},1500);
			}
		});
	}
}
});