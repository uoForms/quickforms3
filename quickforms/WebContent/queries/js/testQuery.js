define(function(){
   window.params = [];
    window.onQueryChange = function(dom)
    {
            var me = dom,
                    parameters = me.val().split('?').length -1,
                    paramDom = $('#params');
            if(parameters != paramDom.children().length)
            {
                    window.params = [];
                    paramDom.html('');
                    for(var i=0;i<parameters;i++)
                    {
                            var param = $('<input type = "text" id = "param'+i+'" />');
                            window.params.push(param);
                            paramDom.append(param);
                    }
                    paramDom.trigger('create');
            }
    };

    $('#query').on('keyup',function(){
            onQueryChange($(this));
    });
    window.testQuery = function(){
            quickforms.errorMessage = "";
            var temp1 = quickforms.currentFormqueriesForm.childMap.queryLabel.currentVal,
                    temp2 = quickforms.currentFormqueriesForm.updateId;
            quickforms.currentFormqueriesForm.childMap.queryLabel.currentVal = "testQuery";
            quickforms.currentFormqueriesForm.updateId = 1;
            quickforms.putFact($('form a')[0],'#');
            quickforms.currentFormqueriesForm.childMap.queryLabel.currentVal = temp1;
            quickforms.currentFormqueriesForm.updateId = temp2;
            var paramList = "";
            for(var i=0;i<window.params.length;i++){
                    if(i>0)
                            paramList += ",";
                    paramList +="="+window.params[i].val();
            }
            quickforms.initLoadingGif();
            window.setTimeout(function(){
                    quickforms.hideLoadingGif();
                    quickforms.loadTableReport(//appName, queryName*, parameterList,whereclause, callback, domId*,configFile 
                            {queryName:'testQuery',domId:'testQuery', whereclause : quickforms.currentFormqueriesForm.childMap.Whereclause.currentVal,
                            parameterList: paramList,
                            callback:function(){
                                    if(quickforms.errorMessage)
                                    {
                                            quickforms.hideLoadingGif();
                                            alert("Error: "+quickforms.errorMessage);
                                    }
                            }});
            },1400);

    }; 
});
