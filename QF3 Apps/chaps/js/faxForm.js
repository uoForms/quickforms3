function checkMark(){

var bmi = parseInt(quickforms.currentFormfaxform.childMap.BMI.currentVal);

$("#smokeCheck").on('click', function () {
    if (bmi > 30) {
        $(smokeCheck).prop('checked', true).checkboxradio('refresh');
      }
});
}
