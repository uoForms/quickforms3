use palis;
create table palis.dbo.non_case_based_fact (
non_case_based_key int primary key not null identity,
request_date date,
hours_of_care int,
type_of_request int,
added_by varchar(20));

create table palis.dbo.rounds_fact (
rounds_key int primary key not null identity,
encounter_date date,
weekly_hospice varchar(50),
notes varchar(300),
added_by varchar(20));

create table palis.dbo.type_of_request(
type_of_request_key int primary key not null identity,
type_of_request_label varchar(50));
insert into palis.dbo.type_of_request values
('Information Calls (Topic Specific)'),('Program Development (Face to Face)'),('System Planning'),('Facilitating Linkages');

create table palis.dbo.hours_of_care(
hours_of_care_key int primary key not null identity,
hours_of_care_label varchar(10));
insert into palis.dbo.hours_of_care
values ('0.5'),('0.75'),('1.0'),('1.5'),('2.0'),('2.5'),('3.0'),('3.5'),('4.0'),('4.5'),('5.0'),('5.5'),('6.0'),('6.5'),('7.0'),('7.5'),('8.0');

--alter table palis.dbo.non_case_based_fact add added_by varchar(20)
--alter table palis.dbo.rounds_fact add added_by varchar(20)

