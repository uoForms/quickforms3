/* Updated by Isabella Vieira - 14.07.14 */

UPDATE sql_queries SET query = '
select genderLabel as ''Gender'' , ageLabel as ''Age'', ( 
	select COUNT(visitsKey) as ''# of Visits'' from FACT_visits as visits 
	left join  lkup_date as d on d.fullDate = visits.date 
	where addedBy = ? and visits.gender = gender.genderKey
	and visits.age = age.ageKey
	and gender.genderLabel is not null
 ) 
 from LKUP_age as age, LKUP_gender as gender'
 where queryLabel = 'ageGenderReport';