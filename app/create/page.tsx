"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"; // Impor klien Supabase
import { useRouter } from 'next/navigation'; // Impor useRouter

export default function CreateSessionPage() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk membuat session_id unik (contoh sederhana)
  const generateSessionId = (name: string): string => {
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    const randomSuffix = Math.random().toString(36).substring(2, 8); // Tambahkan string acak pendek
    return `${sanitizedName}-${randomSuffix}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setError("Nama penerima tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError(null);

    const newSessionId = generateSessionId(recipientName);

    try {
      // Coba masukkan data sesi baru ke Supabase
      const { data, error: insertError } = await supabase
        .from('sessions')
        .insert({
          name: recipientName.trim(),
          session_id: newSessionId
          // created_at dan expired_at akan diisi default oleh database
        })
        .select('session_id') // Pilih session_id yang baru dibuat untuk konfirmasi/redirect
        .single(); // Harapkan satu baris hasil

      if (insertError) {
        // Handle kemungkinan error unik session_id (meski kecil kemungkinannya dengan suffix acak)
        if (insertError.code === '23505') { // Kode error PostgreSQL untuk unique violation
          setError("Gagal membuat sesi, ID sesi sudah ada. Coba lagi.");
          // Mungkin perlu generate ulang session_id di sini jika mau otomatis coba lagi
        } else {
          throw insertError; // Lemparkan error lain
        }
      } else if (data) {
        // Berhasil! Redirect ke halaman sesi baru
        router.push(`/session/${data.session_id}`);
      } else {
         // Jika tidak ada error tapi tidak ada data (kasus aneh)
         throw new Error("Gagal membuat sesi, tidak ada data yang dikembalikan.");
      }

    } catch (err: any) {
      console.error("Error creating session:", err);
      setError(err.message || "Gagal membuat halaman sesi.");
      setLoading(false); // Pastikan loading false jika error
    }
    // Tidak perlu setLoading(false) jika sukses karena akan redirect
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-muted px-8 py-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="font-caveat text-5xl font-bold text-foreground">Create a Letter Page</h1>
        <p className="text-muted-foreground mt-2">Enter the name of the person you want to receive letters.</p>
      </header>

      {/* Form */}
      <main className="max-w-xl mx-auto px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-lg text-sm">
                {error}
            </div>
          )}
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-foreground mb-2">
              Recipient's Name
            </label>
            <input
              id="recipientName"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter name..."
              className="w-full px-4 py-3 bg-secondary border border-muted rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-300 ease-out"
              required
            />
             <p className="text-xs text-muted-foreground mt-2">This name will be displayed on the letter page.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-foreground text-primary-foreground rounded-2xl font-medium hover:shadow-lg transition-all duration-300 ease-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Page"}
            </button>
          </div>
        </form>
      </main>

       {/* Footer */}
       <footer className="px-8 py-8 border-t border-muted text-center text-sm text-muted-foreground mt-auto">
        <p>Made with care. Share your unsent words.</p>
      </footer>
    </div>
  );
}