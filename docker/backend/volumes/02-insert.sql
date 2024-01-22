\c nest;

insert into public.share (name, quantity, price) values ('DELL',3000,3.1);

insert into public."user" ("lastName", "firstName", login, hash) values ('admin','admin','admin','b96452118f0205191326194a8cb974e45c5f1368f77e7f6c7c49b135b56ea5b01f362c9ea621a2c4f22f44181be4a19d0062b5cb77a5f65c51f0f4fee4557e98');

insert into public."right" (name) VALUES ('READ');
insert into public."right" (name) VALUES ('WRITE');
insert into public."right" (name) VALUES ('ADMIN');

insert into public."user_rights_right" ("userId","rightId") values (1,1);
insert into public."user_rights_right" ("userId","rightId") values (1,2);
insert into public."user_rights_right" ("userId","rightId") values (1,3);