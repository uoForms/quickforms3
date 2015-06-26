create table palis.dbo.users (user_name varchar(50) primary key not null, user_pass varchar(100) not null);
insert into palis.dbo.users values('lweaver','3a502a9ef4a3e491cddf7fb0cad64922');

create table palis.dbo.user_roles (
  user_name         varchar(50) not null,
  role_name         varchar(15) not null,
  primary key (user_name, role_name)
);
insert into palis.dbo.user_roles values('lweaver','user');