-- Create table for categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create table for locations
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(id),
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
    rating INT CHECK (rating BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, location_id)
);

-- Create table for favorites with composite primary key
CREATE TABLE favorites (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, location_id)
);
