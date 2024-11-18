--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Postgres.app)
-- Dumped by pg_dump version 16.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: item_type; Type: TYPE; Schema: public; Owner: flavien
--

CREATE TYPE public.item_type AS ENUM (
    'Weapon',
    'Armor',
    'Potion',
    'Herb',
    'Bomb',
    'Crafting Material',
    'Scroll',
    'Runestone',
    'Food',
    'Gadget',
    'Miscellaneous'
);


ALTER TYPE public.item_type OWNER TO flavien;

--
-- Name: location_type; Type: TYPE; Schema: public; Owner: flavien
--

CREATE TYPE public.location_type AS ENUM (
    'Kaer Morhen',
    'Novigrad',
    'Velen',
    'Skellige',
    'Toussaint',
    'Nilfgaard',
    'Temeria',
    'Redania',
    'Aedirn',
    'Mahakam',
    'Wyzima',
    'Oxenfurt',
    'Hengfors',
    'Cintra',
    'Rivia',
    'Belhaven'
);


ALTER TYPE public.location_type OWNER TO flavien;

--
-- Name: profession_type; Type: TYPE; Schema: public; Owner: flavien
--

CREATE TYPE public.profession_type AS ENUM (
    'Witcher',
    'Sorceress',
    'Sorcerer',
    'Alchemist',
    'Blacksmith',
    'Merchant',
    'Bard',
    'Hunter',
    'Guard',
    'Soldier',
    'Thief',
    'Assassin',
    'Healer',
    'Noble',
    'Innkeeper',
    'Tavern Keeper',
    'Scout',
    'Spy',
    'Priest',
    'Priestess'
);


ALTER TYPE public.profession_type OWNER TO flavien;

--
-- Name: race_type; Type: TYPE; Schema: public; Owner: flavien
--

CREATE TYPE public.race_type AS ENUM (
    'Human',
    'Elf',
    'Dwarf',
    'Halfling',
    'Monster'
);


ALTER TYPE public.race_type OWNER TO flavien;

--
-- Name: rarity_type; Type: TYPE; Schema: public; Owner: flavien
--

CREATE TYPE public.rarity_type AS ENUM (
    'Common',
    'Uncommon',
    'Rare',
    'Very Rare',
    'Epic',
    'Legendary'
);


ALTER TYPE public.rarity_type OWNER TO flavien;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: flavien
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.carts OWNER TO flavien;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: flavien
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO flavien;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flavien
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: carts_items; Type: TABLE; Schema: public; Owner: flavien
--

CREATE TABLE public.carts_items (
    id integer NOT NULL,
    cart_id integer,
    item_id integer,
    quantity integer NOT NULL,
    CONSTRAINT carts_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.carts_items OWNER TO flavien;

--
-- Name: carts_items_id_seq; Type: SEQUENCE; Schema: public; Owner: flavien
--

CREATE SEQUENCE public.carts_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_items_id_seq OWNER TO flavien;

--
-- Name: carts_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flavien
--

ALTER SEQUENCE public.carts_items_id_seq OWNED BY public.carts_items.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: flavien
--

CREATE TABLE public.items (
    id integer NOT NULL,
    name text NOT NULL,
    type public.item_type NOT NULL,
    rarity public.rarity_type NOT NULL,
    price money NOT NULL,
    description text
);


ALTER TABLE public.items OWNER TO flavien;

--
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: flavien
--

CREATE SEQUENCE public.item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_id_seq OWNER TO flavien;

--
-- Name: item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flavien
--

ALTER SEQUENCE public.item_id_seq OWNED BY public.items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: flavien
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_price money NOT NULL,
    created_at timestamp with time zone NOT NULL,
    nickname text
);


ALTER TABLE public.orders OWNER TO flavien;

--
-- Name: order_id_seq; Type: SEQUENCE; Schema: public; Owner: flavien
--

CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_id_seq OWNER TO flavien;

--
-- Name: order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flavien
--

ALTER SEQUENCE public.order_id_seq OWNED BY public.orders.id;


--
-- Name: orders_items; Type: TABLE; Schema: public; Owner: flavien
--

CREATE TABLE public.orders_items (
    id integer NOT NULL,
    order_id integer,
    item_id integer,
    quantity integer NOT NULL
);


ALTER TABLE public.orders_items OWNER TO flavien;

--
-- Name: orders_items_id_seq; Type: SEQUENCE; Schema: public; Owner: flavien
--

CREATE SEQUENCE public.orders_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_items_id_seq OWNER TO flavien;

--
-- Name: orders_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flavien
--

ALTER SEQUENCE public.orders_items_id_seq OWNED BY public.orders_items.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: flavien
--

CREATE TABLE public.session (
    sid character varying(255) NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO flavien;

--
-- Name: users; Type: TABLE; Schema: public; Owner: flavien
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    hashed_pw text NOT NULL,
    role text
);


ALTER TABLE public.users OWNER TO flavien;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: flavien
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO flavien;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flavien
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_items; Type: TABLE; Schema: public; Owner: flavien
--

CREATE TABLE public.users_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.users_items OWNER TO flavien;

--
-- Name: users_items_id_seq; Type: SEQUENCE; Schema: public; Owner: flavien
--

CREATE SEQUENCE public.users_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_items_id_seq OWNER TO flavien;

--
-- Name: users_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flavien
--

ALTER SEQUENCE public.users_items_id_seq OWNED BY public.users_items.id;


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: carts_items id; Type: DEFAULT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.carts_items ALTER COLUMN id SET DEFAULT nextval('public.carts_items_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.item_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);


--
-- Name: orders_items id; Type: DEFAULT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.orders_items ALTER COLUMN id SET DEFAULT nextval('public.orders_items_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_items id; Type: DEFAULT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.users_items ALTER COLUMN id SET DEFAULT nextval('public.users_items_id_seq'::regclass);


--
-- Name: carts_items carts_items_pkey; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.carts_items
    ADD CONSTRAINT carts_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: items item_name_key; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT item_name_key UNIQUE (name);


--
-- Name: items item_pkey; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: orders order_pkey; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: orders_items orders_items_pkey; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: users_items users_items_pkey; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.users_items
    ADD CONSTRAINT users_items_pkey PRIMARY KEY (id);


--
-- Name: users_items users_items_user_id_item_id_key; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.users_items
    ADD CONSTRAINT users_items_user_id_item_id_key UNIQUE (user_id, item_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: carts_items carts_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.carts_items
    ADD CONSTRAINT carts_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: carts_items carts_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.carts_items
    ADD CONSTRAINT carts_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orders order_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_user_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orders_items orders_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: orders_items orders_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: users_items users_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.users_items
    ADD CONSTRAINT users_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE;


--
-- Name: users_items users_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flavien
--

ALTER TABLE ONLY public.users_items
    ADD CONSTRAINT users_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
