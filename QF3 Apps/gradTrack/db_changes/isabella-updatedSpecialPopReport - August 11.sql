/* Query updated by Isabella Vieira - 08.11.14 */

/* Special Populations Report */
update sql_queries SET query = '
WITH tempSP (sp_label, vk, gender) as                  
(SELECT ''Aboriginal'', visitskey, gender from FACT_visits where aboriginalFlag <> 0                   
UNION ALL       SELECT ''Disability'', visitskey, gender from FACT_visits where disabilityFlag <> 0                  
UNION ALL       SELECT ''Homeless'', visitskey, gender from FACT_visits where homelessFlag <> 0                   
UNION ALL   SELECT ''Refugee'', visitskey, gender from FACT_visits where refugeeFlag <> 0)                         
SELECT b.genderlabel as ''Gender'',      ''"''+temp.sp_label+''"'' as ''Special Populations'',                   
COUNT(CASE when addedby = ? then 1 end) as ''# of Visits'' from tempSP as temp             
left join LKUP_Gender as b on temp.gender=b.genderkey                     
left join FACT_visits as fv on temp.vk = fv.visitskey                       
left join lkup_date as d on d.fulldate = fv.date       %WHERECLAUSE%    and            
(aboriginalFlag <> 0 or disabilityFlag <> 0 or homelessFlag <> 0 or refugeeFlag <> 0 )   and             
deleteflag <> 1  group by b.genderorder, sp_label, b.genderlabel     order by b.genderorder, temp.sp_label'
where queryLabel = 'specialPopReport'

 
