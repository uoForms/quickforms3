USE [master]
GO
/****** Object:  Database [cws]    Script Date: 2017-07-12 9:56:26 PM ******/
CREATE DATABASE [cws] ON  PRIMARY 
( NAME = N'CWS', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\CWS.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'CWS_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\CWS_log.ldf' , SIZE = 1280KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [cws] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [cws].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [cws] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [cws] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [cws] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [cws] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [cws] SET ARITHABORT OFF 
GO
ALTER DATABASE [cws] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [cws] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [cws] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [cws] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [cws] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [cws] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [cws] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [cws] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [cws] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [cws] SET  DISABLE_BROKER 
GO
ALTER DATABASE [cws] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [cws] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [cws] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [cws] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [cws] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [cws] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [cws] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [cws] SET RECOVERY FULL 
GO
ALTER DATABASE [cws] SET  MULTI_USER 
GO
ALTER DATABASE [cws] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [cws] SET DB_CHAINING OFF 
GO
EXEC sys.sp_db_vardecimal_storage_format N'cws', N'ON'
GO
USE [cws]
GO
/****** Object:  Table [dbo].[cws_domains]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cws_domains](
	[Category] [nvarchar](255) NULL,
	[Subcategory] [nvarchar](255) NULL,
	[Domain] [nvarchar](255) NULL,
	[ICF Code] [nvarchar](255) NULL,
	[Definition] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cws_markscheme1]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cws_markscheme1](
	[evaluationName] [nvarchar](50) NULL,
	[evaluationScalar] [int] NULL,
	[evaluationOrder] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cws_markscheme2]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cws_markscheme2](
	[evaluationName] [nvarchar](50) NULL,
	[evaluationScalar] [int] NULL,
	[evaluationOrder] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FACT_documents]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FACT_documents](
	[patient] [int] NOT NULL,
	[addedBy] [varchar](50) NOT NULL,
	[evaluationMulti] [int] NOT NULL,
	[documentsKey] [int] IDENTITY(1,1) NOT NULL,
	[template] [int] NULL,
	[createdDate] [datetime] NULL,
	[updatedDate] [datetime] NULL,
	[isSigned] [bit] NULL,
	[signedBy] [varchar](50) NULL,
	[deleteFlag] [int] NULL,
	[assessmentDate] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[fact_patients]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[fact_patients](
	[patientsKey] [int] IDENTITY(1,1) NOT NULL,
	[label] [varchar](200) NULL,
	[description] [varchar](200) NULL,
	[patientOrder] [int] NULL,
	[teamMembersMulti] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[fact_queries]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[fact_queries](
	[queriesKey] [int] IDENTITY(1,1) NOT NULL,
	[queryLabel] [varchar](100) NULL,
	[query] [varchar](8000) NULL,
	[deleteFlag] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[queriesKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[fact_teamMembers]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[fact_teamMembers](
	[teamMembersKey] [int] IDENTITY(1,1) NOT NULL,
	[firstName] [varchar](100) NULL,
	[lastName] [varchar](100) NULL,
	[userName] [varchar](100) NULL,
	[password] [varchar](100) NULL,
	[email] [varchar](100) NULL,
	[userRole] [int] NULL,
	[userPosition] [int] NULL,
	[activeFlag] [int] NULL,
	[deleteFlag] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[teamMembersKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LKUP_evaluationMulti]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LKUP_evaluationMulti](
	[evaluationMultiKey] [int] NOT NULL,
	[evaluationMultiValue] [int] NULL,
	[evaluationComments] [nvarchar](120) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LKUP_teamMembersMulti]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LKUP_teamMembersMulti](
	[teamMembersMultiKey] [int] NULL,
	[teamMembersMultiValue] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LKUP_userPosition]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LKUP_userPosition](
	[userPositionKey] [int] NULL,
	[userPositionLabel] [nvarchar](50) NULL,
	[userPositionOrder] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lkup_userRole]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  View [dbo].[lkup_evaluation]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[lkup_evaluation]
AS
SELECT        row_number() OVER (ORDER BY [ICF Code], Domain, evaluationScalar) [evaluationKey], results.Category[evaluationCategory], results.Subcategory[evaluationDomain], results.Domain[evaluationLabel], 
results.[ICF Code] [ICF Code], results.Definition[definition], results.evaluationName[evaluationName], results.evaluationScalar[evaluationScalar], row_number() OVER (ORDER BY [ICF Code], Domain, evaluationScalar) 
[evaluationOrder]
FROM            (SELECT        *
                          FROM            cws_domains CROSS JOIN
                                                    cws_markscheme1
                          WHERE        Category = 'IMPAIRMENTS OF BODY FUNCTIONS' AND Domain IS NOT NULL
                          UNION
                          SELECT        Category, Subcategory, Domain + '-Capacity' AS Domain, [ICF Code], Definition, evaluationName, evaluationScalar, evaluationOrder
                          FROM            cws_domains CROSS JOIN
                                                   cws_markscheme1
                          WHERE        Category = 'CAPACITY AND PERFORMANCE' AND Domain IS NOT NULL
                          UNION
                          SELECT        Category, Subcategory, Domain + '-Performance' AS Domain, [ICF Code], Definition, evaluationName, evaluationScalar, evaluationOrder
                          FROM            cws_domains CROSS JOIN
                                                   cws_markscheme1
                          WHERE        Category = 'CAPACITY AND PERFORMANCE' AND Domain IS NOT NULL
                          UNION
                          SELECT        *
                          FROM            cws_domains CROSS JOIN
                                                   cws_markscheme2
                          WHERE        Category = 'ENVIRONMENT' AND Domain IS NOT NULL) results
GO
/****** Object:  View [dbo].[lkup_patient]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[lkup_patient]
AS
SELECT     patientsKey AS patientKey, label AS patientLabel, patientOrder
FROM         dbo.fact_patients
GO
/****** Object:  View [dbo].[lkup_teamMembers]    Script Date: 2017-07-12 9:56:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[lkup_teamMembers]
AS
SELECT     teamMembersKey, firstName, lastName, userName, password, email, userRole, userPosition, activeFlag, deleteFlag, 1 AS teamMembersOrder
FROM         dbo.fact_teamMembers
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'lkup_evaluation'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'lkup_evaluation'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "fact_patients"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 114
               Right = 207
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'lkup_patient'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'lkup_patient'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "fact_teamMembers"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 114
               Right = 203
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'lkup_teamMembers'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'lkup_teamMembers'
GO
USE [master]
GO
ALTER DATABASE [cws] SET  READ_WRITE 
GO
