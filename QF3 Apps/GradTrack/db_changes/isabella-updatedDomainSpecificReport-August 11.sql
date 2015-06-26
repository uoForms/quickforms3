/* Query Domain Details Report - updated 08.11.14 by Isabella Vieira */

update sql_queries set query = '
DECLARE @user varchar(15)
SET @user = ?
(SELECT diagnosisCategory as ''Category'', diagnosislabel as ''Diagnosis'',           
COUNT(CASE when addedBy like @user then 1 end) as ''# of Visits'' FROM LKuP_diagnosisMulti AS LdM                 
LEFT JOIN LKuP_diagnosis AS Ld  ON LdM.diagnosisMultiValue = Ld.diagnosisKey                 
LEFT JOIN FACT_visits AS FV ON LdM.diagnosisMultiKey = FV.diagnosisMulti        
LEFT JOIN lkup_date AS d  ON fullDate = date %WHERECLAUSE% and diagnosisOrder > 0       
group by diagnosisCategory, diagnosislabel )
UNION
(SELECT  LKUP_diagnosis.diagnosisCategory AS Category, '''' AS Diagnosis_Label,
COUNT(LKUP_diagnosis.diagnosisCategory) AS [#Visits]
FROM     LKUP_diagnosisMulti 
INNER JOIN LKUP_diagnosis ON LKUP_diagnosisMulti.diagnosisMultiValue = LKUP_diagnosis.diagnosisKey 
INNER JOIN FACT_visits ON LKUP_diagnosisMulti.diagnosisMultiKey = FACT_visits.diagnosisMulti
inner join lkup_date as dat on dat.fullDate = FACT_visits.date 
%WHERECLAUSE% and FACT_visits.addedBy = @user
GROUP BY FACT_visits.addedBy, LKUP_diagnosis.diagnosisCategory)'
where queryLabel = 'domainSpecificReport'