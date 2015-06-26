/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(function(){
quickforms.getFieldSelection = function(app,fact,field,id,callback){
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "GET",
		url: quickforms.quickformsUrl+'getFieldSelection'+quickforms.quickformsEnding,
		data: {app:app,
				factTable: fact,
				field: field,
				updateid : id || ""
				}
	});
	serverQuery.fakeData = '[{"id":"1","selected":"selected","label":"Not Specified"},{"id":"2","selected":"","label":"Audi"},{"id":"3","selected":"","label":"Volvo"}]';
	serverQuery.field = field;
	serverQuery.addSuccessListener(
		function(data){
			callback.call(me,serverQuery.field,data);
			});
	quickforms.serverQueries.push(serverQuery);
	serverQuery.run();
	return serverQuery;
	
};
});