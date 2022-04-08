-- Orders UP
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15) DEFAULT 'open',
    user_id bigint REFERENCES users(id) NOT NULL
);
