
create table palis.dbo.education_fact(education_key int NOT NULL primary key identity);
alter table palis.dbo.education_fact
	add initiative int;
alter table palis.dbo.education_fact
	add title varchar(150);
alter table palis.dbo.education_fact
	add date date;
alter table palis.dbo.education_fact
	add course int;
alter table palis.dbo.education_fact
	add area int;
alter table palis.dbo.education_fact
	add edu_hours int;
alter table palis.dbo.education_fact
	add travel_time int;
alter table palis.dbo.education_fact
	add med_part int;
alter table palis.dbo.education_fact
	add nurse_part int;
alter table palis.dbo.education_fact
	add allied_part int;
alter table palis.dbo.education_fact
	add mixed_part int;
alter table palis.dbo.education_fact
	add notes varchar(300);
alter table palis.dbo.education_fact
	add added_by varchar(20);
