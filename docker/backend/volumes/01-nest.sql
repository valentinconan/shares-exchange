CREATE DATABASE nest;
\c nest;

create table public."user"
(
    id          serial
        constraint "PK_cace4a159ff9f2512dd42373760"
            primary key,
    "lastName"  varchar not null,
    "firstName" varchar not null,
    login       varchar not null
        constraint "UQ_a62473490b3e4578fd683235c5e"
            unique,
    hash        varchar not null
);

alter table public."user"
    owner to postgres;

create table public."right"
(
    id       serial
        constraint "PK_77e01b46d514d44ec33fd2d93d3"
            primary key,
    name     varchar not null,
    "userId" integer
        constraint "FK_5312fd220adf29ce4112c9ba27e"
            references public."user"
);

alter table public."right"
    owner to postgres;

create table public.user_rights_right
(
    "userId"  integer not null
        constraint "FK_008b69b17f2ce4a6125670c3538"
            references public."user"
            on update cascade on delete cascade,
    "rightId" integer not null
        constraint "FK_484b1dd9a3996eb7cc0001d5bc6"
            references public."right"
            on update cascade on delete cascade,
    constraint "PK_3e7d3078210355b79c454ab19a0"
        primary key ("userId", "rightId")
);

alter table public.user_rights_right
    owner to postgres;

create index "IDX_008b69b17f2ce4a6125670c353"
    on public.user_rights_right ("userId");

create index "IDX_484b1dd9a3996eb7cc0001d5bc"
    on public.user_rights_right ("rightId");

create table public.share_holder
(
    id    serial
        constraint "PK_666c21c4bb1ec216737d441cd07"
            primary key,
    login varchar not null
        constraint "UQ_6c6e1c37b0c29f608a202eff849"
            unique
);

alter table public.share_holder
    owner to postgres;

create table public.share
(
    id       serial
        constraint "PK_67a2b28d2cff31834bc2aa1ed7c"
            primary key,
    name     varchar not null,
    quantity integer not null,
    price    integer not null
);

alter table public.share
    owner to postgres;

create table public.holding
(
    id       serial
        constraint "PK_82c37e949073d49d4b73e34a903"
            primary key,
    quantity integer not null
);

alter table public.holding
    owner to postgres;

create table public."order"
(
    id       serial
        constraint "PK_1031171c13130102495201e3e20"
            primary key,
    action   varchar   not null,
    quantity integer   not null,
    amount   integer   not null,
    date     timestamp not null
);

alter table public."order"
    owner to postgres;
