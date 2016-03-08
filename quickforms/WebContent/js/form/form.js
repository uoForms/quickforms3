/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
define(['server/putFact', 'server/getFactData', 'server/executeQuery', 'server/putPregappNotification'], function () {
    quickforms.form = {
        domParsers: []
    };

// Preventing to press enter
    $(document).keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });
// End function


    /**
     * Initiate form elements.
     * @param dom : id of the form
     * @param app : quickforms app name, if it's null then get the value of quickforms.app
     * @param fact : FACT table's name in database, if it's ccm form then it's the query's name
     * @param ccm : the form is ccm form or not. Please pass boolean value.
     */
    quickforms.FormElement = function (dom, app, fact, ccm) {
        quickforms.DomElement.call(this, dom); // super call to get parent attributes
        this.ccm = (ccm == 'true' || ccm == true) ? true : false;
        this.children = [];
        this.childMap = {};
        this.app = app || quickforms.app;
        this.fact = fact;
        this.type = "mainForm";
        this.childrenFinished = 0;
        this.completedListeners = [];
        this.updateSummary = function () {
            var summary = "",
                summaryDom = $('#' + this.summaryId);
            if (summaryDom.length > 0) {
                for (var child in this.children) {
                    summary += this.children[child].summary();
                }
                summaryDom.html(summary);
            }
        };
        this.serialize = function () {
            var formSerialized = "",
                childAdded = [];
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i],
                    childSerial = child.serialize();
                if (isNull(childSerial) == false)
                    childAdded.push(childSerial);
                //formSerialized += childSerial;
            }
            for (var i = 0; i < childAdded.length; i++) {
                if (i > 0)
                    formSerialized += "&";
                formSerialized += childAdded[i];
            }
            return formSerialized;
        };
        this.finishedParsing = function () {
            this.childrenFinished += 1;
            this.checkLoadingGif();
        };
        this.checkLoadingGif = function () {
            if (this.childrenFinished == this.children.length) {
                quickforms.hideLoadingGif();
                for (var i = 0; i < this.completedListeners.length; i++) {
                    this.completedListeners[i]();
                }
            }
            this.updateSummary();
        }
        this.scrubFormDataString = function (data) {
            data = data.replace("&&", "&");
            if (data.charAt(data.length - 1) == "&")
                data = data.substring(0, data.length - 1);
            return data;
        };
        this.addChild = function (child) {
            this.children.push(child);
            this.childMap[child.dom[0].id] = child;
        };
        this.getUpdateRow = function (callback) {
            var me = this;
            if (isNull(this.updateId)) {
                callback.call(quickforms);
            }
            else {
                var queryLabel = this.fact + (this.ccm ? "" : "_get_row");
                var prms = "updateId=" + this.updateId;
                quickforms.getFactData({
                    queryName: queryLabel,
                    params: prms,
                    callback: function (data) {
                        if (me.ccm) {
                            me.updateRow = parseCcmContent(data, me.id.replace("currentForm", ""), me.updateId);
                        } else {
                            me.updateRow = JSON.parse(data)[0];
                        }

                        callback.call(quickforms);
                    }
                });
                if (getCookie('userRole') == 'Administrator') {
                    var onClick = "quickforms['" + this.id + "'].deleteRow()";
                    this.dom.find('.buttons.deleteAdmin').append('<a href="#" rel="external" onClick="' + onClick + '" data-role="button" data-inline="true" data-icon="delete">Delete</a>');
                    this.dom.find('.buttons.deleteAdmin').trigger('create');
                }

                var onClick = "quickforms['" + this.id + "'].deleteRow()";
                this.dom.find('.buttons.delete').append('<a href="#" rel="external" onClick="' + onClick + '" data-role="button" data-inline="true" data-icon="delete">Delete</a>');
                this.dom.find('.buttons.delete').trigger('create');
            }
        };
        this.deleteRow = function () {
            var me = this;
            quickforms.confirm("Are you sure you want to delete this record?", function () {
                quickforms.executeQuery(quickforms.app, me.fact + '_delete_row',
                    'id=' + me.updateId, function () {
                        window.history.back();
                    });
            });
        };

        var parseCcmContent = function (jSonData, formId, level1Key) {
            var jsonObj = {};
            var tmpJsonObj = JSON.parse(jSonData);
            var formDom = document.getElementById(formId);
            var titleDom = document.createElement("h1");
            titleDom.appendChild(document.createTextNode(tmpJsonObj[0].title));
//		formDom.insertBefore(titleDom,formDom.childNodes[0]);
            formDom.appendChild(titleDom);
            for (var i = 0; i < tmpJsonObj.length; i++) {
                jsonObj[tmpJsonObj[i].contentId] = tmpJsonObj[i].contentHTML;
                var textareaDom = document.createElement("textarea");
                textareaDom.className = "dynamicText";
                textareaDom.name = tmpJsonObj[i].contentId;
                textareaDom.rows = "0";
                textareaDom.cols = "0";
//		    formDom.insertBefore(textareaDom,formDom.childNodes[i+1]);
                formDom.appendChild(textareaDom);

            }
            var prms = "updateId=" + level1Key;
            quickforms.getFactData({
                queryName: "getLastAndNext",
                params: prms,
                callback: function (data) {
                    var jsonObj = JSON.parse(data)[0];
                    var btnsDivDom = document.createElement("div");
                    btnsDivDom.className = "buttons";
                    if (jsonObj.lastId && jsonObj.lastId != "" && jsonObj.lastId != "null") {
                        var lastBtnDom = document.createElement("a");
                        lastBtnDom.href = "content.html?id=" + jsonObj.lastId;
                        lastBtnDom.rel = "external";
                        lastBtnDom.setAttribute("data-role", "button");
                        lastBtnDom.setAttribute("data-icon", "check");
                        lastBtnDom.setAttribute("data-theme", "b");
                        lastBtnDom.setAttribute("data-inline", "true");
                        lastBtnDom.appendChild(document.createTextNode(jsonObj.lastLabel));
                        btnsDivDom.appendChild(lastBtnDom);
                    }

                    var homeBtnDom = document.createElement("a");
                    homeBtnDom.href = "index.html";
                    homeBtnDom.rel = "external";
                    homeBtnDom.setAttribute("data-role", "button");
                    homeBtnDom.setAttribute("data-icon", "back");
                    homeBtnDom.setAttribute("data-theme", "c");
                    homeBtnDom.setAttribute("data-inline", "true");
                    homeBtnDom.appendChild(document.createTextNode("Home"));
                    btnsDivDom.appendChild(homeBtnDom);

                    if (jsonObj.nextId && jsonObj.nextId != "" && jsonObj.nextId != "null") {
                        var nextBtnDom = document.createElement("a");
                        nextBtnDom.href = "content.html?id=" + jsonObj.nextId;
                        nextBtnDom.rel = "external";
                        nextBtnDom.setAttribute("data-role", "button");
                        nextBtnDom.setAttribute("data-icon", "check");
                        nextBtnDom.setAttribute("data-theme", "b");
                        nextBtnDom.setAttribute("data-inline", "true");
                        nextBtnDom.appendChild(document.createTextNode(jsonObj.nextLabel));
                        btnsDivDom.appendChild(nextBtnDom);
                    }
                    formDom.appendChild(btnsDivDom);

                }
            });

            return jsonObj;
        };


    };
    quickforms.parseForm = function (params)//formId,app*,fact,callback*
    {
        var formDom = $('#' + params.formId);
        quickforms.app = params.app || quickforms.app;
        var formObj = new quickforms.FormElement(formDom, quickforms.app, params.fact, params.ccm);
        formObj.updateId = getParameterByName('id');
        formObj.id = 'currentForm' + params.formId;
        quickforms.initLoadingGif();

        formObj.getUpdateRow(function () {
            for (var i = 0; i < this.form.domParsers.length; i++) {
                this.form.domParsers[i](formObj);
            }
            formObj.checkLoadingGif();
            if (params.callback)
                params.callback();
        });
        quickforms[formObj.id] = formObj;
        quickforms.loadCss(quickforms.cssUrl + "quickforms/form.css");
        quickforms.loadCss("css/custom.css");
    };
    quickforms.putFact = function (context, redirect)// context is JavaScript object of submit button, redirect is the url to navigate to on success
    {
        context = $(context);
        context.attr('html', '');
        var formId = context.parents('form')[0].id;
        var formObj = quickforms['currentForm' + formId];
        var formSerialized = "app=" + formObj.app + "&";
        quickforms.redirectUrl = redirect;

        formSerialized += "factTable=" + formObj.fact + "&updateid=" + formObj.updateId + "&";
        formSerialized += formObj.serialize();
        formSerialized = formObj.scrubFormDataString(formSerialized);

        quickforms.putFactServer.call(formObj, formSerialized, quickforms.formRedirect);
        if (quickforms.offline) {
            $.mobile.activePage.append('<div id="offlineInfo">Data sent to server : <br />' + formSerialized + '</div>');
            window.setTimeout(function () {
                $('#offlineInfo').remove()
            }, 5000);
        }
    };
    quickforms.sendPregappEmail = function (context, redirect)// context is JavaScript object of submit button, redirect is the url to navigate to on success

    {
        try {
            //alert('clicked');
            context = $(context);
            context.attr('html', '');
            var formId = context.parents('form')[0].id;


            var formObj = context.parents('form')[0];
            var formSerialized = "app=pregapp&";
            quickforms.redirectUrl = redirect;


            if (formObj.elements["chkMode"].checked)
                formSerialized += "chkMode=true";

            else
                formSerialized += "chkMode=false";


            quickforms.putPregappNotification.call(formObj, formSerialized, quickforms.formRedirect);
        } catch (e) {
            alert('error activating email:' + e.message);
        }


        if (quickforms.offline) {
            $.mobile.activePage.append('<div id="offlineInfo">Data sent to server : <br />' + formSerialized + '</div>');
            window.setTimeout(function () {
                $('#offlineInfo').remove()
            }, 5000);
        }

    };
    quickforms.autoStartEmailNotification = function (formObj, formDataSerialized, redirect) {
        try {
            quickforms.redirectUrl = redirect;
            quickforms.putPregappNotification.call(formObj, formDataSerialized, quickforms.formRedirect);


        } catch (e) {
            alert('error activating email:' + e.message);
        }


        if (quickforms.offline) {
            $.mobile.activePage.append('<div id="offlineInfo">Data sent to server : <br />' + formSerialized + '</div>');
            window.setTimeout(function () {
                $('#offlineInfo').remove()
            }, 5000);
        }

    };
    quickforms.formRedirect = function (data) {
        if (quickforms.redirectUrl != null) {
            var json = JSON.parse(data);
            window.location = quickforms.redirectUrl + "?rowId=" + json[0].id;


            //$.mobile.changePage(quickforms.redirectUrl+"?id="+json[0].id);
        }


    };
});