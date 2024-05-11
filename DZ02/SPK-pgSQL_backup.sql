PGDMP         1                |           dz2    15.3    15.2 )    G           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            H           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            I           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            J           1262    51402    dz2    DATABASE     e   CREATE DATABASE dz2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE dz2;
                postgres    false            R           1247    51692    KorisnikUlogaEnum    TYPE     a   CREATE TYPE public."KorisnikUlogaEnum" AS ENUM (
    'Narucitelj',
    'Admin',
    'Majstor'
);
 &   DROP TYPE public."KorisnikUlogaEnum";
       public          postgres    false            L           1247    51659    KvarStatusEnum    TYPE     �   CREATE TYPE public."KvarStatusEnum" AS ENUM (
    'Prijavljen',
    'U_Analizi',
    'U_Obradi',
    'Ceka_se_dio',
    'Zahtijeva_Dodatne_Informacije',
    'Riješen',
    'Zatvoren',
    'Odbijen'
);
 #   DROP TYPE public."KvarStatusEnum";
       public          postgres    false            U           1247    51700    MajstorSpecijalizacijaEnum    TYPE     �   CREATE TYPE public."MajstorSpecijalizacijaEnum" AS ENUM (
    'Električar',
    'Vodoinstalater',
    'IT_Podrška',
    'Strojar',
    'Građevinar',
    'Hladnjačar',
    'Telekomunikacije',
    'Automobilski_Tehničar'
);
 /   DROP TYPE public."MajstorSpecijalizacijaEnum";
       public          postgres    false            O           1247    51676    ZadatakStatusEnum    TYPE     �   CREATE TYPE public."ZadatakStatusEnum" AS ENUM (
    'Dodijeljen',
    'U_Tijeku',
    'Ceka_Odobrenje',
    'Pauziran',
    'Zavrsen',
    'Provjerava_se',
    'Zatvoren'
);
 &   DROP TYPE public."ZadatakStatusEnum";
       public          postgres    false            �            1259    51759    Admin    TABLE     a   CREATE TABLE public."Admin" (
    "KorisnikID" integer NOT NULL,
    "SpecijalneOvlasti" text
);
    DROP TABLE public."Admin";
       public         heap    postgres    false            �            1259    51717    KategorijaKvara    TABLE     u   CREATE TABLE public."KategorijaKvara" (
    "ID" integer NOT NULL,
    "Naziv" character varying,
    "Opis" text
);
 %   DROP TABLE public."KategorijaKvara";
       public         heap    postgres    false            �            1259    51745    Korisnik    TABLE       CREATE TABLE public."Korisnik" (
    "ID" integer NOT NULL,
    "Ime" character varying,
    "Prezime" character varying,
    "Email" character varying,
    "Lozinka" character varying,
    "Uloga" public."KorisnikUlogaEnum",
    "DatumKreiranja" timestamp without time zone
);
    DROP TABLE public."Korisnik";
       public         heap    postgres    false    850            �            1259    51724    Kvar    TABLE     �   CREATE TABLE public."Kvar" (
    "ID" integer NOT NULL,
    "KategorijaID" integer,
    "NaruciteljID" integer,
    "Naslov" character varying,
    "Opis" text,
    "DatumPrijave" timestamp without time zone,
    "Status" public."KvarStatusEnum"
);
    DROP TABLE public."Kvar";
       public         heap    postgres    false    844            �            1259    51766    Majstor    TABLE     �   CREATE TABLE public."Majstor" (
    "KorisnikID" integer NOT NULL,
    "Specijalizacija" public."MajstorSpecijalizacijaEnum",
    "Dostupnost" boolean
);
    DROP TABLE public."Majstor";
       public         heap    postgres    false    853            �            1259    51752 
   Narucitelj    TABLE     b   CREATE TABLE public."Narucitelj" (
    "KorisnikID" integer NOT NULL,
    "DodatniPodaci" text
);
     DROP TABLE public."Narucitelj";
       public         heap    postgres    false            �            1259    51731    PostupakOtklanjanja    TABLE     �   CREATE TABLE public."PostupakOtklanjanja" (
    "ID" integer NOT NULL,
    "KvarID" integer,
    "Opis" text,
    "DatumUnosa" timestamp without time zone
);
 )   DROP TABLE public."PostupakOtklanjanja";
       public         heap    postgres    false            �            1259    51738    Zadatak    TABLE     �   CREATE TABLE public."Zadatak" (
    "ID" integer NOT NULL,
    "KvarID" integer,
    "MajstorID" integer,
    "AdminID" integer,
    "DatumPrijave" timestamp without time zone,
    "Opis" text,
    "Rok" date,
    "Status" public."ZadatakStatusEnum"
);
    DROP TABLE public."Zadatak";
       public         heap    postgres    false    847            C          0    51759    Admin 
   TABLE DATA           D   COPY public."Admin" ("KorisnikID", "SpecijalneOvlasti") FROM stdin;
    public          postgres    false    220   3       =          0    51717    KategorijaKvara 
   TABLE DATA           B   COPY public."KategorijaKvara" ("ID", "Naziv", "Opis") FROM stdin;
    public          postgres    false    214   e3       A          0    51745    Korisnik 
   TABLE DATA           k   COPY public."Korisnik" ("ID", "Ime", "Prezime", "Email", "Lozinka", "Uloga", "DatumKreiranja") FROM stdin;
    public          postgres    false    218   �3       >          0    51724    Kvar 
   TABLE DATA           r   COPY public."Kvar" ("ID", "KategorijaID", "NaruciteljID", "Naslov", "Opis", "DatumPrijave", "Status") FROM stdin;
    public          postgres    false    215   �4       D          0    51766    Majstor 
   TABLE DATA           R   COPY public."Majstor" ("KorisnikID", "Specijalizacija", "Dostupnost") FROM stdin;
    public          postgres    false    221   Q5       B          0    51752 
   Narucitelj 
   TABLE DATA           E   COPY public."Narucitelj" ("KorisnikID", "DodatniPodaci") FROM stdin;
    public          postgres    false    219   ~5       ?          0    51731    PostupakOtklanjanja 
   TABLE DATA           U   COPY public."PostupakOtklanjanja" ("ID", "KvarID", "Opis", "DatumUnosa") FROM stdin;
    public          postgres    false    216   �5       @          0    51738    Zadatak 
   TABLE DATA           t   COPY public."Zadatak" ("ID", "KvarID", "MajstorID", "AdminID", "DatumPrijave", "Opis", "Rok", "Status") FROM stdin;
    public          postgres    false    217   �5       �           2606    51765    Admin Admin_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("KorisnikID");
 >   ALTER TABLE ONLY public."Admin" DROP CONSTRAINT "Admin_pkey";
       public            postgres    false    220            �           2606    51723 $   KategorijaKvara KategorijaKvara_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."KategorijaKvara"
    ADD CONSTRAINT "KategorijaKvara_pkey" PRIMARY KEY ("ID");
 R   ALTER TABLE ONLY public."KategorijaKvara" DROP CONSTRAINT "KategorijaKvara_pkey";
       public            postgres    false    214            �           2606    51751    Korisnik Korisnik_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Korisnik"
    ADD CONSTRAINT "Korisnik_pkey" PRIMARY KEY ("ID");
 D   ALTER TABLE ONLY public."Korisnik" DROP CONSTRAINT "Korisnik_pkey";
       public            postgres    false    218            �           2606    51730    Kvar Kvar_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Kvar"
    ADD CONSTRAINT "Kvar_pkey" PRIMARY KEY ("ID");
 <   ALTER TABLE ONLY public."Kvar" DROP CONSTRAINT "Kvar_pkey";
       public            postgres    false    215            �           2606    51770    Majstor Majstor_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."Majstor"
    ADD CONSTRAINT "Majstor_pkey" PRIMARY KEY ("KorisnikID");
 B   ALTER TABLE ONLY public."Majstor" DROP CONSTRAINT "Majstor_pkey";
       public            postgres    false    221            �           2606    51758    Narucitelj Narucitelj_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."Narucitelj"
    ADD CONSTRAINT "Narucitelj_pkey" PRIMARY KEY ("KorisnikID");
 H   ALTER TABLE ONLY public."Narucitelj" DROP CONSTRAINT "Narucitelj_pkey";
       public            postgres    false    219            �           2606    51737 ,   PostupakOtklanjanja PostupakOtklanjanja_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."PostupakOtklanjanja"
    ADD CONSTRAINT "PostupakOtklanjanja_pkey" PRIMARY KEY ("ID");
 Z   ALTER TABLE ONLY public."PostupakOtklanjanja" DROP CONSTRAINT "PostupakOtklanjanja_pkey";
       public            postgres    false    216            �           2606    51744    Zadatak Zadatak_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Zadatak"
    ADD CONSTRAINT "Zadatak_pkey" PRIMARY KEY ("ID");
 B   ALTER TABLE ONLY public."Zadatak" DROP CONSTRAINT "Zadatak_pkey";
       public            postgres    false    217            �           2606    51806    Admin Admin_KorisnikID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_KorisnikID_fkey" FOREIGN KEY ("KorisnikID") REFERENCES public."Korisnik"("ID");
 I   ALTER TABLE ONLY public."Admin" DROP CONSTRAINT "Admin_KorisnikID_fkey";
       public          postgres    false    218    220    3487            �           2606    51771    Kvar Kvar_KategorijaID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Kvar"
    ADD CONSTRAINT "Kvar_KategorijaID_fkey" FOREIGN KEY ("KategorijaID") REFERENCES public."KategorijaKvara"("ID");
 I   ALTER TABLE ONLY public."Kvar" DROP CONSTRAINT "Kvar_KategorijaID_fkey";
       public          postgres    false    214    215    3479            �           2606    51786    Kvar Kvar_NaruciteljID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Kvar"
    ADD CONSTRAINT "Kvar_NaruciteljID_fkey" FOREIGN KEY ("NaruciteljID") REFERENCES public."Korisnik"("ID");
 I   ALTER TABLE ONLY public."Kvar" DROP CONSTRAINT "Kvar_NaruciteljID_fkey";
       public          postgres    false    3487    215    218            �           2606    51811    Majstor Majstor_KorisnikID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Majstor"
    ADD CONSTRAINT "Majstor_KorisnikID_fkey" FOREIGN KEY ("KorisnikID") REFERENCES public."Korisnik"("ID");
 M   ALTER TABLE ONLY public."Majstor" DROP CONSTRAINT "Majstor_KorisnikID_fkey";
       public          postgres    false    218    221    3487            �           2606    51801 %   Narucitelj Narucitelj_KorisnikID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Narucitelj"
    ADD CONSTRAINT "Narucitelj_KorisnikID_fkey" FOREIGN KEY ("KorisnikID") REFERENCES public."Korisnik"("ID");
 S   ALTER TABLE ONLY public."Narucitelj" DROP CONSTRAINT "Narucitelj_KorisnikID_fkey";
       public          postgres    false    218    219    3487            �           2606    51776 3   PostupakOtklanjanja PostupakOtklanjanja_KvarID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."PostupakOtklanjanja"
    ADD CONSTRAINT "PostupakOtklanjanja_KvarID_fkey" FOREIGN KEY ("KvarID") REFERENCES public."Kvar"("ID");
 a   ALTER TABLE ONLY public."PostupakOtklanjanja" DROP CONSTRAINT "PostupakOtklanjanja_KvarID_fkey";
       public          postgres    false    3481    216    215            �           2606    51791    Zadatak Zadatak_AdminID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Zadatak"
    ADD CONSTRAINT "Zadatak_AdminID_fkey" FOREIGN KEY ("AdminID") REFERENCES public."Korisnik"("ID");
 J   ALTER TABLE ONLY public."Zadatak" DROP CONSTRAINT "Zadatak_AdminID_fkey";
       public          postgres    false    3487    217    218            �           2606    51781    Zadatak Zadatak_KvarID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Zadatak"
    ADD CONSTRAINT "Zadatak_KvarID_fkey" FOREIGN KEY ("KvarID") REFERENCES public."Kvar"("ID");
 I   ALTER TABLE ONLY public."Zadatak" DROP CONSTRAINT "Zadatak_KvarID_fkey";
       public          postgres    false    3481    217    215            �           2606    51796    Zadatak Zadatak_MajstorID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Zadatak"
    ADD CONSTRAINT "Zadatak_MajstorID_fkey" FOREIGN KEY ("MajstorID") REFERENCES public."Korisnik"("ID");
 L   ALTER TABLE ONLY public."Zadatak" DROP CONSTRAINT "Zadatak_MajstorID_fkey";
       public          postgres    false    218    3487    217            C   :   x�3���?�/U!73+5/+�$S��$���8U�*1%�$1;Q!S!�,�(�,�+F��� ���      =   m   x�e�=@0D���	�p�F��,R,�1A��r+�B��{�T�5�y_��$D��0X�(���9��vX���+Յ)|̨&�!Q<$e��V�Jt��b�|���/����4�      A   �   x�}�M
�0�u�)�@C�Kҟ�� �p�.RI�#x1f5JA73�����M�z2�i|N��{o������6�G��|�"#A��@���(i�ຖX�@٥��L?ib�λ�VVFjNeC ����k��'ﭛ�q���`�EU�Vp� ���U%      >   �   x�}��
�0E��+��҄J��8�� n�D�З���M��������A�v8�{s�^5}�8���v�%���jF�1�:w�k��j��>-5jzc�3Y�2+�L� �uYղ�W�*Ē<i�F�%K��V#D��؆YMl7BoT$�!}�n�S��ߥ�ec����9� ��L�      D      x�3�t�I�.)�<қX�Y����� N�`      B      x������ � �      ?      x������ � �      @      x������ � �     