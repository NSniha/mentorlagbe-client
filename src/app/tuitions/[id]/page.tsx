'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Copy,
  GraduationCap,
  MapPin,
  Maximize2,
  MonitorPlay,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Spinner } from '@/components/Elements';
import { useAuth } from '@/components/Providers';
import TuitionCard from '@/components/TuitionCard';
import { request } from '@/lib/api';
import { fallbackImage, formatMoney, type PageResult, type Tuition, type User } from '@/lib/types';

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

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'lessons', label: 'Lesson details' },
  { id: 'tutor', label: 'Tutor' },
] as const;

type DetailTab = typeof TABS[number]['id'];

const sectionHeading =
  'text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]! font-bold tracking-[-0.048em]! text-balance';
const label =
  'text-[11px] leading-4 font-extrabold tracking-[0.1em] text-[#b83e25] uppercase [html.dark_&]:text-[#f5a88b]';
const cardHeading = 'text-[20px]! leading-[1.35]! font-bold tracking-[-0.02em]!';
const muted = 'text-[#52677b] [html.dark_&]:text-[var(--muted)]';
const copy = `text-[15px] leading-[1.75] ${muted}`;
const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--orange)]';
const button =
  `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--orange)]
    px-5 py-2.5 text-center text-sm! font-bold! text-white! transition-colors
    hover:bg-[#f47758] disabled:cursor-not-allowed ${focus}`;
const field =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--paper)] px-3.5 py-2.5 text-[15px]! font-normal! placeholder:text-[var(--muted)] focus:border-[var(--orange)] focus:outline-none';

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
    <section id="apply" aria-labelledby="application-title" className="scroll-mt-24 border-t border-[var(--border)] pt-8">
      <h2 id="application-title" className={sectionHeading}>Apply for this tuition</h2>

      {authLoading ? (
        <p role="status" className={`mt-3! ${copy}`}>Checking your sign-in status…</p>
      ) : !user || !token ? (
        <div className="mt-3">
          <p className={copy}>Sign in as a student to send an application.</p>
          <Link
            href={signInHref(tuition.id)}
            className={`mt-4 ${button}`}
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
          <Link href="/dashboard/student/my-applications" className={`mt-4 ${button}`}>
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
          <button type="submit" disabled={status === 'sending'} className={`mt-1 justify-self-start ${button}`}>
            {status === 'sending' ? 'Sending…' : 'Apply for this tuition'}
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          <p className={`flex items-start gap-2 text-sm leading-6 ${muted}`}>
            <ShieldCheck size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--orange)]" />
            Your tutor can see the contact details you submit.
          </p>
        </form>
      )}
    </section>
  );
}

function TuitionDetailsView({ id }: { id: string }) {
  const { user, token, loading: authLoading } = useAuth();
  const [details, setDetails] = useState<TuitionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

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

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % TABS.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index + TABS.length - 1) % TABS.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = TABS[nextIndex].id;
    setActiveTab(nextTab);
    document.getElementById(`tuition-tab-${nextTab}`)?.focus();
  }

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      {/* Tuition title */}
      <section
        aria-labelledby="tuition-title"
        className="flex min-h-[260px] items-center bg-[#202427]
          bg-[radial-gradient(ellipse_at_14%_0%,#383d41,transparent_68%),linear-gradient(130deg,#24282b,#191d20)]
          py-12 text-white sm:min-h-[320px] sm:py-16"
      >
        <div className="container">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-[11px] leading-4 font-extrabold tracking-[0.1em] uppercase">
            <Link href="/" className={`rounded-sm hover:text-[#ffd3c3] ${focus}`}>Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/tuitions" className={`rounded-sm hover:text-[#ffd3c3] ${focus}`}>Browse Tuitions</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page" className="text-white/75">{tuition.subject}</span>
          </nav>
          <h1
            id="tuition-title"
            className="max-w-[900px] text-[clamp(2.125rem,8.5vw,3.5rem)] leading-[1.05]!
              font-extrabold tracking-[-0.048em]! text-balance wrap-break-word
              lg:text-[clamp(3rem,5vw,4.25rem)]"
          >
            {tuition.title}
          </h1>
        </div>
      </section>

      {/* Tuition information, preview and application */}
      <section aria-label="Mentorship details" className="py-12 sm:py-16 lg:py-20">
        <div className="container grid items-start gap-x-12 gap-y-9
          lg:grid-cols-[minmax(0,1fr)_minmax(300px,350px)] lg:gap-y-12 xl:gap-x-16">
          <div className="min-w-0">
            <dl className="flex flex-wrap items-center gap-x-7 gap-y-4 border-b border-[var(--border)] pb-6 sm:gap-x-10">
              <div className="relative flex min-h-12 flex-col justify-center pl-15">
                <dt className={label}>Tutor</dt>
                <dd className="mt-1 text-sm font-bold">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2">
                    <TutorAvatar name={tutorName} image={tutor?.image} />
                  </div>
                  {tutorName}
                </dd>
              </div>
              <div>
                <dt className={label}>Subject</dt>
                <dd className="mt-1 text-sm font-bold">
                  <Link href={subjectHref(tuition.subject)} className={`rounded-sm hover:underline ${focus}`}>
                    {tuition.subject}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className={label}>Class level</dt>
                <dd className="mt-1 text-sm font-bold">{tuition.classLevel}</dd>
              </div>
            </dl>

            <div role="tablist" aria-label="Tuition information" className="mt-5 flex flex-wrap gap-2">
              {TABS.map(({ id, label: tabLabel }, index) => (
                <button
                  key={id}
                  id={`tuition-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  aria-controls={`tuition-panel-${id}`}
                  tabIndex={activeTab === id ? 0 : -1}
                  onClick={() => setActiveTab(id)}
                  onKeyDown={event => moveTab(event, index)}
                  className={`inline-flex min-h-10 items-center rounded-full border border-[var(--border)]
                    px-4 text-sm! font-bold! transition-colors hover:border-[var(--orange)] sm:px-6
                    aria-selected:border-[var(--orange)] aria-selected:bg-[var(--orange)]
                    aria-selected:text-white! ${focus}`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>

            <div
              id="tuition-panel-overview"
              role="tabpanel"
              aria-labelledby="tuition-tab-overview"
              tabIndex={0}
              hidden={activeTab !== 'overview'}
              className={`mt-8 space-y-8 rounded-sm ${focus}`}
            >
              <div>
                <h2 className={sectionHeading}>About this tuition</h2>
                <p className={`mt-4! whitespace-pre-line wrap-break-word ${copy}`}>
                  {tuition.description}
                </p>
              </div>
              <div>
                <h3 className={cardHeading}>What to expect</h3>
                <ul className="mt-4 space-y-3">
                  {EXPECTATIONS.map(text => (
                    <li key={text} className={`flex items-start gap-2.5 ${copy}`}>
                      <CheckCircle2 size={19} aria-hidden="true" className="mt-1 shrink-0 text-[var(--orange)]" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              id="tuition-panel-lessons"
              role="tabpanel"
              aria-labelledby="tuition-tab-lessons"
              tabIndex={0}
              hidden={activeTab !== 'lessons'}
              className={`mt-8 rounded-sm ${focus}`}
            >
              <h2 className={sectionHeading}>Lesson details</h2>
              <dl className="mt-5 grid grid-cols-2 gap-3">
                {facts.map(({ name, value, icon: Icon }) => (
                  <div key={name} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 sm:p-4">
                    <dt className={label}>
                      <Icon size={21} aria-hidden="true" className="mb-3 text-[var(--orange)]" />
                      {name}
                    </dt>
                    <dd className="mt-1 text-sm leading-snug font-bold wrap-break-word">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              id="tuition-panel-tutor"
              role="tabpanel"
              aria-labelledby="tuition-tab-tutor"
              tabIndex={0}
              hidden={activeTab !== 'tutor'}
              className={`mt-8 rounded-sm ${focus}`}
            >
              <h2 className={sectionHeading}>Meet your mentor</h2>
              <article className="mt-5 flex items-start gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--cream)] p-4 sm:p-6">
                <TutorAvatar name={tutorName} image={tutor?.image} />
                <div className="min-w-0">
                  <h3 className={`wrap-break-word ${cardHeading}`}>{tutorName}</h3>
                  {tutor?.bio && <p className={`mt-2! wrap-break-word ${copy}`}>{tutor.bio}</p>}
                  {tutor?.plan === 'pro' && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--paper)] px-3 py-1 text-xs font-bold">
                      <ShieldCheck size={15} aria-hidden="true" className="text-[var(--orange)]" /> Pro tutor
                    </span>
                  )}
                </div>
              </article>
            </div>
          </div>

          <TuitionPreview tuition={tuition} tutorName={tutorName} user={user} token={token} authLoading={authLoading} />

          <ApplicationPanel
            key={user?.id}
            tuition={tuition}
            user={user}
            token={token}
            authLoading={authLoading}
          />
        </div>
      </section>

      <RelatedTuitions tuitionId={tuition.id} subject={tuition.subject} />
    </main>
  );
}

function subjectHref(subject: string) {
  return `/tuitions?subject=${encodeURIComponent(subject)}`;
}

function signInHref(id: string) {
  return {
    pathname: '/sign-in',
    query: { next: `/tuitions/${encodeURIComponent(id)}` },
  };
}

function TutorAvatar({ name, image }: { name: string; image?: string }) {
  return (
    <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full
      bg-[var(--orange)]/15 text-lg font-extrabold text-[#b83e25] [html.dark_&]:text-[#f5a88b]">
      {image ? (
        <Image src={image} alt="" fill unoptimized className="object-cover" />
      ) : (
        <span aria-hidden="true">{name[0]?.toUpperCase()}</span>
      )}
    </div>
  );
}

function TuitionPreview({
  tuition,
  tutorName,
  user,
  token,
  authLoading,
}: {
  tuition: Tuition;
  tutorName: string;
  user: User | null;
  token: string | null;
  authLoading: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [shareUrl, setShareUrl] = useState('');
  const image = tuition.bannerImage || fallbackImage;

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareUrl('');
      toast.success('Tuition link copied.');
    } catch {
      setShareUrl(url);
    }
  }

  return (
    <aside aria-labelledby="preview-title" className="self-start rounded-[24px] border border-[var(--border)]
      bg-[var(--card)] p-5 sm:p-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
      <button
        type="button"
        aria-label="View tuition photo"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[var(--cream)] ${focus}`}
      >
        <Image src={image} alt="" fill unoptimized className="object-cover" />
        <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full
          bg-white text-[#202427] transition-colors group-hover:bg-[var(--orange)]">
          <Maximize2 size={17} aria-hidden="true" />
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="tuition-photo-title"
        className="fixed inset-0 m-auto w-[min(94vw,900px)] max-w-none overflow-hidden rounded-[24px]
          border border-[var(--border)] bg-[var(--card)] p-0 text-[var(--ink)] backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <h2 id="tuition-photo-title" className="text-lg! font-bold">Tuition photo</h2>
          <form method="dialog">
            <button type="submit" aria-label="Close photo" className={`grid size-9 place-items-center rounded-full bg-[var(--cream)] ${focus}`}>
              <X size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
        <div className="relative h-[min(70vh,580px)] bg-[#202427]">
          <Image src={image} alt={`${tuition.subject} tuition photo`} fill unoptimized className="object-contain" />
        </div>
      </dialog>

      <h2 id="preview-title" className={`mt-5! ${cardHeading}`}>Tuition summary</h2>
      <dl className="mt-3 divide-y divide-[var(--border)] text-sm">
        <div className="flex items-baseline justify-between gap-3 py-3">
          <dt className="font-bold">Monthly fee</dt>
          <dd className="text-right text-lg font-extrabold text-[#b83e25] [html.dark_&]:text-[#f5a88b]">
            {formatMoney(tuition.monthlyFee)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 py-3">
          <dt className="font-bold">Tutor</dt>
          <dd className={`text-right wrap-break-word ${muted}`}>{tutorName}</dd>
        </div>
        <div className="flex justify-between gap-3 py-3">
          <dt className="font-bold">Learning mode</dt>
          <dd className={muted}>{tuition.mode}</dd>
        </div>
        <div className="flex justify-between gap-3 py-3">
          <dt className="font-bold">Frequency</dt>
          <dd className={`text-right ${muted}`}>{tuition.daysPerWeek} days / week</dd>
        </div>
      </dl>

      {!authLoading && (
        !user || !token ? (
          <Link href={signInHref(tuition.id)} className={`mt-4 w-full ${button}`}>
            Sign in to apply <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        ) : user.role === 'student' && (
          <Link href="#apply" className={`mt-4 w-full ${button}`}>
            Apply for this tuition <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )
      )}

      <div className="mt-4 border-t border-[var(--border)] pt-3">
        <button
          type="button"
          onClick={copyLink}
          className={`inline-flex min-h-9 items-center gap-2 rounded-sm text-sm! font-bold!
            hover:text-[#b83e25] [html.dark_&]:hover:text-[#f5a88b] ${focus}`}
        >
          <Copy size={16} aria-hidden="true" /> Copy tuition link
        </button>
        {shareUrl && (
          <label className="mt-2 grid gap-1.5 text-sm">
            Copy this link
            <input readOnly value={shareUrl} onFocus={event => event.target.select()} className={field} />
          </label>
        )}
      </div>
    </aside>
  );
}

function RelatedTuitions({ tuitionId, subject }: { tuitionId: string; subject: string }) {
  const [items, setItems] = useState<Tuition[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ subject, limit: '4' });

    request<PageResult<Tuition & { _id?: string }>>(`/api/tuitions?${query}`, {
      signal: controller.signal,
    })
      .then(data => {
        if (controller.signal.aborted) return;
        const related = new Map<string, Tuition>();
        for (const item of data.items) {
          const id = item.id || item._id;
          if (id && id !== tuitionId) related.set(id, { ...item, id });
        }
        setItems([...related.values()].slice(0, 3));
      })
      .catch(() => {
        if (!controller.signal.aborted) setItems([]);
      });

    return () => controller.abort();
  }, [tuitionId, subject]);

  return (
    <section aria-labelledby="related-title" className="border-t border-[var(--border)] bg-[var(--cream)] py-12 sm:py-16 lg:py-20">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="related-title" className={sectionHeading}>Related tuitions</h2>
          <Link
            href={subjectHref(subject)}
            className={`inline-flex items-center gap-1.5 rounded-sm text-sm font-bold
              underline-offset-4 hover:underline ${focus}`}
          >
            Browse {subject} tuitions <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {items === null ? (
          <div className="mt-6" role="status"><Spinner /><span className="sr-only">Loading related tuitions</span></div>
        ) : items.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
            {items.map(item => <TuitionCard key={item.id} tuition={item} variant="featured" />)}
          </div>
        ) : (
          <p className={`mt-4! ${copy}`}>
            Explore more listings in the <Link href="/tuitions" className="font-bold underline! underline-offset-4">tuition directory</Link>.
          </p>
        )}
      </div>
    </section>
  );
}

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  return <TuitionDetailsView key={id} id={id} />;
}
