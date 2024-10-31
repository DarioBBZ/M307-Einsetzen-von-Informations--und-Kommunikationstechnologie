-- Insert tags
INSERT INTO tags (name) VALUES 
    ('Restaurant'),
    ('Bar'),
    ('Cafe');


-- Insert users
-- The password "$2a$10$jEIoOCwwgIkBGq1Z8Iq9SOKo10lPW1UVhvnhdcX4i.tkdPAvKbALe" 
-- is the bcrypt hash of "1234" with 10 rounds of encryption
INSERT INTO users (name, password) VALUES 
    ('Lukas', '$2a$10$jEIoOCwwgIkBGq1Z8Iq9SOKo10lPW1UVhvnhdcX4i.tkdPAvKbALe'),
    ('Dario', '$2a$10$jEIoOCwwgIkBGq1Z8Iq9SOKo10lPW1UVhvnhdcX4i.tkdPAvKbALe'),
    ('Chiara', '$2a$10$jEIoOCwwgIkBGq1Z8Iq9SOKo10lPW1UVhvnhdcX4i.tkdPAvKbALe');

-- Insert locations
INSERT INTO locations (name, tag_id, street, house_number, zip_code, place, country) VALUES 
    ('Restaurant Kornhauskeller', 1, 'Kornhausplatz', 18, 3011, 'Bern', 'Switzerland'),
    ('Altes Tramdepot Brauerei Restaurant', 1, 'Grosser Muristalden', 6, 3006, 'Bern', 'Switzerland'),
    ('Rosengarten Restaurant', 1, 'Alter Aargauerstalden', 31, 3006, 'Bern', 'Switzerland'),
    ('Della Casa', 1, 'Schauplatzgasse', 16, 3011, 'Bern', 'Switzerland'),
    ('Restaurant Harmonie', 1, 'Gerechtigkeitsgasse', 72, 3011, 'Bern', 'Switzerland'),
    ('Adriano''s Bar & Café', 2, 'Theaterplatz', 2, 3011, 'Bern', 'Switzerland'),
    ('Volver Bar Tapas Café', 2, 'Schauplatzgasse', 22, 3011, 'Bern', 'Switzerland'),
    ('Propeller Bar', 2, 'Militärstrasse', 64, 3014, 'Bern', 'Switzerland'),
    ('Cafe Fédéral', 3, 'Bundesplatz', 2, 3011, 'Bern', 'Switzerland'),
    ('Einstein Café & bel étage', 3, 'Kramgasse', 49, 3011, 'Bern', 'Switzerland');

-- Insert reviews
-- Kornhauskeller: 3 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (1, 1, 'Fantastisches Ambiente und tolle Gerichte. Die Atmosphäre ist einzigartig.', 5),
    (2, 1, 'Sehr freundliches Personal, aber die Preise sind etwas hoch.', 4),
    (3, 1, 'Das Essen war gut, aber die Wartezeiten waren lang.', 3);

-- Altes Tramdepot: 3 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (2, 2, 'Schönes Lokal mit einer tollen Aussicht auf die Stadt.', 4),
    (3, 2, 'Die Biere sind hervorragend, aber das Essen war nur durchschnittlich.', 3),
    (1, 2, 'Super Lage und gute Stimmung, aber sehr überlaufen.', 4);

-- Rosengarten Restaurant: 3 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (2, 3, 'Das Essen war grossartig und die Aussicht atemberaubend!', 5),
    (3, 3, 'Sehr teures Restaurant, aber das Essen ist es wert.', 4),
    (1, 3, 'Romantische Atmosphäre und hervorragender Service.', 5);

-- Della Casa: 2 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (1, 4, 'Sehr authentisch und das Essen war fantastisch.', 5),
    (3, 4, 'Perfekt für einen entspannten Abend in der Stadt.', 5);

-- Restaurant Harmonie: 3 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (1, 5, 'Super Atmosphäre und nette Bedienung.', 4),
    (2, 5, 'Das Cordon Bleu ist ein absolutes Highlight!', 5),
    (3, 5, 'Sehr gutes Preis-Leistungs-Verhältnis.', 4);

-- Adriano's Bar & Café: 2 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (1, 6, 'Entspannte Atmosphäre, perfekte Lage für einen Kaffee in der Stadt.', 4),
    (2, 6, 'Guter Kaffee und freundliches Personal.', 5);

-- Volver Bar Tapas Café: 1 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (3, 7, 'Die Cocktails sind fantastisch und die Tapas sind lecker.', 4);

-- Propeller Bar: 3 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (1, 8, 'Coole Bar mit chilliger Musik.', 4),
    (2, 8, 'Die Atmosphäre ist grossartig, aber es ist oft sehr voll.', 3),
    (3, 8, 'Perfekt für einen entspannten Drink mit Freunden.', 4);

-- Cafe Fédéral: 2 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (1, 9, 'Guter Kaffee und eine schöne Aussicht auf den Bundesplatz.', 4),
    (3, 9, 'Gemütlich und ein toller Ort für ein Frühstück.', 4);

-- Einstein Café & bel étage: 3 reviews
INSERT INTO reviews (user_id, location_id, comment, stars) VALUES 
    (2, 10, 'Sehr charmantes Café im Herzen der Altstadt.', 5),
    (3, 10, 'Die Aussicht vom Café ist traumhaft.', 4),
    (1, 10, 'Super Service und leckere Desserts.', 5);
