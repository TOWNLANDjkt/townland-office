# Townland JKT — Office Manager
Aplikasi manajemen kantor untuk booking Komputer 3D & assignment Assistant.

---

## PANDUAN SETUP (Tidak Perlu Coding!)

### LANGKAH 1 — Buat akun GitHub
1. Buka https://github.com dan klik **Sign up**
2. Isi email, password, username
3. Verifikasi email kamu

---

### LANGKAH 2 — Upload kode ke GitHub
1. Login ke GitHub
2. Klik tombol **+** (pojok kanan atas) → **New repository**
3. Nama repo: `townland-office`
4. Pilih **Public**, lalu klik **Create repository**
5. Upload semua file dari folder ini ke repo tersebut
   - Klik **uploading an existing file**
   - Drag & drop semua file (termasuk folder `pages`, `components`, `lib`, `styles`)
   - Klik **Commit changes**

---

### LANGKAH 3 — Setup Supabase (database gratis)
1. Buka https://supabase.com → **Start your project** → login dengan GitHub
2. Klik **New project**
   - Nama project: `townland-office`
   - Database password: tulis password yang kamu ingat (simpan baik-baik!)
   - Region: **Southeast Asia (Singapore)**
   - Klik **Create new project** (tunggu ~2 menit)
3. Setelah selesai, klik **SQL Editor** di sidebar kiri
4. Copy seluruh isi file `supabase-schema.sql` → paste di SQL Editor → klik **Run**
5. **Edit nama assistant** di bagian bawah file SQL sesuai nama asli di kantor kamu sebelum dijalankan

#### Ambil API Keys Supabase:
1. Klik **Settings** (ikon gear) di sidebar → **API**
2. Copy dua nilai ini:
   - **Project URL** → contoh: `https://abcxyz123.supabase.co`
   - **anon public** key → string panjang dimulai dengan `eyJ...`

---

### LANGKAH 4 — Upload logo
1. Rename file logo kamu menjadi `logo.png`
2. Upload ke folder `public/` di GitHub repository kamu

---

### LANGKAH 5 — Deploy ke Vercel (hosting gratis)
1. Buka https://vercel.com → **Sign Up** → login dengan GitHub
2. Klik **Add New → Project**
3. Pilih repository `townland-office` → klik **Import**
4. Di bagian **Environment Variables**, tambahkan:
   - Key: `NEXT_PUBLIC_SUPABASE_URL` → Value: (paste Project URL dari langkah 3)
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: (paste anon key dari langkah 3)
5. Klik **Deploy** — tunggu ~2 menit
6. Selesai! Kamu dapat link seperti `townland-office.vercel.app`

---

## CARA PAKAI APLIKASI

### Menambah booking Komputer 3D:
1. Buka halaman **Komputer 3D**
2. Klik tanggal di kalender ATAU klik tombol **+ Booking Baru**
3. Isi kode PM, nama project, tanggal, estimasi selesai
4. Klik **Simpan**

### Menambah assistant assignment:
1. Buka halaman **Assistant**
2. Klik tanggal di kalender ATAU klik tombol **+ Assign Assistant**
3. Pilih nama assistant, isi kode PM, project, tanggal mulai & selesai
4. Klik **Simpan**

### Menambah/edit nama assistant:
- Buka Supabase → **Table Editor** → tabel `assistants`
- Klik **Insert row** untuk tambah, atau edit langsung di tabel

---

## PERTANYAAN UMUM

**Q: Bisa diakses dari HP?**
A: Ya, bisa dibuka dari browser HP.

**Q: Bagaimana kalau mau tambah nama assistant baru?**
A: Buka Supabase → Table Editor → assistants → Insert row

**Q: Data aman tidak?**
A: Data tersimpan di Supabase (server Singapore). Selama link tidak disebarkan ke luar kantor, aman.

**Q: Bisa custom domain?**
A: Bisa, lewat Vercel settings (butuh beli domain dulu).
