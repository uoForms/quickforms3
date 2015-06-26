INSERT INTO fact_queries (queryLabel, query) VALUES ('getDateFromCalendar','
SELECT CONVERT(VARCHAR(25), LKUP_date.fullDate, 101) FROM LKUP_date 
WHERE block=? and rppWeek=? and lkup_date.dayOfWeek=?');