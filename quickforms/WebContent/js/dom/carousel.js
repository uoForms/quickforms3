/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
define(
	['server/putFact','server/getFactData','server/executeQuery'],
	function() {
	    quickforms.carousel = {
		domParsers : []
	    };

	    // Preventing to press enter
	    $(document).keypress(function(event) {
		if (event.keyCode == 13) {
		    event.preventDefault();
		}
	    });
	    // End function

	    quickforms.CarouselElement = function(dom, app, fact) // Maintains all QF's carousel objects
	    {
		quickforms.DomElement.call(this, dom); // super call to get parent attributes
		this.children = [];
		this.childMap = {};
		this.app = app || quickforms.app;
		this.fact = fact;
		this.type = "mainCarousel";
		this.childrenFinished = 0;
		this.completedListeners = [];
		this.carouselData = [];

		this.serialize = function() {
		    var carouselSerialized = "", childAdded = [];
		    for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i], childSerial = child
				.serialize();
			if (isNull(childSerial) == false)
			    childAdded.push(childSerial);

		    }
		    for (var i = 0; i < childAdded.length; i++) {
			if (i > 0)
			    carouselSerialized += "&";
			carouselSerialized += childAdded[i];
		    }
		    return carouselSerialized;
		};
		this.finishedParsing = function() {
		    this.childrenFinished += 1;
		    this.checkLoadingGif();
		};
		this.checkLoadingGif = function() {
		    if (this.childrenFinished == this.children.length) {
			quickforms.hideLoadingGif();
			for (var i = 0; i < this.completedListeners.length; i++) {
			    this.completedListeners[i]();
			}
		    }

		}
		this.scrubCarouselDataString = function(data) {
		    data = data.replace("&&", "&");
		    if (data.charAt(data.length - 1) == "&")
			data = data.substring(0, data.length - 1);
		    return data;
		};
		this.addChild = function(child) {
		    this.children.push(child);
		    this.childMap[child.dom[0].id] = child;
		};
		this.getCarouselData = function(callback) {
		    	var me = this;
			var queryLabel = this.fact;
			var prms = null;
			quickforms.getFactData({
			    queryName : queryLabel,
			    params : prms,
			    callback : function(data){
				var tempData = [];
				tempData = JSON.parse(data);
				var level0Key = 0,
				    level1Key = 0;
				var carouselHTML = document.getElementById(dom[0].id);
				//initialize carousel_slide elements
				var carousel_slide = document.createElement("div");
				carousel_slide.style.backgroundImage = "url("+tempData[0].image+")";
				carousel_slide.className = "carousel_slide";
				var carousel_level0_container = document.createElement("div");
				carousel_level0_container.className = "carousel_slide_inner";
//				var nextLine = document.createElement("br");
				var carousel_level1_container = document.createElement("span");
				carousel_level1_container.className = "carousel_slide_inner_content";
//				var divider = document.createTextNode("|");
//				var weeks = document.createElement("b");
//				weeks.appendChild(document.createTextNode("Weeks"));
				carousel_level1_container.appendChild(document.createElement("b").appendChild(document.createTextNode("Weeks")));
				carousel_level1_container.appendChild(document.createElement("br"));
				carousel_level1_container.appendChild(document.createElement("br"));
				var level1LineLength = 0;
				var dataSize = 0;
				for(var obj in tempData){
				    dataSize++;
				}
				for(var i=0; i < dataSize; i++){
				    
				    if(level0Key == 0){//level0's first level1
					level0Key = tempData[i].level0Key;
					level1Key = tempData[i].level1Key;
					var carousel_level0_label = document.createElement("span");
					carousel_level0_label.className="carousel_slide_inner_title";
					var text = document.createTextNode(tempData[i].level0Label);
					carousel_level0_label.appendChild(text);
					carousel_level0_container.appendChild(carousel_level0_label);
					
					var carousel_level1_label = document.createElement("a");
					carousel_level1_label.rel="external";
					carousel_level1_label.textDecoration = "none";
					carousel_level1_label.setAttribute("data-role","tabPopup");
					carousel_level1_label.href = "content.html?id="+tempData[i].level1Key;
					text = document.createTextNode(tempData[i].level1Label);
					carousel_level1_label.appendChild(text);
					var level1LabelString = String(tempData[i].level1Label);
					level1LineLength += tempData[i].level1Label.length;
					
					carousel_level1_container.appendChild(carousel_level1_label);
					carousel_level1_container.appendChild(document.createTextNode("|"));
					
				    }else {
					if(level0Key == tempData[i].level0Key ){
						if(level1Key == tempData[i].level1Key) {
						    continue;
						}else{
						    level1Key = tempData[i].level1Key;
						    var carousel_level1_label = document.createElement("a");
						    carousel_level1_label.rel="external";
						    carousel_level1_label.textDecoration = "none";
						    carousel_level1_label.setAttribute("data-role","tabPopup");
						    carousel_level1_label.href = "content.html?id="+tempData[i].level1Key;
						    text = document.createTextNode(tempData[i].level1Label);
						    carousel_level1_label.appendChild(text);
						    level1LineLength += tempData[i].level1Label.length;
						    
						    carousel_level1_container.appendChild(carousel_level1_label);	
						    if(level1LineLength>14){
							carousel_level1_container.appendChild(document.createElement("br"));
							level1LineLength = 0;
						    }else{
							carousel_level1_container.appendChild(document.createTextNode("|"));
						    }
						}
					}else {
					    carousel_level0_container.appendChild(carousel_level1_container);
					    carousel_slide.appendChild(carousel_level0_container);
					    carouselHTML.appendChild(carousel_slide);
					    //initialize carousel_slide elements					    
					    carousel_slide = document.createElement("div");
					    carousel_slide.style.backgroundImage = "url("+tempData[i].image+")";
					    carousel_slide.className = "carousel_slide";
					    carousel_level0_container = document.createElement("div");
					    carousel_level0_container.className = "carousel_slide_inner";
					    carousel_level1_container = document.createElement("span");
					    carousel_level1_container.className = "carousel_slide_inner_content";
					    carousel_level1_container.appendChild(document.createElement("b").appendChild(document.createTextNode("Weeks")));
					    carousel_level1_container.appendChild(document.createElement("br"));
					    carousel_level1_container.appendChild(document.createElement("br"));
					    level1LineLength = 0;
					    level0Key = 0;
					    i--;
						
					}
					
				    }
				    
				    if(i+1 == dataSize && dataSize >1 && level0Key != 0){
					carousel_level0_container.appendChild(carousel_level1_container);
					carousel_slide.appendChild(carousel_level0_container);
					carouselHTML.appendChild(carousel_slide);
				    }

				}

				//alert("loading...");
                                callback.call(quickforms);
                            }
			});

		};
	    };
	    quickforms.parseCarousel = function(params)//carouselId,app*,fact,callback*
	    {
		var carouselDom = $('#' + params.carouselId);
		quickforms.app = params.app || quickforms.app;
		var carouselObj = new quickforms.CarouselElement(carouselDom,
			quickforms.app, params.fact);
		carouselObj.id = 'currentCarousel' + params.carouselId;
		quickforms.initLoadingGif();

		carouselObj.getCarouselData(function() {

		    carouselObj.checkLoadingGif();
		    if (params.callback)
			params.callback();
		});
		
		quickforms[carouselObj.id] = carouselObj;

	    };
	    
	    

	});