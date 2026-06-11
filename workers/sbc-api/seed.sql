DELETE FROM votes;
DELETE FROM activity;
DELETE FROM people;

INSERT INTO people (id, name, photo_url, tier, pending_up, pending_down) VALUES
  ('vineeth', 'Vineeth', '/sbc/assets/photos/vineeth.PNG', 'S', 0, 0),
  ('sophia-q', 'Sophia Q', '/sbc/assets/photos/sophia%20q.PNG', 'S', 0, 0),
  ('aman', 'Aman', '/sbc/assets/photos/aman.PNG', 'S', 0, 0),
  ('tarak', 'Tarak', '/sbc/assets/photos/tarak.PNG', 'S', 0, 0),
  ('nayan', 'Nayan', '/sbc/assets/photos/nayan.PNG', 'S', 0, 0),
  ('ryan', 'Ryan', '/sbc/assets/photos/ryan.PNG', 'A', 0, 0),
  ('mirzett', 'Mirzett', '/sbc/assets/photos/mirzett.PNG', 'B', 0, 0),
  ('jackie', 'Jackie', '/sbc/assets/photos/jackie.PNG', 'B', 0, 0),
  ('muadh', 'Muadh', '/sbc/assets/photos/muadh.JPG', 'C', 0, 0),
  ('logan', 'Logan', '/sbc/assets/photos/logan.PNG', 'D', 0, 0),
  ('sophia-m', 'Sophia M', '/sbc/assets/photos/sophia%20m.JPG', 'F', 0, 0);
