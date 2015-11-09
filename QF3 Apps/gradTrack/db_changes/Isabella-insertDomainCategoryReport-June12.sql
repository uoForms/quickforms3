INSERT INTO sql_queries (queryLabel, query) VALUES ('domainCategoryReport',
'WITH temp (Category, Minimum, Maximum) as   
(SELECT x.diagnosisCategory, MIN(x.numVisits) 
as Mini,  MAX(x.numVisits) as Maxi  from   
(SELECT  COUNT(*)as numVisits,diagnosisCategory, addedBy FROM LKuP_diagnosisMulti AS LdM               
inner JOIN LKuP_diagnosis AS Ld        ON LdM.diagnosisMultiValue = Ld.diagnosisKey               
inner JOIN FACT_visits AS FV        ON LdM.diagnosisMultiKey = FV.diagnosisMulti       
inner JOIN lkup_date AS d        ON fullDate = date      WHERE diagnosisOrder > 0 AND diagnosisDomain = ?    
GROUP BY diagnosisCategory, addedBy) x     GROUP BY x.diagnosisCategory)   
SELECT temp.Category, sum(case when addedBy like ? then 1 else 0 end) as ''# of Visits'', Minimum, Maximum  
FROM temp   JOIN LKuP_diagnosis AS Ld on ld.diagnosisCategory = temp.Category              
JOIN  LKuP_diagnosisMulti AS LdM       ON LdM.diagnosisMultiValue = Ld.diagnosisKey               
JOIN FACT_visits AS FV        ON LdM.diagnosisMultiKey = FV.diagnosisMulti  JOIN lkup_date AS d        
ON fullDate = date      %WHERECLAUSE% GROUP BY temp.Category, Minimum, Maximum, ld.diagnosisCategory;

