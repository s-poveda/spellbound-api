TRUNCATE users, spells;

INSERT INTO users (username, password)
VALUES
('TheLegend27', 'testpwd001'),
('G3tSh3r3kd', 'testpwd002'),
('someDudeWithNoLife', 'testpwd003');

INSERT INTO spells (title, description)
VALUES
('big explosion', 'everyone gets dead.'),
('ineffective death ray', 'anyone killed by this thing gets brought back to life.'),
('glove of vengeance', 'If you''re slapped with this item, you must enter a slap battle to the death');
