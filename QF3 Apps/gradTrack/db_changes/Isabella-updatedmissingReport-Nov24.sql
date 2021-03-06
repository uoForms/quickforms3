-- Updated by Isabella Vieira - Nov 24
update fact_queries set query = '
DECLARE     @user varchar (15) ;      
SET @user = ?;   
Select missingText as ''Missing Assessment'',   date as Date, agelabel as ''Age Range'', genderlabel as Gender from FACT_visits as a            left join LKUP_gender b on  a.gender = b.genderkey              left join LKUP_age c on a.age = c.agekey           left join lkup_date d on a.date = d.fullDate           where addedBy like @user %ANDCLAUSE% and deleteflag = 0 and (missingText like ''%Missing Assessment%'')  order by date, genderlabel'
where queryLabel = 'missingReport'