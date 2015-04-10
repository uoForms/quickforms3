INSERT INTO fact_queries (query, queryLabel) VALUES ('
DECLARE @domain varchar(25);       
DECLARE @user varchar(15);       
SET @domain = ?        
SET @user = ? 
;WITH temp (Diagnosis,     Minimum,     Maximum)         
AS (SELECT x.diagnosisLabel,     MIN (x.numVisits) AS Mini,     MAX (x.numVisits) 
AS Maxi      FROM 
(SELECT SUM (CASE          WHEN ldm.diagnosisMultiValue <> 0 %ANDCLAUSE% THEN 1          
ELSE 0          END) AS numVisits,         diagnosisLabel,         addedBy          
FROM         LKuP_diagnosisMulti AS LdM 
LEFT JOIN LKuP_diagnosis AS Ld  ON LdM.diagnosisMultiValue = Ld.diagnosisKey            
LEFT JOIN FACT_visits AS FV  ON LdM.diagnosisMultiKey = FV.diagnosisMulti         
left JOIN lkup_date AS d ON fullDate = fv.date         
left join lkup_location as ll on fv.location = ll.locationKey          
where diagnosisDomain = @domain and diagnosisOrder >= 0 AND deleteFlag = 0          
GROUP BY diagnosisLabel,   addedBy) x    
GROUP BY x.diagnosisLabel)         
SELECT temp.Diagnosis AS ''Diagnosis'',     
SUM (CASE      WHEN addedBy LIKE @user %ANDCLAUSE%
THEN 1       ELSE 0    END) AS ''# of Diagnoses'',     Minimum,     Maximum    FROM     temp 
LEFT JOIN LKuP_diagnosis AS Ld   ON ld.diagnosisLabel = temp.Diagnosis      
LEFT JOIN LKuP_diagnosisMulti AS LdM    ON LdM.diagnosisMultiValue = Ld.diagnosisKey      
LEFT JOIN FACT_visits AS FV   ON LdM.diagnosisMultiKey = FV.diagnosisMulti     
LEFT JOIN lkup_date AS d   ON fullDate = fv.date         
LEFT join lkup_location as ll on fv.location = ll.locationKey      
where diagnosisDomain = @domain and diagnosisOrder >= 0 AND deleteFlag = 0      
GROUP BY temp.Diagnosis,     Minimum,     Maximum,     ld.diagnosisLabel', 'childrenElderlySummaryReport')