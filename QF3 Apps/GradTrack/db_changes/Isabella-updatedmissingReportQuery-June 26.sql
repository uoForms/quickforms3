/* Updated missigReport query by Isabella Vieira 06.26.13 */

UPDATE sql_queries SET query = 'Select missingText as ''Missing Assessment'', date as Date, agelabel as ''Age Range'', genderlabel as Gender   from FACT_visits as a        
inner join LKUP_gender b on  a.gender = b.genderkey          
inner join LKUP_age c on a.age = c.agekey       
inner join lkup_date d on a.date = d.fullDate       
where addedBy = ? and deleteflag = 0 and (missingText like ''%Missing Assessment%'')
order by date, genderlabel'  
WHERE queryLabel = 'missingReport';
