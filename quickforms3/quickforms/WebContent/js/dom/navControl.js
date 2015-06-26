/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(function(){
//$('html').addClass('ui-mobile-rendering');
quickforms.loadNav = function(url,divId, callback)
{
	$.ajax({
	  url: url,
	  success: function(html){
		successNav(html);
                if(callback)
                    callback();
	  }
	});
	function successNav(html)
	{
		var navDiv = $('#'+divId);
		navDiv.append(html);
		
		var pathname = filterPathName(window.location.pathname);
		var isInd = isIndex(pathname);
		navDiv.find('a').each(function(i,dom){
			var href = filterPathName(dom.href);
                        dom = $(dom);
			if(href == pathname || (isInd && href.indexOf('index')>=0))
				dom.addClass('ui-btn-active ui-state-persist');
		});
		navDiv.find('li').each(function(i,dom){
			dom = $(dom);
			if(dom.is('[qf-users]') && dom.attr('qf-users').indexOf(getCookie('userRole'))<0)
				dom.remove();
		});
		
		navDiv.trigger('create');
		//$('html').removeClass('ui-mobile-rendering');
	}
	function isIndex(pathname)
	{	
		var p = pathname;
		if (p.length === 0 || p === "/" || p.match(/^\/?index/) || p.charAt(p.length-1) === "/")
			return true;
		return false;
	}
	function filterPathName(path)
	{
		var curInd = path.indexOf('/');
		while(curInd>=0)
		{
			path = path.substr(curInd+1,path.length-1);
			curInd = path.indexOf('/');
		}
		return path;
	}
};
});