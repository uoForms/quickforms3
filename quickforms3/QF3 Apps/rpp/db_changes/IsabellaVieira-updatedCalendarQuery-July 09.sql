UPDATE sql_queries SET query = '
DECLARE @user varchar(15)  
DECLARE @block int
SET @user = ?;
SET @block= ?;
WITH temp1 (rppWeek, Sun, Mon, Tue, Wed, Thu, Fri, Sat) AS
	(SELECT rppWeek,     
	SUM(CASE WHEN DATEname(dw,fullDate) LIKE ''%Sun%''  THEN 1 ELSE 0 END) AS ''Sun'',   
	SUM(CASE WHEN DATEname(dw,fullDate) LIKE ''%Mon%''  THEN 1 ELSE 0 END) AS ''Mon'' ,   
	SUM(CASE WHEN DATEname(dw,fullDate) LIKE ''%Tue%''  THEN 1 ELSE 0 END) AS ''Tue'',   
	SUM(CASE WHEN DATEname(dw,fullDate) LIKE ''%Wed%''  THEN 1 ELSE 0 END) AS ''Wed'',   
	SUM(CASE WHEN DATEname(dw,fullDate) LIKE ''%Thu%''  THEN 1 ELSE 0 END) AS ''Thu'',   
	SUM(CASE WHEN DATEname(dw,fullDate) LIKE ''%Fri%''  THEN 1 ELSE 0 END) AS ''Fri'',   
	SUM(CASE WHEN DATEname(dw,fullDate) LIKE ''%Sat%''  THEN 1 ELSE 0 END) AS ''Sat''   
	FROM FACT_visits RIGHT OUTER JOIN LKUP_date  ON  date = fullDate   
	WHERE block = @block  AND addedBy = @user AND rppWeek IS NOT NULL GROUP BY rppWeek),
temp2(rppWeek, fullDate) AS
	(SELECT rppWeek, min(fullDate) FROM LKUP_date WHERE block = @block group by rppWeek)
SELECT ''newVisit'' as form, temp2.rppWeek, fulldate, Sun, Mon, Tue, Wed, Thu, Fri, Sat  
FROM temp1 full outer join temp2 on temp1.rppWeek = temp2.rppWeek order by temp2.fullDate'
WHERE queryLabel = 'calendar';