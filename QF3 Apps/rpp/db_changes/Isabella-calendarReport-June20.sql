INSERT INTO sql_queries (queryLabel, query) VALUES ('calendar',
'declare @user varchar(15)
set @user = ? 
Select rppWeek , 
    sum(case when DATEname(dw,fullDate) like ''%Sun%''   then 1 else 0 end) as ''Sun'',
	SUM(case when DATEname(dw,fullDate) like ''%Mon%''    then 1 else 0 end) as ''Mon'' ,
	SUM(case when DATEname(dw,fullDate) like ''%Tue%''  then 1 else 0 end) as ''Tue'',
	SUM(case when DATEname(dw,fullDate) like ''%Wed%''  then 1 else 0 end) as ''Wed'',
	SUM(case when DATEname(dw,fullDate) like ''%Thu%''  then 1 else 0 end) as ''Thu'',
	SUM(case when DATEname(dw,fullDate) like ''%Fri%''   then 1 else 0 end)as ''Fri'',
	SUM(case when DATEname(dw,fullDate) like ''%Sat%''   then 1 else 0 end) as ''Sat''
	from FACT_visits right outer join LKUP_date  on  date = fullDate 
where block = ?  and addedBy=@user and rppWeek is not null group by  rppWeek order by min(fullDate)');