--create table palis.dbo.sql_queries 
--(query_key int primary key not null identity,
-- query_label varchar(50) not null,
-- query varchar(200) not null);

 --insert into palis.dbo.sql_queries 
 --values('getEducationRows',
 --'select * from palis.dbo.education_fact order by education_key desc');

--insert into palis.dbo.sql_queries 
--values('getFactMetadata',
--'select column_name,* from information_schema.columns where table_name like ? order by ordinal_position;');
--insert into palis.dbo.sql_queries 
--values('education_get_row',
--'select * from palis.dbo.education_fact where education_key = ?;');
--insert into palis.dbo.sql_queries 
--values('team_members_get_row',
--'select * from palis.dbo.team_members_fact where team_members_key = ?;');
insert into palis.dbo.sql_queries 
values('patients_get_row',
'select * from palis.dbo.patients_fact where patients_key = ?;');