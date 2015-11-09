/*Calendar query*/
update sql_queries set query = '
DECLARE @user varchar(15)                 
DECLARE @block int               
DECLARE @rppYear varchar(15)     
SET @user = ?;               
SET @block= ?;      
SELECT rppWeek,   [Sunday] AS Sun, [Monday] as Mon, [Tuesday] AS Tue, [Wednesday] as Wed, [Thursday] as Thu, 
[Friday] as Fri, [Saturday] as Sat     FROM       (SELECT     lkup_block.blockLabel as Block,lkup_date.rppWeek as 
rppWeek, lkup_block.blockKey as BlockKey,       LKUP_date.dayName as ValDayName, FACT_visits.addedBy as addedBy     FROM         
lkup_block full 
outer join     LKUP_date ON lkup_block.blockKey = LKUP_date.block 
RIGHT OUTER JOIN  FACT_visits ON LKUP_date.fullDate = FACT_visits.date                       
WHERE addedBy=@user and blockKey=@block and deleteflag<>1) ps           
PIVOT        
( COUNT (BlockKey)        FOR ValDayName IN     
([Sunday], [Monday], [Tuesday], [Wednesday], [Thursday], [Friday], [Saturday])) AS pv      
UNION      (SELECT rppWeek,''0'' as Sun,''0'' as Mon, ''0'' as Tue, ''0'' as Wed, ''0'' as Thu, ''0'' as Fri, ''0'' as Sat       
FROM LKUP_date WHERE block = @block and (NOT (rppWeek IS NULL)) group by rppWeek     EXCEPT      
SELECT DISTINCT  LKUP_date.rppWeek,''0'' as Sun,''0'' as Mon, ''0'' as Tue, ''0'' as Wed, ''0'' as Thu, ''0'' as Fri, ''0'' as Sat     
FROM         FACT_visits INNER JOIN                               LKUP_date ON FACT_visits.date = LKUP_date.fullDate 
INNER JOIN                                lkup_block ON LKUP_date.block = lkup_block.blockKey     WHERE     
(FACT_visits.addedBy = @user) AND (LKUP_date.block = @block)and (FACT_visits.deleteflag=0)) order by rppWeek'
where queryLabel = 'calendar'