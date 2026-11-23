import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CodeXml,
  FilePlus2,
  GraduationCap,
  Mic,
  Search,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'See how students find and apply for tuitions on MentorLagbe and how tutors publish listings and manage applications.',
};

const heroImage =
  'https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?auto=format&fit=crop&w=2000&q=85';

const actions = [
  {
    icon: Search,
    title: 'Find the right tuition',
    text: 'Filter by subject, class level, and online or in-person learning.',
    href: '/tuitions',
  },
  {
    icon: BookOpen,
    title: 'Compare lesson details',
    text: 'Check the monthly fee, class frequency, and tutor profile before you apply.',
    href: '#student-guide',
  },
  {
    icon: ClipboardList,
    title: 'Follow your application',
    text: 'See whether your request is pending, accepted, or rejected.',
    href: '/dashboard/student/my-applications',
  },
  {
    icon: GraduationCap,
    title: 'Start teaching',
    text: 'Create a tutor account to share the subjects and levels you teach.',
    href: '#tutor-guide',
  },
  {
    icon: FilePlus2,
    title: 'Post a tuition',
    text: 'Set your fee, weekly schedule, and learning mode in the tutor dashboard.',
    href: '/dashboard/tutor/post-tuition',
  },
  {
    icon: Users,
    title: 'Review student requests',
    text: 'Read each learner’s goals and preferred schedule before responding.',
    href: '/dashboard/tutor/applicants',
  },
];

const journeys = [
  {
    id: 'student-guide',
    label: 'For students',
    title: 'Find a tutor and apply',
    photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=720&q=85',
    alt: 'Students discussing their work around a table',
    steps: [
      'Browse approved listings for your subject and level.',
      'Open a listing and check the fee, tutor profile, and class details.',
      'Sign in as a student and send your phone number, preferred schedule, and learning goals.',
      'Check My applications for the tutor’s response.',
    ],
    href: '/tuitions',
    button: 'Browse tuitions',
    imageOrder: 'sm:order-first',
    imagePosition: 'object-center',
  },
  {
    id: 'tutor-guide',
    label: 'For tutors',
    title: 'Share what you teach',
    photo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=720&q=85',
    alt: 'A teacher working with students in a classroom',
    steps: [
      'Choose Tutor when you create your account.',
      'Post a tuition with your subject, schedule, and monthly fee.',
      'Wait for admin approval before the listing goes public.',
      'Accept or reject requests from the Applicants page.',
    ],
    href: '/sign-up',
    button: 'Create a tutor account',
    imageOrder: 'sm:order-last',
    imagePosition: 'object-[55%_center]',
  },
];

const subjects = [
  { name: 'Mathematics', icon: Calculator },
  { name: 'Physics', icon: Atom },
  { name: 'Programming', icon: CodeXml },
  { name: 'IELTS', icon: Mic },
];

const questions = [
  {
    question: 'Can I browse without an account?',
    answer:
      'Yes. Anyone can browse tuitions and view the details. You need a student account to submit an application.',
  },
  {
    question: 'Can I choose in-person lessons?',
    answer:
      'Yes. Select Offline in the Mode filter to find in-person tuitions, or select Online for remote lessons.',
  },
  {
    question: 'What do I need to apply?',
    answer:
      'Sign in as a student and open a tuition. Enter your phone number, preferred schedule, and a short note about what you want to learn.',
  },
  {
    question: 'Where can I see my application status?',
    answer:
      'Open My applications in your student dashboard. Your request starts as Pending and changes when the tutor responds.',
  },
  {
    question: 'When does my tuition listing go live?',
    answer:
      'An admin reviews it before it appears in Browse Tuitions. Check its approval status under My tuitions in your tutor dashboard.',
  },
  {
    question: 'How many listings can I create on Free?',
    answer:
      'The Free tutor plan allows up to two listings. Pro Tutor removes the listing limit.',
  },
];

const heading =
  'text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]! font-bold tracking-[-0.048em]! text-balance';
const cardHeading = 'text-[20px]! leading-[1.35]! font-bold tracking-[-0.02em]!';
const label =
  'text-[11px] leading-4 font-extrabold tracking-[0.1em] text-[#b83e25] uppercase [html.dark_&]:text-[#f5a88b]';
const copy = 'text-[15px] leading-[1.75] text-[#52677b] [html.dark_&]:text-[var(--muted)]';
const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--orange)]';

export default function HowItWorks() {
  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      {/* Photo hero */}
      <section
        aria-labelledby="how-it-works-title"
        className="relative isolate grid min-h-[310px] place-items-center overflow-hidden bg-[var(--deep)] bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80')] bg-cover bg-center py-14 sm:min-h-[385px] lg:min-h-[440px]"
      >
        <Image
          src={heroImage}
          alt=""
          fill
          unoptimized
          preload
          className="object-cover object-[center_43%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
        <div className="container relative text-center text-white">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center justify-center gap-2 text-[11px] font-extrabold tracking-[0.1em] uppercase">
            <Link href="/" className={`rounded-sm hover:text-[#ffd5c8] ${focus}`}>Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">How it works</span>
          </nav>
          <h1
            id="how-it-works-title"
            className="text-[clamp(2.125rem,8.5vw,3.5rem)] leading-[1.05]! font-extrabold tracking-[-0.048em]! text-balance lg:text-[clamp(3rem,5vw,4.25rem)]"
          >
            How MentorLagbe works
          </h1>
          <p className="mx-auto! mt-4! max-w-lg text-[15px] leading-[1.75] text-white/90">
            Find a tuition that fits your goals or connect with students you can help.
          </p>
        </div>
      </section>

      {/* Learning and teaching actions */}
      <section
        aria-labelledby="actions-title"
        className="relative -mt-12 rounded-t-[2.75rem] bg-[var(--paper)] pt-16 pb-16 sm:rounded-t-[4rem] sm:pt-24 sm:pb-24 lg:pt-28"
      >
        <div className="container">
          <div className="mx-auto max-w-[580px] text-center">
            <p className={label}>Getting started</p>
            <h2 id="actions-title" className={`mt-3! ${heading}`}>
              From your first search to your first lesson
            </h2>
            <p className={`mt-4! ${copy}`}>
              Find your next step as a student or tutor.
            </p>
          </div>
          <ul className="mx-auto mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 sm:px-5 lg:mt-14 lg:grid-cols-3">
            {actions.map(({ icon: Icon, title, text, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className={`group flex h-full items-start gap-4 rounded-2xl p-2 sm:p-3 ${focus}`}
                >
                  <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[var(--orange)]/10 text-[var(--orange)] sm:size-15">
                    <Icon size={25} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className={cardHeading}>{title}</h3>
                    <p className={`mt-2! ${copy}`}>{text}</p>
                    <span className="mt-3 inline-grid size-7 place-items-center rounded-full border border-[var(--border)] transition-colors group-hover:border-[var(--orange)] group-hover:bg-[var(--orange)] group-hover:text-white">
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Student and tutor guides */}
      <section aria-labelledby="guides-title" className="pb-16 sm:pb-20">
        <div className="container">
          <div className="mx-auto max-w-[580px] text-center">
            <p className={label}>Step by step</p>
            <h2 id="guides-title" className={`mt-3! ${heading}`}>Your guide to MentorLagbe</h2>
          </div>
          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            {journeys.map(({ id, label: audience, title, photo, alt, steps, href, button, imageOrder, imagePosition }) => (
              <article
                key={id}
                id={id}
                className="grid scroll-mt-28 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--cream)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                <div className={`relative min-h-52 ${imageOrder}`}>
                  <Image src={photo} alt={alt} fill unoptimized className={`object-cover ${imagePosition}`} />
                </div>
                <div className="p-5 sm:p-6">
                  <p className={label}>{audience}</p>
                  <h3 className={`mt-2! ${cardHeading}`}>{title}</h3>
                  <ol className={`mt-4 list-decimal space-y-2 pl-5 marker:font-bold marker:text-[#b83e25] [html.dark_&]:marker:text-[#f5a88b] ${copy}`}>
                    {steps.map(step => <li key={step}>{step}</li>)}
                  </ol>
                  <Link
                    href={href}
                    className={`mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--orange)] px-4 py-2.5 text-sm font-bold text-white! transition-colors hover:bg-[#ae3823] ${focus}`}
                  >
                    {button} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Subject shortcuts */}
      <section aria-labelledby="subject-shortcuts-title" className="pb-16 sm:pb-24">
        <div className="container grid gap-6 lg:grid-cols-[0.8fr_2fr] lg:items-center lg:gap-12">
          <div>
            <p className={label}>Browse by subject</p>
            <h2 id="subject-shortcuts-title" className={`mt-2! ${heading}`}>What do you want to learn?</h2>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {subjects.map(({ name, icon: Icon }) => (
              <li key={name}>
                <Link
                  href={`/tuitions?subject=${encodeURIComponent(name)}`}
                  className={`group flex h-full min-h-25 flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-3 py-4 text-center transition-colors hover:border-[var(--orange)] hover:bg-[var(--orange)]/5 ${focus}`}
                >
                  <Icon size={24} aria-hidden="true" className="text-[var(--orange)]" />
                  <span className="text-base leading-tight font-bold">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Expandable frequently asked questions */}
      <section aria-labelledby="faq-title" className="bg-linear-to-b from-[var(--paper)] to-[var(--orange)]/10 pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="container">
          <div className="mx-auto max-w-[620px] text-center">
            <p className={label}>Frequently asked questions</p>
            <h2 id="faq-title" className={`mt-3! ${heading}`}>Before you get started</h2>
          </div>
          <div className="mt-9 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {questions.map(({ question, answer }) => (
              <details key={question} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <summary className={`flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-base leading-snug font-bold [&::-webkit-details-marker]:hidden ${focus}`}>
                  {question}
                  <ChevronDown size={19} aria-hidden="true" className="shrink-0 text-[var(--orange)] transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                </summary>
                <p className={`px-5 pb-5 ${copy}`}>{answer}</p>
              </details>
            ))}
          </div>
          <Link
            href="/pricing"
            className={`mx-auto mt-7 flex w-fit items-center gap-2 rounded-sm text-sm font-bold text-[#b83e25]! underline-offset-4 hover:underline [html.dark_&]:text-[#f5a88b]! ${focus}`}
          >
            Compare Free and Pro plans <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
