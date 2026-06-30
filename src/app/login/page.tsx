'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, Command, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-700 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-card rounded-[2.5rem] shadow-xl border border-border p-10 lg:p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
              <Command className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">SmartMart Pro</h1>
            <p className="text-muted-foreground font-medium mt-2 uppercase tracking-widest text-[10px]">AI Supermarket Intelligence</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-5 py-4 rounded-2xl text-sm font-bold flex items-center space-x-3 animate-shake">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                Security Protocol / Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-semibold outline-none placeholder:text-muted-foreground"
                placeholder="admin@smartmart.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                Access Credentials
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-semibold outline-none placeholder:text-muted-foreground"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <div className="h-6 w-6 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  <span>AUTHENTICATE</span>
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-10 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Contact your administrator for account access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
