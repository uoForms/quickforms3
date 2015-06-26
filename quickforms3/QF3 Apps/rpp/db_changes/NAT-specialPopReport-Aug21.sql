/* specialPopReport */
--by: ncastillo  on: aug/21
update sql_queries set query = 
';WITH tempSP (sp_label,
		   vk,
		   gender) 
    AS (SELECT ''Aboriginal'',
			visitskey,
			gender
		FROM FACT_visits
		WHERE aboriginalFlag <> 0
	   UNION ALL
	   SELECT ''Disability'',
			visitskey,
			gender
		FROM FACT_visits
		WHERE disabilityFlag <> 0
	   UNION ALL
	   SELECT ''Homeless'',
			visitskey,
			gender
		FROM FACT_visits
		WHERE homelessFlag <> 0
	   UNION ALL
	   SELECT ''Refugee'',
			visitskey,
			gender
		FROM FACT_visits
		WHERE refugeeFlag <> 0) 
    SELECT b.genderlabel AS ''Gender'',
		  temp.sp_label AS ''Special Populations'',
		 SUM (CASE
			   WHEN addedby = ?
			    %ANDCLAUSE% THEN 1 ELSE 0
			   END) AS ''# of Visits''
	 FROM
		 tempSP AS temp LEFT JOIN LKUP_Gender AS b
		 ON temp.gender = b.genderkey
					 LEFT JOIN FACT_visits AS fv
		 ON temp.vk = fv.visitskey
					 LEFT JOIN lkup_date AS d
		 ON d.fulldate = fv.date
		WHERE (aboriginalFlag <> 0
		  OR disabilityFlag <> 0
		  OR homelessFlag <> 0
		  OR refugeeFlag <> 0)
		AND deleteflag <> 1
	 GROUP BY b.genderorder,
			sp_label,
			b.genderlabel
	 ORDER BY b.genderorder,temp.sp_label' where queryLabel = 'specialPopReport'