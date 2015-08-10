
/* nicastillo Update records to correctly display flags*/
Update FACT_visits set readingFlag = 0
Update  FACT_visits set readingFlag = 1 where notes like '%reading%'
Update FACT_visits set moreCasesFlag = 0
Update  FACT_visits set moreCasesFlag = 1 where notes like '%more cases%'
Update FACT_visits set comfortableFlag = 0
Update  FACT_visits set comfortableFlag = 1 where notes like '%comfortable%'
Update FACT_visits set missingAssessmentFlag = 0
Update  FACT_visits set missingAssessmentFlag = 1 where notes like '%missing assessment%' or diagnosis like '%missing assessment%'
  
  

/* nicastillo Update query to remove average columns in domain reports*/
Update sql_queries set query = 'SELECT diagnosisCategory as ''Category'',    
  diagnosislabel as ''Diagnosis'',       
  COUNT(CASE when addedBy like ? then 1 end) as ''# of Visits''         
  FROM LKuP_diagnosisMulti AS LdM             
  LEFT JOIN LKuP_diagnosis AS Ld        
  ON LdM.diagnosisMultiValue = Ld.diagnosisKey             
  LEFT JOIN FACT_visits AS FV        ON LdM.diagnosisMultiKey = FV.diagnosisMulti    
  LEFT JOIN lkup_date AS d        ON fullDate = date      %WHERECLAUSE% and diagnosisOrder > 0   
  group by diagnosisCategory, diagnosislabel            order by diagnosiscategory,diagnosislabel' 
  where queryLabel = 'domainSpecificReport'
  
/* nicastillo Fix query to correctly display self assessment report*/
Update sql_queries set query = 'Select notes as Notes, date as Date, e.agelabel as Age, d.genderlabel as Gender, diagnosisLabel as Diagnosis   
from FACT_visits a      inner join     LKUP_diagnosisMulti b on a.diagnosisMulti =b.diagnosisMultiKey     
inner join LKuP_diagnosis c  on b.diagnosisMultiValue = c.diagnosisKey        
inner join LKuP_Gender as d on a.gender = d.genderkey       
inner join LKuP_Age as e on a.age = e.ageorder       
inner join lkup_date as dat on a.date = dat.fullDate     
%WHERECLAUSE% and (notes like ''%Reading%'' or notes like ''%More Cases%'')       
and diagnosislabel not like ''%No Diagnosis%'' and deleteflag = 0    order by notes, visitskey, diagnosis' 
where queryLabel='selfReport';   

/* nicastillo Fix query to correctly display missing assessment report*/
Update sql_queries set query = 'Select notes as Notes, date as Date, agelabel as ''Age Range'', genderlabel as Gender     
from FACT_visits as a       inner join LKUP_gender b on  a.gender = b.genderkey      
inner join LKUP_age c on a.age = c.agekey     inner join lkup_date d on a.date = d.fullDate   
%WHERECLAUSE% and notes like ''%Missing Assessment%'' and deleteflag = 0   
union     Select diagnosis as Notes, date as Date, agelabel as ''Age Range'', genderlabel as Gender    
from FACT_visits as a       inner join LKUP_gender b on  a.gender = b.genderkey      
inner join LKUP_age c on a.age = c.agekey       inner join lkup_date d on a.date = d.fullDate   
%WHERECLAUSE% and diagnosis like ''%Missing Assessment%'' and deleteflag = 0      order by date' 
where queryLabel ='missingReport'