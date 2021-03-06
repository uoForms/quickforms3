USE [master]
GO
/****** Object:  Database [sample]    Script Date: 6/10/2016 11:33:54 AM ******/
CREATE DATABASE [sample]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'sample_Data', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.SQLEXPRESS\MSSQL\DATA\sample_Data.mdf' , SIZE = 11136KB , MAXSIZE = UNLIMITED, FILEGROWTH = 10%)
 LOG ON 
( NAME = N'sample_Log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.SQLEXPRESS\MSSQL\DATA\sample_Log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 1024KB )
GO
ALTER DATABASE [sample] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [sample].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [sample] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [sample] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [sample] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [sample] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [sample] SET ARITHABORT OFF 
GO
ALTER DATABASE [sample] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [sample] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [sample] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [sample] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [sample] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [sample] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [sample] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [sample] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [sample] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [sample] SET  ENABLE_BROKER 
GO
ALTER DATABASE [sample] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [sample] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [sample] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [sample] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [sample] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [sample] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [sample] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [sample] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [sample] SET  MULTI_USER 
GO
ALTER DATABASE [sample] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [sample] SET DB_CHAINING OFF 
GO
ALTER DATABASE [sample] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [sample] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [sample] SET DELAYED_DURABILITY = DISABLED 
GO
USE [sample]
GO
/****** Object:  User [qfUser]    Script Date: 6/10/2016 11:33:54 AM ******/
CREATE USER [qfUser] FOR LOGIN [qfUser] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [qfUser]
GO
ALTER ROLE [db_accessadmin] ADD MEMBER [qfUser]
GO
ALTER ROLE [db_securityadmin] ADD MEMBER [qfUser]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [qfUser]
GO
ALTER ROLE [db_backupoperator] ADD MEMBER [qfUser]
GO
ALTER ROLE [db_datareader] ADD MEMBER [qfUser]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [qfUser]
GO
ALTER ROLE [db_denydatareader] ADD MEMBER [qfUser]
GO
ALTER ROLE [db_denydatawriter] ADD MEMBER [qfUser]
GO
/****** Object:  Table [dbo].[fact_queries]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[fact_queries](
	[queriesKey] [int] NOT NULL,
	[queryLabel] [varchar](100) NULL,
	[query] [varchar](8000) NULL,
	[deleteFlag] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[queriesKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[FACT_Registration]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[FACT_Registration](
	[RegistrationKey] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NULL,
	[LastName] [varchar](50) NULL,
	[DateofBirth] [date] NULL,
	[Age] [int] NULL,
	[Gender] [int] NULL,
	[Status] [int] NULL,
	[Department] [int] NULL,
	[Agreement] [int] NULL,
	[addedBy] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[RegistrationKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[fact_teamMembers]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[fact_teamMembers](
	[teamMembersKey] [int] IDENTITY(1,1) NOT NULL,
	[firstName] [varchar](100) NULL,
	[lastName] [varchar](100) NULL,
	[userName] [varchar](100) NULL,
	[password] [varchar](100) NULL,
	[email] [varchar](100) NULL,
	[userRole] [int] NULL,
	[activeFlag] [int] NULL,
	[deleteFlag] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[teamMembersKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[LKUP_date]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LKUP_date](
	[date key] [float] NULL,
	[fulldate] [date] NOT NULL,
	[day of week] [float] NULL,
	[day num in month] [float] NULL,
	[day num overall] [float] NULL,
	[day name] [nvarchar](255) NULL,
	[day abbrev] [nvarchar](255) NULL,
	[weekday flag] [nvarchar](255) NULL,
	[week num in year] [float] NULL,
	[week num overall] [float] NULL,
	[week begin date] [datetime] NULL,
	[week begin date key] [float] NULL,
	[month] [float] NULL,
	[month num overall] [float] NULL,
	[month name] [nvarchar](255) NULL,
	[month abbrev] [nvarchar](255) NULL,
	[quarter] [float] NULL,
	[year] [float] NULL,
	[yearmo] [float] NULL,
	[fiscal month] [float] NULL,
	[fiscal quarter] [float] NULL,
	[fiscal year] [float] NULL,
	[last day in month flag] [nvarchar](255) NULL,
	[same day year ago] [datetime] NULL,
	[F25] [nvarchar](255) NULL,
	[table insert statement] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[fulldate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[lkup_Department]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[lkup_Department](
	[DepartmentKey] [int] NOT NULL,
	[DepartmentLabel] [varchar](100) NULL,
	[DepartmentOrder] [int] NOT NULL,
 CONSTRAINT [PK_lkup_Department] PRIMARY KEY CLUSTERED 
(
	[DepartmentKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[lkup_Gender]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[lkup_Gender](
	[GenderKey] [int] NOT NULL,
	[GenderLabel] [varchar](100) NULL,
	[GenderOrder] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[GenderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[lkup_Status]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[lkup_Status](
	[StatusKey] [int] NOT NULL,
	[StatusLabel] [varchar](100) NULL,
	[StatusOrder] [int] NOT NULL,
 CONSTRAINT [PK_lkup_Status] PRIMARY KEY CLUSTERED 
(
	[StatusKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[lkup_userRole]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[lkup_userRole](
	[userRoleKey] [int] NOT NULL,
	[userRoleLabel] [varchar](100) NULL,
	[userRoleOrder] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[userRoleKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[vwGetSampleApp]    Script Date: 6/10/2016 11:33:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[vwGetSampleApp](
	[RegistrationKey] [int] NOT NULL,
	[firstName] [varchar](50) NULL,
	[LastName] [varchar](50) NULL,
	[DateofBirth] [date] NULL,
	[Age] [int] NULL,
	[Gender] [varchar](100) NULL,
	[Status] [varchar](100) NULL,
	[Department] [varchar](100) NULL,
	[Agreement] [int] NULL,
	[addedBy] [varchar](50) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
ALTER TABLE [dbo].[FACT_Registration]  WITH CHECK ADD  CONSTRAINT [fk_dept] FOREIGN KEY([Department])
REFERENCES [dbo].[lkup_Department] ([DepartmentKey])
GO
ALTER TABLE [dbo].[FACT_Registration] CHECK CONSTRAINT [fk_dept]
GO
ALTER TABLE [dbo].[FACT_Registration]  WITH CHECK ADD  CONSTRAINT [fk_Status] FOREIGN KEY([Status])
REFERENCES [dbo].[lkup_Status] ([StatusKey])
GO
ALTER TABLE [dbo].[FACT_Registration] CHECK CONSTRAINT [fk_Status]
GO
USE [master]
GO
ALTER DATABASE [sample] SET  READ_WRITE 
GO
USE [sample]
GO

INSERT INTO [dbo].[fact_teamMembers]
           ([firstName]
           ,[lastName]
           ,[userName]
           ,[password]
           ,[email]
           ,[userRole]
           ,[activeFlag]
           ,[deleteFlag])
     VALUES
           ('admin'
           ,'admin'
           ,'admin'
           ,'21232f297a57a5a743894a0e4a801fc3'
           ,'test@test.com'
           ,1
           ,1
		   ,0)

GO
USE [sample]
GO

INSERT INTO [dbo].[lkup_userRole]
           ([userRoleKey]
           ,[userRoleLabel]
           ,[userRoleOrder])
     VALUES
           (1
           ,'Administrator'
           ,0)
GO

INSERT INTO [dbo].[lkup_userRole]
           ([userRoleKey]
           ,[userRoleLabel]
           ,[userRoleOrder])
     VALUES
           (2
           ,'User'
           ,2)
GO



INSERT INTO [dbo].[lkup_Status]
           ([StatusKey]
           ,[StatusLabel]
           ,[StatusOrder])
     VALUES
           (1
           ,'Full-Time'
           ,1)
GO

INSERT INTO [dbo].[lkup_Status]
           ([StatusKey]
           ,[StatusLabel]
           ,[StatusOrder])
     VALUES
           (2
           ,'Part-time'
           ,2)
GO


INSERT INTO [dbo].[lkup_Status]
           ([StatusKey]
           ,[StatusLabel]
           ,[StatusOrder])
     VALUES
           (3
           ,'-- Not Selected -- '
           ,0)
GO
INSERT INTO [dbo].[lkup_Gender]
           ([GenderKey]
           ,[GenderLabel]
           ,[GenderOrder])
     VALUES
           (1
           ,'Not Specified'
           ,1)
GO
INSERT INTO [dbo].[lkup_Gender]
           ([GenderKey]
           ,[GenderLabel]
           ,[GenderOrder])
     VALUES
           (2
           ,'Male'
           ,2)
GO
INSERT INTO [dbo].[lkup_Gender]
           ([GenderKey]
           ,[GenderLabel]
           ,[GenderOrder])
     VALUES
           (3
           ,'Female'
           ,3)
GO

USE [sample]
GO

INSERT INTO [dbo].[lkup_Department]
           ([DepartmentKey]
           ,[DepartmentLabel]
           ,[DepartmentOrder])
     VALUES
           (1,'Computer Science',1),(2,'Arts',2),(3,'Law',3),
		   (4,'Mathematics',4),(5,'Robotics',5),(6,'Electronics',6),
		   (7,'Mechanical',7),(8,'Physics',8),(9,'Chemistry',9),(10,'Social Sciences',10),
		   (11,'-- Not Selected --',0)
GO
USE [sample]
GO

INSERT INTO [dbo].[fact_queries]
           ([queriesKey]
           ,[queryLabel]
           ,[query]
           ,[deleteFlag])
     VALUES
          (1,'testQuery','select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey %WHERECLAUSE%',NULL),
		  (2,'getUserByPassword','select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey %WHERECLAUSE%',NULL),
		  (3,'getTeamMembers','select teamMembersKey as id, ''teamMember'' as form,firstName as "First Name", lastName as "Last Name", userName as "User Name", email as "Email" from fact_teamMembers',NULL),
		  (4,'getTable','select r.RegistrationKey as id,''registrationForm''as form, r.FirstName as "First Name",r.LastName as " Last Name", r.Status as "Status", r.Department as "Department" from FACT_Registration as r left join LKUP_Status as d on d.StatusKey = r.Status left join LKUP_Department as e on e.DepartmentKey = r.Department %WHERECLAUSE% and deleteFlag != 1 order by RegistrationKey desc', NULL), 
		  (5,'getTableDisplay','select r.RegistrationKey as id,''registrationForm''as form, r.FirstName as "First Name",r.LastName as " Last Name", d.StatusLabel as "Status", e.DepartmentLabel as "Department" from FACT_Registration as r left join LKUP_Status as d on d.StatusKey = r.Status left join LKUP_Department as e on e.DepartmentKey = r.Department %WHERECLAUSE% order by RegistrationKey desc', NULL),
		  (6,'departmentGenderGraph','select 	DepartmentLabel as ''Department'', sum(case when gender = 2 then 1 else 0 end)as ''Male'', sum(case when gender = 3 then 1 else 0 end)as ''Female'', sum(case when gender = 0 then 1 else 0 end)as ''Not Specified'' from lkup_Department left join FACT_Registration on Department = DepartmentKey %WHERECLAUSE% group by DepartmentLabel, DepartmentOrder order by DepartmentOrder',NULL),
		  (7,'getQueries','select queriesKey as id, ''query'' as form, queryLabel as "Query Label", query as "Query" from fact_queries',NULL),
		  (8,'getFactMetadata','select column_name as field,* from information_schema.columns where table_name like ? order by ordinal_position;',NULL),
		  (9,'getAllSampleView','SELECT *  FROM [sample].[dbo].[vwGetSampleApp]',NULL)
	GO