UPDATE fact_queries SET query = '
SELECT CONVERT(VARCHAR(25), LKUP_date.fullDate, 101) as date FROM LKUP_date   
WHERE block=? and rppWeek=? and lkup_date.dayOfWeek=?'
where queryLabel = 'getDateFromCalendar'