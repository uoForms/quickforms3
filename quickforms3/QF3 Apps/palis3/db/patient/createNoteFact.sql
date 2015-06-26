create table palis.dbo.patient_notes_fact(patient_notes_key int primary key not null identity,
encounter_date date, note_label varchar(50), attachment varbinary(max),notes varchar(1000));

create table palis.dbo.note_label(note_label_key varchar(50),
note_label_label varchar(50));
insert into palis.dbo.note_label values('EHR','EHR'),('Chart','Chart');