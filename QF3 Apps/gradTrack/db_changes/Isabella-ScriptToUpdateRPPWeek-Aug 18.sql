/*	THIS SCRIPT WASN'T TESTED */ 
 -- Updating rppWeek in the lkup_date

/* All the values between 1 and 9 have to have 0 in front of it. 
Eg: rppWeek: 1-7 -> 01-07
             27-2 -> 27-02 */
UPDATE LKUP_date SET rppWeek = '01-07' where rppWeek = '1-7';