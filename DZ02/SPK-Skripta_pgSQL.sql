CREATE TYPE "KvarStatusEnum" AS ENUM (
  'Prijavljen',
  'U_Analizi',
  'U_Obradi',
  'Ceka_se_dio',
  'Zahtijeva_Dodatne_Informacije',
  'Riješen',
  'Zatvoren',
  'Odbijen'
);

CREATE TYPE "ZadatakStatusEnum" AS ENUM (
  'Dodijeljen',
  'U_Tijeku',
  'Ceka_Odobrenje',
  'Pauziran',
  'Zavrsen',
  'Provjerava_se',
  'Zatvoren'
);

CREATE TYPE "KorisnikUlogaEnum" AS ENUM (
  'Narucitelj',
  'Admin',
  'Majstor'
);

CREATE TYPE "MajstorSpecijalizacijaEnum" AS ENUM (
  'Električar',
  'Vodoinstalater',
  'IT_Podrška',
  'Strojar',
  'Građevinar',
  'Hladnjačar',
  'Telekomunikacije',
  'Automobilski_Tehničar'
);

CREATE TABLE "KategorijaKvara" (
  "ID" integer PRIMARY KEY,
  "Naziv" varchar,
  "Opis" text
);

CREATE TABLE "Kvar" (
  "ID" integer PRIMARY KEY,
  "KategorijaID" integer,
  "NaruciteljID" integer,
  "Naslov" varchar,
  "Opis" text,
  "DatumPrijave" timestamp,
  "Status" KvarStatusEnum
);

CREATE TABLE "PostupakOtklanjanja" (
  "ID" integer PRIMARY KEY,
  "KvarID" integer,
  "Opis" text,
  "DatumUnosa" timestamp
);

CREATE TABLE "Zadatak" (
  "ID" integer PRIMARY KEY,
  "KvarID" integer,
  "MajstorID" integer,
  "AdminID" integer,
  "DatumPrijave" timestamp,
  "Opis" text,
  "Rok" date,
  "Status" ZadatakStatusEnum
);

CREATE TABLE "Korisnik" (
  "ID" integer PRIMARY KEY,
  "Ime" varchar,
  "Prezime" varchar,
  "Email" varchar,
  "Lozinka" varchar,
  "Uloga" KorisnikUlogaEnum,
  "DatumKreiranja" timestamp
);

CREATE TABLE "Narucitelj" (
  "KorisnikID" integer PRIMARY KEY,
  "DodatniPodaci" text
);

CREATE TABLE "Admin" (
  "KorisnikID" integer PRIMARY KEY,
  "SpecijalneOvlasti" text
);

CREATE TABLE "Majstor" (
  "KorisnikID" integer PRIMARY KEY,
  "Specijalizacija" MajstorSpecijalizacijaEnum,
  "Dostupnost" bool
);

ALTER TABLE "Kvar" ADD FOREIGN KEY ("KategorijaID") REFERENCES "KategorijaKvara" ("ID");

ALTER TABLE "PostupakOtklanjanja" ADD FOREIGN KEY ("KvarID") REFERENCES "Kvar" ("ID");

ALTER TABLE "Zadatak" ADD FOREIGN KEY ("KvarID") REFERENCES "Kvar" ("ID");

ALTER TABLE "Kvar" ADD FOREIGN KEY ("NaruciteljID") REFERENCES "Korisnik" ("ID");

ALTER TABLE "Zadatak" ADD FOREIGN KEY ("AdminID") REFERENCES "Korisnik" ("ID");

ALTER TABLE "Zadatak" ADD FOREIGN KEY ("MajstorID") REFERENCES "Korisnik" ("ID");

ALTER TABLE "Narucitelj" ADD FOREIGN KEY ("KorisnikID") REFERENCES "Korisnik" ("ID");

ALTER TABLE "Admin" ADD FOREIGN KEY ("KorisnikID") REFERENCES "Korisnik" ("ID");

ALTER TABLE "Majstor" ADD FOREIGN KEY ("KorisnikID") REFERENCES "Korisnik" ("ID");


-- Inserting sample data into KategorijaKvara
INSERT INTO "KategorijaKvara" ("ID", "Naziv", "Opis") VALUES
(1, 'Električni kvar', 'Problemi s električnim instalacijama'),
(2, 'Vodoinstalacije', 'Kvarovi na vodovodnim cijevima i pripadajućim instalacijama');

-- Inserting sample data into Kvar
INSERT INTO "Kvar" ("ID", "KategorijaID", "NaruciteljID", "Naslov", "Opis", "DatumPrijave", "Status") VALUES
(1, 1, 1, 'Ne radi svjetlo u hodniku', 'Svjetlo u hodniku prestalo raditi, moguć problem s prekidačem.', CURRENT_TIMESTAMP, 'Prijavljen'),
(2, 2, 2, 'Curenje vode u kuhinji', 'Iz slavine u kuhinji stalno curi voda.', CURRENT_TIMESTAMP, 'U_Analizi');

-- Inserting sample data into PostupakOtklanjanja
INSERT INTO "PostupakOtklanjanja" ("ID", "KvarID", "Opis", "DatumUnosa") VALUES
(1, 1, 'Provjeriti električne instalacije i prekidač.', CURRENT_TIMESTAMP);

-- Inserting sample data into Zadatak
INSERT INTO "Zadatak" ("ID", "KvarID", "MajstorID", "AdminID", "DatumPrijave", "Opis", "Rok", "Status") VALUES
(1, 1, 1, 1, CURRENT_TIMESTAMP, 'Zamjena oštećenog prekidača.', CURRENT_DATE + INTERVAL '7 days', 'Dodijeljen');

-- Inserting sample data into Korisnik
INSERT INTO "Korisnik" ("ID", "Ime", "Prezime", "Email", "Lozinka", "Uloga", "DatumKreiranja") VALUES
(1, 'Ivan', 'Ivić', 'ivan.ivic@email.com', 'ivansPassword', 'Narucitelj', CURRENT_TIMESTAMP),
(2, 'Ana', 'Anić', 'ana.anic@email.com', 'anasPassword', 'Admin', CURRENT_TIMESTAMP);

-- Inserting sample data into Narucitelj
INSERT INTO "Narucitelj" ("KorisnikID", "DodatniPodaci") VALUES
(1, 'Adresa: Ivana Gorana Kovačića 5, Zagreb');

-- Inserting sample data into Admin
INSERT INTO "Admin" ("KorisnikID", "SpecijalneOvlasti") VALUES
(2, 'Može mijenjati statuse zadataka i kvarova');

-- Inserting sample data into Majstor
INSERT INTO "Majstor" ("KorisnikID", "Specijalizacija", "Dostupnost") VALUES
(3, 'Električar', TRUE);

-- Example of adding another Majstor
INSERT INTO "Korisnik" ("ID", "Ime", "Prezime", "Email", "Lozinka", "Uloga", "DatumKreiranja") VALUES
(3, 'Marko', 'Markić', 'marko.maric@email.com', 'markosPassword', 'Majstor', CURRENT_TIMESTAMP);

-- Adding Majstor detail for the newly added Korisnik
INSERT INTO "Majstor" ("KorisnikID", "Specijalizacija", "Dostupnost") VALUES
(3, 'Električar', TRUE);
