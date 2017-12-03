define(['dom/form/form','server/executeQuery','dom/form/text','dom/form/date','dom/form/tabPopup',
						'dom/form/fillDiv'],function(){


	// Age Tab Diagnosis auto nav
	quickforms.form.domParsers.push(function(formObj){
		formObj.completedListeners.push(function(){
			$('#assessmentLink').on('click',function(){
				formObj.dom.find('ul a').removeClass('ui-state-persist'); // add / remove persist to ensure state stays the same between dialog navigation
				$('a[href="#mental"]').trigger('click');
				$('a[href="#mental"]').addClass('ui-btn-active ui-state-persist');
			});
		});
	});
	// End Age Tab Diagnosis auto nav

var colors = {'4':'e0100c' , '3':'ff6b00', '2':'ffeb04','1':'a8f110', '0':'08a503', '9':null};
var environmentColors = {'4':'08a503' , '3':'00da63', '2':'a8f110','1':'d9f999', '0':'016eff', '-1':'ffffcc','-2':'ffeb04', '-3':'ff6b00', '-4':'e0100c','9':'ffffff'};


var validateCapacityDual = function(){
		var radios = $('#capacity_form').find('input[type="radio"]');
		var valid = true;
		for(var i=0; i<radios.length; i =i + 12){
			var count = 0;
			radios.slice(i, i+12).each(function(){
				if($(this).prop('checked') == true){
					count++;
				}
			})
			if(count !=0 && count!=2){
				quickforms.toast("Error: Capacity and Performance must both be selected");
				valid = false;
				return false;
			}
		}
		if(valid){
			quickforms['currentFormcapacity_form'].updateSummary();
			return true;
		}
		return false;
}

var saveSubform = function(subformId, redirectUrl){
	quickforms['currentForm'+subformId].updateSummary();
	quickforms.putFact($('#saveclose'),redirectUrl, false);
}

$('#assessmentLink').on('click',function(){
	quickforms.initLoadingGif();
	var info = $('#patient').find(':selected').text();
	  $('#assessment').find('.buttons.design').each(function(){
		if(info){
			$(this).append('<div class="personalInfo"><div style="font-weight:600"><span>'+info + '</span></div></div>');
		}

	  });


	  //when tab is clicked, load jquery mobile elements and populate colors
	 setTimeout(function(){
			$('#assessment').find('div[qf-type="radio"]').each(function(){
			$(this).trigger("create");
			$(this).find('input[type=radio]').each(function(){
				var span =  $(this).next('label')
								   .children('span');
				var num = span.children('span').html().match(/\d+/)[0];
				span.css('background-color',colors[num]);
				 })
			  });
			 quickforms.hideLoadingGif();
	  }, 1000)


	  $('#assessment_form').find('a[class^="cancel"]').each(function(){
	        $(this).find('.ui-btn-text').each(function(){
				$(this).text('Close');
			 });
			 $(this).on('click', function(e){
				saveSubform('assessment_form', null);
			});
	  });

	   $('#assessment_form').find('a[class^="confirm"]').each(function(){
		$(this).removeProp('onclick');
		$(this).attr('href','#');
		$(this).on('click', function(){
		    saveSubform('assessment_form', null);
	    });
	   });
})

$('#capacityLink').on('click',function(){
	quickforms.initLoadingGif();
	var info = $('#patient').find(':selected').text();
	  $('#capacity').find('.buttons.design').each(function(){
		if(info){
			$(this).append('<div class="personalInfo"><div style="font-weight:600"><span>'+info + '</span></div></div>');
		}

	  });


     $('#capacity_form').find('a[class^="cancel"]').each(function(){
	    $(this).find('.ui-btn-text').each(function(){
				$(this).text('Close');
		});
		$(this).on('click', function(){
			var isvalid = validateCapacityDual();
			if(isvalid){
			    $(this).attr('href','#newVisitPage');
				quickforms.putFact($('#saveclose'),null, false);
			}else{
				$(this).attr('href','#');
			}
	    });
	});
	   //when clicking OK, validate if both capacity and performance is selected or neither
    $('#capacity_form').find('a[class^="confirm"]').each(function(){
		$(this).removeProp('onclick');
		$(this).attr('href','#');
		$(this).on('click', function(){
			var isvalid = validateCapacityDual();
			if(isvalid){
				quickforms.putFact($('#saveclose'),null, false);
			}
	    });
	});

	//populate colors
	setTimeout(function(){
		$('#capacity').find('div[qf-type="radio"]').each(function(){
				$(this).trigger("create");
				$(this).find('input[type=radio]').each(function(){
			var span =  $(this).next('label')
							   .children('span');
			var num = span.children('span').html().match(/\d+/)[0];
			span.css('background-color',colors[num]);

		  })
		  });
		 quickforms.hideLoadingGif();
	}, 1500)

})

$('#environmentLink').on('click',function(){
        quickforms.initLoadingGif();
		var info = $('#patient').find(':selected').text();
		$('#environment').find('.buttons.design').each(function(){
		if(info){
			$(this).append('<div class="personalInfo"><div style="font-weight:600"><span>'+info + '</span></div></div>');
		}

	  });

		setTimeout(function(){
			 $('#environment').find('div[qf-type="radio"]').each(function(){
				$(this).trigger("create");
				$(this).find('input[type=radio]').each(function(){
					var span =  $(this).next('label')
									   .children('span');
					var num = span.children('span').html().match(/-?\d+(\.\d+)?$/)[0];
					if(num == undefined)
					     num = span.children('span').html().match(/\d+/)[0];
					span.css('background-color',environmentColors[num]);
					span.css('padding-right','0px');
				  })
			  });
			 quickforms.hideLoadingGif();
		}, 1000);


		 $('#environment_form').find('a[class^="cancel"]').each(function(){
		     $(this).find('.ui-btn-text').each(function(){
				$(this).text('Close');
			 });
			$(this).on('click', function(){
				saveSubform('environment_form', null);
			});
	   });

		$('#environment_form').find('a[class^="confirm"]').each(function(){
			$(this).removeProp('onclick');
			$(this).attr('href','#');
			$(this).on('click', function(){
				saveSubform('environment_form', null);
			});
	   });
})




	// Assessment auto nav
	quickforms.form.domParsers.push(function(formObj){

		if(formObj.id.indexOf('assessment')>=0)
		{
			formObj.completedListeners.push(function(){
				$('#assessmentLink').on('click',function(){

					$('#mental').on('click',function() {
						formObj.dom.find('ul a').removeClass('ui-state-persist'); // add / remove persist to ensure state stays the same between dialog navigation
						$('a[href="#mental"]').trigger('click');
						$('a[href="#mental"]').addClass('ui-btn-active ui-state-persist');
					});

					$('#sensory').on('click',function() {
						formObj.dom.find('ul a').removeClass('ui-state-persist');
						$('a[href="#sensory"]').trigger('click');
						$('a[href="#sensory"]').addClass('ui-btn-active ui-state-persist');
					});

				});
			});
		}
	});



	//Redirect Submit Button
	window.redirectSaveClose=function(button){

    var url = 'documents.html?id='+$('#patient').val();
		if($("#isSigned").prop("checked") == false){
			 quickforms.putFact(button,url, false);
    }
    window.location=url;


	}
	//End Redirect Submit Button

  window.signDocument=function(button){

	if ($('#assessmentDate').val() == ""){
		quickforms.toast("Date of Assessment field cannot be left empty");
		return false;
	}

	 if($("#isSigned").prop("checked") == false){
		
		 /*document.getElementById("assessmentDate").style.visibility = "hidden";
		  document.getElementById("date").innerHTML = $("#assessmentDate").val();*/
	     $("#isSigned").prop('checked',true).checkboxradio('refresh');
	     $("#isSigned").val('on').trigger('change');
	     var userName = getCookie('username');
	     var userId = getCookie('userid');
	     $("#signedBy").val(userName).trigger('change');
		  

	     var url = 'documents.html?id='+$('#patient').val();
		 console.log($("#patient").val()+", " + $("#addedBy").val()+", " + $("#evaluationMulti").val()+", "+ $("#template").val()+", "+ $("#createdDate").val()+", "+ $("#updatedDate").val()+", "
		 + $("#isSigned").val()+", "+ $("#signedBy").val()+", "+ $("#deleteFlag").val()+", "+ $("#assessmentDate").val());
	     quickforms.putFact(button,url, false);

    };

  }

	//Redirect Delete Button
    window.redirectDeleteButton=function(button){
	    var id = getParameterByName('id');
       		quickforms.confirm("Are you sure you want to delete this record?", function(){
			quickforms.executeQuery('cws', 'documents_delete_row', 'id='+id, function(){window.location = 'documents.html';});
	    });
	}
	// End Delete Button

	window.redirectCancelButton=function(){

    	var url = 'documents.html';
		window.location = url;
	}


});
