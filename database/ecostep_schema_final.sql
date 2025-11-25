-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.daily_chal_data (
  record_id text NOT NULL,
  chal_id text,
  user_id character varying,
  is_completed boolean DEFAULT false,
  total_completed integer DEFAULT 0,
  created_at date DEFAULT CURRENT_DATE,
  content text,
  CONSTRAINT daily_chal_data_pkey PRIMARY KEY (record_id),
  CONSTRAINT daily_chal_data_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_info(user_id),
  CONSTRAINT daily_chal_data_chal_id_fkey FOREIGN KEY (chal_id) REFERENCES public.daily_chal_list(chal_id)
);
CREATE TABLE public.daily_chal_list (
  chal_id text NOT NULL,
  chal_name text NOT NULL,
  about_plastic boolean DEFAULT false,
  is_basic boolean DEFAULT true,
  user_id text,
  CONSTRAINT daily_chal_list_pkey PRIMARY KEY (chal_id),
  CONSTRAINT daily_chal_list_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_info(user_id)
);
CREATE TABLE public.daily_chal_record (
  id bigint NOT NULL DEFAULT nextval('daily_chal_record_id_seq'::regclass),
  user_id text NOT NULL,
  challenge_date date NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT daily_chal_record_pkey PRIMARY KEY (id),
  CONSTRAINT daily_chal_record_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_info(user_id)
);
CREATE TABLE public.places (
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  name text NOT NULL,
  category text,
  description text,
  CONSTRAINT places_pkey PRIMARY KEY (latitude, longitude)
);
CREATE TABLE public.store (
  item_id text NOT NULL,
  category USER-DEFINED,
  price integer NOT NULL,
  rank USER-DEFINED NOT NULL DEFAULT 'Bronze'::"Rank",
  item_name text,
  CONSTRAINT store_pkey PRIMARY KEY (item_id)
);
CREATE TABLE public.user_friend (
  user_id character varying NOT NULL,
  friend_id character varying NOT NULL,
  accepted_at date,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'blocked'::character varying]::text[])),
  CONSTRAINT user_friend_pkey PRIMARY KEY (user_id, friend_id),
  CONSTRAINT user_friend_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_info(user_id),
  CONSTRAINT user_friend_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.user_info(user_id)
);
CREATE TABLE public.user_info (
  user_id text NOT NULL,
  name text NOT NULL,
  user_f_id text,
  phone_num text,
  email text NOT NULL UNIQUE,
  created_at date DEFAULT CURRENT_DATE,
  point_current integer DEFAULT 0,
  points_total integer DEFAULT 0,
  rank character varying DEFAULT 'bronze'::character varying CHECK (rank::text = ANY (ARRAY['bronze'::character varying, 'silver'::character varying, 'gold'::character varying, 'platinum'::character varying]::text[])),
  amount integer DEFAULT 0,
  birthdate date,
  profile_image_url text,
  consecutive_days integer,
  water_quality bigint DEFAULT '0'::bigint,
  CONSTRAINT user_info_pkey PRIMARY KEY (user_id)
);
CREATE TABLE public.user_item (
  item_id text NOT NULL,
  user_id text NOT NULL,
  ordered_at date DEFAULT CURRENT_DATE,
  CONSTRAINT user_item_pkey PRIMARY KEY (item_id, user_id),
  CONSTRAINT user_item_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_info(user_id),
  CONSTRAINT user_item_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.store(item_id)
);
CREATE TABLE public.zero_chal_data (
  record_id text NOT NULL,
  item_id text,
  user_id text,
  item_num integer DEFAULT 1,
  created_at date DEFAULT CURRENT_DATE,
  tracked_date date DEFAULT CURRENT_DATE,
  quantity double precision DEFAULT 1,
  weight integer DEFAULT 0,
  item_name text,
  CONSTRAINT zero_chal_data_pkey PRIMARY KEY (record_id),
  CONSTRAINT zero_chal_data_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.zero_chal_item(item_id),
  CONSTRAINT zero_chal_data_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_info(user_id)
);
CREATE TABLE public.zero_chal_item (
  item_id text NOT NULL,
  item_name text NOT NULL,
  tag text,
  plastic_amount integer NOT NULL,
  user_id text,
  CONSTRAINT zero_chal_item_pkey PRIMARY KEY (item_id),
  CONSTRAINT zero_chal_item_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_info(user_id)
);