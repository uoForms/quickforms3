create table palis.dbo.role_forms(role_forms_key int not null primary key identity,
role varchar(45),
form_name varchar(45),
form_url varchar(45))

insert into palis.dbo.role_forms values('user','Education','educationForm.html'),
('user','Rounds','roundsForm.html'),('user','Non-Case Based','non-casebasedForm.html'),
('lweaver','Education','educationForm.html');