/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['jquery/jquery.dataTables','server/getFactData'],function(){
quickforms.tableControl = quickforms.tableControl || {list:{}};
quickforms.loadTableReport = function(params) //appName, queryName*, crossTabs , parameterList, callback,whereclause, domId, configFile
{
	params.appName = params.appName || quickforms.app;
	params.parameterList = params.parameterList || '';
	params.callback = params.callback || function(){};
	params.crossTabs = params.crossTabs || [];
	params.whereclause = params.whereclause || '1=1';
	params.domId = params.domId || 'mainData';
	params.configFile = params.configFile || 'dom/report/tableConfig';
        
	quickforms.loadCss(quickforms.jqueryDataTableCss);
	quickforms.initLoadingGif();
	quickforms.tableControl.list[params.domId]=quickforms.tableControl.list[params.domId]||{
		params:params,
		dom:$('#'+params.domId),
		callback:quickforms.loadTableReport
	};
        require([params.configFile],function(tableConfigFile){
            var createTable = function(data)
            {
                    var tableId = params.domId || 'mainData'
					mainTable = $('#'+tableId);
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
                                            data = '[["No Data"]]';
                            }
                            else
                            {
                                            alertJSONError(data);
                                            params.callback();
                                            return;
                            }
                    }
                    if(isJSONString(data))
                    {
                            var json = JSON.parse(data),
                                    columns = [],
                                    percentWidth = 0;
                            for(var key in json[0])
                            {
                                    percentWidth+=1;
                            }
                            percentWidth = (100/percentWidth)+"%";
                            //percentWidth = 0;
                            var i=0;
                            for(var key in json[0])
                            {
                                    var obj = { sTitle: key , mData: key, sWidth : tableConfigFile.columnWidths[i]|| percentWidth };
                                    //if(key == "id")
                                    //	obj = { sTitle: key , mData: key, bVisible: false};
                                     columns.push(obj);
                                     i++;
                            } 
                            if($.fn.DataTable.fnIsDataTable( mainTable[0] ) == true)
                            {
                                    mainTable.dataTable().fnDestroy(); 
                                    mainTable.html("");
                            }
                            mainTable.css("max-width","none");
                            //mainTable.attr('width','100%');
                            mainTable.addClass('display');
                            var tableConfig = {  	
                                    "aaData": json,    
                                    "aoColumns": columns,
                                    "fnDrawCallback" : function(oSettings) {
                                            drawCallback(mainTable);
                                    }
                            };
                            quickforms.mixin(tableConfig,tableConfigFile);
                            var oTable = mainTable.dataTable( tableConfig );	

                            quickforms.hideLoadingGif();

                            oTable.fnDraw(true);
                    }
                    else
                    {
                            mainTable.remove();
                            if(data.indexOf(']')==0)
                                    quickforms.hideLoadingGif();
                            //alertJSONError(data);
                    }

                    params.callback();

            };
            quickforms.getFactData({app:params.appName,
                                    queryName:params.queryName,
                                    params:params.parameterList,
                                    callback:createTable,
                                    whereclause:params.whereclause
                                    });
        });
	var drawCallback = function(table)
	{
		for(var i =0;i<params.crossTabs.length;i++)
		{
			var tab = params.crossTabs[i],
				headerRow = table.find('thead tr th'),
				columns = [];
			headerRow.each(function(j,val){
				if($(val).attr('aria-label').indexOf(tab)>=0)
				{
					columns.push(j+1);
				}
			});
			for(var j=0;j<columns.length;j++)
			{
				
				var col = table.find('tr td:nth-child('+columns[j]+')'),
					curCategory = "";
				col.each(function(k,row)
				{
					row = $(row);
					row.css('color','black');
					if(row.text() == curCategory)
					{
						row.css('color',row.css('background-color'));				
						//row.css("background-color","white");
					}
					else
					{
						curCategory = row.text();
					}
				});
			}
		}
	}
};


});