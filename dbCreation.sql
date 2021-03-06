CREATE TABLE IF NOT EXISTS users (
  user_id   SERIAL PRIMARY KEY,
  email     VARCHAR(40) NOT NULL UNIQUE,
  pass_hash VARCHAR
);
CREATE TABLE IF NOT EXISTS classes (
  class_id   SERIAL PRIMARY KEY,
  class_name VARCHAR(40) NOT NULL
);
CREATE TABLE IF NOT EXISTS assignments (
  assignment_id SERIAL PRIMARY KEY,
  user_id       INTEGER,
  class_id      INTEGER,
  title         VARCHAR(50)  NOT NULL,
  comment       VARCHAR(128),
  duedate       DATE,
  completed     BOOLEAN,
  expected_hours INTEGER,
  FOREIGN KEY (class_id) REFERENCES classes on DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users on DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS takes (
  class_id INTEGER,
  user_id  INTEGER,
  FOREIGN KEY (class_id) REFERENCES classes on DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users on delete CASCADE,
  PRIMARY KEY (user_id, class_id)
);
CREATE TABLE IF NOT EXISTS subtask (
  assignment_id INTEGER,
  task          VARCHAR(100),
  completed     BOOLEAN,
  duedate       DATE,
  expected_hours INTEGER,
  PRIMARY KEY (assignment_id, task),
  FOREIGN KEY (assignment_id) REFERENCES assignments on DELETE CASCADE
);
