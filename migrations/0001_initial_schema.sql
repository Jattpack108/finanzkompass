-- Finanzkompass initial schema (matches master_concept_v6 §5.4)

CREATE TABLE IF NOT EXISTS abonnenten (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  angemeldet_am DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'ausstehend',
  token TEXT,
  bestaetigt_am DATETIME,
  quelle TEXT
);
CREATE INDEX IF NOT EXISTS idx_abonnenten_token ON abonnenten(token);
CREATE INDEX IF NOT EXISTS idx_abonnenten_status ON abonnenten(status);

CREATE TABLE IF NOT EXISTS cashback_antraege (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  produkt_name TEXT NOT NULL,
  affiliate_programm TEXT NOT NULL,
  bestaetigungs_id TEXT,
  cashback_betrag REAL,
  paypal_email TEXT,
  status TEXT DEFAULT 'pruefung',
  eingereicht_am DATETIME DEFAULT CURRENT_TIMESTAMP,
  ausgezahlt_am DATETIME
);
CREATE INDEX IF NOT EXISTS idx_cashback_status ON cashback_antraege(status);
CREATE INDEX IF NOT EXISTS idx_cashback_email ON cashback_antraege(email);

CREATE TABLE IF NOT EXISTS affiliate_klicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link_slug TEXT NOT NULL,
  ziel_url TEXT NOT NULL,
  produkt_name TEXT,
  quelle_seite TEXT,
  geklickt_am DATETIME DEFAULT CURRENT_TIMESTAMP,
  land TEXT,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_klicks_produkt ON affiliate_klicks(produkt_name);
CREATE INDEX IF NOT EXISTS idx_klicks_datum ON affiliate_klicks(geklickt_am);

CREATE TABLE IF NOT EXISTS affiliate_programme (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  netzwerk TEXT,
  saeule TEXT,
  provision_typ TEXT,
  provision_wert REAL,
  cashback_aktiv INTEGER DEFAULT 0,
  cashback_betrag REAL,
  cookie_tage INTEGER,
  ppc_erlaubt INTEGER DEFAULT 1,
  status TEXT DEFAULT 'aktiv',
  genehmigt_am DATETIME,
  affiliate_id TEXT
);
