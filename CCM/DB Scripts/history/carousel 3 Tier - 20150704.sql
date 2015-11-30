--Create Tables--
IF OBJECT_ID('LKUP_level0', 'U') IS NOT NULL ALTER TABLE FACT_content DROP CONSTRAINT FK_FACT_content_LKUP_level0;
IF OBJECT_ID('LKUP_level1', 'U') IS NOT NULL ALTER TABLE FACT_content DROP CONSTRAINT FK_FACT_content_LKUP_level1;
IF OBJECT_ID('LKUP_level2', 'U') IS NOT NULL ALTER TABLE FACT_content DROP CONSTRAINT FK_FACT_content_LKUP_level2;
IF OBJECT_ID('LKUP_level0', 'U') IS NOT NULL DROP TABLE LKUP_level0;
CREATE TABLE LKUP_level0 (
	level0Key INT PRIMARY KEY,
	level0Label VARCHAR(2000),
	level0Order INT);

IF OBJECT_ID('LKUP_level1', 'U') IS NOT NULL DROP TABLE LKUP_level1;
CREATE TABLE LKUP_level1 (
	level1Key INT PRIMARY KEY,
	level1Label VARCHAR(2000),
	level1Order INT);

IF OBJECT_ID('LKUP_level2', 'U') IS NOT NULL DROP TABLE LKUP_level2;
CREATE TABLE LKUP_level2 (
	level2Key INT PRIMARY KEY,
	level2Label VARCHAR(2000),
	level2Order INT);

IF OBJECT_ID('FACT_content', 'U') IS NOT NULL DROP TABLE FACT_content;
CREATE TABLE FACT_content (
	contentKey INT PRIMARY KEY,
	contentLabel VARCHAR(2000),
	level0 int NOT NULL,
	level1 int NOT NULL,
	level2 int NOT NULL,
	content TEXT NOT NULL,
	deleteFlag INT DEFAULT 0,
	addedBy VARCHAR(200),
	createdDate datetime NOT NULL,
	updatedDate datetime,
	CONSTRAINT UNIQUE_levels UNIQUE (level0,level1,level2,deleteFlag),
	CONSTRAINT FK_FACT_content_LKUP_level0 FOREIGN KEY (level0) REFERENCES LKUP_level0 (level0Key),
	CONSTRAINT FK_FACT_content_LKUP_level1 FOREIGN KEY (level1) REFERENCES LKUP_level1 (level1Key),
	CONSTRAINT FK_FACT_content_LKUP_level2 FOREIGN KEY (level2) REFERENCES LKUP_level2 (level2Key));

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

INSERT INTO LKUP_level0 (level0Key,	level0Label, level0Order) VALUES (1, 'First Trimester', 1);
INSERT INTO LKUP_level0 (level0Key,	level0Label, level0Order) VALUES (2, 'Second Trimester', 2);
INSERT INTO LKUP_level0 (level0Key,	level0Label, level0Order) VALUES (3, 'Third Trimester', 3);
INSERT INTO LKUP_level0 (level0Key,	level0Label, level0Order) VALUES (4, 'New Born', 4);

INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (1, 'Week 1', 1);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (2, 'Week 2', 2);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (3, 'Week 3', 3);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (4, 'Week 4', 4);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (5, 'Week 5', 5);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (6, 'Week 6', 6);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (7, 'Week 7', 7);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (8, 'Week 8', 8);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (9, 'Week 9', 9);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (10, 'Week 10', 10);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (11, 'Week 11', 11);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (12, 'Week 12', 12);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (13, 'Warning signs 1', 13);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (14, 'Week 13', 14);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (15, 'Week 14', 15);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (16, 'Week 15', 16);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (17, 'Week 16', 17);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (18, 'Week 17', 18);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (19, 'Week 18', 19);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (20, 'Week 19', 20);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (21, 'Week 20', 21);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (22, 'Week 21', 22);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (23, 'Week 22', 23);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (24, 'Week 23', 24);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (25, 'Week 24', 25);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (26, 'Week 25', 26);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (27, 'Week 26', 27);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (28, 'Warning signs 2', 28);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (29, 'Week 27', 29);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (30, 'Week 28', 30);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (31, 'Week 29', 31);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (32, 'Week 30', 32);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (33, 'Week 31', 33);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (34, 'Week 32', 34);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (35, 'Week 33', 35);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (36, 'Week 34', 36);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (37, 'Week 35', 37);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (38, 'Week 36', 38);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (39, 'Week 37', 39);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (40, 'Week 38', 40);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (41, 'Week 39', 41);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (42, 'Week 40', 42);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (43, 'Warning signs 3', 43);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (44, 'Signs of labour', 44);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (45, 'Week 1', 45);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (46, 'Week 2', 46);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (47, 'Week 3', 47);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (48, 'Week 4', 48);
INSERT INTO LKUP_level1 (level1Key,	level1Label, level1Order) VALUES (49, 'Advantages of breast feeding', 49);

INSERT INTO LKUP_level2 (level2Key,	level2Label, level2Order) VALUES (1, 'Home', 1);
INSERT INTO LKUP_level2 (level2Key,	level2Label, level2Order) VALUES (2, 'Body', 2);
INSERT INTO LKUP_level2 (level2Key,	level2Label, level2Order) VALUES (3, 'Tips', 3);
INSERT INTO LKUP_level2 (level2Key,	level2Label, level2Order) VALUES (4, 'Baby', 4);

INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (1,,1,1,1,'Week 1 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (2,,1,1,2,'Week 1 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (3,,1,1,3,'Week 1 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (4,,1,1,4,'Week 1 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (5,,1,2,1,'Week 2 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (6,,1,2,2,'Week 2 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (7,,1,2,3,'Week 2 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (8,,1,2,4,'Week 2 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (9,,1,3,1,'Week 3 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (10,,1,3,2,'Week 3 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (11,,1,3,3,'Week 3 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (12,,1,3,4,'Week 3 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (13,,1,4,1,'Week 4 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (14,,1,4,2,'Week 4 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (15,,1,4,3,'Week 4 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (16,,1,4,4,'Week 4 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (17,,1,5,1,'Week 5 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (18,,1,5,2,'Week 5 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (19,,1,5,3,'Week 5 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (20,,1,5,4,'Week 5 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (21,,1,6,1,'Week 6 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (22,,1,6,2,'Week 6 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (23,,1,6,3,'Week 6 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (24,,1,6,4,'Week 6 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (25,,1,7,1,'Week 7 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (26,,1,7,2,'Week 7 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (27,,1,7,3,'Week 7 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (28,,1,7,4,'Week 7 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (29,,1,8,1,'Week 8 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (30,,1,8,2,'Week 8 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (31,,1,8,3,'Week 8 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (32,,1,8,4,'Week 8 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (33,,1,9,1,'Week 9 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (34,,1,9,2,'Week 9 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (35,,1,9,3,'Week 9 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (36,,1,9,4,'Week 9 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (37,,1,10,1,'Week 10 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (38,,1,10,2,'Week 10 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (39,,1,10,3,'Week 10 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (40,,1,10,4,'Week 10 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (41,,1,11,1,'Week 11 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (42,,1,11,2,'Week 11 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (43,,1,11,3,'Week 11 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (44,,1,11,4,'Week 11 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (45,,1,12,1,'Week 12 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (46,,1,12,2,'Week 12 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (47,,1,12,3,'Week 12 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (48,,1,12,4,'Week 12 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (49,,1,13,1,'Week 13 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (50,,1,13,2,'Week 13 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (51,,1,13,3,'Week 13 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (52,,1,13,4,'Week 13 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (53,,2,14,1,'Week 14 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (54,,2,14,2,'Week 14 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (55,,2,14,3,'Week 14 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (56,,2,14,4,'Week 14 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (57,,2,15,1,'Week 15 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (58,,2,15,2,'Week 15 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (59,,2,15,3,'Week 15 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (60,,2,15,4,'Week 15 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (61,,2,16,1,'Week 16 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (62,,2,16,2,'Week 16 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (63,,2,16,3,'Week 16 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (64,,2,16,4,'Week 16 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (65,,2,17,1,'Week 17 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (66,,2,17,2,'Week 17 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (67,,2,17,3,'Week 17 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (68,,2,17,4,'Week 17 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (69,,2,18,1,'Week 18 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (70,,2,18,2,'Week 18 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (71,,2,18,3,'Week 18 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (72,,2,18,4,'Week 18 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (73,,2,19,1,'Week 19 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (74,,2,19,2,'Week 19 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (75,,2,19,3,'Week 19 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (76,,2,19,4,'Week 19 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (77,,2,20,1,'Week 20 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (78,,2,20,2,'Week 20 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (79,,2,20,3,'Week 20 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (80,,2,20,4,'Week 20 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (81,,2,21,1,'Week 21 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (82,,2,21,2,'Week 21 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (83,,2,21,3,'Week 21 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (84,,2,21,4,'Week 21 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (85,,2,22,1,'Week 22 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (86,,2,22,2,'Week 22 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (87,,2,22,3,'Week 22 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (88,,2,22,4,'Week 22 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (89,,2,23,1,'Week 23 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (90,,2,23,2,'Week 23 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (91,,2,23,3,'Week 23 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (92,,2,23,4,'Week 23 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (93,,2,24,1,'Week 24 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (94,,2,24,2,'Week 24 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (95,,2,24,3,'Week 24 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (96,,2,24,4,'Week 24 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (97,,2,25,1,'Week 25 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (98,,2,25,2,'Week 25 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (99,,2,25,3,'Week 25 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (100,,2,25,4,'Week 25 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (101,,2,26,1,'Week 26 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (102,,2,26,2,'Week 26 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (103,,2,26,3,'Week 26 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (104,,2,26,4,'Week 26 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (105,,2,27,1,'Week 27 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (106,,2,27,2,'Week 27 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (107,,2,27,3,'Week 27 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (108,,2,27,4,'Week 27 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (109,,2,28,1,'Week 28 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (110,,2,28,2,'Week 28 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (111,,2,28,3,'Week 28 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (112,,2,28,4,'Week 28 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (113,,3,29,1,'Week 29 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (114,,3,29,2,'Week 29 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (115,,3,29,3,'Week 29 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (116,,3,29,4,'Week 29 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (117,,3,30,1,'Week 30 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (118,,3,30,2,'Week 30 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (119,,3,30,3,'Week 30 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (120,,3,30,4,'Week 30 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (121,,3,31,1,'Week 31 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (122,,3,31,2,'Week 31 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (123,,3,31,3,'Week 31 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (124,,3,31,4,'Week 31 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (125,,3,32,1,'Week 32 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (126,,3,32,2,'Week 32 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (127,,3,32,3,'Week 32 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (128,,3,32,4,'Week 32 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (129,,3,33,1,'Week 33 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (130,,3,33,2,'Week 33 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (131,,3,33,3,'Week 33 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (132,,3,33,4,'Week 33 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (133,,3,34,1,'Week 34 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (134,,3,34,2,'Week 34 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (135,,3,34,3,'Week 34 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (136,,3,34,4,'Week 34 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (137,,3,35,1,'Week 35 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (138,,3,35,2,'Week 35 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (139,,3,35,3,'Week 35 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (140,,3,35,4,'Week 35 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (141,,3,36,1,'Week 36 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (142,,3,36,2,'Week 36 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (143,,3,36,3,'Week 36 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (144,,3,36,4,'Week 36 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (145,,3,37,1,'Week 37 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (146,,3,37,2,'Week 37 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (147,,3,37,3,'Week 37 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (148,,3,37,4,'Week 37 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (149,,3,38,1,'Week 38 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (150,,3,38,2,'Week 38 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (151,,3,38,3,'Week 38 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (152,,3,38,4,'Week 38 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (153,,3,39,1,'Week 39 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (154,,3,39,2,'Week 39 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (155,,3,39,3,'Week 39 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (156,,3,39,4,'Week 39 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (157,,3,40,1,'Week 40 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (158,,3,40,2,'Week 40 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (159,,3,40,3,'Week 40 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (160,,3,40,4,'Week 40 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (161,,3,41,1,'Week 41 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (162,,3,41,2,'Week 41 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (163,,3,41,3,'Week 41 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (164,,3,41,4,'Week 41 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (165,,3,42,1,'Week 42 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (166,,3,42,2,'Week 42 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (167,,3,42,3,'Week 42 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (168,,3,42,4,'Week 42 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (169,,3,43,1,'Week 43 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (170,,3,43,2,'Week 43 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (171,,3,43,3,'Week 43 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (172,,3,43,4,'Week 43 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (173,,3,44,1,'Week 44 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (174,,3,44,2,'Week 44 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (175,,3,44,3,'Week 44 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (176,,3,44,4,'Week 44 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (177,,4,45,1,'Week 45 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (178,,4,45,2,'Week 45 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (179,,4,45,3,'Week 45 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (180,,4,45,4,'Week 45 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (181,,4,46,1,'Week 46 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (182,,4,46,2,'Week 46 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (183,,4,46,3,'Week 46 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (184,,4,46,4,'Week 46 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (185,,4,47,1,'Week 47 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (186,,4,47,2,'Week 47 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (187,,4,47,3,'Week 47 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (188,,4,47,4,'Week 47 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (189,,4,48,1,'Week 48 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (190,,4,48,2,'Week 48 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (191,,4,48,3,'Week 48 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (192,,4,48,4,'Week 48 4',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (193,,4,49,1,'Week 49 1',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (194,,4,49,2,'Week 49 2',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (195,,4,49,3,'Week 49 3',0,'admin','2014-6-3',null);
INSERT INTO FACT_content (contentKey,contentLabel,level0,level1,level2,content,deleteFlag,addedBy,createdDate,updatedDate) VALUES (196,,4,49,4,'Week 49 4',0,'admin','2014-6-3',null);



