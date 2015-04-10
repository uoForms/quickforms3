UPDATE fact_queries SET query = '
select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey 
%WHERECLAUSE% and deleteFlag <> 1'
where queryLabel = 'getUserByPassword'