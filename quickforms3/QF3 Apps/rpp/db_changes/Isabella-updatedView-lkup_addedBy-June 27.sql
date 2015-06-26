USE [RPP]
GO

/****** Object:  View [dbo].[lkup_addedBy]    Script Date: 06/27/2014 13:54:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


create view [dbo].[lkup_addedBy](addedByKey,addedByLabel,addedByOrder) as
(select '0','Not Selected',0
union
select username, username,1 from FACT_teamMembers where deleteFlag = 0)


GO


