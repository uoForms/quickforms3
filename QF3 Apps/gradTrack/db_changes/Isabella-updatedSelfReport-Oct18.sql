update fact_queries SET query = '
Select Case WHEN (LEN(notes)>40) THEN LEFT(notes,40) + ''...'' ELSE notes END as ''Notes'', date as Date, 
e.agelabel as Age, d.genderlabel as Gender, diagnosisLabel as Diagnosis       
from FACT_visits a      inner join     LKUP_diagnosisMulti b on a.diagnosisMulti =b.diagnosisMultiKey         
inner join LKuP_diagnosis c  on b.diagnosisMultiValue = c.diagnosisKey            
inner join LKuP_Gender as d on a.gender = d.genderkey           
inner join LKuP_Age as e on a.age = e.ageorder          
inner join lkup_date as dat on a.date = dat.fullDate         
where addedBy = ? and (notes like ''%Reading%'' or notes like ''%More Cases%'')           
and diagnosislabel not like ''%No Diagnosis%'' and deleteflag = 0      
order by notes, visitskey, diagnosis'
where queryLabel = 'selfReport'