--Create Tables--
IF OBJECT_ID('LKUP_level0', 'U') IS NOT NULL ALTER TABLE FACT_ccm DROP CONSTRAINT FK_FACT_ccm_LKUP_level0;
IF OBJECT_ID('LKUP_level1', 'U') IS NOT NULL ALTER TABLE FACT_ccm DROP CONSTRAINT FK_FACT_ccm_LKUP_level1;
IF OBJECT_ID('LKUP_level2', 'U') IS NOT NULL ALTER TABLE FACT_ccm DROP CONSTRAINT FK_FACT_ccm_LKUP_level2;
IF OBJECT_ID('LKUP_level0', 'U') IS NOT NULL DROP TABLE LKUP_level0;
CREATE TABLE LKUP_level0 (
	level0Key INT IDENTITY(1,1) PRIMARY KEY,
	level0Label VARCHAR(2000),
	level0Order INT,
	level0ImagePath VARCHAR(2000));

IF OBJECT_ID('LKUP_level1', 'U') IS NOT NULL DROP TABLE LKUP_level1;
CREATE TABLE LKUP_level1 (
	level1Key INT IDENTITY(1,1) PRIMARY KEY,
	level1Label VARCHAR(2000),
	level1Order INT,
	level1ImagePath VARCHAR(2000));

IF OBJECT_ID('LKUP_level2', 'U') IS NOT NULL DROP TABLE LKUP_level2;
CREATE TABLE LKUP_level2 (
	level2Key INT IDENTITY(1,1) PRIMARY KEY,
	level2Label VARCHAR(2000),
	level2Order INT);
	

IF OBJECT_ID('FACT_ccm', 'U') IS NOT NULL DROP TABLE FACT_ccm;
CREATE TABLE FACT_ccm (
	ccmKey INT IDENTITY(1,1) PRIMARY KEY,
	ccmLabel VARCHAR(2000),
	level0 int NOT NULL,
	level1 int NOT NULL,
	level2 int NOT NULL,
	contentHTML TEXT,
	ccmOrder INT NOT NULL,
	deleteFlag INT DEFAULT 0,
	addedBy VARCHAR(200),
	createdDate datetime NOT NULL,
	updatedDate datetime,
	CONSTRAINT UNIQUE_levels UNIQUE (level0,level1,level2,deleteFlag),
	CONSTRAINT FK_FACT_ccm_LKUP_level0 FOREIGN KEY (level0) REFERENCES LKUP_level0 (level0Key),
	CONSTRAINT FK_FACT_ccm_LKUP_level1 FOREIGN KEY (level1) REFERENCES LKUP_level1 (level1Key),
	CONSTRAINT FK_FACT_ccm_LKUP_level2 FOREIGN KEY (level2) REFERENCES LKUP_level2 (level2Key));

IF OBJECT_ID('FACT_teamMembers', 'U') IS NOT NULL DROP TABLE FACT_teamMembers;
CREATE TABLE FACT_teamMembers(
	teamMembersKey INT IDENTITY(1,1) PRIMARY KEY,
	firstName VARCHAR(100) NULL,
	lastName VARCHAR(100) NULL,
	userName VARCHAR(100) NULL,
	password VARCHAR(100) NULL,
	email VARCHAR(100) NULL,
	userRole INT NULL,
	activeFlag INT NULL,
	deleteFlag INT NOT NULL);
	
IF OBJECT_ID('LKUP_userRole', 'U') IS NOT NULL DROP TABLE LKUP_userRole;
CREATE TABLE LKUP_userRole(
	userRoleKey INT PRIMARY KEY,
	userRoleLabel VARCHAR(100) NULL,
	userRoleOrder INT NULL);

IF OBJECT_ID('FACT_queries', 'U') IS NOT NULL DROP TABLE FACT_queries;
CREATE TABLE FACT_queries(
	queriesKey INT IDENTITY(1,1) PRIMARY KEY,
	queryLabel VARCHAR(50) NULL,
	query VARCHAR(4000) NULL,
	deleteFlag INT NULL)


--Insert Basic CCM Data--
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('testQuery', 'select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey %WHERECLAUSE%', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getUserByPassword', 'select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey %WHERECLAUSE%', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getTeamMembers', 'select teamMembersKey as id, ''teamMember'' as form,firstName as "First Name", lastName as "Last Name", userName as "User Name", email as "Email" from fact_teamMembers', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getQueries', 'select queriesKey as id, ''query'' as form, queryLabel as "Query Label", query as "Query" from fact_queries', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getFactMetadata', 'select column_name as field,* from information_schema.columns where table_name like ? order by ordinal_position;', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getCarouselData', 'select a.level0 as level0Key, b.level0Label as level0Label, b.level0ImagePath as image,	a.level1 as level1Key,	c.level1Label as level1Label from FACT_ccm a left join LKUP_level0 b on a.level0 = b.level0Key left join LKUP_level1 c on a.level1 = c.level1Key where a.deleteFlag != 1 group by	a.level0, b.level0Label, b.level0ImagePath, a.level1, c.level1Label, a.ccmOrder order by a.ccmOrder', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getCcmContent', 'select d.level1Label as title, b.level2Label as contentId, c.contentHTML as contentHTML from FACT_ccm a left join LKUP_level1 d on a.level1=d.level1Key left join LKUP_level2 b on a.level2=b.level2Key left join LKUP_content c on a.content=c.contentKey where a.level1 = ?', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getLastAndNext', 'select top 1 (select top 1 level1Key from FACT_ccm  left join LKUP_level1  on level1 = level1Key where level1Order < b.level1Order and deleteFlag != 1 order by level1Order desc) as lastId,(select top 1 level1Label from FACT_ccm  left join LKUP_level1  on level1 = level1Key where level1Order < b.level1Order and deleteFlag != 1 order by level1Order desc) as lastLabel,(select top 1 level1Key from FACT_ccm  left join LKUP_level1  on level1 = level1Key where level1Order > b.level1Order and deleteFlag != 1 order by level1Order) as nextId,(select top 1 level1Label from FACT_ccm  left join LKUP_level1  on level1 = level1Key where level1Order > b.level1Order and deleteFlag != 1 order by level1Order) as nextLabel from FACT_ccm a left join LKUP_level1 b on a.level1 = b.level1Key where a.level1 = ?', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getCcmContentNew', 'select a.ccmKey as ccmKey, a.level2 as level2Key, d.level1Label as title, b.level2Label as contentId, a.contentHTML as contentHTML from FACT_ccm a left join LKUP_level1 d on a.level1=d.level1Key left join LKUP_level2 b on a.level2=b.level2Key where a.deleteFlag != 1 and a.level1 = ?', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getCarouselStructure', 'select a.ccmKey as id, ''carouselContentForm'' as form, b.level0Label as "Level 0",c.level1Label as "Level 1", d.level2Label as "Level 2", a.ccmOrder as "Order" from FACT_ccm as a left join LKUP_level0 as b on a.level0 = b.level0Key left join LKUP_level1 as c on a.level1 = c.level1Key left join LKUP_level2 as d on a.level2 = d.level2Key %WHERECLAUSE% and a.deleteFlag != 1 order by a.ccmOrder, d.level2Order', 0);

INSERT INTO LKUP_userRole (userRoleKey, userRoleLabel, userRoleOrder) VALUES (1, 'Administrator', 0);
INSERT INTO LKUP_userRole (userRoleKey, userRoleLabel, userRoleOrder) VALUES (2, 'User', 1);

INSERT INTO FACT_teamMembers (firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES ('John', 'Smith', 'admin', '21232f297a57a5a743894a0e4a801fc3', 'devteam@gmail.com', 1, 1, 0);

--Insert francine Data--
CREATE TABLE fact_users(
	usersKey int IDENTITY(1,1) PRIMARY KEY,
	createdDate datetime NOT NULL,
	updatedDate datetime NOT NULL,
	Email varchar(50) NOT NULL,
	DueDate nvarchar(50) NOT NULL,
	Subscribed bit NULL
);

CREATE TABLE lkup_users(
	usersKey int IDENTITY(1,1) PRIMARY KEY,
	Email varchar(50) NOT NULL,
	DueDate datetime NULL,
	Subscribed bit NOT NULL,
	fName varchar(50) NULL
);

CREATE TABLE fact_unsubscribe(
	unsubscribeKey int IDENTITY(1,1) PRIMARY KEY,
	createdDate datetime NOT NULL,
	updatedDate datetime NOT NULL,
	Email varchar(50) NOT NULL,
	DueDate nvarchar(50) NULL,
	Unsubscribed bit NULL,
	UserTabelRefID int NULL
);

CREATE TABLE lkup_unsubscribe(
	unsubscribeKey int IDENTITY(1,1) PRIMARY KEY,
	Email varchar(255) NOT NULL,
	Unsubscribed bit NOT NULL
);

CREATE TABLE fact_emailSent(
	emailSentKey int IDENTITY(1,1) PRIMARY KEY,
	weeksK nvarchar(50) NULL,
	usersK nvarchar(50) NULL,
	message nvarchar(max) NULL,
	senderEmail nvarchar(50) NULL,
	createdDate datetime NULL,
	updatedDate datetime NULL,
	requestNumber int NULL,
	emailType nvarchar(50) DEFAULT (0)
);

CREATE TABLE lkup_emailType(
	emailTypeKey int IDENTITY(1,1) PRIMARY KEY,
	emailTypeLabel varchar(50) NOT NULL
);


INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('lkup_Users', 'Select *  from fact_users', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getUsers', 'select Email as "Email", createdDate as "Subscribed Date" from fact_users', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getUserDetails', 'select * from fact_users %WHERECLAUSE%', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getReport', 'SELECT  Months.id,COUNT (dbo.fact_users.createdDate) FROM (SELECT 1 as ID UNION SELECT 2 as ID UNION  SELECT 3 as ID UNION SELECT 4 as ID UNION SELECT 5 as ID UNION SELECT 6 as ID UNION SELECT 7 as ID UNION SELECT 8 as ID UNION SELECT 9 as ID UNION SELECT 10 as ID UNION SELECT 11 as ID UNION SELECT 12 as ID) as Months LEFT JOIN dbo.fact_users on Months.id=month(dbo.fact_users.createdDate)GROUP BY Months.id ORDER BY Months.id ASC', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getEmails', 'select fact_users.Email as "User", lkup_emailType.emailTypeLabel as "Email Type", fact_emailSent.createdDate as "Date Sent" from fact_emailSent, fact_users, lkup_emailType where fact_users.usersKey = fact_emailSent.usersK and fact_emailSent.emailType = lkup_emailType.emailTypeKey order by fact_emailSent.createdDate desc', 0);
INSERT INTO FACT_queries (queryLabel, query, deleteFlag) VALUES ('getEmailGraph', 'select Subscibers, sum(case when u.Subscribed like 0  then 1 else 0 end) as "Subscibers", from FACT_Users as u', 0);

