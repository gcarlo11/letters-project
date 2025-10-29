"use client"

import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"; // Impor supabase
import { useRouter } from 'next/navigation'; // Impor useRouter

export default function HomePage() {
  const router = useRouter(); // Inisialisasi router
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>(""); // Tambahkan state untuk name
  const [error, setError] = useState<string | null>(null); // Tambahkan state untuk error

  // Fungsi untuk membuat session_id unik (sama seperti di create page)
  const generateSessionId = (name: string): string => {
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${sanitizedName}-${randomSuffix}`;
  };

  // Fungsi createSession (sama seperti di create page)
  const createSession = async () => {
    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError(null);

    const newSessionId = generateSessionId(name);

    try {
      const { data, error: insertError } = await supabase
        .from('sessions')
        .insert({
          name: name.trim(),
          session_id: newSessionId
        })
        .select('session_id')
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          setError("Gagal membuat sesi, ID sesi sudah ada. Coba lagi dengan nama sedikit berbeda.");
        } else {
          throw insertError;
        }
      } else if (data) {
        router.push(`/session/${data.session_id}`);
      } else {
         throw new Error("Gagal membuat sesi, tidak ada data yang dikembalikan.");
      }

    } catch (err: any) {
      console.error("Error creating session:", err);
      setError(err.message || "Gagal membuat halaman sesi.");
      setLoading(false);
    }
    // Tidak perlu setLoading(false) jika sukses karena akan redirect
  };


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="font-caveat text-3xl font-bold text-foreground">lettersforme</div>
        <div className="flex gap-8 items-center">
          {/* Link Navbar tidak perlu diubah */}
           <Link
             href="/create" // Sebaiknya arahkan ke bagian form di bawah, atau hapus jika tidak relevan
             className="text-sm font-normal text-foreground hover:text-muted-foreground transition-all duration-300 ease-out"
           >
             Create
           </Link>
           <Link
             href="#about" // Sesuaikan ID elemen jika perlu
             className="text-sm font-normal text-foreground hover:text-muted-foreground transition-all duration-300 ease-out"
           >
             About
           </Link>
           <Link
             href="#support" // Sesuaikan ID elemen jika perlu
             className="text-sm font-normal text-foreground hover:text-muted-foreground transition-all duration-300 ease-out"
           >
             Support
           </Link>
        </div>
      </nav>

      {/* Hero Section dengan Form */}
      {/* Tambahkan id="create" jika link navbar Create mengarah ke sini */}
      <div id="create" className="flex-1 bg-gradient-to-br bg-white flex items-center justify-center p-8 gap-12 flex-wrap grid-cols-2">
        
        <div className="max-w-lg w-full">
          <div className="text-center">
            <h1 className={`text-5xl text-bold text-gray-800 mb-2 font-caveat`}>Hallo aku tampan sekalsi wiafadfiaof </h1>
            <p className="text-gray-600">Write. Listen. Feel.</p>
          </div>
        </div>

        <div className="max-w-sm w-full">
          <div className="bg-white rounded-3xl border border-black shadow-lg p-8">
            <p className="text-sm font-poppins text-gray-700 mb-6 text-center">
              Create your personal space for anonymous messages with songs that touch the soul.
            </p>

            {/* Tampilkan error jika ada */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Enter recipient's name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && name.trim() && createSession()} // Tambahkan validasi
              className="w-full px-4 py-3 font-poppins text-sm rounded-md border border-black focus:border-purple-400 focus:outline-none mb-4 bg-secondary text-foreground placeholder:text-muted-foreground" // Sesuaikan styling
              disabled={loading}
            />

            <button
              onClick={createSession}
              disabled={loading || !name.trim()}
              className="w-full bg-gradient-to-r bg-black text-white font-poppins text-sm py-3 rounded-md font-semibold hover:shadow-lg transition-all disabled:opacity-80 disabled:cursor-not-allowed" // Pertimbangkan styling dari globals.css Anda
            >
              {loading ? 'Creating...' : 'Create Page'}
            </button>
          </div>

          <div className="font-poppins text-center mt-4 mb-4 text-[13px] text-gray-500">
            💌 Each session lasts 21 day before disappearing
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-muted text-center text-sm text-muted-foreground">
        <p>LettersForMe Support Us</p>
      </footer>
    </div>
  )
}