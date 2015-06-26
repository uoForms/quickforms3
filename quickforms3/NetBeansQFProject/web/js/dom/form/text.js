/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['dom/form/form',
	'server/getFieldSelection'],
function (){
	quickforms.TextElement = function(dom,formObj) // Monitors text activity
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.parent = formObj;
                if(dom)
                {
                    this.currentVal = dom.val();
                    dom.on('change',function(eventData){
                            me.currentVal = $(this).val();     
                    });
                }
		this.serialize = function()
		{
			if(this.type=='password' && this.currentVal.length!=32) // dont double md5
			{
				return this.name+"="+md5(this.currentVal);
			}
			else
			{
				return this.name +"="+encodeURIComponent(this.currentVal);
			}
		};
		this.summary = function()
		{
			if(!isNull(this.currentVal))
				return this.currentVal+"<br />";
			return '';
		};
                this.filter = function()
		{
			return this.name+'=\''+this.currentVal+'\'';
		};
		this.parseDom = function(formObj)
		{
                        var remembered = getCookie(formObj.id+this.id);
			if(!isNull(formObj.updateId))
			{
				this.dom.val(formObj.updateRow[this.name]);
				this.currentVal = formObj.updateRow[this.name];
			}
                        if(isNull(formObj.updateId) && !isNull(remembered))
			{
				this.dom.val(remembered);
				this.currentVal = remembered;
			}
			if(this.dom.attr("type") == 'password')
			{
				require(['helper/md5']);
				this.type='password';
			}
			formObj.addChild(this);
			window.setTimeout(function(){formObj.finishedParsing();},1);
		};
		this.notSelected = function()
		{
			return isNull(this.currentVal);
		};
	};
	quickforms.form.domParsers.push(function(formObj){
		var texts = formObj.dom.find('input[type=text],input[type=hidden],textarea,input[type=password]');
		texts.each(function(i,tex){
			tex = $(tex);
			
			var texObj = new quickforms.TextElement(tex,formObj);
			texObj.parseDom(formObj);
		});
	});
	
});
