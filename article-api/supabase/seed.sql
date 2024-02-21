SET session_replication_role = replica;\n
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.5 (Ubuntu 15.5-1.pgdg20.04+1)

--
-- Data for Name: public_todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."public_todos" ("id", "created_at", "title", "completed") VALUES
	('2cf67c97-2aca-43fc-868c-1dba7cfda281', '2024-02-08 22:00:18.149172+00', 'Learn React', false),
	('0d749c5d-3226-4ea1-a535-72b405064a10', '2024-02-08 22:00:42.889071+00', 'Learn Redux', false),
	('59d5c934-a623-4856-a893-a22a5e764b47', '2024-02-08 22:00:57.299045+00', 'Learn React Router', false),
	('73bd1564-d434-4d9c-aaad-bd2c3a53a6af', '2024-02-08 22:01:19.700173+00', 'Cooking Lunch', true);


