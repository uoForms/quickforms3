window.initForm = function(){
	$(function(){
		
		$('#medPart,#alliedPart,#nursePart,#mixedPart').live("keyup" ,function()
		{
			$('#participantsError').css('color','red');
			if(validateNumber($(this)))
			{
				$('#participantsError').html("");
			}
			else
			{
				$('#participantsError').html("Please enter numbers only");
			}
		});
		
	});
	window.validateNumber = function(dom)
	{
		if(is_int(dom.val())==false)
		{
			return false;
		}
		else
		{	
			return true;
		}
	};
	window.addParticipants = function()
	{
		var total = 0;
		$('#medPart,#alliedPart,#nursePart,#mixedPart').each(function(i,dom){
			dom = $(dom);
			total += parseInt(dom.val());
			$('#numParticipantsTitle').html('Number Of Participants: ('+total+')');
		});
		
	};
};