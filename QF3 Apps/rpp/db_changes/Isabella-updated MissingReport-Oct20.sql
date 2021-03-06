update fact_queries set query = '
Select missingText as ''Missing Assessment'', 
date as Date, agelabel as ''Age Range'', genderlabel as Gender   from FACT_visits as a          
left join LKUP_gender b on  a.gender = b.genderkey            
left join LKUP_age c on a.age = c.agekey         
left join lkup_date d on a.date = d.fullDate         
where addedBy = ? and deleteflag = 0 and (missingText like ''%Missing Assessment%'')  order by date, genderlabel'
where queryLabel = 'missingReport'