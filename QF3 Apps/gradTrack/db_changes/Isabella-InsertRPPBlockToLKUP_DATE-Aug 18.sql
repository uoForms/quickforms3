/* This query should be tested before you run it */
/* Query to automatically set blocks in a RPPYear */
/* MUST: run for all years included in table 'LKUP_Date' by setting variable @year accordingly */
/* RECOMMENDED: set all values of block to null before running the query for all the years */
/* INFO: an RPPYear always starts July 1st and ends June 30th of the next year, 
   the academic year consists of 13 blocks, each block consits on 4 weeks and starts on a Tuesday and ends on a Monday 
   with the exception of the first block(starts July 1st no matter the day) and last block (ends July 30th no matter the day)*/

declare @startYear date
declare @endYear date
declare @startBlock date
declare @endBlock date
declare @year varchar(30)
declare @blockcounter int
declare @counter int
--
set @year = '2018-2019' /* Change to all 5 rppYears included in LKUP_Date */
set @blockcounter = 1
set @counter = 0

Set @startYear = (select Min(fullDate) from lkup_date where rppYear = @year) ;
set @startBlock = (select Min(fullDate) from lkup_date where rppYear = @year and dayOfWeek = 3) --Force first startBlock to start on 1st Wednesday
set @endYear = (select MAX(fullDate) from lkup_date where rppYear = @year);
set @endBlock = @endYear;

WHILE @blockcounter <= 13
begin
	WHILE @startBlock <= @endYear
	begin
		if ((select dayofWeek from LKUP_date where fullDate = @startBlock) = 2)
		begin
			set @counter = @counter + 1;
			if @counter = 4
			begin
				set @endBlock = @startBlock;
				set @counter = 0;
				update lkup_date set block =  @blockcounter where fullDate >= @startBlock and fullDate <= @endYear and rppYear = @year
			    set @blockcounter = @blockcounter + 1;				
			end
		end
		update lkup_date set block =  @blockcounter where fullDate >= @startBlock and fullDate <= @endYear and rppYear = @year
		set @startBlock = cast(DATEADD(day,1,@startBlock)as date);
	end; 
	set @blockcounter = @blockcounter + 1;
end;

update LKUP_date set block = 13 where block = 14 -- Compensate last month where a block may not end on a Monday
update LKUP_Date set block = 1 where block is null -- 

