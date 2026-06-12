-- ============================================
-- O'Studio Academy — Schéma Supabase
-- Exécute ce SQL dans ton éditeur Supabase SQL
-- ============================================

-- Table principale des inscriptions liste d'attente
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  city TEXT,
  profile TEXT CHECK (profile IN ('photographe', 'createur', 'entrepreneur', 'debutant')),
  learning_goals TEXT[] DEFAULT '{}',
  notes TEXT
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS waitlist_profile_idx ON waitlist(profile);

-- RLS (Row Level Security)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Politique : tout le monde peut insérer (pour le formulaire public)
CREATE POLICY "Anyone can insert into waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- Politique : personne ne peut lire via le client (seulement via API avec service key)
-- L'admin lit via l'API route Next.js avec la clé secrète
CREATE POLICY "No public reads"
  ON waitlist FOR SELECT
  USING (false);
