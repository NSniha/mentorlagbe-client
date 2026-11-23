'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';

import type { Role } from '@/lib/types';
import { useAuth } from './Providers';

const headingFont = '[font-family:Manrope,sans-serif]!';
const bodySize = 'text-[16px]!';
const eyebrow = `inline-flex items-center gap-2 text-[11px]! font-extrabold
  tracking-[0.14em] text-[var(--orange)] uppercase ${headingFont}`;
const fieldLabel = 'mb-4 block text-[14px]! font-bold';
const fieldFrame = 'mt-2 min-h-12 w-full rounded-[7px] border border-[var(--border)] bg-[var(--paper)] px-3.5 py-3';
const inputText = `${bodySize} font-normal! text-[var(--ink)] placeholder:text-[var(--muted)]/80 outline-none`;
const roleButton = 'flex flex-col items-start gap-1 rounded-lg border p-[15px] text-left text-[var(--ink)]';
const roleSelected = 'border-[var(--orange)] bg-[color-mix(in_srgb,var(--orange)_6%,var(--paper))]';
const roleIdle = 'border-[var(--border)] bg-[var(--card)]';
const submitButton = `inline-flex min-h-[47px] w-full items-center justify-center gap-4 rounded-[5px]
  border border-transparent bg-[var(--orange)] px-[23px] py-3.5 text-[14px]! font-bold! sm:text-[15px]!
  whitespace-nowrap text-white transition-[background-color,transform]
  enabled:hover:-translate-y-0.5 enabled:hover:bg-[var(--orange-hover)] disabled:cursor-not-allowed`;

export default function AuthForm({ mode }: { mode: 'in' | 'up' }) {
  const isSignUp = mode === 'up';
  const router = useRouter();
  const search = useSearchParams();
  const { login, register, demo } = useAuth();

  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSignUp && name.trim().length < 2) {
      return toast.error('Enter your full name.');
    }

    if (password.length < 8) {
      return toast.error('Password must be 8+ characters.');
    }

    setBusy(true);

    try {
      if (isSignUp) {
        await register({ name, email, password, role });
      } else {
        await login(email, password);
      }

      toast.success(isSignUp ? 'Welcome to MentorLagbe!' : 'Welcome back!');
      router.replace(search.get('next') || '/dashboard');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-[730px] grid-cols-1 bg-[var(--paper)] text-[var(--ink)]
      [font-family:'DM_Sans',sans-serif] lg:grid-cols-2">
      <div className="flex min-h-[280px] items-center bg-cover bg-center px-[22px] py-[47px]
        text-white bg-[linear-gradient(120deg,rgba(20,31,27,.86),rgba(20,31,27,.3)),url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400&q=85')]
        lg:px-[max(45px,calc((100vw_-_1200px)_/_2))] lg:py-[100px]">
        <div className="max-w-[560px]">
          <span className={eyebrow}>✳ A BETTER WAY TO GROW</span>

          <h1
            className={`my-2.5! text-[clamp(2.125rem,8.5vw,3.4rem)]! leading-[1.05]! font-bold
              tracking-[-0.048em]! text-balance lg:my-[19px]! lg:text-[clamp(3rem,5vw,4.25rem)]! ${headingFont}`}
          >
            Big dreams<br />
            start with the<br />right guidance.
          </h1>

          <p className="max-w-[380px] text-base leading-relaxed font-medium text-balance text-[#e0e3dd] sm:text-lg sm:leading-[1.75]">Join a community where curiosity meets opportunity.</p>

          <div className="mt-[85px] hidden items-center gap-3 border-t border-white/30 pt-[25px]
            text-[12px] lg:flex">
            <CheckCircle2 size={21} aria-hidden="true" className="text-[var(--orange)]" /> Your learning journey starts here.
          </div>
        </div>
      </div>

      <div className="grid place-items-center px-[22px] py-[46px] lg:px-[35px] lg:py-[65px]">
        <div className="w-full max-w-[435px]">
          <span className={eyebrow}>
            ✳ {isSignUp ? 'JOIN OUR COMMUNITY' : 'WELCOME BACK'}
          </span>

          <h1 className={`mt-3.5! mb-2.5! text-[clamp(1.875rem,3.38vw,2.475rem)]! leading-[1.19]! font-bold tracking-[-0.048em]! text-balance ${headingFont}`}>
            {isSignUp ? 'Create your account' : 'Good to see you again.'}
          </h1>

          <p className="mb-[26px]! text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            {isSignUp
              ? 'Start exploring mentors or share your expertise with learners.'
              : 'Sign in to continue your learning journey.'}
          </p>

          {isSignUp && (
            <div className="mb-[23px] grid grid-cols-2 gap-3" aria-label="Choose your role">
              <button
                type="button"
                className={`${roleButton} ${role === 'student' ? roleSelected : roleIdle}`}
                aria-pressed={role === 'student'}
                onClick={() => setRole('student')}
              >
                <GraduationCap size={20} aria-hidden="true" className="mb-1 text-[var(--orange)]" />
                <b className="text-[14px]!">I'm a student</b>
                <small className="text-[12px]! text-[var(--muted)]">Find a mentor</small>
              </button>
              <button
                type="button"
                className={`${roleButton} ${role === 'tutor' ? roleSelected : roleIdle}`}
                aria-pressed={role === 'tutor'}
                onClick={() => setRole('tutor')}
              >
                <BookOpen size={20} aria-hidden="true" className="mb-1 text-[var(--orange)]" />
                <b className="text-[14px]!">I'm a tutor</b>
                <small className="text-[12px]! text-[var(--muted)]">Share my skills</small>
              </button>
            </div>
          )}

          <form onSubmit={submit}>
            {isSignUp && (
              <label className={fieldLabel}>
                Full name
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="Your full name"
                  autoComplete="name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className={`${fieldFrame} ${inputText} focus:border-[var(--orange)]`}
                />
              </label>
            )}

            <label className={fieldLabel}>
              Email address
              <input
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className={`${fieldFrame} ${inputText} focus:border-[var(--orange)]`}
              />
            </label>

            <label className={fieldLabel}>
              Password
              <div className={`flex items-center pr-2.5 focus-within:border-[var(--orange)] ${fieldFrame}`}>
                <input
                  required
                  minLength={8}
                  type={show ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className={`min-w-0 w-full border-0 bg-transparent ${inputText}`}
                />
                <button
                  type="button"
                  onClick={() => setShow(current => !current)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="shrink-0 border-0 bg-transparent text-[var(--muted)]"
                >
                  {show ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <button disabled={busy} className={submitButton} type="submit">
              {busy ? 'Please wait...' : isSignUp ? 'Create my account' : 'Sign in'}{' '}
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </form>

          <p className={`mt-[22px]! text-center text-[var(--muted)] ${bodySize}`}>
            {isSignUp ? 'Already have an account?' : 'New to MentorLagbe?'}{' '}
            <Link href={isSignUp ? '/sign-in' : '/sign-up'} className="font-extrabold text-[var(--orange)]!">
              {isSignUp ? 'Sign in' : 'Create an account'}
            </Link>
          </p>

          {demo && (
            <div className="mt-8 rounded-lg border border-[#f2d5c3] p-4
              bg-[color-mix(in_srgb,var(--orange)_7%,var(--paper))]">
              <strong className="text-[14px]!">✳ Demo accounts for testing</strong>
              <p className={`mt-1.5! mb-3! text-[var(--muted)] ${bodySize}`}>
                All accounts use password: <code className="font-extrabold text-[var(--orange)]">Demo12345!</code>
              </p>
              <div className="flex flex-wrap gap-[7px]">
                {[
                  ['Student', 'student@mentorlagbe.demo'],
                  ['Tutor', 'farhan@mentorlagbe.demo'],
                  ['Admin', 'admin@mentorlagbe.demo'],
                ].map(([label, value]) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-[5px] border border-[var(--border)] bg-[var(--card)]
                      px-2.5 py-1.5 text-[12px]! font-extrabold!"
                    onClick={() => {
                      setEmail(value);
                      setPassword('Demo12345!');
                    }}
                  >
                    {label} ↗
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
