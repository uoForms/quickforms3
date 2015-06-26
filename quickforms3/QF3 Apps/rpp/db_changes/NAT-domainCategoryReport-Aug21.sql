
/* domainCategoryReport */
--by: ncastillo  on: aug/21

UPDATE sql_queries
  SET query = 'DECLARE @domain varchar(25);
			DECLARE @user varchar(15);
			SET @domain = ? 
			SET @user = ? ;WITH temp (Category,
		 Minimum,
		 Maximum) 
    AS (SELECT x.diagnosisCategory,
			MIN (x.numVisits) AS Mini,
			MAX (x.numVisits) AS Maxi
		FROM (
			 SELECT SUM (CASE
					   WHEN ldm.diagnosisMultiValue <> 0 %ANDCLAUSE% THEN 1
						  ELSE 0
					   END) AS numVisits,
				   diagnosisCategory,
				   addedBy
			   FROM
				   LKuP_diagnosisMulti AS LdM LEFT JOIN LKuP_diagnosis AS Ld
				   ON LdM.diagnosisMultiValue = Ld.diagnosisKey
										LEFT JOIN FACT_visits AS FV
				   ON LdM.diagnosisMultiKey = FV.diagnosisMulti
				   left JOIN lkup_date AS d        ON fullDate = fv.date      
 left join lkup_location as ll on fv.location = ll.locationKey
			   where diagnosisDomain = @domain and diagnosisOrder >= 0 AND deleteFlag = 0
			   GROUP BY diagnosisCategory,
					  addedBy) x
		GROUP BY x.diagnosisCategory) 
    SELECT temp.Category,
		 SUM (CASE
			 WHEN addedBy LIKE @user %ANDCLAUSE% THEN 1 
				ELSE 0
			 END) AS ''# of Diagnoses'',
		 Minimum,
		 Maximum
	 FROM
		 temp LEFT JOIN LKuP_diagnosis AS Ld
		 ON ld.diagnosisCategory = temp.Category
			 LEFT JOIN LKuP_diagnosisMulti AS LdM
		 ON LdM.diagnosisMultiValue = Ld.diagnosisKey
			 LEFT JOIN FACT_visits AS FV
		 ON LdM.diagnosisMultiKey = FV.diagnosisMulti
		 left JOIN lkup_date AS d        ON fullDate = fv.date      
 left join lkup_location as ll on fv.location = ll.locationKey
	 where diagnosisDomain = @domain and diagnosisOrder >= 0 AND deleteFlag = 0
	 GROUP BY temp.Category,
			Minimum,
			Maximum,
			ld.diagnosisCategory'
  WHERE queryLabel = 'domainCategoryReport';