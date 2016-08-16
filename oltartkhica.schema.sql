CREATE TABLE fontinfo (id INTEGER PRIMARY KEY AUTOINCREMENT, unit STRING, contents TEXT);
CREATE TABLE glyphs (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, code INTEGER, unicode INTEGER, width INTEGER, glyphclass INTEGER, flags STRING, hstem STRING, vstem STRING, splineset TEXT, refer STRING, lookupname STRING, checked BOOLEAN);
