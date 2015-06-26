/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['dom/form/form','dom/form/range'],function(){
quickforms.filterControl = function(url,divId){ // AJAX in the filter HTML, fills the sql whereclause
    this.url = url;
    this.divId = divId;
    this.form = '';
    this.summary = '';
    this.dom = $("#"+divId);
	var me = this;
    this.appendButtons = function(page){
        var parentPageId = this.parentPage.attr("id");
        var buttonsDiv = $('<div class="buttons"></div>');
        buttonsDiv.append('<a href="#'+parentPageId+'" onclick="quickforms.cancelFilter(\''+this.divId+'\')" data-role="button" data-inline="true" data-icon="back">Back</a>');
        buttonsDiv.append('<a href="#'+parentPageId+'" onclick="quickforms.updateFilter(\''+this.divId+'\')" data-role="button" data-inline="true" data-theme="b" data-icon="check">Filter</a>');
        buttonsDiv.append('<a href="#'+parentPageId+'" onclick="quickforms.clearFilter(\''+this.divId+'\')" data-role="button" data-inline="true"  data-icon="delete">Clear</a>');
        page.append(buttonsDiv);
        page.prepend(buttonsDiv.clone(true));
    };
	this.createFilterButton = function(){
		setTimeout(function(){ // timeout so table has time to load
			me.button = $('<a class="previous paginate_button paginate_button_disabled" style = "position:absolute;left:48%;top:35px">Filter</a>');
			var paginate = $('#'+me.divId+'_paginate');
			if(paginate.length==0)
			{
				var top = $('#'+me.divId+'_wrapper div[class="top"]');
				top.append('<div class="dataTables_paginate paging_full_numbers" id="mainData_paginate"></div>');
				paginate = $('#'+me.divId+'_paginate');
			}
			paginate.prepend(me.button);
			//if($('#filterSummary').length == 0){
			$('#filterSummary').html('');
			$('#'+divId+'_wrapper div[class="top"]').prepend($('<div id ="filterSummary" style="text-align:center">&nbsp;'+me.summary+'</div>'));
			//}

			me.button.on("click",function(){
					$.mobile.changePage(me.url);
			});
		},1);
	};
	this.scrubSerial = function(serial)
	{
		if(serial.endsWith('and '))
			serial = serial.substr(0,serial.length - 4);
		serial = serial.replace('and  and','and');
		return serial;
	};
};
quickforms.loadFilter = function(url,divId)
{
	var dialogId = url.substring(0,url.indexOf(".")),
		filterObj = new quickforms.filterControl(url,divId);
	if($('#'+dialogId).length<=0) // sometimes called twice
	{
		filterObj.id = filterObj.url.substring(0,filterObj.url.indexOf("."));
		filterObj.parentPage = filterObj.dom.parents('[data-role="page"],[data-role="dialog"]');
		filterObj.pageId = "#"+filterObj.id;
		filterObj.formId = filterObj.id+"_form";
		$(document).one('pageinit', filterObj.pageId, function(){
				filterObj.newPage = $(filterObj.pageId);
				var newPageChild = filterObj.newPage.children().first();
				quickforms.tableControl.list[divId]['filter'] = filterObj;
				newPageChild.addClass('ui-body-c');
				filterObj.appendButtons(newPageChild);
				newPageChild.wrapInner("<form id='"+filterObj.formId+"'></form>");
				
				quickforms.parseForm({"formId":filterObj.formId,
														"app":quickforms.app,
														"fact":"filter"+filterObj.id});
				var newFormObj = quickforms['currentForm'+filterObj.formId];
				newFormObj.type="dialogForm";
				filterObj.form = newFormObj;
				newFormObj.tableId = divId;
				newFormObj.completedListeners.push(function(){quickforms.updateFilter(divId);});
				filterObj.newPage.trigger('create',true);
				filterObj.newPage.unbind('pageinit');
		});
		$.mobile.loadPage(filterObj.url,{prefetch:true});
	}
};
quickforms.updateFilter = function(divId){
	var tableControl = quickforms.tableControl.list[divId],
		form = tableControl.filter.form,
		serial = '',
		summary = '';
	var tableControls = quickforms.tableControl.list;
	var includedCount = 0;
	
	for(var filFocus in tableControls)
	{
		tableControls[filFocus].oldWhereclause = tableControls[filFocus].oldWhereclause || tableControls[filFocus].params.whereclause;
	}
	for(var i in form.children)
	{
		var child = form.children[i];
		if(child.dom.parents('div[class*="range"]').length == 0 && child.included)
		{
			
			if(includedCount>0 || tableControl.oldWhereclause.length>0){serial +=" and ";}
			if(includedCount>0){summary += ' , ';}
			serial += child.filter();	
			summary += child.summary();
			includedCount +=1;
		}
	}

	tableControl.filter.summary = "<b>Filtered By: </b>"+summary.replace(/<br \/>/g,'');
	serial = tableControl.filter.scrubSerial(serial);
	
	
	var oldCallback = tableControl.params.callback;
	tableControl.params.callback = function(){
		oldCallback();
		tableControl.filter.createFilterButton();
	};
	
	for(var filFocus in tableControls)
	{
		tableControls[filFocus].params.whereclause = tableControls[filFocus].oldWhereclause + serial;
		tableControls[filFocus].callback(tableControls[filFocus].params);
	}
	
};
quickforms.clearFilter = function(divId){
        
        var tableControl = quickforms.tableControl.list[divId],
        filter = tableControl.filter;
		filter.newPage.dialog("close");
		for(var i=0;i<filter.form.children.length;i++)
		{
			var child = filter.form.children[i];
			setCookie(child.parent.id + child.id,'',1);
		}
        window.setTimeout(function(){
			filter.newPage.remove();
			$(document).one('pageinit', filter.pageId, function(){
				$.mobile.changePage(filter.url);	
			});
			quickforms.loadFilter(filter.url,filter.divId);
        },50);
};
quickforms.cancelFilter = function(divId)
{
	//$('#ui-datepicker-div').remove();
	var tableControls = quickforms.tableControl.list;
	for(var divId in tableControls)
	{
		tableControls[divId].callback(tableControls[divId].params);
	}
};
quickforms.form.domParsers.push(function(formObj){
    if(formObj.fact.indexOf('filter')>=0) // ensure persisted module does not confict with another form
    {
        formObj.completedListeners.push(function(){
                for(var i in formObj.children)
                {
                        var child = formObj.children[i];

                        child.dom.on('change',function(){
                                var obj = formObj.childMap[$(this)[0].id];
								var label = $('label[for="'+obj.dom[0].id+'"]');
								if(!obj.notSelected())
								{
									obj.included = true;
									if(label.length>0)
									{
											if(label[0].innerHTML.indexOf("Included")==-1)
													label[0].innerHTML += " (Included)";
									}
								}
								else
								{
									obj.included = false;
									label[0].innerHTML = label[0].innerHTML.replace(" (Included)",'');
								}
                        });
                        if(!isNull(getCookie(formObj.id+child.id)))
                                child.dom.trigger('change');
                }
                var tableControl = quickforms.tableControl.list[formObj.tableId],
                        filter = tableControl.filter;
                filter.completed = true;
        });
    }
});

});