/*isabellavieira Update query for Total Domain Graph*/
UPDATE sql_queries
SET query = 'SELECT diagnosisDomain as ''Domain'',      
COUNT(CASE when addedBy like ? then 1 end) as ''# of Visits'',      
sum(case when gender = 1 then 1 else 0 end)as ''Not Specified'',      
sum(case when gender = 2 then 1 else 0 end)as ''Male'',          
sum(case when gender = 3 then 1 else 0 end)as ''Female''   FROM LKuP_diagnosisMulti AS LdM      
LEFT JOIN LKuP_diagnosis as Ld ON LdM.diagnosisMultiValue = Ld.diagnosisKey      
LEFT JOIN FACT_visits as Fv ON LdM.diagnosisMultiKey = Fv.diagnosisMulti      
LEFT JOIN lkup_date AS d   ON fullDate = date  %WHERECLAUSE%	
group by diagnosisDomain       order by diagnosisDomain'
WHERE queryLabel = 'totalDomainGraph';

/*isabellavieira Update query for Total Domain Report*/
UPDATE sql_queries
SET query = 'SELECT diagnosisDomain as ''Domain'',      
COUNT(CASE when addedBy like ? then 1 end) as ''# of Visits''   
FROM LKuP_diagnosisMulti AS LdM      
LEFT JOIN LKuP_diagnosis as Ld ON LdM.diagnosisMultiValue = Ld.diagnosisKey     
LEFT JOIN FACT_visits as Fv ON LdM.diagnosisMultiKey = Fv.diagnosisMulti      
LEFT JOIN lkup_date AS d        ON fullDate = date  %WHERECLAUSE%    
group by diagnosisDomain           order by diagnosisDomain'
WHERE queryLabel = 'totalDomainGraph';

/* isabellavieira Delete the table View -> lkup_addedBy */