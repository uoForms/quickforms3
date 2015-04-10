/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['dom/form/form'],
function (){
    quickforms.RangeElement = function(dom,formObj)
    {
            quickforms.DomElement.call(this,dom); // super call to get parent attributes
            var me = this;
            this.parent = formObj;
            this.serialize = function()
            {
                    return '';
            };
            this.summary = function()
            {
                    var summary = '';
                    if(this.left.val())
                    {
                            summary += this.left.attr('name')+" > '"+this.left.val()+"'";
                    }			
                    if(this.right.val())
                    {
                            if(this.left.val())
                                            summary += " and ";
                            summary += this.right.attr('name')+" < '"+this.right.val()+"'";
                    }
                    return summary;
            };
            this.filter = function(){
                    var filter = '';
                    if(this.left.val())
                    {
                            filter += this.left.attr('name')+">='"+this.left.val()+"'";
                    }			
                    if(this.right.val())
                    {
                            if(this.left.val())
                                            filter += " and ";
                            filter += this.right.attr('name')+"<='"+this.right.val()+"'";
                    }
                    return filter;
            };
			this.notSelected = function()
			{
				return isNull(this.left.val()) && isNull(this.right.val());
			};
    };
    quickforms.form.domParsers.push(function(formObj){
        if(formObj.fact.indexOf('filter')>=0) // ensure persisted module does not confict with another form
        {	
			
            $('div[class="range"]').each(function(i,dom){
                    dom = $(dom);

                                    var rangeCheck = $('<input type="checkbox" data-inline="true"/>');
                                    rangeCheck.checkboxradio();
                    var rangeObj = new quickforms.RangeElement(dom,formObj);
                    rangeObj.left = $(rangeObj.dom.find("input,select")[0]);
                    rangeObj.right = $(rangeObj.dom.find("input,select")[1]);
                    formObj.addChild(rangeObj);
                    window.setTimeout(function(){formObj.finishedParsing();},1);


                    formObj.completedListeners.push(function(){
                            dom.on('click',function(){
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
                            dom.trigger('click');
                    });

            });
			
        }
    });
});