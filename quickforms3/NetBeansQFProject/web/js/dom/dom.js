/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(function(){
quickforms.domElements = [];
quickforms.DomElement = function(dom) // Create one of these for every control
{
	var me = this;
	this.dom = dom;
	if(dom)
	{
		this.name = dom.attr("name");
		this.id = dom.attr("id");
		if(dom.attr("remember")=="")
		{
			dom.on('change',function(){
				setCookie(me.parent.id+me.id,$(this).val(),quickforms.rememberLength);
			});
		}
		if(dom.is('[qf-users]') && dom.attr('qf-users').indexOf(getCookie('userRole'))<0)
		{
			dom.attr("disabled", "disabled");
			dom.parent().attr('style','display:none');
			$('label[for="'+dom[0].id+'"]').attr('style','display:none');
		}
	}
	this.addedData = [];
	this.onChange = function(){};
	this.onBlur = function(){};
	quickforms.domElements.push(this);
	this.summary = function(){return this.name;}
	
}
});