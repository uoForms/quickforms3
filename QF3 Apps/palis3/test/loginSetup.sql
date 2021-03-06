/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
use [simpleform];

create table fact_teamMembers
	(teamMembersKey int primary key not null identity,
	firstName varchar(100),
	lastName varchar(100),
	userName varchar(100),
	password varchar(100),
	email varchar(100),
	userRole int,
	activeFlag int);

create table lkup_userRole
	(userRoleKey int primary key not null,
	userRoleLabel varchar(100),
	userRoleOrder int);

insert into lkup_userRole values (1,'Administrator',0);
insert into lkup_userRole values (2,'User',1);


insert into fact_teamMembers values ('John','Smith','admin','21232f297a57a5a743894a0e4a801fc3','devteam@gmail.com',1,1);
--Username: admin, Password: admin

insert into sql_queries values('getUserByPassword','select * from fact_teamMembers left join lkup_userRole on userRole = userRoleKey %WHERECLAUSE%');
insert into sql_queries values('getTeamMembers','select teamMembersKey as id, ''teamMember'' as form,firstName as "First Name", lastName as "Last Name", userName as "User Name", email as "Email" from fact_teamMembers');