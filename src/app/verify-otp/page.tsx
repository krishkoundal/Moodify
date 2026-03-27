'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        setMessage('Verified! Redirecting to login...');
        setTimeout(() => router.push('/login?message=Verified! You can now login.'), 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
      >
        <source src="/gojo-vs-sukuna.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600 mb-6 neon-glow-purple">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Verify Account</h1>
          <p className="text-zinc-400">Enter the 6-digit code sent to <span className="text-white font-medium">{email}</span></p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-2xl">
          <form className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                name="otp"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-4xl font-black tracking-[1em] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono"
                placeholder="000000"
              />
              <p className="text-center text-zinc-500 text-xs text-balance">Check your console for the code in this demo</p>
            </div>

            <button
              type="button"
              onClick={(e) => handleSubmit(e as any)}
              disabled={loading || message !== ''}
              className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <button className="w-full mt-6 text-zinc-500 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
            <RefreshCcw className="w-4 h-4" />
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
