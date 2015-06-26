
use simpleform

create table FACT_reservations
	(reservationsKey int primary key not null identity,
	 FirstName [varchar](50),
	LastName [varchar](50),
	ReservationDate date,
	Gender int,
	BirthDate date,
	City int,
	Agreement int,
	);
	
	        -- Create lookup tables---
create table lkup_Gender
	(GenderKey int primary key not null,
	GenderLabel varchar(100),
	GenderOrder int not null default (0) 
	);
		
create table lkup_City
	(CityKey int primary key not null,
	CityLabel varchar(100),
	CityOrder int not null default (0) 
	);	

 -- Add a date lookup table --
         
          CREATE TABLE [dbo].[LKUP_date](
	[datekey] [float] NULL,
	[fulldate] [date] NOT NULL,
	[dayofweek] [float] NULL,
	[daynuminmonth] [float] NULL,
	[daynumoverall] [float] NULL,
	[dayname] [nvarchar](255) NULL,
	[dayabbrev] [nvarchar](255) NULL,
	[weekdayflag] [nvarchar](255) NULL,
	[weeknuminyear] [float] NULL,
	[weeknumoverall] [float] NULL,
	[weekbegindate] [datetime] NULL,
	[weekbegindatekey] [float] NULL,
	[month] [float] NULL,
	[monthnumoverall] [float] NULL,
	[monthname] [nvarchar](255) NULL,
	[monthabbrev] [nvarchar](255) NULL,
	[quarter] [float] NULL,
	[year] [float] NULL,
	[yearmo] [float] NULL,
	[fiscalmonth] [float] NULL,
	[fiscalquarter] [float] NULL,
	[fiscalyear] [float] NULL,
	[lastdayinmonthflag] [nvarchar](255) NULL,
	[samedayyearago] [datetime] NULL,
	[F25] [nvarchar](255) NULL,
	[tableinsertstatement] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[fulldate] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

             --Creating Foriegn Key References for drop down values---

ALTER TABLE FACT_reservations
ADD CONSTRAINT fk_Gender
FOREIGN KEY (Gender)
REFERENCES lkup_Gender(GenderKey)


ALTER TABLE FACT_reservations
ADD CONSTRAINT fk_City
FOREIGN KEY (City)
REFERENCES lkup_City(CityKey)

ALTER TABLE FACT_reservations
ADD CONSTRAINT fk_ReservationDate
FOREIGN KEY (ReservationDate)
REFERENCES LKUP_date(fulldate)

              -- Adding drop down values in lookup tables -- 
              
INSERT INTO LKUP_Gender
           (GenderKey,GenderLabel
           ,GenderOrder)
     VALUES
           (0,'--Not Selected--',0)
           
INSERT INTO LKUP_Gender
           (GenderKey,GenderLabel
           ,GenderOrder)
     VALUES
           (1,'Male',1)
           
 INSERT INTO LKUP_Gender
           (GenderKey,GenderLabel
           ,GenderOrder)
     VALUES
           (2,'Female',2)
           
 INSERT INTO LKUP_City
           (CityKey,CityLabel
           ,CityOrder)
     VALUES
           (0,'--Not Selected--',0)
           
  INSERT INTO LKUP_City
           (CityKey,CityLabel
           ,CityOrder)
     VALUES
           (1,'Toronto',1)
           
    INSERT INTO LKUP_City
           (CityKey,CityLabel
           ,CityOrder)
     VALUES
           (2,'Ottawa',2)
   
    INSERT INTO LKUP_City
           (CityKey,CityLabel
           ,CityOrder)
     VALUES
           (3,'Vancouver',3)
           
      INSERT INTO LKUP_City
           (CityKey,CityLabel
           ,CityOrder)
     VALUES
           (4,'Kingston',4)
           
   
     
ALTER TABLE LKUP_date
ADD Primary KEY (fulldate)



Alter table LKUP_date
Alter Column fulldate date Not null

ALTER TABLE FACT_reservations
ADD FOREIGN KEY (ReservationDate)
REFERENCES LKUP_date(fulldate)