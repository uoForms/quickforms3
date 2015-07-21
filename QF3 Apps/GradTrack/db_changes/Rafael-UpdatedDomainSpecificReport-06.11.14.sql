  UPDATE fact_queries set query = 'DECLARE     @domain varchar (25) ;    
  DECLARE     @user varchar (15) ;  
  SET @domain = ?;    
  SET @user = ?;  
  (SELECT Category = ISNULL (diagnosisCategory,''- All Categories -'') ,        
  Diagnosis = ISNULL (diagnosisLabel,''--TOTAL--'') ,      
  COUNT (CASE     WHEN addedBy LIKE @user        
  %ANDCLAUSE% THEN 1     END) AS ''# of Visits''     
  FROM      LKUP_diagnosis AS ld LEFT JOIN LKUP_diagnosisMulti ldm        
  ON ld.diagnosisKey = ldm.diagnosisMultiValue           LEFT JOIN fact_visits fv      
  ON ldm.diagnosisMultiKey = fv.diagnosisMulti             LEFT JOIN lkup_date AS d      
  ON fullDate = fv.date           LEFT JOIN lkup_location AS ll      
  ON fv.location = ll.locationKey       
  WHERE diagnosisDomain = @domain   AND diagnosisOrder >= 0   AND deleteFlag = 0     
  GROUP BY ROLLUP (diagnosisCategory,diagnosisLabel))    
  ORDER BY Category,Diagnosis' where queryLabel = 'domainSpecificReport'
  
