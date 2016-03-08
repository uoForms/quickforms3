/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
define(['server/putFact', 'server/getFactData', 'server/executeQuery', 'server/updateLookup', 'server/putPregappNotification'], function () {
    quickforms.form = {
        domParsers: []
    };

//  Preventing to press enter
    $(document).keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });
//  End function


    /**
     * Initiate form elements.
     * @param dom : id of the form
     * @param app : quickforms app name, if it's null then get the value of quickforms.app
     * @param fact : FACT table's name in database, if it's ccm form then it's the query's name
     * @param ccm : the form is ccm form or not. Please pass boolean value.
     */
    quickforms.FormElement = function (dom, app, fact, ccm) {
        quickforms.DomElement.call(this, dom); // super call to get parent attributes
        this.ccm = (("" + ccm).trim().length > 0 && ccm != false && ccm != "false") ? ccm : false;
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
//		var whereclause = this.ccm?"a.level1="+this.updateId:null;
                quickforms.getFactData({
                    queryName: queryLabel,
                    params: prms,
//		    whereclause:whereclause,
                    callback: function (data) {
                        if (me.ccm) {
                            me.updateRow = parseCcmContent(data, me.id.replace("currentForm", ""), me.updateId, me.level2Key, me.ccm);
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

        var parseCcmContent = function (jSonData, formId, level1Key, level2Key, ccm) {
            var jsonObj = {};
            var tmpJsonObj = JSON.parse(jSonData);
            var formDom = document.getElementById(formId);
            var titleDom = document.createElement("h1");
            var editBtn = document.getElementById("editBtn");
//	    alert(ccm);
            if (ccm == "display") {
                if (editBtn) {
                    editBtn.href = editBtn.href + "?id=" + level1Key;
                }
                titleDom.appendChild(document.createTextNode(tmpJsonObj[0].title));
                formDom.insertBefore(titleDom, formDom.childNodes[0]);
                var tabDom = document.getElementById("contentTab");
                tabDom.className = "tabs";
                //generate tab labels and reprocess the contentHTML
                for (var i = 0; i < tmpJsonObj.length; i++) {
                    var contentHTML = tmpJsonObj[i].contentHTML;
                    if (contentHTML == null || contentHTML.trim().length == 0) continue;
                    var labelDom = document.getElementById("#tab" + tmpJsonObj[i].contentId);
                    labelDom.style.display = "block";
                    var tabContentDom = document.getElementById("tab" + tmpJsonObj[i].contentId);
                    tabContentDom.innerHTML = tmpJsonObj[i].contentHTML;
                }
            } else if (ccm == "edit") {
                titleDom.appendChild(document.createTextNode(tmpJsonObj[0].title));
                formDom.insertBefore(titleDom, formDom.childNodes[0]);
//		formDom.appendChild(titleDom);
                //get content navBar and change href pointing to this level1
                var navBtnList = $("#navBarContent").find("a");
                for (var i = 0; i < navBtnList.size(); i++) {
                    navBtnList[i].href = navBtnList[i].href + "&id=" + level1Key;
                }
                for (var i = 0; i < tmpJsonObj.length; i++) {
                    if (level2Key != "-1" && level2Key != tmpJsonObj[i].level2Key) {//if level2Key is defined but is not equal to the content's level2Key, then continue
                        continue;
                    }
                    jsonObj[tmpJsonObj[i].contentId] = tmpJsonObj[i].contentHTML;
                    jsonObj["level2Key"] = tmpJsonObj[i].level2Key;
                    jsonObj["ccmKey"] = tmpJsonObj[i].ccmKey;
                    jsonObj["contentName"] = tmpJsonObj[i].contentId;
                    var textareaDom = document.createElement("textarea");
                    textareaDom.className = "dynamicText";
                    textareaDom.name = tmpJsonObj[i].contentId;
                    textareaDom.id = "content_" + tmpJsonObj[i].contentId;
                    textareaDom.rows = "1";
                    textareaDom.cols = "1";
                    formDom.insertBefore(textareaDom, formDom.childNodes[1]);
//		    formDom.appendChild(textareaDom);
                    if (level2Key == "-1") {//if the level2Key is not defined which will be "-1", then display the first content.
                        break;
                    }
                }
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
                        if (ccm == "display") {
                            lastBtnDom.href = "content.html?id=" + jsonObj.lastId;
                        } else if (ccm == "edit") {
                            lastBtnDom.href = "editContent.html?id=" + jsonObj.lastId;
                        } else {
                            lastBtnDom.style.display = "none";
                        }
                        lastBtnDom.rel = "external";
                        lastBtnDom.setAttribute("data-role", "button");
                        lastBtnDom.setAttribute("data-icon", "check");
                        lastBtnDom.setAttribute("data-theme", "c");
                        lastBtnDom.setAttribute("data-inline", "true");
                        lastBtnDom.setAttribute("class","tabPopup ui-btn-left ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c");
                        lastBtnDom.setAttribute("style","padding: 10px 20px; margin: 5px;");
                        //lastBtnDom.appendChild(document.createTextNode(jsonObj.lastLabel));
                        lastBtnDom.appendChild(document.createTextNode("<<"));
                        btnsDivDom.appendChild(lastBtnDom);
                    }

                    var homeBtnDom = document.createElement("a");
                    homeBtnDom.href = "index.html";
                    homeBtnDom.rel = "external";
                    homeBtnDom.setAttribute("data-role", "button");
                    homeBtnDom.setAttribute("data-icon", "back");
                    homeBtnDom.setAttribute("data-theme", "c");
                    homeBtnDom.setAttribute("data-inline", "true");
                    homeBtnDom.setAttribute("class","tabPopup ui-btn-left ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c");
                    homeBtnDom.setAttribute("style","padding: 10px 20px; margin: 5px;");
                    homeBtnDom.appendChild(document.createTextNode("Up"));
                    btnsDivDom.appendChild(homeBtnDom);

                    if (jsonObj.nextId && jsonObj.nextId != "" && jsonObj.nextId != "null") {
                        var nextBtnDom = document.createElement("a");
                        if (ccm == "display") {
                            nextBtnDom.href = "content.html?id=" + jsonObj.nextId;
                        } else if (ccm == "edit") {
                            nextBtnDom.href = "editContent.html?id=" + jsonObj.nextId;
                        } else {
                            nextBtnDom.style.display = "none";
                        }
                        nextBtnDom.rel = "external";
                        nextBtnDom.setAttribute("data-role", "button");
                        nextBtnDom.setAttribute("data-icon", "check");
                        nextBtnDom.setAttribute("data-theme", "c");
                        nextBtnDom.setAttribute("data-inline", "true");
                        nextBtnDom.setAttribute("class","tabPopup ui-btn-left ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c");
                        nextBtnDom.setAttribute("style","padding: 10px 20px; margin: 5px;");
                        //nextBtnDom.appendChild(document.createTextNode(jsonObj.nextLabel));
                        nextBtnDom.appendChild(document.createTextNode(">>"));
                        btnsDivDom.appendChild(nextBtnDom);
                    }

                    formDom.appendChild(btnsDivDom);


                }
            });

            return jsonObj;
        };


        var makeTabs = function (selector) {

            tab_lists_anchors = document.querySelectorAll(selector + " li a");
            divs = document.querySelector(selector).getElementsByClassName("subTab");
            for (var i = 0; i < tab_lists_anchors.length; i++) {
                if (tab_lists_anchors[i].classList.contains('active')) {
                    divs[i].style.display = "block";
                }

            }

            for (i = 0; i < tab_lists_anchors.length; i++) {

                document.querySelectorAll(".tabs li a")[i]
                    .addEventListener(
                        'click',
                        function (e) {

                            for (i = 0; i < divs.length; i++) {
                                divs[i].style.display = "none";
                            }

                            for (i = 0; i < tab_lists_anchors.length; i++) {
                                tab_lists_anchors[i].classList.remove("active");
                            }

                            clicked_tab = e.target || e.srcElement;

                            clicked_tab.classList.add('active');
                            div_to_show = clicked_tab
                                .getAttribute('href');

                            document.querySelector(div_to_show).style.display = "block";

                        });
            }

        };


    };
    quickforms.parseForm = function (params)//formId,app*,fact,callback*
    {
        var formDom = $('#' + params.formId);
        quickforms.app = params.app || quickforms.app;
        var formObj = new quickforms.FormElement(formDom, quickforms.app, params.fact, params.ccm);
        formObj.updateId = getParameterByName('id');
        formObj.level2Key = getParameterByName('level2Key') ? getParameterByName('level2Key') : "-1";//get level2Key to display specific content
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
    //TODO:finish this
    quickforms.updateCcmContent = function (context, redirect) {
        context = $(context);
        context.attr('html', '');
        var formId = context.parents('form')[0].id;
        var formObj = quickforms['currentForm' + formId];
        var formSerialized = "app=" + formObj.app + "&";
        var contentDom = document.getElementById("contentName");
        var ccmKeyDom = document.getElementById("ccmKey");

        quickforms.redirectUrl = window.location.href;
        ;
        if (redirect != null && redirect != '' && redirect != "") {
            quickforms.redirectUrl = redirect;
        }

        formSerialized += "factTable=ccm" + "&updateid=" + ccmKeyDom.value + "&";
        formSerialized += formObj.serialize();
        formSerialized = formObj.scrubFormDataString(formSerialized);
//	alert(formSerialized); 
        formSerialized = formSerialized.replace("&" + contentDom.value + "=", "&contentHTML=");

        quickforms.putFactServer.call(formObj, formSerialized, function () {
            window.location = quickforms.redirectUrl;
        });
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