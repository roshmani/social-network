DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL primary key,
    fname VARCHAR(255) not null,
    lname VARCHAR(255) not null,
    email VARCHAR(255) not null UNIQUE,
    password  VARCHAR(255) not NULL,
    imageurl VARCHAR(500),
    bio VARCHAR(1000)
);

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    status INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(1000) not null
);
