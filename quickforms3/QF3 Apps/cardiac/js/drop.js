/*$("#b1").click(function(){
	$("#drop1").removeClass('ui-screen-hidden');
	$("#drop2").addClass('ui-screen-hidden');
	$("#drop3").addClass('ui-screen-hidden');
});

$("#b2").click(function(){
	$("#drop1").addClass('ui-screen-hidden');
	$("#drop2").removeClass('ui-screen-hidden');
	$("#drop3").addClass('ui-screen-hidden');
});

$("#b3").click(function(){
	$("#drop1").addClass('ui-screen-hidden');
	$("#drop2").addClass('ui-screen-hidden');
	$("#drop3").removeClass('ui-screen-hidden');
});*/

/*alert("Yeah we are here");
var dateTime=$('#dateTime');
	quickforms.form.domParsers.push(function(formObj){
		formObj.completedListeners.push(function(){
			missingText.parent().toggle($('#missingAssessment').is(":checked"));
$("#OrderDischarge").click(function)(){
$("#datepicker").dateTime();*/


require(['dom/form/form','server/executeQuery'],function(){ 
quickforms.form.domParsers.push(function(formObj){
$(document).ready(function(){

 if($('#consultSteps').val()==1){

$( "#test" ).removeClass('ui-screen-hidden').addClass("");
$( "#admit" ).removeClass('').addClass("ui-screen-hidden");
$( "#discharge" ).removeClass('').addClass("ui-screen-hidden");

}else if($('#consultSteps').val()==2){
$( "#admit" ).removeClass('ui-screen-hidden').addClass("");
$( "#test" ).removeClass('').addClass("ui-screen-hidden");
$( "#discharge" ).removeClass('').addClass("ui-screen-hidden");

}else if($('#consultSteps').val()==3){
$( "#discharge" ).removeClass('ui-screen-hidden').addClass("");
$( "#admit" ).removeClass('').addClass("ui-screen-hidden");
$( "#test" ).removeClass('').addClass("ui-screen-hidden");
}
});});
});

