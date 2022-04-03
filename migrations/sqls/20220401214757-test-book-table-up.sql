CREATE TABLE IF NOT EXISTS books (
  id serial primary key,
  title varchar(100) not null,
  author varchar(30) not null,
  total_pages integer,
  summary text
);
