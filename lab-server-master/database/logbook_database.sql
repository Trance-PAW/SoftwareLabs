CREATE TABLE classes(
	group_id	     TEXT NOT NULL,
	day                  TINYINT NOT NULL,
	start_hour           TINYINT NOT NULL,
	end_hour             TINYINT NULL,
	classroom            TEXT NULL,
	subject_id           TEXT NOT NULL
);

ALTER TABLE classes
ADD PRIMARY KEY (group_id(10), subject_id(10), day, start_hour);

CREATE TABLE enrollments
(
	student_id           INTEGER NOT NULL,
	group_id             TEXT NOT NULL,
	subject_id           TEXT NOT NULL
);

ALTER TABLE enrollments
ADD PRIMARY KEY (student_id, group_id(10), subject_id(10));

CREATE TABLE c_groups
(
	group_id             TEXT NOT NULL,
	subject_id           TEXT NOT NULL,
	professor_id         INTEGER NOT NULL
);

ALTER TABLE c_groups
ADD PRIMARY KEY (group_id(10), subject_id(10));

CREATE TABLE professors
(
	professor_id         INTEGER NOT NULL,
	name                 TEXT NOT NULL
);

ALTER TABLE professors
ADD PRIMARY KEY (professor_id);

CREATE TABLE students
(
	student_id           INTEGER NOT NULL,
	program_id           TEXT NOT NULL,
	status               TINYINT NOT NULL,
	name                 TEXT NOT NULL
);

ALTER TABLE students
ADD PRIMARY KEY (student_id, program_id(10));

CREATE TABLE subjects
(
	subject_id           TEXT NOT NULL,
	modality             INTEGER NOT NULL,
	name                 TEXT NOT NULL
);

ALTER TABLE subjects
ADD PRIMARY KEY (subject_id(10));

--ALTER TABLE classes
--ADD FOREIGN KEY R_11 (group_id(10), subject_id(10)) REFERENCES c_groups (group_id, subject_id);

ALTER TABLE enrollments
ADD FOREIGN KEY R_12 (student_id) REFERENCES students (student_id);

--ALTER TABLE enrollments
--ADD FOREIGN KEY R_13 (group_id, subject_id) REFERENCES c_groups (group_id, subject_id);

--ALTER TABLE c_groups
--ADD FOREIGN KEY R_9 (subject_id) REFERENCES subjects (subject_id);

ALTER TABLE c_groups
ADD FOREIGN KEY R_10 (professor_id) REFERENCES professors (professor_id);

CREATE TABLE users (
	user_id     INTEGER AUTO_INCREMENT,
	email       TEXT NOT NULL,
	name        TEXT NOT NULL,
	role        TEXT NOT NULL,
	password    TEXT NOT NULL,
	PRIMARY KEY (user_id)
);

ALTER TABLE users
ADD CONSTRAINT R_email_unique UNIQUE (email(10));

CREATE TABLE records (
	student_id  INTEGER NOT NULL,
	classroom   TEXT NULL,
	group_id    TEXT NOT NULL,
	subject_id  TEXT NOT NULL,
	date        BIGINT(15) NOT NULL
);

CREATE TABLE employee_records (
	employee_id  INTEGER NOT NULL,
	classroom   TEXT NULL,
	group_id    TEXT NOT NULL,
	subject_id  TEXT NOT NULL,
	date        BIGINT(15) NOT NULL
);

CREATE TABLE programs (
	program_id TEXT NOT NULL
);

CREATE TABLE classrooms (
	classroom    TEXT,
	PRIMARY KEY (classroom(10))
);

CREATE TABLE lab_admins (
	user_id    INTEGER,
	classroom  TEXT NOT NULL,
	PRIMARY KEY (user_id, classroom(10))
);

CREATE TABLE config (
	_key TEXT,
	_value TEXT,
	PRIMARY KEY (_key(15))
);