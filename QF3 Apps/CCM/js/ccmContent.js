/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['server/putFact','server/getFactData','server/executeQuery'],function(){
quickforms.ccmContent = {
	domParsers : []
};

// Preventing to press enter
$(document).keypress(function(event){
	if (event.keyCode == 13) {
		event.preventDefault();	
	}
});
// End function

quickforms.ccmContentElement = function(dom,app,query) // Maintains all QF's form objects
{
	quickforms.DomElement.call(this,dom); // super call to get parent attributes
	this.children = [];
        this.childMap = {};
	this.app = app || quickforms.app;
	this.query = query;
	this.type="mainForm";
	this.childrenFinished = 0;
        this.completedListeners = [];
	this.updateSummary = function()
	{
		var summary = "",
			summaryDom = $('#'+this.summaryId);
		if(summaryDom.length>0)
		{
			for(var child in this.children)
			{
				summary += this.children[child].summary();
			}
			summaryDom.html(summary);
		}
	};
	this.serialize = function()
	{
		var ccmContentSerialized = "",
			childAdded = [];
		for (var i=0;i<this.children.length;i++)
		{
			var child = this.children[i],
				childSerial = child.serialize();
			if(isNull(childSerial) == false)
				childAdded.push(childSerial);
				//ccmContentSerialized += childSerial;
		}
		for(var i=0;i<childAdded.length;i++)
		{
			if(i>0)
				ccmContentSerialized += "&";
			ccmContentSerialized += childAdded[i];
		}
		return ccmContentSerialized;
	};
	this.finishedParsing = function()
	{
		this.childrenFinished +=1;
		this.checkLoadingGif();
	};
	this.checkLoadingGif = function()
	{
		if(this.childrenFinished == this.children.length)
		{
			quickforms.hideLoadingGif();
                        for(var i=0;i<this.completedListeners.length;i++)
                        {
                            this.completedListeners[i]();
                        }
		}
		this.updateSummary();
	}
	this.scrubccmContentDataString = function(data)
	{
		data = data.replace("&&","&");
		if(data.charAt(data.length-1) == "&")
			data = data.substring(0,data.length-1);
		return data;
	};
        this.addChild = function(child)
        {
            this.children.push(child);
            this.childMap[child.dom[0].id] = child;
        };
	this.getUpdateRow = function(callback)
	{
		var me = this;
		if(isNull(this.updateId))
		{
			callback.call(quickforms);
		}
		else
		{
                        var queryLabel = this.query;
                        var prms = "updateId="+this.updateId;
			quickforms.getFactData({queryName:queryLabel, 
                                                params:prms,
                                                callback: function(data){
                                                    me.updateRow = function(data){
                                                	var jsonObj;
                                                	var tmpJsonObj = JSON.parse(data);
                                                	for(var i = 0; i < tmpJsonObj.length; i++){
                                                	    jsonObj.push(tmpJsonObj[i].contentId,tmpJsonObj[i].contentHTML);
                                                	}
                                                	return jsonObj;
                                                    };
                                                	
                                                    callback.call(quickforms);
                                                }
                                            });
                }
        };

};
quickforms.parseCcmContent = function(params)//ccmContentId,app*,query,callback*
{
	var ccmContentDom = $('#'+params.ccmContentId);
	quickforms.app = params.app || quickforms.app;
	var ccmContentObj = new quickforms.ccmContentElement(ccmContentDom,quickforms.app,params.query);
	ccmContentObj.updateId = getParameterByName('id');
	ccmContentObj.id = 'currentCcmContent'+params.ccmContentId;
	quickforms.initLoadingGif();
	
	ccmContentObj.getUpdateRow(function(){
		for (var i=0;i<this.ccmContent.domParsers.length; i++)
		{
			this.ccmContent.domParsers[i](ccmContentObj);
		}
		ccmContentObj.checkLoadingGif();
		if(params.callback)
			params.callback();
	});
	quickforms[ccmContentObj.id] = ccmContentObj;
	quickforms.loadCss(quickforms.cssUrl+"quickforms/form.css");
};

quickforms.ccmContentRedirect = function(data)
{
	if(quickforms.redirectUrl != null)
	{
		var json = JSON.parse(data);
		window.location = quickforms.redirectUrl+"?rowId="+json[0].id;
		
	}
	
};
});