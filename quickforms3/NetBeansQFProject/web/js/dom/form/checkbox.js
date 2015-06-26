/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['dom/form/form'],
function (){
	quickforms.CheckboxElement = function(dom,formObj,label) // Monitors checkbox activity
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.parent = formObj;
		this.label = label;
		this.hasBeenClicked = false;
		this.selectedField = 0;
                this.domType = dom.attr('type'); // radio or checkbox
		this.rememeber = dom.is("[remember]");
		this.multiple = dom.is("[multiple]");  // No need to insert into database if unchecked
		dom.on('change',function(eventData){
			me.changeSelection($(this));
			quickforms.form.updateRadios(me.parent,me.name);
		});
		if(this.domType == "radio")
		{
			var legendDom = dom.parents('fieldset').find('legend');
			this.label = legendDom.text() + ': '+this.label;
			formObj.radioGroups = formObj.radioGroups || {}
			formObj.radioGroups[this.name] = formObj.radioGroups[this.name] || [];
			formObj.radioGroups[this.name].push(this);
		}
		this.changeSelection = function(check)
		{
			me.hasBeenClicked = true;
			if(check.is(":checked") == true) {
			    me.selectedField = check.val();
				if(me.rememeber)
					setCookie(formObj.id+me.name,check.val(),quickforms.rememberLength);
				me.checked = true;
			}
			else{
				me.checked = false;
				me.selectedField = 0;

			}
			
		};
		this.serialize = function(multi)
		{
                    if(this.domType == "radio")
                    {
                        if(this.checked)
                            return this.name+'='+this.selectedField;
                    }
                    else
                    {
                        if(!multi || this.checked)// filldiv checkboxes should only save when checked
                            return this.name+'='+this.selectedField;
			return '';
                    }
		};
                this.filter = function()
		{
			return this.name +'='+this.selectedField;
		};
		this.summary = function(multiple)
		{
			if(multiple && this.checked == true)
			{
				return this.label;
			}
			if(this.checked == true){
			
				return this.label + "<br />";
			}
			return '';
		};
		this.notSelected = function()
		{
			return !this.hasBeenClicked;
		};
	}
	quickforms.form.domParsers.push(function(formObj){
		
		var checks = formObj.dom.find('input[type="checkbox"],input[type="radio"]');
		
		checks.each(function(i,chek){
			chek = $(chek);
			if(!isNull(chek.attr('name')))
			{
				var checkLabel = chek.siblings('label[for="'+chek.attr('id')+'"]');
				
				var chekObj = new quickforms.CheckboxElement(chek,formObj,checkLabel.text());
				
				if((!isNull(formObj.updateId) && formObj.updateRow[chekObj.name] == chek.val())
                                        || (getCookie(formObj.id+chekObj.name) == chek.val() && isNull(formObj.updateId)) )
				{
					chek.attr('checked','checked');
					chekObj.changeSelection(chek);
				}
				chek.checkboxradio('refresh');
				formObj.addChild(chekObj);
				window.setTimeout(function(){formObj.finishedParsing();},1);
			}
		});
		for(var name in formObj.radioGroups)
		{
			quickforms.form.updateRadios(formObj,name);
		}
	});
	quickforms.form.updateRadios = function(formObj,name)
	{
		if(formObj.radioGroups)
		{
			var radGroup = formObj.radioGroups[name];
			if(!isNull(radGroup))
			{
				for(var i = 0; i< radGroup.length;i++)
				{
					radGroup[i].dom.checkboxradio('refresh');
					radGroup[i].changeSelection(radGroup[i].dom);
				}
			}
		}
	};
});
