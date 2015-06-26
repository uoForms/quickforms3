UPDATE fact_queries SET query = '
SELECT CASE
	  WHEN LEN (notes) > 40 THEN LEFT (notes,40) + ''...''
		 ELSE notes
	  END AS ''Notes'',
	  date AS Date,
	  e.agelabel AS Age,
	  d.genderlabel AS Gender,
	  ISNULL(diagnosisLabel, ''No Diagnosis'') as Diagnosis
  FROM
	  FACT_visits a left JOIN LKUP_diagnosisMulti b
	  ON a.diagnosisMulti = b.diagnosisMultiKey
				 left JOIN LKuP_diagnosis c
	  ON b.diagnosisMultiValue = c.diagnosisKey
				 INNER JOIN LKuP_Gender AS d
	  ON a.gender = d.genderkey
				 INNER JOIN LKuP_Age AS e
	  ON a.age = e.ageKey
				 INNER JOIN lkup_date AS dat
	  ON a.date = dat.fullDate
  WHERE addedBy = ?
    AND (notes LIKE ''%Reading%''
	 OR notes LIKE ''%More Cases%''
	 OR notes LIKE ''%Comfortable%'')
    AND deleteflag = 0
  ORDER BY notes,visitskey,diagnosis;'
  where queryLabel = 'selfReport'