define([],function(){ 
		
	quickforms.form.domParsers.push(function(formObj){
		formObj.completedListeners.push(function(){
		var bpFields=$('#bpfields');
			bpFields.toggle($('#YesBP').is(":checked"));
				$('#YesBP,#NoBP,#uncertainBP').on('click',function(){
		if (quickforms.currentFormquestionnaire_form.childMap.YesBP.checked == true)
		{
			bpFields.show();
		}
		else
		{
		
			bpFields.hide();
		}
	         });
		});
	});	
});
function chapsSubmit(){
 
			var ageScore = parseInt(quickforms.currentFormprofile_form.childMap.ageScore.currentVal);
			var genderScore = parseInt(quickforms.currentFormprofile_form.childMap.genderScore.currentVal);
			var BPscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.BPscore.currentVal);
			var HPSscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.HPSscore.currentVal);
			var DBscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.DBscore.currentVal);
			var motherDBscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.motherDBscore.currentVal);
			var fatherDBscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.fatherDBscore.currentVal);
			var childDBscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.childDBscore.currentVal);
			var siblingDBscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.siblingDBscore.currentVal);
			var otherDBscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.otherDBscore.currentVal);
			var babymore9poundsscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.babymore9poundsscore.currentVal);
			var exercisescore = parseInt(quickforms.currentFormquestionnaire_form.childMap.exercisescore.currentVal);
			var fruitvegScore = parseInt(quickforms.currentFormquestionnaire_form.childMap.fruitvegScore.currentVal);
			var eduscore = parseInt(quickforms.currentFormquestionnaire_form.childMap.eduScore.currentVal);
		    var ethencityScore = parseInt(quickforms.currentFormquestionnaire_form.childMap.ethenicityScore.currentVal);
			var BMIScore = parseInt(quickforms.currentFormmeasurements_form.childMap.BMIScore.currentVal);
			var waistScore = parseInt(quickforms.currentFormmeasurements_form.childMap.waistScore.currentVal);
			var canRiskLevel = quickforms.currentFormvisitsform.childMap.canRiskLevel.currentVal;
			var tenYearRisk = quickforms.currentFormvisitsform.childMap.tenYearRisk.currentVal;
			
			var  canscore = parseInt(quickforms.currentFormvisitsform.childMap.canscore.currentVal);
			var frScore = quickforms.currentFormvisitsform.childMap.framinghamScore.currentVal;
			
				if(quickforms.currentFormprofile_form.childMap.age.selectedField >= 55 &&  quickforms.currentFormprofile_form.childMap.age.selectedField <= 64)
				{
					ageScore = 13;
				}
				else if(quickforms.currentFormprofile_form.childMap.age.selectedField >= 65)
				{
					ageScore = 15;
				}
                else
					ageScore = 0; 
				
				if(quickforms.currentFormprofile_form.childMap.gender.selectedField == 2)
				{
					genderScore = 6;
				}
				else
				{
					genderScore = 0; 
					
				}
				if(quickforms.currentFormquestionnaire_form.childMap.YesHPS.checked == true )
				{
					HPSscore = 14;
				}
				else
					HPSscore = 0;
			
				
                if(quickforms.currentFormquestionnaire_form.childMap.YesPills.checked == true || quickforms.currentFormquestionnaire_form.childMap.YesBP.checked ==  true)
				{
					BPscore = 4; 
				}
				else
					BPscore = 0; 
					
				if(quickforms.currentFormquestionnaire_form.childMap.diabetesYes.checked == true)
				{
				  if(quickforms.currentFormquestionnaire_form.childMap.motherdbYes.checked == true)
				  {
				     motherDBscore = 2;
				  }
				  else
					 motherDBscore = 0;
			      if(quickforms.currentFormquestionnaire_form.childMap.fatherdbYes.checked == true)
				  {
					fatherDBscore = 2; 
				  }
				  else
					fatherDBscore = 0;
				  if(quickforms.currentFormquestionnaire_form.childMap.childdbYes.checked == true)
				  {
				    childDBscore = 2;
				  }
				  else
					childDBscore = 0;
				  if(quickforms.currentFormquestionnaire_form.childMap.siblingdbYes.checked == true)
				  {
				   siblingDBscore = 2;
				  }
				  else
					siblingDBscore = 0;
				  if(quickforms.currentFormquestionnaire_form.childMap.otherdbYes.checked == true)
				  {
				    otherDBscore = 0;
				  }
				  else
					otherDBscore = 0;
				}
				else
					DBscore = 0;
					
				if(quickforms.currentFormquestionnaire_form.childMap.babymore9poundsYes.checked ==  true && genderScore == 0)
					{
					  babymore9poundsscore = 1;
					}
					else
					 babymore9poundsscore = 0;
				if(quickforms.currentFormquestionnaire_form.childMap.exerciseNo.checked ==  true)
					{
					   exercisescore = 1;
					}
				else
				    exercisescore = 0;
				
				if(quickforms.currentFormquestionnaire_form.childMap.fruitvegNo.checked ==  true)
					{
					 fruitvegScore = 2;
					}
				else
				     fruitvegScore = 0;
				
				if(quickforms.currentFormquestionnaire_form.childMap.education.selectedField == 0)
				{
					eduscore = 5;
				}
				else if(quickforms.currentFormquestionnaire_form.childMap.education.selectedField == 1)
				{
					eduscore = 1;
				}
				else
				eduscore = 0;
				
				if(quickforms.currentFormquestionnaire_form.childMap.motherEthnicity.selectedField == 2 && quickforms.currentFormquestionnaire_form.childMap.fatherEthnicity.selectedField == 2 )
					{
					 ethencityScore = 3;
					}
				else if(quickforms.currentFormquestionnaire_form.childMap.motherEthnicity.selectedField == 3 && quickforms.currentFormquestionnaire_form.childMap.fatherEthnicity.selectedField == 3)	
			       {
					 ethencityScore = 5;
					}
				else if(quickforms.currentFormquestionnaire_form.childMap.motherEthnicity.selectedField == 4 && quickforms.currentFormquestionnaire_form.childMap.fatherEthnicity.selectedField == 4)	
			       {
					 ethencityScore = 10;
					}
				else if(quickforms.currentFormquestionnaire_form.childMap.motherEthnicity.selectedField == 5 && quickforms.currentFormquestionnaire_form.childMap.fatherEthnicity.selectedField == 5)	
			       {
					 ethencityScore = 11;
					}
				else if(quickforms.currentFormquestionnaire_form.childMap.motherEthnicity.selectedField == 6 && quickforms.currentFormquestionnaire_form.childMap.fatherEthnicity.selectedField == 6)	
			       {
					 ethencityScore = 3;
					}
				else
                  ethencityScore = 0;
				  
                if(quickforms.currentFormmeasurements_form.childMap.BMI.currentVal >= 25  && quickforms.currentFormmeasurements_form.childMap.BMI.currentVal <= 29)
					{
					BMIScore = 4;
					}
				else if(quickforms.currentFormmeasurements_form.childMap.BMI.currentVal >= 30 && quickforms.currentFormmeasurements_form.childMap.BMI.currentVal <= 34)
					{
					BMIScore = 9;
					}
				else if(quickforms.currentFormmeasurements_form.childMap.BMI.currentVal >= 35)
					{
					BMIScore = 14;
					}
				else
					{
					  BMIScore = 0;
					}
				if(quickforms.currentFormprofile_form.childMap.gender.selectedField == 2)
				{
				  if(quickforms.currentFormmeasurements_form.childMap.waist.currentVal >102)
				  {
				    waistScore = 6;
				  }
				  else if(quickforms.currentFormmeasurements_form.childMap.waist.currentVal >=94 && quickforms.currentFormmeasurements_form.childMap.waist.currentVal <=102)
				  {
				    waistScore = 4;
				  }
				  else
				    waistScore = 0;
				}
				else if (quickforms.currentFormprofile_form.childMap.gender.selectedField == 3)
				{
				   if(quickforms.currentFormmeasurements_form.childMap.waist.currentVal >88)
				  {
				    waistScore = 6;
				  }
				  else if(quickforms.currentFormmeasurements_form.childMap.waist.currentVal >=80 && quickforms.currentFormmeasurements_form.childMap.waist.currentVal <= 88)
				  {
				    waistScore = 4;
				  }
				  else
				    waistScore = 0;
				}
				
			DBscore = motherDBscore + fatherDBscore + childDBscore + siblingDBscore + otherDBscore;
			
			canscore = ageScore + genderScore + BPscore + HPSscore + DBscore + babymore9poundsscore + exercisescore + fruitvegScore + eduscore + ethencityScore + BMIScore + waistScore;
			
			quickforms.currentFormvisitsform.childMap.canscore.currentVal = canscore;
			
			if(quickforms.currentFormvisitsform.childMap.canscore.currentVal < 21 )
			{
			   canRiskLevel = "Low risk";
			}
			else if(quickforms.currentFormvisitsform.childMap.canscore.currentVal >= 21 && quickforms.currentFormvisitsform.childMap.canscore.currentVal <= 32)
			{
				canRiskLevel = "Moderate risk";
			}
			else if(quickforms.currentFormvisitsform.childMap.canscore.currentVal >=33)
			{
			 	canRiskLevel = "High risk";
			}
			
			
			
			quickforms.currentFormprofile_form.childMap.ageScore.currentVal = ageScore;
			quickforms.currentFormprofile_form.childMap.genderScore.currentVal = genderScore;
		    quickforms.currentFormquestionnaire_form.childMap.BPscore.currentVal = BPscore;
            quickforms.currentFormquestionnaire_form.childMap.HPSscore.currentVal = HPSscore;
			quickforms.currentFormquestionnaire_form.childMap.DBscore.currentVal = DBscore;
			quickforms.currentFormquestionnaire_form.childMap.motherDBscore.currentVal = motherDBscore;
			quickforms.currentFormquestionnaire_form.childMap.fatherDBscore.currentVal = fatherDBscore;
			quickforms.currentFormquestionnaire_form.childMap.childDBscore.currentVal = childDBscore;
			quickforms.currentFormquestionnaire_form.childMap.siblingDBscore.currentVal = siblingDBscore;
			quickforms.currentFormquestionnaire_form.childMap.otherDBscore.currentVal = otherDBscore;
			quickforms.currentFormquestionnaire_form.childMap.babymore9poundsscore.currentVal = babymore9poundsscore;
			quickforms.currentFormquestionnaire_form.childMap.exercisescore.currentVal = exercisescore;
			quickforms.currentFormquestionnaire_form.childMap.fruitvegScore.currentVal = fruitvegScore;
			quickforms.currentFormquestionnaire_form.childMap.eduScore.currentVal = eduscore;
			quickforms.currentFormquestionnaire_form.childMap.ethenicityScore.currentVal = ethencityScore;
			quickforms.currentFormmeasurements_form.childMap.BMIScore.currentVal = BMIScore;
			quickforms.currentFormmeasurements_form.childMap.waistScore.currentVal = waistScore;
			 quickforms.currentFormvisitsform.childMap.canRiskLevel.currentVal = canRiskLevel;
			 
			 
			 
			  
		   
		    
			 if(quickforms.currentFormprofile_form.childMap.gender.selectedField == 3)
			 {
			  var logAge = Math.log(parseInt(quickforms.currentFormprofile_form.childMap.age.selectedField));
			  var betaWomenAge = 2.32888;
			  var  ageCal = logAge*betaWomenAge;
		
			  var logHDL =  Math.log(parseInt(quickforms.currentFormmeasurements_form.childMap.HDL.currentVal));
			  var betaHDL = -0.70833;
			  var  HDLCal = logHDL*betaHDL;
			
			  var logTotalCholestrol =  Math.log(parseInt(quickforms.currentFormmeasurements_form.childMap.TotalCholestrol.currentVal));
			  var betaTotalCholestrol = 1.20904;
			  var  TotalCholestrolCal = logTotalCholestrol*betaTotalCholestrol;
		
			 
			  if(quickforms.currentFormquestionnaire_form.childMap.medBPYes.checked == true || quickforms.currentFormquestionnaire_form.childMap.YesPills.checked == true)
			  {
			   var betaWomenBP = 2.82263;
			   var logSPB = Math.log(parseInt(quickforms.currentFormmeasurements_form.childMap.systolisBP.currentVal));
			   var womenBPCal = logSPB*betaWomenBP;
			  }
			  else
			  {
			   var betaWomenBP = 2.76157;
			   var logSPB = Math.log(parseInt(quickforms.currentFormmeasurements_form.childMap.systolisBP.currentVal));
			   var womenBPCal = logSPB*betaWomenBP;
			  }
			  
			  if(quickforms.currentFormquestionnaire_form.childMap.smokeYes.checked == true || quickforms.currentFormquestionnaire_form.childMap.smokeuncertain.checked == true)
			  {
			       var smokeVal = 1;
				   var smokeBeta = 0.52873;
				   var womenSmokeCal = smokeBeta*smokeVal;
			  }
			  else
			  {
			  var womenSmokeCal = 0;
			  }
			  
			  if(quickforms.currentFormquestionnaire_form.childMap.diabYes.checked == true || quickforms.currentFormquestionnaire_form.childMap.diabuncertain.checked == true)
			  { 
			    var diabetesVal = 1;
				   var diabetesBeta = 0.69154;
				   var womenDiabetesCal = diabetesBeta*diabetesVal;
			  }
			  else
			  {
			   var womenDiabetesCal = 0;
			  }
			  
			 var betaProductXSum =  ageCal + womenBPCal + womenSmokeCal + HDLCal + TotalCholestrolCal;
			 var expInValue = betaProductXSum - 26.1931;
			 var expOutValue = Math.exp(expInValue);
			 var powerOutValue = Math.pow(0.95012,expOutValue);
			 var tempfrScorepoint = Math.round((1 - powerOutValue)* 100);
			  
			  if(tempfrScorepoint < 9)
			  {
			    frScore = "<1%";
			  }
			  else if(tempfrScorepoint >= 9 && tempfrScorepoint <=12)
			  {
			    frScore = "1%";
			  }
			  else if(tempfrScorepoint >= 13 && tempfrScorepoint <=14)
			  {
			    frScore = "2%";
			  }
			   else if(tempfrScorepoint == 15)
			  {
			    frScore = "3%";
			  }
			   else if(tempfrScorepoint == 16)
			  {
			    frScore = "4%";
			  }
			   else if(tempfrScorepoint == 17)
			  {
			    frScore = "5%";
			  }
			   else if(tempfrScorepoint == 18)
			  {
			    frScore = "6%";
			  }
			   else if(tempfrScorepoint == 19)
			  {
			    frScore = "8%";
			  }
			   else if(tempfrScorepoint == 20)
			  {
			    frScore = "11%";
			  }
			   else if(tempfrScorepoint == 21)
			  {
			    frScore = "14%";
			  }
			   else if(tempfrScorepoint == 22)
			  {
			    frScore = "17%";
			  }
			   else if(tempfrScorepoint == 23)
			  {
			    frScore = "22%";
			  }
			   else if(tempfrScorepoint == 24)
			  {
			    frScore = "27%";
			  }
		      else if(tempfrScorepoint >= 25)
			  {
			    frScore = "Over 30%";
			  }
			 }
			 else if(quickforms.currentFormprofile_form.childMap.gender.selectedField == 2)
			 {
			  var logMenAge = Math.log(parseInt(quickforms.currentFormprofile_form.childMap.age.selectedField));
			  var betaMenAge = 3.06117;
			  var  ageCal = logMenAge*betaMenAge;
			 
			  var logmenHDL =  Math.log(parseInt(quickforms.currentFormmeasurements_form.childMap.HDL.currentVal));
			  var betamenHDL = -0.93263;
			  var  HDLCal = logmenHDL*betamenHDL;

			  var logTotalCholestrol =  Math.log(parseInt(quickforms.currentFormmeasurements_form.childMap.TotalCholestrol.currentVal));
			  var betaTotalCholestrol = 1.12370;
			  var  TotalCholestrolCal = logTotalCholestrol*betaTotalCholestrol;
			  
			 
			  if(quickforms.currentFormquestionnaire_form.childMap.medBPYes.checked == true || quickforms.currentFormquestionnaire_form.childMap.YesPills.checked == true)
			  {
			   var betaWomenBP = 1.99881;
			   var logSPB = Math.log(parseInt(quickforms.currentFormmeasurements_form.childMap.systolisBP.currentVal));
			   var womenBPCal = logSPB*betaWomenBP;
			  }
			  else
			  {
			   var betaWomenBP = 1.93303;
			   var logSPB = Math.log(parseInt(quickforms.currentFormmeasurements_form.childMap.systolisBP.currentVal));
			   var womenBPCal = logSPB*betaWomenBP;
			  }
			  
			  if(quickforms.currentFormquestionnaire_form.childMap.smokeYes.checked == true || quickforms.currentFormquestionnaire_form.childMap.smokeuncertain.checked == true)
			  {
			       var smokeVal = 1;
				   var smokeBeta = 0.65451;
				   var womenSmokeCal = smokeBeta*smokeVal;
					
			  }
			  else
			  {
			  var womenSmokeCal = 0;
			  }
			  
			  if(quickforms.currentFormquestionnaire_form.childMap.diabYes.checked == true || quickforms.currentFormquestionnaire_form.childMap.diabuncertain.checked == true)
			  { 
			    var diabetesVal = 1;
				   var diabetesBeta = 0.57367;
				   var womenDiabetesCal = diabetesBeta*diabetesVal;
				 
			  }
			  else
			  {
			   var womenDiabetesCal = 0;
			  }
			  
			 var betaProductXSum =  ageCal + womenBPCal + womenSmokeCal + HDLCal + TotalCholestrolCal;
			 var expInValue = betaProductXSum - 23.9802 ;
			 var expOutValue = Math.exp(expInValue);
			 var powerOutValue = Math.pow(0.88936,expOutValue);
			 var tempfrScorepoint = Math.round((1 - powerOutValue)* 100);
			 
			  if(tempfrScorepoint == 0)
			  {
			    frScore ="<1%";
			  }
			  else if(tempfrScorepoint >= 1 && tempfrScorepoint <=4)
			  {
			    frScore = "1%";
			  }
			  else if(tempfrScorepoint >= 5 && tempfrScorepoint <=6)
			  {
			    frScore = "2%";
			  }
			   else if(tempfrScorepoint == 7)
			  {
			    frScore = "3%";
			  }
			   else if(tempfrScorepoint == 8)
			  {
			    frScore = "4%";
			  }
			   else if(tempfrScorepoint == 9)
			  {
			    frScore = "5%";
			  }
			   else if(tempfrScorepoint == 10)
			  {
			    frScore = "6%";
			  }
			   else if(tempfrScorepoint == 11)
			  {
			    frScore = "8%";
			  }
			   else if(tempfrScorepoint == 12)
			  {
			    frScore = "10%";
			  }
			   else if(tempfrScorepoint == 13)
			  {
			    frScore = "12%";
			  }
			   else if(tempfrScorepoint == 14)
			  {
			    frScore = "16%";
			  }
			   else if(tempfrScorepoint == 15)
			  {
			    frScore = "20%";
			  }
			   else if(tempfrScorepoint == 16)
			  {
			    frScore = "25%";
			  }
		      else if(tempfrScorepoint >= 17)
			  {
			  
              frScore = "Over 30%";
				
			  }
			 }
			 

			 
			 
			 quickforms.currentFormvisitsform.childMap.framinghamScore.currentVal = frScore;
			 
	quickforms.putFact($('#submitButton')[0],'visits.html');
		
	
}
