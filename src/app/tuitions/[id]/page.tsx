'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MapPin,
  MonitorPlay,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

import { Spinner } from '@/components/Elements';
import { useAuth } from '@/components/Providers';
import { request } from '@/lib/api';
import { fallbackImage, formatMoney, type Tuition, type User } from '@/lib/types';

type TuitionDetails = {
  tuition: Tuition;
  tutor: Partial<User> | null;
};

const INITIAL_FORM = { studentPhone: '', preferredSchedule: '', studentNote: '' };
const EXPECTATIONS = [
  'Guidance tailored to your subject and class level',
  'Regular sessions with a schedule you agree on together',
  'An application reviewed directly by the tutor',
];

const sectionHeading =
  'text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]! font-bold tracking-[-0.048em]! text-balance';
const label =
  'text-[11px] leading-4 font-extrabold tracking-[0.1em] text-[#b83e25] uppercase [html.dark_&]:text-[#f5a88b]';
const copy = 'text-[15px] leading-[1.75] text-[#52677b] [html.dark_&]:text-[var(--muted)]';
const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--orange)]';
const button =
  `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--orange)]
    px-5 py-2.5 text-center text-sm! font-bold! text-[#24160f]! transition-colors
    hover:bg-[#f47758] disabled:cursor-not-allowed ${focus}`;
const field =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--paper)] px-3.5 py-2.5 text-[15px]! placeholder:text-[var(--muted)] focus:border-[var(--orange)] focus:outline-none';

function ApplicationPanel({
  tuition,
  user,
  token,
  authLoading,
}: {
  tuition: Tuition;
  user: User | null;
  token: string | null;
  authLoading: boolean;
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'submitted'>('idle');
  const submitting = useRef(false);

  async function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || user?.role !== 'student' || submitting.current || status === 'submitted') return;

    submitting.current = true;
    setStatus('sending');

    try {
      await request('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ ...form, tuitionId: tuition.id }),
      }, token);
      setStatus('submitted');
      toast.success('Application sent! Track it in your dashboard.');
    } catch (error) {
      setStatus('idle');
      toast.error(error instanceof Error ? error.message : 'Could not send your application.');
    } finally {
      submitting.current = false;
    }
  }

  return (
    <aside
      aria-labelledby="application-title"
      className="self-start rounded-[24px] border border-[var(--border)] bg-[var(--card)]
        p-5 shadow-[0_15px_50px_rgba(17,25,20,0.07)] sm:p-7 lg:sticky lg:top-24"
    >
      <div className="border-b border-[var(--border)] pb-5">
        <p className={label}>Monthly tuition</p>
        <p className="mt-2! flex flex-wrap items-baseline gap-2">
          <strong className="text-[clamp(2.125rem,4vw,2.75rem)] leading-none font-extrabold tracking-[-0.055em] [font-family:Manrope,sans-serif]">
            {formatMoney(tuition.monthlyFee)}
          </strong>
          <span className={`text-sm ${copy}`}>/ month</span>
        </p>
      </div>

      <h2
        id="application-title"
        className="mt-5! text-xl! leading-[1.35]! font-bold tracking-[-0.025em]! sm:text-[24px]!"
      >
        Apply for this tuition
      </h2>

      {authLoading ? (
        <p role="status" className={`mt-3! ${copy}`}>Checking your sign-in status…</p>
      ) : !user || !token ? (
        <div className="mt-3 space-y-4">
          <p className={copy}>Sign in as a student to send an application.</p>
          <Link
            href={{
              pathname: '/sign-in',
              query: { next: `/tuitions/${encodeURIComponent(tuition.id)}` },
            }}
            className={`w-full ${button}`}
          >
            Sign in to apply <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : user.role !== 'student' ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[var(--cream)] p-3">
          <ShieldCheck size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--orange)]" />
          <p className={copy}>Only student accounts can apply. You are signed in as a {user.role}.</p>
        </div>
      ) : status === 'submitted' ? (
        <div role="status" className="mt-4 rounded-2xl bg-[var(--cream)] p-4">
          <CheckCircle2 size={26} aria-hidden="true" className="text-[var(--orange)]" />
          <h3 className="mt-2! text-base! font-bold">Application sent</h3>
          <p className={`mt-1! ${copy}`}>Your application is pending tutor review.</p>
          <Link href="/dashboard/student/my-applications" className={`mt-4 w-full ${button}`}>
            View application <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <form onSubmit={apply} className="mt-4 grid gap-4" aria-busy={status === 'sending'}>
          <label className="grid gap-1.5 text-sm font-bold">
            Phone number
            <input
              type="tel"
              name="studentPhone"
              autoComplete="tel"
              required
              minLength={7}
              value={form.studentPhone}
              onChange={event => setForm({ ...form, studentPhone: event.target.value })}
              placeholder="01XXXXXXXXX"
              className={field}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            Preferred schedule
            <input
              name="preferredSchedule"
              required
              minLength={3}
              value={form.preferredSchedule}
              onChange={event => setForm({ ...form, preferredSchedule: event.target.value })}
              placeholder="e.g. Sun & Tue after 6pm"
              className={field}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            A note for your mentor
            <textarea
              name="studentNote"
              required
              minLength={5}
              rows={4}
              value={form.studentNote}
              onChange={event => setForm({ ...form, studentNote: event.target.value })}
              placeholder="Share your learning goals"
              className={`resize-y ${field}`}
            />
          </label>
          <button type="submit" disabled={status === 'sending'} className={`w-full ${button}`}>
            {status === 'sending' ? 'Sending…' : 'Apply for this tuition'}
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          <p className={`flex items-start gap-2 text-sm ${copy}`}>
            <ShieldCheck size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--orange)]" />
            Your tutor can see the contact details you submit.
          </p>
        </form>
      )}
    </aside>
  );
}

function TuitionDetailsView({ id }: { id: string }) {
  const { user, token, loading: authLoading } = useAuth();
  const [details, setDetails] = useState<TuitionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setDetails(null);

    request<TuitionDetails>(`/api/tuitions/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    }, token)
      .then(data => {
        if (!controller.signal.aborted && data?.tuition) {
          setDetails({
            tuition: { ...data.tuition, id: data.tuition.id || id },
            tutor: data.tutor ?? null,
          });
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          toast.error(error instanceof Error ? error.message : 'Could not load this tuition.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, token]);

  if (loading || (!details && authLoading)) {
    return (
      <main aria-busy="true" className="container grid min-h-[50vh] place-items-center">
        <div role="status">
          <span className="sr-only">Loading tuition details</span>
          <Spinner />
        </div>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="container py-20 text-center sm:py-28">
        <BookOpen size={36} aria-hidden="true" className="mx-auto mb-4 text-[var(--orange)]" />
        <h1 className={sectionHeading}>Tuition unavailable</h1>
        <p className={`mt-3! ${copy}`}>Browse the directory to find other open listings.</p>
        <Link href="/tuitions" className={`mt-6 ${button}`}>
          <ArrowLeft size={16} aria-hidden="true" /> Browse tuitions
        </Link>
      </main>
    );
  }

  const { tuition, tutor } = details;
  const tutorName = tuition.tutorName || tutor?.name || 'Your tutor';
  const facts = [
    { name: 'Learning mode', value: tuition.mode, icon: MonitorPlay },
    { name: 'Class level', value: tuition.classLevel, icon: GraduationCap },
    { name: 'Frequency', value: `${tuition.daysPerWeek} days / week`, icon: CalendarDays },
    { name: 'Location', value: tuition.location, icon: MapPin },
  ];

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      {/* Tuition photo and heading */}
      <section
        aria-labelledby="tuition-title"
        className="relative isolate grid min-h-[300px] place-items-center overflow-hidden
          bg-[var(--deep)] pt-10 pb-[4.5rem] sm:min-h-[360px] lg:min-h-[420px]"
      >
        <Image
          src={tuition.bannerImage || fallbackImage}
          alt=""
          fill
          unoptimized
          preload
          className="object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
        <div className="container relative text-center text-white">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center justify-center gap-2 text-[11px] leading-4 font-extrabold tracking-[0.1em]">
            <Link href="/" className={`rounded-sm hover:text-[#ffd3c3] ${focus}`}>Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/tuitions" className={`rounded-sm hover:text-[#ffd3c3] ${focus}`}>Browse Tuitions</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{tuition.subject}</span>
          </nav>
          <h1
            id="tuition-title"
            className="mx-auto! max-w-[1000px] text-[clamp(2.125rem,8.5vw,3.5rem)] leading-[1.05]!
              font-extrabold tracking-[-0.048em]! text-balance wrap-break-word
              lg:text-[clamp(3rem,5vw,4.25rem)]"
          >
            {tuition.title}
          </h1>
          <p className="mt-4! text-[15px] leading-[1.75] text-white/90">
            Guided by {tutorName} · {tuition.classLevel}
          </p>
        </div>
      </section>

      {/* Mentorship details and application */}
      <section
        aria-label="Mentorship details"
        className="relative -mt-12 rounded-t-[2.75rem] bg-[var(--paper)] pt-16 pb-16
          sm:rounded-t-[4rem] sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28"
      >
        <div className="container grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(320px,370px)] lg:gap-10 xl:gap-14">
          <div className="min-w-0 space-y-8 sm:space-y-10">
            <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {facts.map(({ name, value, icon: Icon }) => (
                <div key={name} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 sm:p-4">
                  <Icon size={21} strokeWidth={1.65} aria-hidden="true" className="mb-3 text-[var(--orange)]" />
                  <dt className={label}>{name}</dt>
                  <dd className="mt-1 text-sm leading-snug font-bold wrap-break-word">{value}</dd>
                </div>
              ))}
            </dl>

            <article aria-labelledby="overview-title">
              <h2 id="overview-title" className={sectionHeading}>About this tuition</h2>
              <p className={`mt-4! whitespace-pre-line wrap-break-word ${copy}`}>
                {tuition.description}
              </p>
            </article>

            <article aria-labelledby="expectations-title">
              <h2 id="expectations-title" className={sectionHeading}>What to expect</h2>
              <ul className="mt-4 space-y-3">
                {EXPECTATIONS.map(text => (
                  <li key={text} className={`flex items-start gap-2.5 ${copy}`}>
                    <CheckCircle2 size={19} aria-hidden="true" className="mt-1 shrink-0 text-[var(--orange)]" />
                    {text}
                  </li>
                ))}
              </ul>
            </article>

            <article
              aria-labelledby="tutor-title"
              className="flex items-start gap-4 rounded-[24px] border border-[var(--border)]
                bg-[var(--cream)] p-4 sm:gap-5 sm:p-6"
            >
              <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--orange)]/15 text-xl font-extrabold text-[#b83e25] sm:size-[72px] [html.dark_&]:text-[#f5a88b]">
                {tutor?.image ? (
                  <Image src={tutor.image} alt="" fill unoptimized className="object-cover" />
                ) : (
                  <span aria-hidden="true">{tutorName[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className={label}>Meet your mentor</p>
                <h2 id="tutor-title" className="mt-1! text-xl! leading-[1.35]! font-bold tracking-[-0.02em]! wrap-break-word">
                  {tutorName}
                </h2>
                {tutor?.bio && <p className={`mt-2! wrap-break-word ${copy}`}>{tutor.bio}</p>}
                {tutor?.plan === 'pro' && (
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--paper)] px-3 py-1 text-xs font-bold">
                    <ShieldCheck size={15} aria-hidden="true" className="text-[var(--orange)]" /> Pro tutor
                  </span>
                )}
              </div>
            </article>
          </div>

          <ApplicationPanel
            key={user?.id}
            tuition={tuition}
            user={user}
            token={token}
            authLoading={authLoading}
          />
        </div>
      </section>
    </main>
  );
}

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  return <TuitionDetailsView key={id} id={id} />;
}
