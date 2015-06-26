/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['server/server'],function(){
quickforms.getFakeFactData = '[{"id":1,"form":"test","Car Type":"Mazda","My Rating":"80%"},{"id":2,"form":"test","Car Type":"Volvo","My Rating":"90%"},{"id":3,"form":"test","Car Type":"Audi","My Rating":"40%"}]';
quickforms.getFactData = function (params) { // appName*, queryName, params*,whereclause*, callback
        params.appName = params.appName || quickforms.app;
        params.params = params.params || '';
        params.whereclause = params.whereclause || '' ;
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "GET",
		url: quickforms.quickformsUrl+'getResultSet'+quickforms.quickformsEnding,
		data: {app:params.appName,
                        queryLabel: params.queryName,
                        params: params.params,
                        whereclause: params.whereclause
                        }
	});
	serverQuery.fakeData = quickforms.getFakeFactData;
	serverQuery.addSuccessListener(
		function(data){
			params.callback.call(me,data);
			});
	serverQuery.addErrorListener(
		function(data){
			params.callback.call(me,data);
			});
	serverQuery.run();
	quickforms.serverQueries.push(serverQuery);
	return serverQuery;
}
});