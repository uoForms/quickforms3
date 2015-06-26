create table palis.dbo.consult_fact (consult_key int primary key  not null identity,
consultant varchar(100),consult_type int, pps int, physician_present varchar(100), resident_present varchar(100), 
hours_of_care int, request_date date, request_physician varchar(100), location int, encounter_date date, consult_location int, notes varchar(300));

create table palis.dbo.consultant (consultant_key varchar(100) primary key not null, 
consultant_label varchar(100) not null);

insert into palis.dbo.consultant values 

('-- Not Selected--','-- Not Selected--'),
('Debbie','Debbie'),
('Liam','Liam'),
('Ashish','Ashish');


create table palis.dbo.consult_type (consult_type_key int identity primary key not null, 
consult_type_label varchar(100) not null);

insert into palis.dbo.consult_type values 

('Initial Face to Face Consult'),
('Follow up Face to Face Consult'),
('Initial Phone Consult'),
('Follow up Phone Consult'),



create table palis.dbo.pps (pps_key int identity primary key not null, 
pps_label varchar(100) not null);

insert into palis.dbo.pps values 

('-- Not Assessed --'),('0'),('10'),('20'),('30'),('40'),('50'),('60'),('70'),('80'),('90'),('100');

create table palis.dbo.physician_present (physician_present_key varchar(100) primary key not null, 
physician_present_label varchar(100) not null);

insert into palis.dbo.physician_present values 

('-- Not Selected--','-- Not Selected--'),
('Debbie','Debbie'),
('Liam','Liam'),
('Ashish','Ashish');

create table palis.dbo.resident_present (resident_present_key varchar(100) primary key not null, 
resident_present_label varchar(100) not null);

insert into palis.dbo.resident_present values 

('-- Not Selected--','-- Not Selected--'),
('Debbie','Debbie'),
('Liam','Liam'),
('Ashish','Ashish');

create table palis.dbo.request_physician (request_physician_key varchar(100) primary key not null, 
request_physician_label varchar(100) not null);

insert into palis.dbo.request_physician values 

('-- Not Selected--','-- Not Selected--'),
('Debbie','Debbie'),
('Liam','Liam'),
('Ashish','Ashish');

create view consult_location as select * from palis.dbo.location;

insert into palis.dbo.sql_queries values ('getMostRecent_consult','select top 1 consult_key as id,* from palis.dbo.consult_fact'),
										  ('getScheduledConsults','select top 50 consult_key as id,* from palis.dbo.consult_fact where request_date>=GETDATE()'),
										  ('getConsults','select top 50 consult_key as id,* from palis.dbo.consult_fact where request_date<GETDATE()'),
										  ('consult_get_row','select top 1 consult_key as id,* from palis.dbo.consult_fact where consult_key = ?');
