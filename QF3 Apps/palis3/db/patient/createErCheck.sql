create table palis.dbo.er_check
(er_check_key int identity primary key not null,
 er_check_label varchar(100));

insert into palis.dbo.er_check
values('Do Not Know'),('Yes'),('No');