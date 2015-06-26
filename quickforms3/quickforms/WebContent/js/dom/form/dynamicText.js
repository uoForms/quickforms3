/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com. Sonia Peri, soniaperi@ymail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['jquery/jquery.cleditor.min','dom/form/text'],function()
{
	quickforms.loadCss (quickforms.cssUrl+'jquery/jquery.cleditor.css')  
	quickforms.form.domParsers.push(function(formObj)
	{
			
		var textarea = formObj.dom.find('textarea.dynamicText')						// finds dynamic text areas
		if(getCookie('userRole') == 'Administrator')
		{
		       var options = {
				width: '100%',
				height: 600,
				controls: "bold italic underline strikethrough subscript superscript | font size " +
						"style | color highlight removeformat | bullets numbering | outdent " +
						"indent | alignleft center alignright justify | undo redo | " +
						"rule link image unlink | cut copy paste pastetext | print source"
			};
			var buttons = $('<div class="normaldiv"><a href="#" data-role="button" data-inline="true" id="btnClear">Clear</a></div>');
			textarea.after(buttons);
			buttons.trigger('create');
			var editor = textarea.cleditor(options)[0];	   
			$(editor).on("change",function(){
				formObj.childMap[textarea.attr('id')].currentVal = textarea.val();
			});
			$("#btnClear").click(function (e) {
				e.preventDefault();
				editor.focus();
				editor.clear();
			});
			formObj.completedListeners.push(function(){textarea.blur();})	
		}	
		else
		{
			formObj.completedListeners.push(function(){ 
				var textarea = formObj.dom.find('textarea.dynamicText')
				textarea.each(function(i,dom){				
						$(dom).after(formObj.updateRow[dom.name]);
						$(dom).remove();
					});
			});	

		}
	});		
});
