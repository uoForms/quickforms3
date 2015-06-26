/*	THIS SCRIPT WASN'T TESTED */ 
 -- Inserting the column rppWeekOrder into lkup_date

-- Add the column into the table
ALTER TABLE lkup_date
ADD rppWeekOrder int

/* The order of each rppWeek in each block was added manually. Each block has 4 weeks. */