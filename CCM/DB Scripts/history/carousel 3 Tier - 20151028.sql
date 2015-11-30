--Create Tables--
IF OBJECT_ID('LKUP_level0', 'U') IS NOT NULL ALTER TABLE FACT_ccm DROP CONSTRAINT FK_FACT_ccm_LKUP_level0;
IF OBJECT_ID('LKUP_level1', 'U') IS NOT NULL ALTER TABLE FACT_ccm DROP CONSTRAINT FK_FACT_ccm_LKUP_level1;
IF OBJECT_ID('LKUP_level2', 'U') IS NOT NULL ALTER TABLE FACT_ccm DROP CONSTRAINT FK_FACT_ccm_LKUP_level2;
IF OBJECT_ID('LKUP_level0', 'U') IS NOT NULL DROP TABLE LKUP_level0;
CREATE TABLE LKUP_level0 (
	level0Key INT PRIMARY KEY,
	level0Label VARCHAR(2000),
	level0Order INT,
	level0ImagePath VARCHAR(2000));

IF OBJECT_ID('LKUP_level1', 'U') IS NOT NULL DROP TABLE LKUP_level1;
CREATE TABLE LKUP_level1 (
	level1Key INT PRIMARY KEY,
	level1Label VARCHAR(2000),
	level1Order INT,
	level1ImagePath VARCHAR(2000));

IF OBJECT_ID('LKUP_level2', 'U') IS NOT NULL DROP TABLE LKUP_level2;
CREATE TABLE LKUP_level2 (
	level2Key INT PRIMARY KEY,
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
	teamMembersKey INT PRIMARY KEY,
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
	queriesKey INT PRIMARY KEY,
	queryLabel VARCHAR(50) NULL,
	query VARCHAR(4000) NULL,
	deleteFlag INT NULL)


--Insert Basic Data--
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (1, 'testQuery', 'select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey %WHERECLAUSE%', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (2, 'getUserByPassword', 'select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey %WHERECLAUSE%', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (3, 'getTeamMembers', 'select teamMembersKey as id, ''teamMember'' as form,firstName as "First Name", lastName as "Last Name", userName as "User Name", email as "Email" from fact_teamMembers', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (4, 'getTable', 'select r.RegistrationKey as id,''registrationForm''as form, r.FirstName as "First Name",r.LastName as " Last Name", r.Status as "Status", r.Department as "Department" from FACT_Registration as r left join LKUP_Status as d on d.StatusKey = r.Status left join LKUP_Department as e on e.DepartmentKey = r.Department %WHERECLAUSE% and deleteFlag != 1 order by RegistrationKey desc', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (5, 'getTableDisplay', 'select r.RegistrationKey as id,''registrationForm''as form, r.FirstName as "First Name",r.LastName as " Last Name",
 d.StatusLabel as "Status", e.DepartmentLabel as "Department" from FACT_Registration as r left join LKUP_Status as d on d.StatusKey = r.Status
 left join LKUP_Department as e on e.DepartmentKey = r.Department %WHERECLAUSE% order by RegistrationKey desc', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (6, 'departmentGenderGraph', 'select 	DepartmentLabel as ''Department'', sum(case when gender = 2 then 1 else 0 end)as ''Male'', sum(case when gender = 3 then 1 else 0 end)as ''Female'', sum(case when gender = 0 then 1 else 0 end)as ''Not Specified'' from lkup_Department left join FACT_Registration on Department = DepartmentKey %WHERECLAUSE% group by DepartmentLabel, DepartmentOrder order by DepartmentOrder', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (7, 'getQueries', 'select queriesKey as id, ''query'' as form, queryLabel as "Query Label", query as "Query" from fact_queries', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (8, 'getFactMetadata', 'select column_name as field,* from information_schema.columns where table_name like ? order by ordinal_position;', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (9, 'getCarouselData', 'select a.level0 as level0Key, b.level0Label as level0Label, b.level0ImagePath as image,	a.level1 as level1Key,	c.level1Label as level1Label from FACT_ccm a left join LKUP_level0 b on a.level0 = b.level0Key left join LKUP_level1 c on a.level1 = c.level1Key where a.deleteFlag != 1 group by	a.level0, b.level0Label, b.level0ImagePath, a.level1, c.level1Label, a.ccmOrder order by a.ccmOrder', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (10, 'getCcmContent', 'select d.level1Label as title, b.level2Label as contentId, c.contentHTML as contentHTML from FACT_ccm a left join LKUP_level1 d on a.level1=d.level1Key left join LKUP_level2 b on a.level2=b.level2Key left join LKUP_content c on a.content=c.contentKey where a.level1 = ?', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (11, 'getLastAndNext', 'select top 1 (select top 1 level1Key from FACT_ccm  left join LKUP_level1  on level1 = level1Key where level1Order < b.level1Order and deleteFlag != 1 order by level1Order desc) as lastId,(select top 1 level1Label from FACT_ccm  left join LKUP_level1  on level1 = level1Key where level1Order < b.level1Order and deleteFlag != 1 order by level1Order desc) as lastLabel,(select top 1 level1Key from FACT_ccm  left join LKUP_level1  on level1 = level1Key where level1Order > b.level1Order and deleteFlag != 1 order by level1Order) as nextId,(select top 1 level1Label from FACT_ccm  left join LKUP_level1  on level1 = level1Key where level1Order > b.level1Order and deleteFlag != 1 order by level1Order) as nextLabel from FACT_ccm a left join LKUP_level1 b on a.level1 = b.level1Key where a.level1 = ?', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (12, 'getCcmContentNew', 'select d.level1Label as title, b.level2Label as contentId, a.contentHTML as contentHTML from FACT_ccm a left join LKUP_level1 d on a.level1=d.level1Key left join LKUP_level2 b on a.level2=b.level2Key where a.deleteFlag != 1 and a.level1 = ?', 0);
INSERT INTO FACT_queries (queriesKey, queryLabel, query, deleteFlag) VALUES (13, 'getCarouselStructure', 'select a.ccmKey as id, ''carouselContentForm'' as form, b.level0Label as "Level 0",c.level1Label as "Level 1", d.level2Label as "Level 2", a.ccmOrder as "Order" from FACT_ccm as a left join LKUP_level0 as b on a.level0 = b.level0Key left join LKUP_level1 as c on a.level1 = c.level1Key left join LKUP_level2 as d on a.level2 = d.level2Key %WHERECLAUSE% and a.deleteFlag != 1 order by a.ccmOrder, d.level2Order', 0);

INSERT INTO LKUP_userRole (userRoleKey, userRoleLabel, userRoleOrder) VALUES (1, 'Administrator', 0);
INSERT INTO LKUP_userRole (userRoleKey, userRoleLabel, userRoleOrder) VALUES (2, 'User', 1);

INSERT INTO FACT_teamMembers (teamMembersKey, firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES (1, 'John', 'Smith', 'admin', '21232f297a57a5a743894a0e4a801fc3', 'devteam@gmail.com', 1, 1, 0);
INSERT INTO FACT_teamMembers (teamMembersKey, firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES (2, 'rachel', 'rachel', 'rachel', '8e73b27568cb3be29e2da74d42eab6dd', 'rgodk065@uottawa.ca', 2, 0, 0);
INSERT INTO FACT_teamMembers (teamMembersKey, firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES (3, 'Veena', 'Melwani', 'veena', '5d41402abc4b2a76b9719d911017c592', 'veena.chhattani@gmail.com', 1, 0, 0);
INSERT INTO FACT_teamMembers (teamMembersKey, firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES (4, 'Katherine', 'ChengLi', 'katAdmin', 'c3373bfaa7deb1566df61233769915df', 'katchengli@hotmail.com', 1, 0, 0);
INSERT INTO FACT_teamMembers (teamMembersKey, firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES (5, 'Benjamin', 'Eze', 'beze', '1bca2e2db2efc723ea88c25508b7c327', 'ben_eze@yahoo.com', 1, 0, 0);
INSERT INTO FACT_teamMembers (teamMembersKey, firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES (6, 'Francine', 'Darroch', 'Francine', '695d5cf06094d7e2e93c4d347fadaf36', 'francinedarroch@gmail.com', 1, 0, 0);
INSERT INTO FACT_teamMembers (teamMembersKey, firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES (7, 'user1', 'user1', 'user1', '24c9e15e52afc47c225b757e7bee1f9d', '', 2, 0, 0);
INSERT INTO FACT_teamMembers (teamMembersKey, firstName, lastName, userName, password, email, userRole, activeFlag, deleteFlag) VALUES (8, 'sonia', 'sonia', 'sonia', 'd31cb1e2b7902e8e9b4d1793e94c38a0', 'sonia@gmail.com', 1, 0, 0);




