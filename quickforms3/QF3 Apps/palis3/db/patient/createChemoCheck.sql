create table palis.dbo.chemo_check
(chemo_check_key int identity primary key not null,
 chemo_check_label varchar(100));

insert into palis.dbo.chemo_check
values('Do Not Know'),('Yes'),('No');