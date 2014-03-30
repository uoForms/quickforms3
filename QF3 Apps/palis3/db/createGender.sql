create table palis.dbo.gender
	(gender_key int primary key not null identity,
	 gender_label varchar(50) not null);

insert into palis.dbo.gender
(gender_label) values ('Male');
insert into palis.dbo.gender
(gender_label) values ('Female');
insert into palis.dbo.gender
(gender_label) values ('Uncertain/Indetermined');
