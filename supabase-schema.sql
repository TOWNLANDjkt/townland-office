-- ============================================================
-- TOWNLAND JKT - OFFICE MANAGER
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================================

-- Tabel: daftar assistant
CREATE TABLE assistants (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('Landscape', 'Urban Design')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel: booking komputer 3D
CREATE TABLE komputer_bookings (
  id SERIAL PRIMARY KEY,
  kode_pm TEXT NOT NULL,
  nama_project TEXT,
  tanggal DATE NOT NULL,
  estimasi_selesai TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel: assignment assistant ke PM/project
CREATE TABLE assistant_assignments (
  id SERIAL PRIMARY KEY,
  assistant_id INTEGER REFERENCES assistants(id) ON DELETE CASCADE,
  kode_pm TEXT NOT NULL,
  nama_project TEXT,
  tanggal DATE NOT NULL,
  tanggal_selesai DATE,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DATA AWAL: isi nama assistant kamu di bawah ini
-- (edit sesuai nama asli di kantor)
-- ============================================================
INSERT INTO assistants (nama, tipe) VALUES
  ('Lina', 'Landscape'),
  ('Rudi', 'Urban Design'),
  ('Dian', 'Landscape');

-- Aktifkan akses publik (karena tidak pakai login)
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE komputer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all" ON assistants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON komputer_bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON assistant_assignments FOR ALL USING (true) WITH CHECK (true);
