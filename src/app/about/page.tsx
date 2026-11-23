'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowUpRight,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Quote,
  ShieldCheck,
  Target,
} from 'lucide-react';

const photos = {
  group: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1800&q=85',
  study: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=85',
  mentor: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=85',
};

const portraits = [
  { id: '1524504388940-b1c1722653e1', position: 'size-10 self-end sm:size-12' },
  { id: '1656338997878-279d71d48f6e', position: 'size-14 self-start sm:size-[68px]' },
  { id: '1734365294784-00255163b97d', position: 'size-12 self-end sm:size-16' },
  { id: '1742783107521-f69aa5e6ab8c', position: 'size-9 self-start sm:size-11' },
];

const benefits = [
  {
    icon: HeartHandshake,
    title: 'Personal support',
    text: 'Find a tutor who understands your goals and helps you work through the topics you find challenging.',
  },
  {
    icon: Target,
    title: 'Clear choices',
    text: 'Compare subjects, class levels, learning modes, and monthly fees before applying.',
  },
  {
    icon: ShieldCheck,
    title: 'Reviewed listings',
    text: 'Every tuition listing goes through admin approval before it appears in the catalog.',
  },
  {
    icon: GraduationCap,
    title: 'Flexible learning',
    text: 'Choose online or in-person tuition and share your preferred schedule when you apply.',
  },
];

const learningNotes = [
  {
    title: 'Start with one goal',
    text: 'Pick a topic you want to understand better. Sharing that goal with your tutor gives you a clear starting point for your first session.',
  },
  {
    title: 'Learn at your own pace',
    text: 'Take time to work through a difficult idea, ask questions along the way, and practice what you learn between sessions.',
  },
  {
    title: 'Make progress visible',
    text: 'Keep a short note of what you learned after each session. Over time, you can see which topics are getting easier and what needs more practice.',
  },
];

const accents = 'text-[#b83e25] [html.dark_&]:text-[#f5a88b]';
const muted = 'text-[#52677b] [html.dark_&]:text-[var(--muted)]';
const headings =
  'text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]! font-bold tracking-[-0.048em]! text-balance';

export default function About() {
  const [activeNote, setActiveNote] = useState(0);
  const note = learningNotes[activeNote];

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      {/* About hero */}
      <section
        aria-labelledby="about-title"
        className="relative isolate grid min-h-[300px] place-items-center overflow-hidden bg-[var(--deep)] pb-14 sm:min-h-[360px] lg:min-h-[420px]"
      >
        <Image src={photos.group} alt="" fill unoptimized preload className="object-cover object-center" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/35 via-black/55 to-black/70" />

        <div className="container relative text-center text-white">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-[11px] leading-4 font-extrabold tracking-[0.1em]">
            <Link href="/" className="transition-colors hover:text-[#ffd3c3]">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">About</span>
          </nav>
          <h1 id="about-title" className="text-[clamp(2.125rem,8.5vw,3.5rem)] leading-[1.05]! font-extrabold tracking-[-0.048em]! text-balance lg:text-[clamp(3rem,5vw,4.25rem)]">
            About us
          </h1>
        </div>
      </section>

      {/* Our story */}
      <section
        aria-labelledby="about-story"
        className="relative -mt-12 rounded-t-[2.75rem] bg-[var(--paper)] pt-16 pb-14 sm:rounded-t-[4rem] sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24"
      >
        <div className="container grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="relative mx-auto aspect-[10/11] w-full max-w-[480px]">
            <div className="absolute top-0 left-0 h-[82%] w-[63%] overflow-hidden rounded-[100vw] bg-[var(--cream)]">
              <Image src={photos.study} alt="Students working together on campus" fill unoptimized className="object-cover object-[48%_center]" />
            </div>
            <div className="absolute right-0 bottom-0 h-[76%] w-[57%] overflow-hidden rounded-[100vw] bg-[var(--cream)] ring-[7px] ring-[var(--paper)]">
              <Image src={photos.mentor} alt="A mentor smiling" fill unoptimized className="object-cover object-[center_35%]" />
            </div>
          </div>

          <div>
            <span className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] leading-4 font-extrabold tracking-[0.1em] uppercase ${accents}`}>
              <HeartHandshake size={15} aria-hidden="true" /> Our story
            </span>
            <h2 id="about-story" className={`mt-4! ${headings}`}>
              Good education starts with a connection.
            </h2>
            <p className={`mt-5! max-w-[560px] text-[15px] leading-[1.75] ${muted}`}>
              MentorLagbe connects students in Bangladesh with tutors who can help
              them build confidence. From school subjects to practical skills,
              students can explore approved listings and find guidance that fits
              their goals, schedule, and budget.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <GraduationCap size={29} strokeWidth={1.5} className={`shrink-0 ${accents}`} aria-hidden="true" />
                <div>
                  <h3 className="text-[20px]! leading-[1.35]! font-bold tracking-[-0.02em]!">For students</h3>
                  <p className={`mt-1! text-[15px] leading-[1.7] ${muted}`}>Browse tuition listings and apply online.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={29} strokeWidth={1.5} className={`shrink-0 ${accents}`} aria-hidden="true" />
                <div>
                  <h3 className="text-[20px]! leading-[1.35]! font-bold tracking-[-0.02em]!">For tutors</h3>
                  <p className={`mt-1! text-[15px] leading-[1.7] ${muted}`}>Post tuition listings and manage applications.</p>
                </div>
              </div>
            </div>

            <Link
              href="/tuitions"
              className="mt-8 inline-flex min-h-[50px] items-center gap-2 rounded-full bg-[#ed603e] px-5 text-sm font-bold text-white! transition-colors hover:bg-[#ae3823] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed603e]"
            >
              Find your mentor <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform benefits */}
      <section aria-labelledby="about-benefits" className="py-12 sm:py-20 lg:py-24">
        <div className="container grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className={`flex items-center gap-2 text-[11px] leading-4 font-extrabold tracking-[0.1em] uppercase ${accents}`}>
              Our benefits
            </p>
            <h2 id="about-benefits" className={`mt-3! ${headings}`}>
              Learning that fits your needs
            </h2>
            <p className={`mt-5! max-w-[400px] text-[15px] leading-[1.75] ${muted}`}>
              Whether you are preparing for an exam or learning something new,
              choose a tutor who works with your schedule and learning goals.
            </p>
            <Link href="/how-it-works" className={`mt-6 inline-flex items-center gap-2 text-sm font-bold underline-offset-4 hover:underline ${accents}`}>
              See how it works <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <ul className="grid gap-x-6 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 border-t border-[var(--border)] py-5 sm:py-7">
                <Icon size={29} strokeWidth={1.5} aria-hidden="true" className={`mt-0.5 shrink-0 ${accents}`} />
                <div>
                  <h3 className="text-[20px]! leading-[1.35]! font-bold tracking-[-0.02em]!">{title}</h3>
                  <p className={`mt-2! text-[15px] leading-[1.7] ${muted}`}>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Learning tips carousel */}
      <section aria-label="Learning tips" className="pb-16 sm:pb-24 lg:pb-28">
        <div className="container relative isolate overflow-hidden rounded-[2rem] bg-[var(--cream)] px-5 pt-8 pb-10 text-center sm:pt-12 sm:pb-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_26%_55%,#facd7140,transparent_48%),radial-gradient(ellipse_at_70%_58%,#ed603e28,transparent_54%)]" />

          <div aria-hidden="true" className="mx-auto mb-8 flex h-[76px] max-w-[570px] justify-between px-2 sm:mb-10 sm:h-[104px]">
            {portraits.map(({ id, position }) => (
              <div key={id} className={`relative shrink-0 overflow-hidden rounded-full bg-[var(--border)] ring-4 ring-[var(--paper)] ${position}`}>
                <Image
                  src={`https://images.unsplash.com/photo-${id}?w=160&h=160&fit=crop&crop=faces&q=80`}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover grayscale"
                />
              </div>
            ))}
          </div>

          <div aria-live="polite" aria-atomic="true" className="mx-auto max-w-[620px]">
            <Quote aria-hidden="true" size={27} className={`mx-auto mb-4 ${accents}`} />
            <h2 className="text-lg! leading-[1.35]! font-bold tracking-[-0.02em]! sm:text-xl!">
              {note.title}
            </h2>
            <p className={`mt-4! min-h-[6.5rem] text-[clamp(1.125rem,2.1vw,1.625rem)] leading-[1.6] sm:min-h-[7.5rem] ${muted}`}>
              {note.text}
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            {learningNotes.map(({ title }, index) => (
              <button
                key={title}
                type="button"
                onClick={() => setActiveNote(index)}
                aria-label={title}
                aria-pressed={index === activeNote}
                className="group grid size-10 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#ed603e]"
              >
                <span aria-hidden="true" className="size-2.5 rounded-full bg-[var(--muted)]/55 transition-colors group-hover:bg-[#ed603e] group-aria-pressed:bg-[#ed603e]" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
