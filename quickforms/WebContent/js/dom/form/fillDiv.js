/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
define(['dom/form/form',
        'dom/form/text',
        'server/getMultiData',
        'dom/form/checkbox',
        'dom/form/select'],
    function () {
        quickforms.FillDiv = function (dom, formObj) // Fills a div with selects or checkboxes from the database
        {
            quickforms.DomElement.call(this, dom); // super call to get parent attributes
            var me = this;
            this.parent = formObj;
            this.id = this.dom.attr('id');
            this.tab = $('a[href="#' + this.id + '"]');
            if(this.tab.length == 0){
              this.tab = $('h3[id='+this.id+'_label]');
            }
            this.label = this.tab.text();
            this.label = this.label.replace('click to expand contents','');
            this.serialize = function () {
                var curSerialize = '';
                for (var i in this.addedData) {
                    var child = this.addedData[i],
                        childSerial = child.serialize('multi');
                    if (i > 0 && isNull(childSerial) == false) curSerialize += "&";
                    curSerialize += childSerial;
                }
                return curSerialize;
            };
            this.summary = function () {
                var thisSummary = "<b>" + this.label + "</b><br/>",
                    childSummaries = "";
                for (var i in this.addedData) {
                    var child = this.addedData[i],
                        childSummary = child.summary('multi');
                    if (child instanceof quickforms.CheckboxElement && isNull(childSummary) == false) {
                        childSummaries += childSummary + "<br />";
                    }
                    else if (child instanceof quickforms.SelectElement && isNull(childSummary) == false) {
                        childSummaries += childSummary;
                    }
                }
                if (childSummaries == "")
                    return "";
                return thisSummary + childSummaries;
            };
            this.parseFilter = function (filter) {
                var filterReturn = '';
                if (filter != null) {
                    var filters = filter.split(',');
                    for (var i = 0; i < filters.length; i++) {
                        if (filterReturn != '')
                            filterReturn += ",";

                        if (filters[i].indexOf('=') >= 0) // Server side filtering
                        {
                            filterReturn += filters[i];
                        }
                        else // Client side categorization, server side sorting
                        {
                            this.category = filters[i];

                            filterReturn += filters[i]
                        }
                    }
                }
                return filterReturn;
            };
        }

        quickforms.form.domParsers.push(function (formObj) {
			var templateId;
			var url = formObj.dom.context.URL;
			var urlVariables = url.split('&');
			var templateId;
			for (i = 0; i < urlVariables.length; i++) {
				var sParameterName = urlVariables[i].split('=');

				 if (sParameterName[0] === 'template') {
					 templateId = sParameterName[1] === undefined ? true : sParameterName[1];
				 }
			 }
            var fills = formObj.dom.find('div[qf-type]');
            fills.each(function (i, fill) {
                fill = $(fill);
                var fillObj = new quickforms.FillDiv(fill, formObj);
                var filter = fillObj.parseFilter(fill.attr('qf-filter'));

                formObj.addChild(fillObj); 
                fillObj.parentForm = formObj;
                fillObj.query = quickforms.getMultiData.call(fillObj, formObj.app,
                    formObj.fact,
                    fill.attr('qf-lookup'),
                    filter,
                    formObj.updateId,
                    quickforms.addAttributes,
					templateId);

            });
        });
        quickforms.addAttributes = function (data) {
            var fillObj = this; // fillObj
            var qfType = fillObj.dom.attr('qf-type');
            fillObj.type = qfType;
            fillObj.qfLabelCols = fillObj.dom.attr('qf-label-cols');
            fillObj.lookup = fillObj.dom.attr('qf-lookup');
            fillObj.filter = fillObj.dom.attr('qf-filter');
            fillObj.multiple = fillObj.dom.attr('multiple') || '';
            fillObj.addSelectLabels = (fillObj.dom.attr('qf-show-category') || "false") == "true";
            if (qfType == 'select') {
                quickforms.convertJSONtoFillSelect(fillObj, data);
                fillObj.dom.children('select').selectmenu();
                //fillObj.dom.trigger("create");
            }
            else if (qfType == 'checkbox') {
                quickforms.convertJSONtoFillCheckbox(fillObj, data);
                fillObj.dom.checkboxradio();
                fillObj.dom.trigger("create");
            }
            else if (qfType == 'radio') {
                quickforms.convertJSONtoRadioButton(fillObj, data);
                fillObj.dom.checkboxradio();
               // fillObj.dom.trigger("create");
            }
            fillObj.parentForm.finishedParsing();
            //var selectField = new quickforms.DomElement($('#'+fieldId));
        }
        quickforms.convertJSONtoRadioButton = function (fillObj, data) {
            if (isJSONString(data)) {
                fillObj.dom.children().remove();
                fillObj.addedData = [];
                var json = JSON.parse(data),
                    currentKey = '',
                    currentCategory = '';

                var fieldSet;
                var table, tHead, tBody, tRow, tData, tHeader;
                table = $('<table id="' + json[0]['evaluationCategory'] + '_'+ json[0]['evaluationDomain']+'" >');
                tHead = $("<thead>");
                tRow = $("<tr>");
                tRow.append($("<th>"));
                var firstRowsecondHeader = $("<th>");
                var markPopupWindow = $('<div style="width:400px;position:relative;left:200px" data-position-to="origin" data-role="popup" id= "mark_description">');
                var markInfoPopupBtn = $('<a style="position:relative;left:40%" href="#mark_description" data-role="button" data-rel="popup" data-icon="info" data-iconpos="notext" data-inline="true"></a>');
                var markInfoBox = $('<ul><li>No Impairment:</li><li>Mild Impairment</li><li>Moderate Impairment</li><li>Complete Impairment</li></ul>');
                markPopupWindow.append(markInfoBox);
                firstRowsecondHeader.append(markInfoPopupBtn);
                firstRowsecondHeader.append(markPopupWindow);
                tRow.append(firstRowsecondHeader);
				if(json[0]['evaluationCategory'] == 'CAPACITY AND PERFORMANCE'){
				     tRow.append('<th></th>');
				}	 
                if (json[0]['evaluationCategory'] == 'ENVIRONMENT'){
                  tRow.append('<th class="rotate"><div><span>Complete barrier</span></div></th>'+
                              '<th class="rotate"><div><span>Severe barrier</span></div></th>'+
                              '<th class="rotate"><div><span>Moderate barrier</span></div></th>'+
                              '<th class="rotate"><div><span>Mild barrier</span></div></th>'+
                              '<th class="rotate"><div><span>No barrier facilitartor</span></div></th>'+
                              '<th class="rotate"><div><span>Mild facilitartor</span></div></th>' +
                              '<th class="rotate"><div><span>Moderate facilitartor</span></div></th>'+
                              '<th class="rotate"><div><span>Substantial facilitator</span></div></th>'+
                              '<th class="rotate"><div><span>Complete facilitator</span></div></th>'+
                              '<th class="rotate"><div><span>Not applicable</span></div></th>'+
                              '<th class="rotate"><div><span>Comment</span></div></th>');
                              ;
                }else{
                tRow.append('<th class="rotate"><div><span>No Impairment</span></div></th>'+
                            '<th class="rotate"><div><span>Mild Impairment</span></div></th>'+
                            '<th class="rotate"><div><span>Moderate Impairment</span></div></th>'+
                            '<th class="rotate"><div><span>Severe Impairment</span></div></th>'+
                            '<th class="rotate"><div><span>Complete Impairment</span></div></th>'+
                            '<th class="rotate"><div><span>Not Applicable</span></div></th>'+
                          '<th class="rotate"><div><span>Comment</span></div></th>');
                }
                tHead.append(tRow);
                table.append(tHead);
                tBody = $("<tbody>");
                var commentText = "";
				var isCapacity = true;
                for (var i = 0; i < json.length; i++) {

                    var keyColumnName = "",
                        jsoni = json[i];
                    for (var col in jsoni) {
                        if (col.indexOf('Key') >= 0) {
                            keyColumnName = col;
                            fillObj.keyColumnName = col;
                        }
                    }

                    if (fillObj.category != null && jsoni[fillObj.category] != currentCategory) {
                      if(currentCategory != ''){
					    // add the comment pop up botton at the end of the last row
                        var qualifiedCat =  currentCategory .replace('\'',' ').replace(/\W+/g,'_');
                        var closeButton = $('<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>')
                        var popupButton = $('<a id="'+ qualifiedCat+'_popupButton" href="#' + qualifiedCat+'_popup" data-rel="popup" data-role="button" data-transition="pop">Add</a>');
                        var popupWindow = $('<div style="width:500px;left:400px" data-position-to="origin" data-role="popup" id= "'+qualifiedCat+'_popup">');
                        var comment= $('<textarea type="comment" id="'+ qualifiedCat +'_text" name="comment">');

                        comment.change(function(evt){
                          var popupId = $(this).attr('id').replace('text','popupButton');
                          if($(this).val() != ''){
                            $('#'+popupId+' .ui-btn-text').text('..');
                          }else{
                            $('#'+popupId+' .ui-btn-text').text('Add');
                          }
                        })
                        
						if(commentText != '' && commentText != 'null'){
					      
                          popupButton = $('<a id="'+ qualifiedCat+'_popupButton" href="#' + qualifiedCat+'_popup" data-rel="popup" data-role="button" data-transition="pop">..</a>');
                       
                         comment.val(commentText);
						 commentText = '';
						}
                        popupButton.blur(function(e) {
                          $('textarea').focus();
                        });
                        popupWindow.append(closeButton).append(comment);
                        var commentDom = new quickforms.TextElement(comment, fillObj.parentForm);

                        td = $('<td align="center">');
                        td.append(popupButton);
                        td.append(popupWindow);
                        fillObj.addedData.push(commentDom);
                        tRow.append(td);
                      }           

                      tRow = $('<tr>');
					  
                     
                      currentCategory = jsoni[fillObj.category];
                      currentKey = jsoni[fillObj.keyColumnName];
					  qualifiedCat = currentCategory.replace(/\W+/g,'_');
                      //tHeader.append('<a href="" data-role="button" data-rel="popup" data-icon="info" data-iconpos="notext" data-inline="true"></a><h3>'+currentCategory+'</h3>');
                      var infoPopupWindow = $('<div style="width:800px" data-position-to="origin" data-role="popup" id= "'+qualifiedCat+'_description">');
                      var infoCloseBtn = $('<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>')
                      var infoPopupBtn = $('<a href="#'+qualifiedCat+'_description" data-role="button" data-rel="popup" data-icon="info" data-iconpos="notext" data-inline="true"></a>');
                      var infoBox = $('<div><p><b>'+ currentCategory+'('+jsoni['ICF Code']+')</b></p><p>Definition:' +jsoni['definition'] + '</div>');
                      infoPopupWindow.append(infoCloseBtn).append(infoBox);
                      
                     
					  if(jsoni['evaluationCategory'] == 'CAPACITY AND PERFORMANCE' && isCapacity ){
					     tHeader = $('<th rowspan="2">');
						 tHeader.append(infoPopupBtn);
						 tHeader.append(infoPopupWindow);
						 tRow.append(tHeader);
					     tRow.append('<th rowspan="2"><h3>'+currentCategory.replace('-Capacity', '')+'</h3></th>');
						 tRow.append('<th><h4>capacity</h4></th>');
						 isCapacity = false;
					  }
					  else if(jsoni['evaluationCategory'] == 'CAPACITY AND PERFORMANCE' ){
					    tRow.append('<th><h4>performance</h4></th>');
						isCapacity = true;
						}else{
						 tHeader = $('<th>');
						 tHeader.append(infoPopupBtn);
						  tHeader.append(infoPopupWindow);
						  tRow.append(tHeader);
						  tRow.append('<th valing="bottom"><h3>'+currentCategory+'</h3></th>');
						}
			
                      tBody.append(tRow);
                    }
					var cat = currentCategory.replace(/\W+/g,'_');
					if(jsoni['comment']!= '' && jsoni['comment'] != 'null'){
                        commentText = jsoni['comment'];
                     }
                    tData = $('<td>');
                    var radioDom = $('<input id= "' + fillObj.id + i + '" name="' + cat+ '" type="radio" value=' + jsoni[keyColumnName] + ' />');
                    if (jsoni.selected == 'selected') {
                        radioDom.attr('checked', 'checked');
						$(radioDom).data("currentState", "true");
                    }
					$(radioDom).click(function(){
						if($(this).prop('checked') && $(this).data("currentState") =="true"){
							$(this).prop('checked',false);
							$(this).data("currentState", "false");
							$(this).trigger('change');
						}else{
						$(this).data("currentState", "true");
						}
					});
                    tData.append(radioDom);
                    tData.append($('<label for="' + fillObj.id + i + '">' + jsoni[fillObj.qfLabelCols] + '</label>'));
                    tRow.append(tData);
                    var checkObj = new quickforms.CheckboxElement(radioDom, fillObj.parentForm, jsoni[fillObj.qfLabelCols], fillObj.lookup);
                    fillObj.addedData.push(checkObj);
                    if (jsoni.selected) {
                        fillObj.selectedField = jsoni.id;
                        checkObj.changeSelection(radioDom);
                    }
                    if (i == json.length - 1){
                        var qualifiedCat = currentCategory.replace(/\W+/g,'_');
                        var closeButton = $('<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>')
                        var popupButton = $('<a id="'+ qualifiedCat+'_popupButton" href="#' + qualifiedCat+'_popup" data-rel="popup" data-role="button" data-transition="pop">Add</a>');
                        var popupWindow = $('<div style="width:800px" data-role="popup" id= "'+qualifiedCat+'_popup">');
                        var comment= $('<textarea autofocus name="comment"  type="comment" id="'+ qualifiedCat +'_text" placeholder="">');
                        commentDom = new quickforms.TextElement(comment, fillObj.parentForm);
                        popupButton.mousedown(function(e){
                          e.preventDefault();
                          comment.focus();
                        })
						
						if(commentText != '' && commentText != 'null'){
					      
                          popupButton = $('<a id="'+ qualifiedCat+'_popupButton" href="#' + qualifiedCat+'_popup" data-rel="popup" data-role="button" data-transition="pop">..</a>');
                       
                         comment.val(commentText);
						 commentText = '';
						}
						
						comment.change(function(evt){
                          var popupId = $(this).attr('id').replace('text','popupButton');
                          if($(this).val() != ''){
                            $('#'+popupId+' .ui-btn-text').text('..');
                          }else{
                            $('#'+popupId+' .ui-btn-text').text('Add');
                          }
                        })
                        popupWindow.append(closeButton).append(comment);
                        td = $('<td align="center">');
                        td.append(popupButton);td.append(popupWindow);
                        tRow.append(td);
                        fillObj.addedData.push(commentDom);
                    }
                }
                table.append(tBody);
                fillObj.dom.append(table);
            }
        }
        quickforms.convertJSONtoFillCheckbox = function (fillObj, data) {
            if (isJSONString(data)) {
                fillObj.dom.children().remove();
                fillObj.addedData = [];
                var json = JSON.parse(data),
                    currentCategory = '';
                for (var i = 0; i < json.length; i++) {
                    var keyColumnName = "",
                        jsoni = json[i];
                    for (var col in jsoni) {
                        if (col.indexOf('Key') >= 0) {
                            keyColumnName = col;
                            fillObj.keyColumnName = col;
                        }
                    }
                    if (fillObj.category != null && jsoni[fillObj.category] != currentCategory) {
                        currentCategory = jsoni[fillObj.category];
                        fillObj.dom.append('<h2>' + currentCategory + '</h2>');
                    }
                    var checkDom = $('<input id= "' + fillObj.id + i + '" name="' + fillObj.lookup + '" type="checkbox" value=' + jsoni[keyColumnName] + ' />');
                    if (jsoni.selected == 'selected') {
                        checkDom.attr('checked', 'checked');
                    }
                    fillObj.dom.append(checkDom);
					var labels = fillObj.qfLabelCols.split('\,');
					var concatenatedLabel = '';
					for(var j in labels){
					    if(j != 0)
						    concatenatedLabel += '--';
						concatenatedLabel += jsoni[labels[j]];
					}
                    fillObj.dom.append($('<label for="' + fillObj.id + i + '">' + concatenatedLabel + '</label>'));
                    var checkObj = new quickforms.CheckboxElement(checkDom, fillObj.parentForm,concatenatedLabel);
                    fillObj.addedData.push(checkObj);
                    if (jsoni.selected) {
                        fillObj.selectedField = jsoni.id;
                        checkObj.changeSelection(checkDom);
                    }
                }
            }
        }
        quickforms.convertJSONtoFillSelect = function (fillObj, data) {
            if (isJSONString(data)) {
                fillObj.dom.children().remove();
                fillObj.addedData = [];
                var json = JSON.parse(data),
                    currentCategory = "",
                    selectDom,
                    selectObj,
                    i = 0;
                for (i = 0; i < json.length; i++) {
                    var keyColumnName = "";
                    var jsoni = json[i];
                    for (var col in jsoni) {
                        if (col.indexOf('Key') >= 0) {
                            keyColumnName = col;
                            fillObj.keyColumnName = col;
                        }
                    }
                    if (jsoni[fillObj.category] != currentCategory) {
                        currentCategory = jsoni[fillObj.category];
                        if (fillObj.addSelectLabels)
                            fillObj.dom.append("<label for = '" + fillObj.id + i + "'>" + currentCategory + "</div>");
                        selectDom = $('<select name="' + fillObj.lookup + '" id="' + fillObj.id + i + '" data-native-menu="' + quickforms.dataNativeMenu + '" ' + fillObj.multiple + '></select>');
                        fillObj.dom.append(selectDom);
                        selectObj = new quickforms.SelectElement(selectDom, fillObj.parentForm, fillObj.multiple == 'multiple');
                        selectObj.category = currentCategory;
                        if (!fillObj.addSelectLabels)
                            selectDom.append('<option data-placeholder="true">' + currentCategory + '</option>')
                        else
                            selectDom.append('<option data-placeholder="true"></option>')
                        fillObj.addedData.push(selectObj);
                    }

                    selectDom.append('<option value=' + jsoni[keyColumnName] + ' ' + jsoni.selected + '>' + currentCategory + ":" + jsoni[fillObj.qfLabelCols] + '</option>');
                    if (jsoni.selected) {
                        fillObj.selectedField = jsoni.id;
                        selectObj.changeSelection();
                    }
                }
            }
            else {
                console.log("Error : " + data);
            }
        }
    });
