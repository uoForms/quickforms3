/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['dom/form/form',
	'server/getFieldSelection'],
function (){
	quickforms.SelectElement = function(dom,formObj,multiple) // Monitors select activity
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.multiple = multiple;
		this.parent = formObj;
		this.selectedField='';
		this.measure = dom.is("[measure]"); // has attr measure
                this.offline = dom.is("[offline]"); // has attr offline
		if(this.multiple==true)
				this.selectedField = [];
		dom.on('change',function(eventData){
			me.changeSelection();
		});
		this.changeSelection = function()
		{
			me.label = '';
			if(me.multiple==true)
			{
				me.selectedField = [];
				me.label = [];
			}
			me.dom.find(":selected").each(function () {
				if(me.multiple==false)
				{
					me.selectedField = $(this).val();
					me.label +=$(this).text() ;
				}
				else
				{
					me.selectedField.push($(this).val());
					me.label.push($(this).text());
				}
				
			});
		};
		this.serialize = function()
		{
			if(this.multiple)
			{
				var retVal = '';
				for(var i=0;i<this.selectedField.length;i++)
				{
					if(i>0) retVal+= "&";
					retVal += this.name+'='+this.selectedField[i];
				}
				return retVal;
			}
			if(isNull(this.selectedField))
				return '';
				
			var retVal = this.name+'='+this.selectedField;
			if(this.measure)
				retVal += this.name+'Measure='+this.label;
			return retVal;
		};
		this.summary = function(multi)
		{
			if(this.label)
			{
				if(this.multiple)
				{
					var multiLabel = "";
					for(var i in this.label)
					{
						multiLabel += this.label[i]+"<br />";
					}
					return multiLabel;
				}
				return this.label + "<br />";
			}
			return '';
		};
		this.filter = function()
		{
			if(this.measure)
				return this.name +'=\''+this.label+'\'';
			return this.name +'=\''+this.selectedField+'\'';
		};
		this.notSelected = function()
		{
                        if(!this.label) return true;
			return this.label.indexOf('Not')>=0;
		};
	}
	quickforms.form.domParsers.push(function(formObj){
		
		var selects = formObj.dom.find('select');
		
		selects.each(function(i,sel){
			sel = $(sel);
			if(!isNull(sel.attr('name')))
			{
				var selObj = new quickforms.SelectElement(sel,formObj,sel.attr('multiple')=='multiple');
				formObj.addChild(selObj);
                                if(!selObj.offline)
                                {
                                    var name = selObj.name;
                                    selObj.query = quickforms.getFieldSelection.call(selObj,formObj.app,
											formObj.fact,
											name,
											formObj.updateId,
											quickforms.addSelectAttributes);
                                }
                                else
                                {
                                    selObj.dom.attr("data-native-menu",quickforms.dataNativeMenu);
                                    selObj.dom.selectmenu('refresh');
                                    selObj.parent.finishedParsing();
                                }
			}
		});
	});
	quickforms.addSelectAttributes = function(fieldId,data)
	{
		var selectField = this; // selObj
		var parent = selectField.parent;
		selectField.remembered = getCookie(parent.id+selectField.id);
		quickforms.convertJSONtoSelect(selectField,data);
		
		selectField.dom.attr("data-native-menu",quickforms.dataNativeMenu);
		selectField.dom.selectmenu('refresh');
		parent.finishedParsing();
	}
	quickforms.convertJSONtoSelect = function(field,data)
	{
		if(isJSONString(data)){
			field.dom.children().remove();
			field.addedData = [];
			var json = JSON.parse(data);
			for(var i=0;i<json.length;i++)
			{
				if((!field.parent.updateId && field.multiple) || (!isNull(field.remembered) && isNull(field.parent.updateId)))
					json[i].selected = "";
				if(!isNull(field.remembered) && field.remembered == json[i].id && isNull(field.parent.updateId))
					json[i].selected = "selected";
				field.addedData.push({type:'option',
						id:json[i].id,
						selected:json[i].selected,
                                                order:json[i].order,
						label:json[i].label});
                                if(json[i].order>=0 || (json[i].order == -1 && json[i].selected == "selected")) // Disable deleted select elements
                                    field.dom.append($('<option value="'+json[i].id+'" '+json[i].selected+'>'+json[i].label+'</option>'));

				if(json[i].selected)
				{
					field.changeSelection();
				}
			}
		}
		else
		{
			if(data == ']')
				field.parent.finishedParsing();
			else
				throw data;
		}
	}
});
