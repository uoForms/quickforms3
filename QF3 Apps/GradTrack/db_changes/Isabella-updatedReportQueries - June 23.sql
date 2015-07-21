 /* Updated queries by Isabella Vieira - 06.23.14 */
 
	/* Age/Gender Report */
	UPDATE sql_queries SET query = ' 
	select genderLabel as "Gender", AgeLabel as "Age", 
	COUNT(a.visitsKey) as "Visits"   from FACT_visits as a 
	left join  LKUP_age as b on a.age = b.ageKey 
	left join  LKUP_gender as c on a.gender = c.genderKey 
	left join  lkup_date as d on d.fullDate = a.date  
	where addedBy = ? and genderLabel is not null  
	group by genderKey,genderLabel, ageKey, ageLabel  order by genderKey, ageKey '
	WHERE queryLabel = 'ageGenderReport';
	    
	/* Age Gender Graph */
	UPDATE sql_queries SET query = '
	select ageLabel as ''Age'',    
	sum(case when gender = 2 then 1 else 0 end)as ''Male'',    
	sum(case when gender = 3 then 1 else 0 end)as ''Female'',   
	sum(case when gender = 1 then 1 else 0 end)as ''Not Specified''  
	from lkup_age  left join  FACT_visits on age = ageKey  
	left join lkup_date on date = fullDate  where addedBy=?  
	group by ageLabel, ageOrder  order by ageOrder '
	WHERE queryLabel='ageGenderGraph';

	/* Self Report */
	UPDATE sql_queries SET query = '
	Select notes as Notes, date as Date, e.agelabel as Age, d.genderlabel as Gender, diagnosisLabel as Diagnosis     
	from FACT_visits a      inner join     LKUP_diagnosisMulti b on a.diagnosisMulti =b.diagnosisMultiKey       
	inner join LKuP_diagnosis c  on b.diagnosisMultiValue = c.diagnosisKey          
	inner join LKuP_Gender as d on a.gender = d.genderkey         
	inner join LKuP_Age as e on a.age = e.ageorder        
	inner join lkup_date as dat on a.date = dat.fullDate       
	where addedBy = ? and (notes like ''%Reading%'' or notes like ''%More Cases%'')         
	and diagnosislabel not like ''%No Diagnosis%'' and deleteflag = 0    
	order by notes, visitskey, diagnosis'
	WHERE queryLabel = 'selfReport';

	/* Missing Report */
	UPDATE sql_queries SET query = '
	Select notes as Notes, date as Date, agelabel as ''Age Range'', genderlabel as Gender       from FACT_visits as a       
	inner join LKUP_gender b on  a.gender = b.genderkey        
	inner join LKUP_age c on a.age = c.agekey     
	inner join lkup_date d on a.date = d.fullDate     
	where addedBy = ? and notes like ''%Missing Assessment%'' and deleteflag = 0     
	union     Select diagnosis as Notes, date as Date, agelabel as ''Age Range'', genderlabel as Gender      from FACT_visits as a      
	inner join LKUP_gender b on  a.gender = b.genderkey        
	inner join LKUP_age c on a.age = c.agekey       
	inner join lkup_date d on a.date = d.fullDate    
	where addedBy = ? and diagnosis like ''%Missing Assessment%'' and deleteflag = 0      order by date'
	WHERE queryLabel = 'missingReport';

	/* Special Pop graph */
	UPDATE sql_queries SET query = '
	WITH    tempSP (sp_label, vk) as       
	(SELECT ''Aboriginal'', visitskey     
	from FACT_visits where aboriginalFlag <> 0        
	UNION ALL     SELECT ''Disability'', visitskey     
	from FACT_visits where disabilityFlag <> 0       
	UNION ALL     SELECT ''Homeless'', visitskey from FACT_visits where homelessFlag <> 0       
	UNION ALL SELECT ''Refugee'', visitskey from FACT_visits where refugeeFlag <> 0)         
	SELECT ''"''+sp_label+''"''  as ''Special Populations'',       
	sum(CASE WHEN genderlabel like ''Male'' then 1 else 0 end) as Male,       
	sum(CASE WHEN genderlabel like ''Female'' then 1 else 0 end)as Female,      
	sum(CASE WHEN  genderlabel like ''Not Specified'' then 1 else 0 end) as ''Not Specified''     
	from FACT_visits as a     left join LKUP_Gender as b on a.gender=b.genderkey       
	left join tempSP as temp on temp.vk = a.visitskey     
	left join lkup_date as d on d.fulldate = a.date   
	where addedBy = ? and (aboriginalFlag <> 0 or disabilityFlag <> 0 or homelessFlag <> 0 or refugeeFlag <> 0 ) and deleteflag <> 1      
	group by sp_label    order by sp_label '
	WHERE queryLabel = 'specialPopGraph'; 

	/*Special Pop Report */
	UPDATE sql_queries SET query = '
	WITH tempSP (sp_label, vk, gender) as        
	(SELECT ''Aboriginal'', visitskey, gender from FACT_visits where aboriginalFlag <> 0           
	UNION ALL     SELECT ''Disability'', visitskey, gender from FACT_visits where disabilityFlag <> 0          
	UNION ALL     SELECT ''Homeless'', visitskey, gender from FACT_visits where homelessFlag <> 0           
	UNION ALL SELECT ''Refugee'', visitskey, gender from FACT_visits where refugeeFlag <> 0)               
	SELECT b.genderlabel as ''Gender'',      ''"''+temp.sp_label+''"'' as ''Special Populations'',         
	COUNT(CASE when addedby = ? then 1 end) as ''# of Visits'' from tempSP as temp   
	left join LKUP_Gender as b on temp.gender=b.genderkey           
	left join FACT_visits as fv on temp.vk = fv.visitskey             
	left join lkup_date as d on d.fulldate = fv.date    
	where addedBy = ?    and    (aboriginalFlag <> 0 or disabilityFlag <> 0 or homelessFlag <> 0 or refugeeFlag <> 0 ) 
	and     deleteflag <> 1       group by b.genderorder, sp_label, b.genderlabel     order by b.genderorder, temp.sp_label'
	where queryLabel = 'specialPopReport';