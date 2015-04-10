create database tabs_tutorial;

use tabs_tutorial;

create table sql_queries
(queryKey int primary key not null auto_increment,
queryLabel varchar(100),
query varchar(8000));

insert into sql_queries values('getFactMetadata','select column_name as field,* from information_schema.columns where table_name like ? order by ordinal_position;');

create table fact_teamMembers
	(teamMembersKey int primary key not null identity,
	firstName varchar(100),
	lastName varchar(100),
	userName varchar(100),
	password varchar(100),
	email varchar(100),
	userRole int,
	activeFlag int);

create table lkup_userRole
	(userRoleKey int primary key not null,
	userRoleLabel varchar(100),
	userRoleOrder int);

insert into lkup_userRole values (1,'Administrator',0);
insert into lkup_userRole values (2,'User',1);


insert into fact_teamMembers values ('John','Smith','admin','21232f297a57a5a743894a0e4a801fc3','devteam@gmail.com',1,1);
-- Username: admin, Password: admin
insert into sql_queries values('getUserByPassword','select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey %WHERECLAUSE%');
insert into sql_queries values('getTeamMembers','select teamMembersKey as id, ''teamMember'' as form,firstName as "First Name", lastName as "Last Name", userName as "User Name", email as "Email" from fact_teamMembers');