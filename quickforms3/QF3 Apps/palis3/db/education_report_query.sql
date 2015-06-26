select DateName( month , DateAdd( month , month(date) , 0 ) - 1 ) as "Month", 
initiative_label as "Initiative", 
count(education_key) as "TotalInitiatives",
sum(med_part+nurse_part+allied_part+mixed_part) as "TotalOfParticipants",
sum(edu_label) as "TotalInitiativeHours",
sum(travel_label) as "TotalTravelTime",
sum(travel_label + edu_label) as "TotalHours"
from palis.dbo.education_fact, palis.dbo.initiative, palis.dbo.edu_hours,palis.dbo.travel_time
where initiative_key = initiative and edu_hours = edu_key and travel_time= travel_key
group by DateName( month , DateAdd( month , month(date) , 0 ) - 1 ),initiative_label order by month;