CREATE DATABASE nest;
\c nest;

create table share
(
    id       serial
        constraint "PK_67a2b28d2cff31834bc2aa1ed7c"
            primary key,
    name     varchar not null
        constraint "UQ_2c71988c62459919d6f454ff713"
            unique,
    quantity integer not null,
    price    integer not null
);

alter table share
    owner to postgres;

create table share_holder
(
    id    serial
        constraint "PK_666c21c4bb1ec216737d441cd07"
            primary key,
    login varchar not null
        constraint "UQ_6c6e1c37b0c29f608a202eff849"
            unique
);

alter table share_holder
    owner to postgres;

create table "order"
(
    id              serial
        constraint "PK_1031171c13130102495201e3e20"
            primary key,
    action          varchar   not null,
    quantity        integer   not null,
    amount          integer   not null,
    date            timestamp not null,
    "purchasePrice" integer   not null,
    "shareHolderId" integer
        constraint "FK_684116363d81e7bb88d99e01b5e"
            references share_holder,
    "shareId"       integer
        constraint "FK_d84f78459d169e1e6755f96c4c0"
            references share
);

alter table "order"
    owner to postgres;

create table holding
(
    id          serial
        constraint "PK_82c37e949073d49d4b73e34a903"
            primary key,
    "shareName" varchar not null,
    quantity    integer not null
);

alter table holding
    owner to postgres;

create table wallet
(
    id              serial
        constraint "PK_bec464dd8d54c39c54fd32e2334"
            primary key,
    "shareHolderId" integer
        constraint "REL_c7603120894a016c895d5f6f2a"
            unique
        constraint "FK_c7603120894a016c895d5f6f2ab"
            references share_holder
);

alter table wallet
    owner to postgres;

create table wallet_holdings_holding
(
    "walletId"  integer not null
        constraint "FK_09b79a57d9b6fcb7054b99adedb"
            references wallet
            on update cascade on delete cascade,
    "holdingId" integer not null
        constraint "FK_590b7937dec110a349499ac9bcc"
            references holding
            on update cascade on delete cascade,
    constraint "PK_08c05b96bb3997a5e5261ba8055"
        primary key ("walletId", "holdingId")
);

alter table wallet_holdings_holding
    owner to postgres;

create index "IDX_09b79a57d9b6fcb7054b99aded"
    on wallet_holdings_holding ("walletId");

create index "IDX_590b7937dec110a349499ac9bc"
    on wallet_holdings_holding ("holdingId");

create table "user"
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

alter table "user"
    owner to postgres;

create table "right"
(
    id       serial
        constraint "PK_77e01b46d514d44ec33fd2d93d3"
            primary key,
    name     varchar not null,
    "userId" integer
        constraint "FK_5312fd220adf29ce4112c9ba27e"
            references "user"
);

alter table "right"
    owner to postgres;

create table user_rights_right
(
    "userId"  integer not null
        constraint "FK_008b69b17f2ce4a6125670c3538"
            references "user"
            on update cascade on delete cascade,
    "rightId" integer not null
        constraint "FK_484b1dd9a3996eb7cc0001d5bc6"
            references "right"
            on update cascade on delete cascade,
    constraint "PK_3e7d3078210355b79c454ab19a0"
        primary key ("userId", "rightId")
);

alter table user_rights_right
    owner to postgres;

create index "IDX_008b69b17f2ce4a6125670c353"
    on user_rights_right ("userId");

create index "IDX_484b1dd9a3996eb7cc0001d5bc"
    on user_rights_right ("rightId");

