
/*Queries updated by Isabella Vieira - 08.11.14*/

/*Age gender Report */
UPDATE sql_queries SET query = '  
select genderLabel as ''Gender'' , ageLabel as ''Age'',   
(select COUNT(visitsKey) as ''# of Visits'' from FACT_visits as visits      
left join  lkup_date as d on d.fullDate = visits.date   %WHERECLAUSE% and
visits.deleteFlag=0 and  
visits.gender = gender.genderKey   and visits.age = age.ageKey   and gender.genderLabel is not null )      
from LKUP_age as age, LKUP_gender as gender'
where queryLabel = 'ageGenderReport'
  
/* Age Gender Report */  
UPDATE sql_queries SET query = '  
select ageLabel as ''Age'',          
sum(case when gender = 2 then 1 else 0 end)as ''Male'',          
sum(case when gender = 3 then 1 else 0 end)as ''Female'',         
sum(case when gender = 1 then 1 else 0 end)as ''Not Specified''   from lkup_age    
left join  FACT_visits on age = ageKey        left join lkup_date on date = fullDate    
%WHERECLAUSE% and deleteFlag=0     group by ageLabel, ageOrder  order by ageOrder'
where queryLabel = 'ageGenderGraph'
 
