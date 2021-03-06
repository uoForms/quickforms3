/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
use [insert-app-name-here];

create table fact_queries
(queriesKey int primary key not null identity,
queryLabel varchar(100),
query varchar(8000),
deleteFlag int);

insert into sql_queries values('getFactMetadata','select column_name as field,* from information_schema.columns where table_name like ? order by ordinal_position;',0);
--For MySql use this
-- insert into sql_queries values(default,'getFactMetadata','SELECT `COLUMN_NAME` as Field FROM `INFORMATION_SCHEMA`.`COLUMNS` where `TABLE_NAME` like ?');