/* specialPopGraph */
--by: ncastillo  on: aug/21
update sql_queries set query = 'WITH tempSP (sp_label,
		   vk) 
    AS (SELECT ''Aboriginal'',
			visitskey
		FROM FACT_visits
		WHERE aboriginalFlag <> 0
	   UNION ALL
	   SELECT ''Disability'',
			visitskey
		FROM FACT_visits
		WHERE disabilityFlag <> 0
	   UNION ALL
	   SELECT ''Homeless'',
			visitskey
		FROM FACT_visits
		WHERE homelessFlag <> 0
	   UNION ALL
	   SELECT ''Refugee'',
			visitskey
		FROM FACT_visits
		WHERE refugeeFlag <> 0) 
    SELECT sp_label AS ''Special Populations'',
		 SUM (CASE
			 WHEN genderlabel LIKE ''Male'' %ANDCLAUSE% THEN 1
				ELSE 0
			 END) AS Male,
		 SUM (CASE
			 WHEN genderlabel LIKE ''Female'' %ANDCLAUSE% THEN 1
				ELSE 0
			 END) AS Female,
		 SUM (CASE
			 WHEN genderlabel LIKE ''Not Specified''%ANDCLAUSE% THEN 1
				ELSE 0
			 END) AS ''Not Specified''
	 FROM
		 FACT_visits AS a LEFT JOIN LKUP_Gender AS b
		 ON a.gender = b.genderkey
					   LEFT JOIN tempSP AS temp
		 ON temp.vk = a.visitskey
					   LEFT JOIN lkup_date AS d
		 ON d.fulldate = a.date
	 WHERE addedBy = ?
	   AND (aboriginalFlag <> 0
		OR disabilityFlag <> 0
		OR homelessFlag <> 0
		OR refugeeFlag <> 0)
	   AND deleteflag <> 1
	 GROUP BY sp_label
	 ORDER BY sp_label' where queryLabel = 'specialPopGraph' ;
