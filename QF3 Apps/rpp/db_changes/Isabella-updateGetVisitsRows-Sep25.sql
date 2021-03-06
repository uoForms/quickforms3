  update fact_queries set query = '
  select a.visitsKey as id,''newVisit''as form,     
  convert(varchar,a.date,106) as "Date", d.ageLabel as "Age", e.genderLabel as "Gender" ,    
  a.diagnosis as "Diagnosis", Case WHEN (LEN(notes)>40) THEN LEFT(notes,40) + ''...'' ELSE notes END as "Notes", f.locationLabel as "Location"  from FACT_visits as a      
  left join  LKUP_age as d on d.ageKey = a.age  left join  LKUP_gender as e on e.genderKey = a.gender      
  left join  LKUP_location as f on f.locationKey = a.location  left join  lkup_date as g on g.fulldate = a.date  
  %WHERECLAUSE% and deleteFlag != 1  order by visitsKey desc'
  where queryLabel = 'getVisitsRows';