BEGIN;
INSERT INTO users (id, username, password)
VALUES (0, 'marked for deletion', 'change-in-production');
COMMIT;

INSERT INTO users (username, password)
VALUES
('TheLegend27', '$2b$16$kNkLNfR8Sn3BG8RHwc3SxO07/N55ahMBnGJtLxzx3GteoVLJflSQ.'),
('G3tSh3r3kd', '$2b$16$0vbtYJhme0xbnsBcaK3dgOVsbexP9/moZkaXGE17iNbzv4F3cTo0i'),
('someDudeWithNoLife', '$2b$16$gF/ax8LUYnfoDxIP02xNrOIxty4YOgUjw/mCz7pppbNUczZfTRWKG');

INSERT INTO spells (title, description)
VALUES
('big explosion', 'everyone gets dead.'),
('ineffective death ray', 'anyone killed by this thing gets brought back to life.'),
('glove of vengeance', 'If you''re slapped with this item, you must enter a slap battle to the death');
