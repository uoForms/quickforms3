use rpp;
alter table FACT_teamMembers 
add deleteFlag int not null default(0)

update sql_queries set query = 'select teamMembersKey as id, ''teamMember'' as form,firstName as "First Name", lastName as "Last Name", userName as "User Name", email as "Email" from fact_teamMembers where deleteFlag = 0'
where queryLabel = 'getTeamMembers'