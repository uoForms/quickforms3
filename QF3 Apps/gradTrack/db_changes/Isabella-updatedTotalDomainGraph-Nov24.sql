-- Updated by Isabella Vieira - Nov 24
update fact_queries set query = '
DECLARE     @user varchar (15) ;      
SET @user = ?;   
SELECT diagnosisDomain as ''Domain'',        COUNT(CASE when addedBy like @user then 1 end) as ''# of Visits''  FROM LKuP_diagnosisMulti AS LdM          LEFT JOIN LKuP_diagnosis as Ld ON LdM.diagnosisMultiValue = Ld.diagnosisKey          LEFT JOIN FACT_visits as Fv ON LdM.diagnosisMultiKey = Fv.diagnosisMulti          LEFT JOIN lkup_date AS d   ON fullDate = date    %WHERECLAUSE% and deleteFlag=0  and  diagnosisDomain <> ''adult''   group by diagnosisDomain   order by diagnosisDomain'
where queryLabel = 'totalDomainGraph'

 