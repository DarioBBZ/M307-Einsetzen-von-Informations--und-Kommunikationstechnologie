-- Create table for tags
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create table for locations
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tag_id INT REFERENCES tags(id),
    street VARCHAR(255),
    house_number INT,
    zip_code INT,
    place VARCHAR(255),
    country VARCHAR(255)
);

-- Create table for reviews with composite primary key
CREATE TABLE reviews (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    comment TEXT,
    stars INT CHECK (stars BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, location_id)
);

-- Create table for favorites with composite primary key
CREATE TABLE favorites (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, location_id)
);
