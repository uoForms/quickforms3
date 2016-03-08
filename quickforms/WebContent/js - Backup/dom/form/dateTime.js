/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['dom/form/form','dom/form/text',
	'jquery/jquery-ui-1.10.4.custom.min'],
function (){
	quickforms.form.domParsers.push(function(formObj){
		quickforms.loadCss(quickforms.cssUrl+'jquery/jquery-ui-1.10.3.custom.min.css');
		quickforms.loadCss(quickforms.cssUrl+'jquery/jquery.time.addon.css');
		require(['jquery/jquery-ui-timepicker-addon'],function(){
			var dateDom = formObj.dom.find('input.dateTime');
			dateDom.datetimepicker({
				ampm: true
			});
		});
	});
        quickforms.extendClass('TextElement',function(texObj){
            var oldFilter = texObj.filter;
            texObj.filter = function(){
                if(texObj.dom.hasClass('datTime'))
                {
                    var datePart = 'convert(varchar,'+texObj.name+',101) + \' \'+';
                    var timePart = 'convert(varchar,DATEPART(hour,'+texObj.name+')) + \':\'+convert(varchar,DATEPART(minute,'+texObj.name+'))';
                    return datePart+timePart+"='"+texObj.dom.val()+"'";
                }
                else
                {
                    return oldFilter.call(texObj);
                }
            }
        });
});
