/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['dom/form/form',
	'server/getMultiData',
	'dom/form/checkbox',
	'dom/form/select'],
function (){ 
	quickforms.FillDiv = function(dom,formObj) // Fills a div with selects or checkboxes from the database
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.parent = formObj;
		this.id = this.dom.attr('id');
		this.tab = $('a[href="#'+this.id+'"]');
		this.label = this.tab.text();
		this.serialize = function()
		{
			var curSerialize = '';
			for(var i in this.addedData)
			{
				var child = this.addedData[i],
					childSerial = child.serialize('multi');
				if(i>0 && isNull(childSerial) == false) curSerialize += "&";
				curSerialize+= childSerial;
			}
			return curSerialize;
		};
		this.summary = function()
		{
			var thisSummary = "<b>"+this.label+"</b><br/>",
			    childSummaries= "";
			for(var i in this.addedData)
			{
				var child = this.addedData[i],
					childSummary = child.summary('multi');
				if(child instanceof quickforms.CheckboxElement && isNull(childSummary) == false)
				{
					childSummaries += childSummary + "<br />";
				}
				else if(child instanceof quickforms.SelectElement && isNull(childSummary) == false)
				{
					childSummaries += childSummary;
				}
			}
			if(childSummaries == "")
				return "";
			return thisSummary+childSummaries;
		};
		this.parseFilter = function(filter){
			var filterReturn = '';
			if(filter != null)
			{
				var filters = filter.split(',');
				for(var i=0;i<filters.length;i++)
				{
					if(filterReturn != '')
							filterReturn +=",";

					if(filters[i].indexOf('=')>=0) // Server side filtering
					{
						filterReturn += filters[i];
					}
					else // Client side categorization, server side sorting 
					{
						this.category = filters[i];
						
						filterReturn+= filters[i]
					}
				}
			} 
			return filterReturn;
		};
	}
	quickforms.form.domParsers.push(function(formObj){
		
		var fills = formObj.dom.find('div[qf-type]');
		
		fills.each(function(i,fill){
			fill = $(fill);
			
			var fillObj = new quickforms.FillDiv(fill,formObj);
			var filter = fillObj.parseFilter(fill.attr('qf-filter'));
			
			formObj.addChild(fillObj); 
			fillObj.parentForm = formObj;
			fillObj.query = quickforms.getMultiData.call(fillObj,formObj.app,
										formObj.fact,
										fill.attr('qf-lookup'),
										filter,
										formObj.updateId,
										quickforms.addAttributes);
			
		});
	});
	quickforms.addAttributes = function(data)
	{
		var fillObj = this; // fillObj
		var qfType=fillObj.dom.attr('qf-type');
		fillObj.type = qfType;
		fillObj.qfLabelCols = fillObj.dom.attr('qf-label-cols');
		fillObj.lookup= fillObj.dom.attr('qf-lookup');
		fillObj.filter = fillObj.dom.attr('qf-filter');
		fillObj.multiple = fillObj.dom.attr('multiple') || '';
		fillObj.addSelectLabels = (fillObj.dom.attr('qf-show-category') || "false") == "true";
		if(qfType=='select')
		{
			quickforms.convertJSONtoFillSelect(fillObj,data);
			fillObj.dom.children('select').selectmenu();
			//fillObj.dom.trigger("create");
		}
		else if(qfType=='checkbox')
		{
			quickforms.convertJSONtoFillCheckbox(fillObj,data);
			fillObj.dom.checkboxradio();
			fillObj.dom.trigger("create");
		}
		fillObj.parentForm.finishedParsing();
		//var selectField = new quickforms.DomElement($('#'+fieldId));
	}
	quickforms.convertJSONtoFillCheckbox = function(fillObj,data)
	{
		if(isJSONString(data)){
			fillObj.dom.children().remove();
			fillObj.addedData = [];
			var json = JSON.parse(data),
				currentCategory='';
			for(var i=0;i<json.length;i++)
			{
				var keyColumnName = "",
					jsoni = json[i];
				for(var col in jsoni)
				{
					if(col.indexOf('Key')>=0)
					{
						keyColumnName = col;
						fillObj.keyColumnName = col;
					}
				}
				if(fillObj.category != null && jsoni[fillObj.category] != currentCategory)
				{
					currentCategory = jsoni[fillObj.category];
					fillObj.dom.append('<h2>'+currentCategory+'</h2>');
				}
				var checkDom = $('<input id= "'+fillObj.id+i+'" name="'+fillObj.lookup+'" type="checkbox" value='+jsoni[keyColumnName]+' />');
				if(jsoni.selected == 'selected')
				{
					checkDom.attr('checked','checked');
				}
				fillObj.dom.append(checkDom);
				fillObj.dom.append($('<label for="'+fillObj.id+i+'">'+jsoni[fillObj.qfLabelCols]+'</label>'));
				var checkObj = new quickforms.CheckboxElement(checkDom,fillObj.parentForm,jsoni[fillObj.qfLabelCols]);
				fillObj.addedData.push(checkObj);
				if(jsoni.selected)
				{
					fillObj.selectedField = jsoni.id;
					checkObj.changeSelection(checkDom);
				}
			}
		}
	}
	quickforms.convertJSONtoFillSelect = function(fillObj,data)
	{
		if(isJSONString(data)){
			fillObj.dom.children().remove();
			fillObj.addedData = [];
			var json = JSON.parse(data),
			    currentCategory = "",
				selectDom,
				selectObj,
				i=0;
			for(i=0;i<json.length;i++)
			{
				var keyColumnName = "";
				var jsoni = json[i];
				for(var col in jsoni)
				{
					if(col.indexOf('Key')>=0)
					{
						keyColumnName = col;
						fillObj.keyColumnName = col;
					}
				}
				if(jsoni[fillObj.category] != currentCategory)
				{
					currentCategory = jsoni[fillObj.category];
					if(fillObj.addSelectLabels)
						fillObj.dom.append("<label for = '"+fillObj.id+i+"'>"+currentCategory+"</div>");
					selectDom = $('<select name="'+fillObj.lookup+'" id="'+fillObj.id+i+'" data-native-menu="'+quickforms.dataNativeMenu+'" '+fillObj.multiple+'></select>');
					fillObj.dom.append(selectDom);
					selectObj = new quickforms.SelectElement(selectDom,fillObj.parentForm,fillObj.multiple == 'multiple');
					selectObj.category = currentCategory;
					if(!fillObj.addSelectLabels)
						selectDom.append('<option data-placeholder="true">'+currentCategory+'</option>')
					else
						selectDom.append('<option data-placeholder="true"></option>')
					fillObj.addedData.push(selectObj);
				}
				
				selectDom.append('<option value='+jsoni[keyColumnName]+' '+jsoni.selected+'>'+jsoni[fillObj.qfLabelCols]+'</option>');

				if(jsoni.selected)
				{
					fillObj.selectedField = jsoni.id;
					selectObj.changeSelection();
				}
			}
		}
		else
		{
			console.log("Error : "+data);
		}
	}
});
