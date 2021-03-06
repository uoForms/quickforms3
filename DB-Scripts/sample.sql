USE [master]
GO
/****** Object:  Database [sample]    Script Date: 05/19/2016 15:17:22 ******/
CREATE DATABASE [sample] ON  PRIMARY 
( NAME = N'sample', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\sample.mdf' , SIZE = 2048KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'sample_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\sample_1.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [sample] SET COMPATIBILITY_LEVEL = 100
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
ALTER DATABASE [sample] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [sample] SET AUTO_CREATE_STATISTICS ON
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
ALTER DATABASE [sample] SET  DISABLE_BROKER
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
ALTER DATABASE [sample] SET  READ_WRITE
GO
ALTER DATABASE [sample] SET RECOVERY FULL
GO
ALTER DATABASE [sample] SET  MULTI_USER
GO
ALTER DATABASE [sample] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [sample] SET DB_CHAINING OFF
GO
EXEC sys.sp_db_vardecimal_storage_format N'sample', N'ON'
GO
USE [sample]
GO
/****** Object:  User [sonia peri]    Script Date: 05/19/2016 15:17:22 ******/
CREATE USER [sonia peri] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [segcourse]    Script Date: 05/19/2016 15:17:22 ******/
CREATE USER [segcourse] FOR LOGIN [segcourse] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[fact_queries]    Script Date: 05/19/2016 15:17:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING OFF
GO
CREATE TABLE [dbo].[fact_queries](
	[queriesKey] [int] IDENTITY(1,1) NOT NULL,
	[queryLabel] [varchar](100) NULL,
	[query] [varchar](8000) NULL,
	[deleteFlag] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[queriesKey] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[lkup_userRole]    Script Date: 05/19/2016 15:17:23 ******/
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
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[lkup_Status]    Script Date: 05/19/2016 15:17:23 ******/
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
PRIMARY KEY CLUSTERED 
(
	[StatusKey] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[lkup_Gender]    Script Date: 05/19/2016 15:17:23 ******/
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
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[lkup_Department]    Script Date: 05/19/2016 15:17:23 ******/
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
PRIMARY KEY CLUSTERED 
(
	[DepartmentKey] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[LKUP_date]    Script Date: 05/19/2016 15:17:23 ******/
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
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[fact_teamMembers]    Script Date: 05/19/2016 15:17:23 ******/
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
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[FACT_Registration]    Script Date: 05/19/2016 15:17:23 ******/
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
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  View [dbo].[vwGetSampleApp]    Script Date: 05/19/2016 15:17:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vwGetSampleApp]
As
select RegistrationKey,r.firstName,r.LastName,r.DateofBirth,r.Age,g.GenderLabel Gender,s.StatusLabel Status
,d.DepartmentLabel Department,r.Agreement,addedBy from FACT_Registration r INNER JOIN lkup_Department d on d.DepartmentKey=r.Department
INNER JOIN lkup_Gender g on r.Gender=g.GenderKey INNER JOIN lkup_Status s on r.Status=s.StatusKey
GO
/****** Object:  ForeignKey [fk_dept]    Script Date: 05/19/2016 15:17:23 ******/
ALTER TABLE [dbo].[FACT_Registration]  WITH CHECK ADD  CONSTRAINT [fk_dept] FOREIGN KEY([Department])
REFERENCES [dbo].[lkup_Department] ([DepartmentKey])
GO
ALTER TABLE [dbo].[FACT_Registration] CHECK CONSTRAINT [fk_dept]
GO
/****** Object:  ForeignKey [fk_Status]    Script Date: 05/19/2016 15:17:23 ******/
ALTER TABLE [dbo].[FACT_Registration]  WITH CHECK ADD  CONSTRAINT [fk_Status] FOREIGN KEY([Status])
REFERENCES [dbo].[lkup_Status] ([StatusKey])
GO
ALTER TABLE [dbo].[FACT_Registration] CHECK CONSTRAINT [fk_Status]
GO
