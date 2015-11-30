IF OBJECT_ID('FACT_level0', 'U') IS NOT NULL DROP TABLE FACT_level0;
CREATE TABLE FACT_level0 (
	level0Key INT NOT NULL IDENTITY, 
	level0Label VARCHAR(2000),
	carousalId INT,  
	level1Mulit INT NOT NULL,
	pictureKey INT NOT NULL, 
	createdDate datetime NOT NULL,
	updatedDate datetime,
	PRIMARY KEY (level0Key));

IF OBJECT_ID('LKUP_level1', 'U') IS NOT NULL ALTER TABLE LKUP_level1Multi DROP CONSTRAINT FK_LKUP_level1Multi_LKUP_level1;
IF OBJECT_ID('LKUP_level1', 'U') IS NOT NULL DROP TABLE LKUP_level1;
CREATE TABLE LKUP_level1 (
	level1Key INT NOT NULL IDENTITY,
	level1Label VARCHAR(2000),
	level1Order INT,
	CONSTRAINT PK_LKUP_level1 PRIMARY KEY (level1Key),
	CONSTRAINT IX_LKUP_level1 UNIQUE (level1Key));

IF OBJECT_ID('LKUP_level1Multi', 'U') IS NOT NULL DROP TABLE LKUP_level1Multi;
CREATE TABLE LKUP_level1Multi (
	level1MultiKey INT NOT NULL,
	level1MultiValue INT NOT NULL,
	CONSTRAINT PK_LKUP_level1Multi PRIMARY KEY (level1MultiKey, level1MultiValue),
	CONSTRAINT FK_LKUP_level1Multi_LKUP_level1 FOREIGN KEY (level1MultiValue)
	REFERENCES LKUP_level1 (level1Key));

IF OBJECT_ID('FACT_level1', 'U') IS NOT NULL DROP TABLE FACT_level1;
CREATE TABLE FACT_level1 (
	level1Key INT NOT NULL IDENTITY,
	level1Label VARCHAR(2000),
	contentMulti VARCHAR(2000),
	createdDate datetime NOT NULL,
	updatedDate datetime,
	PRIMARY KEY (level1Key),
	CONSTRAINT IX_FACT_level1 UNIQUE (level1Key));
	
IF OBJECT_ID('LKUP_content', 'U') IS NOT NULL ALTER TABLE LKUP_contentMulti DROP CONSTRAINT FK_LKUP_contentMulti_LKUP_content;
IF OBJECT_ID('LKUP_content', 'U') IS NOT NULL DROP TABLE LKUP_content;
CREATE TABLE LKUP_content (
	contentKey INT NOT NULL IDENTITY,
	contentLabel VARCHAR(2000),
	contentOrder INT,
	CONSTRAINT PK_LKUP_content PRIMARY KEY (contentKey),
	CONSTRAINT IX_LKUP_content UNIQUE (contentKey));

IF OBJECT_ID('LKUP_contentMulti', 'U') IS NOT NULL DROP TABLE LKUP_contentMulti;
CREATE TABLE LKUP_contentMulti (
	contentMultiKey INT NOT NULL,
	contentMultiValue INT NOT NULL,
	CONSTRAINT PK_LKUP_contentMulti PRIMARY KEY (contentMultiKey, contentMultiValue),
	CONSTRAINT FK_LKUP_contentMulti_LKUP_content FOREIGN KEY (contentMultiValue)
	REFERENCES LKUP_content (contentKey));
	
IF OBJECT_ID('FACT_content', 'U') IS NOT NULL DROP TABLE FACT_content;
CREATE TABLE FACT_content (
	contentKey INT NOT NULL IDENTITY,
	contentLabel VARCHAR(2000),
	contentType int NOT NULL,
	content TEXT NOT NULL,
	createdDate datetime NOT NULL,
	updatedDate datetime,
	PRIMARY KEY (contentKey),
	CONSTRAINT IX_FACT_content UNIQUE (contentKey));
	
IF OBJECT_ID('LKUP_contentType', 'U') IS NOT NULL DROP TABLE LKUP_contentType;
CREATE TABLE LKUP_contentType (
	contentTypeKey INT NOT NULL IDENTITY,
	contentTypeLabel VARCHAR(2000),
	contentTypeOrder INT,
	CONSTRAINT PK_LKUP_contentType PRIMARY KEY (contentTypeKey),
	CONSTRAINT IX_LKUP_contentType UNIQUE (contentTypeKey));
	
IF OBJECT_ID('FACT_file', 'U') IS NOT NULL DROP TABLE FACT_file;
CREATE TABLE FACT_file (
	fileKey INT NOT NULL IDENTITY,
	fileLabel VARCHAR(2000),
	filePath VARCHAR(2000) NOT NULL,
	createUser INT,
	createDate DATE,  
	status INT NOT NULL,
	PRIMARY KEY (fileKey));