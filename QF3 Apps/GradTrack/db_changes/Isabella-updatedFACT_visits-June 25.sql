  /* Edited FACT_visits table by Isabella Vieira - 06.25.14 */
  
  /* Adding a new column */
  ALTER TABLE FACT_visits ADD cutNotes VARCHAR(53)
  
  /* Updating the column to show as Notes */
  UPDATE sql_queries SET query = 'select a.visitsKey as id,''newVisit''as form, 
  convert(varchar,a.date,106) as "Date", d.ageLabel as "Age", e.genderLabel as "Gender" ,
  a.diagnosis as "Diagnosis", a.cutNotes as "Notes", f.locationLabel as "Location"  from FACT_visits as a  
  left join  LKUP_age as d on d.ageKey = a.age  left join  LKUP_gender as e on e.genderKey = a.gender  
  left join  LKUP_location as f on f.locationKey = a.location  left join  lkup_date as g on g.fulldate = a.date  %WHERECLAUSE% and deleteFlag != 1  order by visitsKey desc'
  where queryLabel = 'getVisitsRows';