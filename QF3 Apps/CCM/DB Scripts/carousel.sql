IF OBJECT_ID('FACT_Carousel', 'U') IS NOT NULL DROP TABLE FACT_Carousel;
CREATE TABLE FACT_carousel (
	carouselKey INT NOT NULL IDENTITY, 
	carousalNum INT, 
	pageNum INT NOT NULL, 
	pageLinkMulit INT NOT NULL,
	pictureKey INT NOT NULL, 
	createUser INT, 
	createDate DATE,
	PRIMARY KEY (carouselKey));

IF OBJECT_ID('LKUP_pageLink', 'U') IS NOT NULL ALTER TABLE LKUP_pageLinkMulti DROP CONSTRAINT FK_LKUP_pageLinkMulti_LKUP_pageLink;
IF OBJECT_ID('LKUP_pageLink', 'U') IS NOT NULL DROP TABLE LKUP_pageLink;
CREATE TABLE LKUP_pageLink (
	pageLinkKey INT NOT NULL IDENTITY,
	pageLinkLabel VARCHAR(2000),
	pageLink VARCHAR(2000),
	pageLinkOrder INT,
	CONSTRAINT PK_LKUP_pageLink PRIMARY KEY (pageLinkKey),
	CONSTRAINT IX_LKUP_pageLink UNIQUE (pageLinkKey));

IF OBJECT_ID('LKUP_pageLinkMulti', 'U') IS NOT NULL DROP TABLE LKUP_pageLinkMulti;
CREATE TABLE LKUP_pageLinkMulti (
	pageLinkMultiKey INT NOT NULL,
	pageLinkMultiValue INT NOT NULL,
	CONSTRAINT PK_LKUP_pageLinkMulti PRIMARY KEY (pageLinkMultiKey, pageLinkMultiValue),
	CONSTRAINT FK_LKUP_pageLinkMulti_LKUP_pageLink FOREIGN KEY (pageLinkMultiValue)
	REFERENCES LKUP_pageLink (pageLinkKey));
	
IF OBJECT_ID('FACT_file', 'U') IS NOT NULL DROP TABLE FACT_file;
CREATE TABLE FACT_file (
	fileKey INT NOT NULL IDENTITY,
	fileLabel VARCHAR(2000),
	filePath VARCHAR(2000) NOT NULL,
	createUser INT,
	createDate DATE,  
	status INT NOT NULL,
	PRIMARY KEY (fileKey));