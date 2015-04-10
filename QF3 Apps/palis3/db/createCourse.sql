create table palis.dbo.course
	(course_key int primary key not null identity,
	 course_label varchar(50) not null);

insert into palis.dbo.course 
(course_label) values ('LEAP');
insert into palis.dbo.course 
(course_label) values ('Evening Series');
insert into palis.dbo.course 
(course_label) values ('May Court');
insert into palis.dbo.course 
(course_label) values ('Dinner');
insert into palis.dbo.course 
(course_label) values ('Algonquin');
insert into palis.dbo.course 
(course_label) values ('Lacite');
