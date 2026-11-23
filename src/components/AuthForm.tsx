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
const bodySize = 'text-[15px]!';
const labelSize = 'text-[14px]!';

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
    <main className="auth-page [font-family:'DM_Sans',sans-serif]">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <span className="eyebrow">✳ A BETTER WAY TO GROW</span>

          <h1
            className={`${headingFont} text-[clamp(2.125rem,8.5vw,3.5rem)]!
              lg:text-[clamp(3rem,5vw,4.25rem)]!`}
          >
            Big dreams<br />
            start with the<br />
            <em className={headingFont}>right guidance.</em>
          </h1>

          <p className={bodySize}>Join a community where curiosity meets opportunity.</p>

          <div className="auth-visual-bottom">
            <CheckCircle2 size={21} /> Your learning journey starts here.
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-shell">
          <span className="eyebrow">
            ✳ {isSignUp ? 'JOIN OUR COMMUNITY' : 'WELCOME BACK'}
          </span>

          <h1 className={`${headingFont} text-[clamp(1.875rem,3.38vw,2.875rem)]!`}>
            {isSignUp ? 'Create your account' : 'Good to see you again.'}
          </h1>

          <p className={bodySize}>
            {isSignUp
              ? 'Start exploring mentors or share your expertise with learners.'
              : 'Sign in to continue your learning journey.'}
          </p>

          {isSignUp && (
            <div className="role-selector" aria-label="Choose your role">
              <button
                type="button"
                className={role === 'student' ? 'selected' : ''}
                onClick={() => setRole('student')}
              >
                <GraduationCap size={20} />
                <b className={labelSize}>I'm a student</b>
                <small className="text-[12px]!">Find a mentor</small>
              </button>

              <button
                type="button"
                className={role === 'tutor' ? 'selected' : ''}
                onClick={() => setRole('tutor')}
              >
                <BookOpen size={20} />
                <b className={labelSize}>I'm a tutor</b>
                <small className="text-[12px]!">Share my skills</small>
              </button>
            </div>
          )}

          <form className="auth-form" onSubmit={submit}>
            {isSignUp && (
              <label className={labelSize}>
                Full name
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="Your full name"
                  autoComplete="name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className={bodySize}
                />
              </label>
            )}

            <label className={labelSize}>
              Email address
              <input
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className={bodySize}
              />
            </label>

            <label className={labelSize}>
              Password
              <div className="password-field">
                <input
                  required
                  minLength={8}
                  type={show ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className={bodySize}
                />
                <button
                  type="button"
                  onClick={() => setShow(current => !current)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <button
              disabled={busy}
              className={`btn btn-primary btn-full ${labelSize}`}
              type="submit"
            >
              {busy ? 'Please wait...' : isSignUp ? 'Create my account' : 'Sign in'}{' '}
              <ArrowUpRight size={18} />
            </button>
          </form>

          <p className={`switch-auth ${bodySize}`}>
            {isSignUp ? 'Already have an account?' : 'New to MentorLagbe?'}{' '}
            <Link href={isSignUp ? '/sign-in' : '/sign-up'}>
              {isSignUp ? 'Sign in' : 'Create an account'}
            </Link>
          </p>

          {demo && (
            <div className="demo-credentials">
              <strong>✳ Demo accounts for testing</strong>
              <p className={bodySize}>
                All accounts use password: <code>Demo12345!</code>
              </p>

              <div>
                {[
                  ['Student', 'student@mentorlagbe.demo'],
                  ['Tutor', 'farhan@mentorlagbe.demo'],
                  ['Admin', 'admin@mentorlagbe.demo'],
                ].map(([label, value]) => (
                  <button
                    key={label}
                    type="button"
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