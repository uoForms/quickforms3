--create table palis.dbo.metadata(meta_key int primary key identity NOT NULL);
--alter table palis.dbo.metadata
--add column_name varchar(50) not null;

--alter table palis.dbo.metadata
--add input_name varchar(50) not null;

--alter table palis.dbo.metadata
--add fact_name varchar(50) not null;

--alter table palis.dbo.metadata
--add app_name varchar(50) not null;

--alter table palis.dbo.metadata
--add input_type varchar(50) not null;

alter table palis.dbo.metadata
add reference_data varchar(50) null;

--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('initiative','initiative','education','palis','select');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('title','title','education','palis','text');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('date','date','education','palis','date');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('course','course','education','palis','select');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('area','area','education','palis','select');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('education_hours','eduHours','education','palis','select');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('travel_time','travelTime','education','palis','select');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('med_part','medPart','education','palis','text');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('nurse_part','nursePart','education','palis','text');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('allied_part','alliedPart','education','palis','text');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('mixed_part','mixedPart','education','palis','text');
--insert into palis.dbo.metadata (column_name, input_name,fact_name,app_name,input_type) 
--	values('notes','notes','education','palis','text');

