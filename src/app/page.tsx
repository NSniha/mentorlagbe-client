'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Atom,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  CodeXml,
  FlaskConical,
  Globe,
  GraduationCap,
  GraduationCap as CategoryCap,
  HeartHandshake,
  Laptop as CategoryLaptop,
  MessagesSquare,
  Mic,
  MonitorPlay,
  Pencil as CategoryPencil,
  Play,
  Quote,
  ScrollText,
  Search,
  ShieldCheck,
  Target,
  Trophy,
  Wallet,
} from 'lucide-react';

import { EmptyState, SectionTitle } from '@/components/Elements';
import TuitionCard from '@/components/TuitionCard';
import { request } from '@/lib/api';
import type { Tuition } from '@/lib/types';
import mentorChat from './images/mentor-chat.png';

const photos = {
  study: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1050&q=85',
  group: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&q=85',
  woman: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85',
  class: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&q=85',
  coding: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&q=85',
  english: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1000&q=85',
  library: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=85',
  smile: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=550&q=85',
  mentor: 'https://images.unsplash.com/photo-1656338997878-279d71d48f6e?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  mentor2: 'https://images.unsplash.com/photo-1734365294784-00255163b97d?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  mentor3: 'https://images.unsplash.com/photo-1742783107521-f69aa5e6ab8c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  community: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=85',
};

const heroBenefits = [
  'Free to browse',
  'Learn at your own pace',
  'Track your applications',
];

const platformFeatures = [
  {
    icon: GraduationCap,
    title: 'Search by Subject',
    text: 'Find tuition listings for the subject and class level you need.',
  },
  {
    icon: Trophy,
    title: 'Pick Your Learning Mode',
    text: 'Choose online lessons or meet your tutor in person.',
  },
  {
    icon: ScrollText,
    title: 'See Fees Upfront',
    text: 'Compare monthly rates before applying for a tuition.',
  },
  {
    icon: Globe,
    title: 'Track Your Applications',
    text: 'View application updates in your dashboard.',
  },
];

const reviewSlides = [
  {
    title: 'Guidance that builds confidence',
    quote: "A good mentor doesn't just explain the answer. They help you feel confident enough to find it yourself.",
    image: photos.smile,
  },
  {
    title: 'Learning on your terms',
    quote: 'The right support fits your goals and schedule. Look for a mentor whose subject, class level and learning mode work for you.',
    image: photos.woman,
  },
  {
    title: 'Make each session count',
    quote: 'Start with a specific goal. Share it when you apply, then use each session to work through what still feels difficult.',
    image: photos.mentor,
  },
];

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55 },
} as const;

const categories = [
  { title: 'One-on-one tuition', count: 'Personal attention', image: photos.study },
  { title: 'Exam preparation', count: 'Confidence for exams', image: photos.class },
  { title: 'Learn a new skill', count: 'Practical outcomes', image: photos.coding },
  { title: 'Language coaching', count: 'Real conversations', image: photos.english },
];

const subjects = [
  {
    name: 'Mathematics',
    icon: Calculator,
    caption: 'Build problem-solving confidence',
  },
  {
    name: 'Physics',
    icon: Atom,
    caption: 'Understand the world',
  },
  {
    name: 'Programming',
    icon: CodeXml,
    caption: 'Make something amazing',
  },
  {
    name: 'IELTS',
    icon: Mic,
    caption: 'Speak with confidence',
  },
  {
    name: 'English',
    icon: BookOpen,
    caption: 'Express every idea',
  },
  {
    name: 'Chemistry',
    icon: FlaskConical,
    caption: 'Explore every reaction',
  },
];

const questions = [
  [
    'How do I find a tuition that fits my needs?',
    'On the Tuitions page, filter by subject, class level, and learning mode. Open a listing to check the monthly fee and how many classes it offers each week.',
  ],
  [
    'What do I need to apply for a tuition?',
    'Sign in as a student, open the listing, and enter your phone number, preferred schedule, and a short note about what you want to learn. Then select “Apply for this tuition.”',
  ],
  [
    'Where can I track my application?',
    'Open “My applications” in your student dashboard. Your application starts as Pending and updates to Accepted or Rejected when the tutor responds.',
  ],
  [
    'How do I publish a tuition listing as a tutor?',
    'Create a tutor account and select “Post a tuition” in your dashboard. Add the subject, class level, learning mode, and monthly fee. Your listing appears publicly after admin approval.',
  ],
  [
    'Can I use MentorLagbe on the Free plan?',
    'Yes. Students can browse and apply for tuitions, and tutors can create up to two listings on Free. Pro Tutor removes the listing limit.',
  ],
];

function Photo({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}

export default function Home() {
  const [featured, setFeatured] = useState<{
    status: 'loading' | 'ready' | 'error';
    items: Tuition[];
  }>({ status: 'loading', items: [] });

  const [openFAQ, setOpenFAQ] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const currentReview = reviewSlides[activeReview];

  useEffect(() => {
    const controller = new AbortController();

    request<{ items: (Tuition & { _id?: string })[] }>(
      '/api/tuitions?limit=6',
      { signal: controller.signal },
    )
      .then(({ items }) => {
        if (controller.signal.aborted) return;

        const uniqueItems = new Map<string, Tuition>();

        for (const item of items) {
          const id = item.id || item._id;

          if (typeof id === 'string' && id) {
            uniqueItems.set(id, { ...item, id });
          }
        }

        setFeatured({ status: 'ready', items: [...uniqueItems.values()] });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFeatured({ status: 'error', items: [] });
        }
      });

    return () => controller.abort();
  }, []);
  return (
    <main>
      {/* Hero section */}
      <section
        aria-labelledby="home-hero-title"
        className="relative isolate grid min-h-[640px] grid-rows-[1fr_auto] items-center gap-9 overflow-hidden
          bg-[#201710] bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=2200&q=90')]
          bg-cover bg-[position:65%_center] px-4 pt-[112px] pb-[76px] text-center text-white
          sm:min-h-[700px] sm:bg-[position:center_48%] sm:px-6
          lg:min-h-[clamp(700px,59.3vw,850px)] lg:gap-10 lg:pt-[128px] lg:pb-[101px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-[#16100c]/60 via-[#16100c]/49 to-[#16100c]/72"
        />

        <motion.div
          className="mx-auto flex w-full max-w-[940px] flex-col items-center gap-5 sm:gap-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex w-full flex-col items-center gap-1.5">
            <p className="flex items-center justify-center gap-1.5 text-[15px] leading-snug font-semibold sm:text-base">
              <span aria-hidden="true">👋</span> Welcome to MentorLagbe!
            </p>

            <h1
              id="home-hero-title"
              className="text-[clamp(2.125rem,8.5vw,3.5rem)] leading-[1.05]! font-extrabold tracking-[-0.048em]! text-balance lg:text-[clamp(3rem,5vw,4.25rem)]"
            >
              Find the right mentor.{' '}
              <span className="sm:block">Unlock your potential.</span>
            </h1>
          </div>

          <p className="max-w-[655px] text-base leading-relaxed font-medium text-balance sm:text-lg sm:leading-[1.75]">
            Personalized tuition and mentorship that meets you where you are — and helps
            you go further.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <Link
              href="/tuitions"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#cf4429] px-5 text-sm font-bold
                transition-[background-color,transform] hover:bg-[#b73b23] focus-visible:outline-2 focus-visible:outline-offset-4
                focus-visible:outline-white motion-safe:hover:-translate-y-0.5 sm:min-w-[188px] sm:px-6 sm:text-[15px]"
            >
              Explore mentors <ArrowUpRight size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/how-it-works"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold
                text-[#54697f]! transition-[background-color,transform] hover:bg-[#f4ede7] focus-visible:outline-2
                focus-visible:outline-offset-4 focus-visible:outline-white motion-safe:hover:-translate-y-0.5
                sm:min-w-[176px] sm:px-6 sm:text-[15px]"
            >
              <Play size={15} fill="currentColor" aria-hidden="true" /> How it works
            </Link>
          </div>
        </motion.div>

        <ul
          className="mx-auto flex w-full max-w-[780px] flex-wrap justify-center gap-x-5 gap-y-2.5 text-sm leading-normal font-semibold sm:gap-x-9 sm:text-base"
          role="list"
        >
          {heroBenefits.map((benefit) => (
            <li key={benefit} className="inline-flex items-center gap-2.5">
              <Check
                size={16}
                className="shrink-0 text-[#b5cce0]"
                aria-hidden="true"
              />
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      {/* Platform benefits section */}
      <section
        aria-label="MentorLagbe benefits"
        className="relative z-10 -mt-[34px] rounded-t-[34px] bg-[#f1eee9]
          px-5 pt-9 pb-9 text-[#101024] sm:px-7
          lg:-mt-[50px] lg:rounded-t-[50px] lg:pt-[60px] lg:pb-[34px]
          [html.dark_&]:bg-[var(--cream)] [html.dark_&]:text-[var(--ink)]"
      >
        <ul
          role="list"
          className="mx-auto grid max-w-[640px] grid-cols-1 gap-x-6 gap-y-8
            min-[460px]:grid-cols-2
            lg:max-w-[1140px] lg:grid-cols-4 lg:gap-x-[clamp(20px,3.3vw,44px)]"
        >
          {platformFeatures.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex min-w-0 items-start gap-4 lg:gap-6">
              <Icon
                aria-hidden="true"
                strokeWidth={1.25}
                className="mt-1 size-9 shrink-0 text-[#302b2b]
                  drop-shadow-[1px_1px_0_#e2a18a] lg:size-[46px]
                  [html.dark_&]:text-[#f5a88b]"
              />

              <div className="flex min-w-0 flex-col gap-2.5 lg:gap-4">
                <h2
                  className="text-lg! leading-[1.4]! font-extrabold tracking-[-0.02em]!
                    lg:min-h-14 lg:max-w-[148px] lg:text-[19.2px]!"
                >
                  {title}
                </h2>

                <p
                  className="text-sm leading-[1.45] text-[#62768b]
                    lg:max-w-[160px] lg:text-[15px]
                    [html.dark_&]:text-[var(--muted)]"
                >
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Learning categories section */}
      <section
        aria-labelledby="learning-categories-title"
        className="relative isolate overflow-hidden border-t border-[#d8d0c54d]
          bg-[#f1eee9] pt-16 pb-20 text-[#101024] lg:pt-[90px] lg:pb-[120px]
          [html.dark_&]:border-[var(--border)] [html.dark_&]:bg-[var(--cream)]
          [html.dark_&]:text-[var(--ink)]"
      >
        {/* Decorative stars */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 hidden text-[#fef4ea]
            lg:block [html.dark_&]:opacity-10"
        >
          <span className="absolute -top-5 left-8 text-[155px] leading-none">
            ✦
          </span>
          <span className="absolute top-27 -left-1 text-[104px] leading-none">
            ✦
          </span>
        </div>

        {/* Paper edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-[var(--paper)] lg:h-5"
        />

        <div className="container relative z-10">
          <motion.div
            {...reveal}
            className="flex flex-col items-center gap-2.5 text-center"
          >
            <p className="flex items-center gap-1.5 text-[11px] leading-4 font-extrabold
              tracking-[0.1em] text-[#ed603e] [html.dark_&]:text-[#f5a88b]">
              <span aria-hidden="true" className="text-base leading-none">✳</span>
              LEARN IN YOUR OWN WAY
            </p>

            <h2
              id="learning-categories-title"
              className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]!
                font-bold tracking-[-0.048em]! text-balance pb-10"
            >
              Prepare for your exams and build skills beyond the classroom
            </h2>

            <p className="sr-only">
              From exam preparation to lifelong skills, the right learning experience
              is closer than you think.
            </p>
          </motion.div>

          {/* Category cards */}
          <div className="mt-6 grid grid-cols-2 items-start gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                {...reveal}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="min-w-0 lg:even:mt-10"
              >
                <Link
                  href="/tuitions"
                  className="group relative isolate flex aspect-[3/4] items-end justify-center
                    overflow-hidden rounded-[18px] bg-[#302a24] px-2.5 pb-6 text-center text-white!
                    sm:rounded-[24px] sm:px-4 lg:pb-[42px]
                    focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c4472f]"
                >
                  <Photo
                    src={category.image}
                    alt=""
                    className="absolute inset-0 -z-20 size-full object-cover
                      motion-safe:transition-transform motion-safe:duration-500
                      motion-safe:group-hover:scale-105"
                  />

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b
                      from-transparent from-25% via-[#171614]/25 via-55% to-[#191817]"
                  />

                  <span className="flex max-w-[190px] flex-col">
                    <strong className="text-base leading-[1.4] font-extrabold
                      tracking-[-0.025em] text-balance sm:text-lg lg:text-xl">
                      {category.title}
                    </strong>
                    <span className="sr-only">{category.count}</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Category CTA */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1
            text-center text-sm font-bold sm:text-base">
            <span>✳ A better way to find the help you need</span>
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-1 underline! decoration-[#ed603e]
                decoration-2 underline-offset-3 hover:text-[#b73b23]!
                [html.dark_&]:hover:text-[#f5a88b]!"
            >
              Discover all opportunities <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>


      {/* Featured tuitions section */}
      <section
        aria-labelledby="featured-tuitions-title"
        className="relative isolate overflow-hidden bg-[var(--paper)] pt-16 pb-20
          text-[var(--ink)] lg:pt-[90px] lg:pb-[120px]"
      >
        {/* Decorative stars */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 left-0 hidden text-[#fef4ea]
            lg:block [html.dark_&]:opacity-10"
        >
          <span className="absolute top-0 -left-5 text-[150px] leading-none">✦</span>
          <span className="absolute top-33 -left-10 text-[100px] leading-none">✦</span>
        </div>

        <div className="container relative z-10">
          <motion.div
            {...reveal}
            className="flex flex-col items-center gap-2.5 pb-8 text-center sm:pb-10"
          >
            <p className="flex items-center gap-1.5 text-[11px] leading-4 font-extrabold
              tracking-[0.1em] text-[#ed603e] [html.dark_&]:text-[#f5a88b]">
              <span aria-hidden="true" className="text-base leading-none">✳</span>
              PERSONALIZED LEARNING
            </p>

            <h2
              id="featured-tuitions-title"
              className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]!
                font-bold tracking-[-0.048em]! text-balance"
            >
              Mentorships worth exploring
            </h2>

            <p className="max-w-[460px] text-sm leading-relaxed text-[#62768b]
              sm:text-base [html.dark_&]:text-[var(--muted)]">
              Handpicked from our latest approved opportunities. Start with a subject
              you love.
            </p>
          </motion.div>

          {/* Featured tuition cards */}
          <div
            className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]"
            aria-busy={featured.status === 'loading'}
            aria-label={
              featured.status === 'loading' ? 'Loading featured tuitions' : undefined
            }
          >
            {featured.status === 'loading' ? (
              Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="overflow-hidden rounded-[24px] border border-[var(--border)]
                    bg-[var(--card)] motion-safe:animate-pulse"
                >
                  <div className="aspect-[4/3] rounded-b-[24px] bg-[var(--cream)]" />

                  <div className="flex flex-col gap-3 p-6">
                    <div className="h-3 w-24 rounded-full bg-[var(--cream)]" />
                    <div className="h-5 w-full rounded-full bg-[var(--cream)]" />
                    <div className="h-5 w-3/4 rounded-full bg-[var(--cream)]" />
                    <div className="mt-2 h-3 w-28 rounded-full bg-[var(--cream)]" />
                    <div className="mt-4 h-3 w-2/3 rounded-full bg-[var(--cream)]" />
                  </div>
                </div>
              ))
            ) : featured.status === 'error' ? (
              <div className="col-span-full">
                <EmptyState
                  title="Unable to load featured tuitions"
                  description="Refresh the page to try again."
                />
              </div>
            ) : featured.items.length ? (
              featured.items.map((tuition, index) => (
                <motion.div
                  key={tuition.id}
                  {...reveal}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.07 }}
                  className="min-w-0"
                >
                  <TuitionCard tuition={tuition} variant="featured" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  title="No approved tuitions yet"
                  description="New mentor listings will appear here once they are approved."
                />
              </div>
            )}
          </div>

          {/* Browse all tuitions */}
          <div className="mt-10 flex justify-center text-center text-sm font-bold lg:mt-12">
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-1.5 underline! decoration-[#ed603e]
                decoration-2 underline-offset-4 hover:text-[#b73b23]!
                [html.dark_&]:hover:text-[#f5a88b]!"
            >
              Browse all tuitions <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>


      {/* Learning marquee */}
      <section
        aria-hidden="true"
        className="overflow-hidden bg-[var(--paper)] py-7 sm:py-9 lg:pt-0 lg:pb-10"
      >
        <div
          className="flex w-max items-center gap-6 whitespace-nowrap pl-5
            text-[clamp(3rem,8vw,7rem)] leading-none font-medium
            tracking-[-0.04em] text-transparent [font-family:Fraunces,Georgia,serif]
            [-webkit-text-stroke:1px_#656565]
            sm:gap-10 lg:pl-[50px]
            [html.dark_&]:[-webkit-text-stroke:1px_#aeb5bd]
            motion-safe:animate-[slidewords_32s_linear_infinite]"
        >
          {[0, 1].map((index) => (
            <div key={index} className="flex shrink-0 items-center gap-6 sm:gap-10">
              <span>Learn with Confidence</span>

              <span className="text-[0.7em] [-webkit-text-stroke:1.5px_#ed603e]">
                ✳
              </span>

              <span>Grow with Purpose</span>

              <span className="text-[0.7em] [-webkit-text-stroke:1.5px_#ed603e]">
                ✳
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* About MentorLagbe */}
      <section
        aria-labelledby="about-mentorlagbe-title"
        className="bg-[var(--paper)] pt-12 pb-20 text-[var(--ink)]
          lg:pt-[52px] lg:pb-[120px]"
      >
        <div
          className="container relative z-10 grid items-center gap-10
            lg:grid-cols-2 lg:gap-[56px]"
        >
          <motion.div {...reveal} className="flex flex-col items-start">
            <p
              className="flex items-center gap-1.5 text-[11px] leading-4 font-extrabold
                tracking-[0.1em] text-[#ed603e] [html.dark_&]:text-[#f5a88b]"
            >
              <span aria-hidden="true" className="text-base leading-none">✳</span>
              ABOUT MENTORLAGBE
            </p>

            <div className="mt-3 flex max-w-[540px] flex-col gap-5 sm:gap-6">
              <h2
                id="about-mentorlagbe-title"
                className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]!
                  font-bold tracking-[-0.048em]! text-balance"
              >
                Learning feels different when someone gets you
              </h2>

              <p className="text-[15px] leading-[1.75] text-[#62768b] [html.dark_&]:text-[var(--muted)]">
                Big goals begin with small, consistent steps. Our platform brings
                motivated learners and thoughtful tutors together, making it simpler
                to find the personal support that helps ideas click.
              </p>
            </div>

            <ul className="mt-7 flex flex-col gap-4 sm:mt-8 sm:gap-5" role="list">
              {[
                'Find mentors by subject and learning level',
                'Choose online or offline classes',
                'Keep track of every application',
              ].map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-base leading-snug font-bold
                    sm:text-lg [font-family:Manrope,sans-serif]"
                >
                  <CheckCircle2
                    size={17}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-[#6c8198] [html.dark_&]:text-[#f5a88b]"
                  />
                  {benefit}
                </li>
              ))}
            </ul>

            <Link
              href="/how-it-works"
              className="mt-8 inline-flex min-h-[50px] items-center gap-2 rounded-full
                bg-[#ed603e] px-5 text-sm font-bold text-white!
                transition-colors hover:bg-[#ae3823] sm:mt-10
                focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed603e]"
            >
              Explore our approach <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </motion.div>

          {/* About visual */}
          <motion.div
            {...reveal}
            className="relative isolate mx-auto w-full max-w-[560px] px-4 py-6 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-5 inset-y-5 -z-10 rotate-[-7deg]
                rounded-[36px] bg-[#fceee7] [html.dark_&]:bg-[#44312a]"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-3 z-10 rotate-12
                text-5xl leading-none text-[#ed603e] sm:text-6xl"
            >
              ✳
            </span>

            <div className="aspect-[5/4] overflow-hidden rounded-[26px]">
              <Photo
                src={photos.group}
                alt="Students collaborating at a table"
                className="size-full object-cover"
              />
            </div>

            <div
              className="absolute right-2 bottom-2 flex items-center gap-3 rounded-2xl
                bg-[var(--paper)] px-4 py-3 text-[var(--ink)]
                shadow-[0_8px_28px_#26170d14] sm:right-0 sm:bottom-3 sm:px-5"
            >
              <strong className="text-xl font-extrabold text-[#ed603e] [html.dark_&]:text-[#f5a88b]">
                01:01
              </strong>
              <span className="max-w-[130px] text-xs leading-snug font-semibold">
                Learning that is personal to you
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why MentorLagbe section */}
      <section
        aria-labelledby="why-mentorlagbe-title"
        className="bg-[var(--cream)] pt-16 pb-18 text-[var(--ink)]
          lg:pt-[90px] lg:pb-[120px]"
      >
        <div className="container relative z-10">
          <motion.div
            {...reveal}
            className="flex flex-col items-center gap-2.5 pb-8 text-center sm:pb-10"
          >
            <p
              className="flex items-center gap-1.5 text-[11px] leading-4
                font-extrabold tracking-[0.1em] text-[#ed603e]"
            >
              <span aria-hidden="true" className="text-base leading-none">✳</span>
              WHAT MAKES US DIFFERENT
            </p>

            <h2
              id="why-mentorlagbe-title"
              className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]!
                font-bold tracking-[-0.048em]! text-balance"
            >
              Guidance built around you
            </h2>

            <p
              className="max-w-[520px] text-sm leading-relaxed text-[#62768b]
                sm:text-base [html.dark_&]:text-[var(--muted)]"
            >
              A simple, thoughtful learning experience — whether you are looking for
              help or ready to share what you know.
            </p>
          </motion.div>

          {/* Benefit cards */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              {
                icon: GraduationCap,
                title: 'Find your fit',
                text: 'Explore subjects, compare clear monthly fees, and choose mentors at your own pace.',
              },
              {
                icon: Trophy,
                title: 'Make a connection',
                text: 'Apply with your schedule and learning goals so tutors know how to support you.',
              },
              {
                icon: ScrollText,
                title: 'Learn with purpose',
                text: 'Focus on your next milestone with personalized academic or practical guidance.',
              },
              {
                icon: Globe,
                title: 'Grow together',
                text: 'Tutors keep students updated, and learners stay in control of their journey.',
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <motion.article
                key={title}
                {...reveal}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="flex min-w-0 flex-col items-start rounded-[24px]
                  border border-[var(--border)] bg-[var(--card)] p-5
                  transition-colors hover:border-[#ed603e]/60 sm:p-6"
              >
                <div className="flex h-12 items-center">
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.25}
                    className="size-9 shrink-0 text-[#302b2b] drop-shadow-[1px_1px_0_#ed603e]
                      lg:size-[46px] [html.dark_&]:text-[var(--ink)]"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-2.5">
                  <h3 className="text-[20px]! leading-[1.35]! font-bold tracking-[-0.02em]!">
                    {title}
                  </h3>

                  <p className="text-[15px] leading-[1.7] text-[#62768b] [html.dark_&]:text-[var(--muted)]">
                    {text}
                  </p>
                </div>

                <div className="mt-auto pt-5">
                  <Link
                    href="/how-it-works"
                    aria-label={`Learn more about ${title}`}
                    className="inline-flex size-10 items-center justify-center rounded-full
                      border border-[#ed603e]/35 text-[#ed603e]!
                      transition-colors hover:bg-[#ed603e]/10 focus-visible:outline-2
                      focus-visible:outline-offset-4 focus-visible:outline-[#ed603e]"
                  >
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Learning quote banner */}
      <section
        aria-labelledby="learning-quote-title"
        className="wide-image-section mt-8 sm:mt-12 lg:mt-24"
      >
        <div className="container">
          <div
            className="wide-photo"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(22, 28, 24, .55), rgba(22, 28, 24, .2)), url('${photos.study}')`,
            }}
          >
            <span className="wide-quote-mark text-[#ed603e]!" aria-hidden="true">
              “
            </span>

            <h2
              id="learning-quote-title"
              className="max-w-[820px] text-[clamp(40px,5vw,72px)]! leading-[1.05]!
                font-extrabold tracking-[-0.048em]! text-balance"
            >
              Every great learner
              <br />
              was once a beginner.
            </h2>

            <p className="max-w-[540px] text-base! leading-relaxed font-medium sm:text-lg! lg:text-xl! pb-12">
              Your next breakthrough starts with a conversation.
            </p>

            <Link
              href="/tuitions"
              className="round-image-link"
              aria-label="Browse mentorships"
            >
              <ArrowUpRight size={23} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Explore subjects section */}
      <section
        aria-labelledby="explore-subjects-title"
        className="relative isolate overflow-hidden rounded-t-2xl
          bg-[linear-gradient(180deg,transparent_76%,#c8ddf6_100%),linear-gradient(110deg,#e8f1f4_0%,#edf0f7_48%,#f8ddd6_100%)]
          pt-16 pb-16 text-[var(--ink)] sm:py-20 lg:pt-[88px] lg:pb-24
          [html.dark_&]:bg-[linear-gradient(110deg,#19252b_0%,#202b30_52%,#322825_100%)]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block [html.dark_&]:opacity-15">
          {['top-[70px] left-[18%]', 'top-[160px] left-[4%]', 'top-[120px] right-[2%]'].map(position => (
            <span key={position} className={`absolute h-8 w-20 ${position}`}>
              <span className="absolute inset-x-0 bottom-0.5 h-[18px] rounded-[50%]
                bg-linear-to-b from-[#fffdf8] to-[#e3ddd8]" />
              <span className="absolute bottom-0 left-[16px] size-5 rounded-full
                bg-[radial-gradient(circle_at_35%_25%,#fffdf8,#e9e2dc)]" />
              <span className="absolute bottom-0 left-[27px] size-8 rounded-full
                bg-[radial-gradient(circle_at_35%_20%,#fffdf8,#e0d9d4)]" />
            </span>
          ))}
        </div>

        <div className="container">
          <motion.div
            {...reveal}
            className="flex flex-col items-center gap-2.5 pb-6 text-center"
          >
            <p className="text-[11px] leading-4 font-extrabold tracking-[0.12em] text-[#ed603e]">
              <span aria-hidden="true" className="text-base leading-none">✳</span> EXPLORE SUBJECTS 
            </p>

            <h2
              id="explore-subjects-title"
              className="text-[clamp(1.875rem,3.6vw,2.875rem)]! leading-[1.19]!
                font-bold tracking-[-0.048em]! text-balance"
            >
              What would you like to learn?
            </h2>

            <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-[#52677b]
              sm:text-base sm:leading-7 [html.dark_&]:text-[var(--muted)]">
              Explore popular topics and discover mentors who can help you turn
              interest into progress.
            </p>
          </motion.div>

          <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map(({ name, icon: Icon, caption }) => (
              <Link
                key={name}
                href={`/tuitions?subject=${encodeURIComponent(name)}`}
                className="group grid min-h-[102px] min-w-0 grid-cols-[auto_minmax(0,1fr)_auto]
                  items-center gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--card)]
                  px-4 py-4 shadow-[0_4px_16px_#2436450a]
                  transition-[border-color,box-shadow,translate] hover:border-[#ed603e]/55
                  hover:shadow-[0_8px_22px_#24364514] motion-safe:hover:-translate-y-0.5
                  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed603e]
                  sm:min-h-[112px] sm:gap-4 sm:px-5"
              >
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-[14px] bg-[#fff0e9]
                    text-[#ed603e] ring-1 ring-[#ed603e]/10 ring-inset sm:size-14
                    [html.dark_&]:bg-[#ed603e]/15 [html.dark_&]:text-[#ffb7a4]"
                >
                  <Icon size={25} strokeWidth={1.8} />
                </span>

                <div className="min-w-0">
                  <h3 className="text-base! leading-[1.3]! font-bold tracking-[-0.02em]! sm:text-lg!">
                    {name}
                  </h3>
                  <p className="mt-1! text-sm leading-[1.45] text-[#52677b]
                    [html.dark_&]:text-[var(--muted)]">
                    {caption}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="grid size-8 place-items-center rounded-full bg-[#fbf1ef]
                    text-[#8a5245] transition-colors sm:size-9 group-hover:bg-[#ed603e]
                    group-hover:text-[#24160f] [html.dark_&]:bg-[#ed603e]/15
                    [html.dark_&]:text-[#ffb7a4] [html.dark_&]:group-hover:bg-[#ed603e]
                    [html.dark_&]:group-hover:text-[#24160f]"
                >
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-7 text-center">
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-1.5 text-sm font-bold underline!
                decoration-[#ed603e] decoration-2 underline-offset-4 focus-visible:outline-2
                focus-visible:outline-offset-4 focus-visible:outline-[#ed603e]"
            >
              Explore all subjects <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the mentors */}
      <section
        aria-labelledby="meet-mentors-title"
        className="bg-linear-to-b from-[var(--paper)] to-[var(--cream)]
          pt-14 pb-16 text-[var(--ink)] lg:pt-24 lg:pb-20"
      >
        <div className="container relative z-10">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <p
              className="flex items-center gap-1.5 text-[11px] leading-4
                font-extrabold tracking-[0.1em] text-[#ed603e]"
            >
              <span aria-hidden="true" className="text-base leading-none">✳</span>
              MEET THE PEOPLE BEHIND PROGRESS
            </p>

            <h2
              id="meet-mentors-title"
              className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]!
                font-bold tracking-[-0.048em]! text-balance"
            >
              Good mentors change everything
            </h2>

            <p
              className="mt-3 max-w-[520px] text-sm leading-relaxed text-[#62768b]
                sm:text-base sm:leading-7 [html.dark_&]:text-[var(--muted)]"
            >
              A community of educators, makers and specialists ready to share what
              they know.
            </p>
          </div>

          {/* Mentor portraits */}
          <ul
            role="list"
            className="mt-15 grid w-full grid-cols-2 items-start gap-x-3 gap-y-6
              sm:gap-x-5 lg:grid-cols-4 lg:gap-x-4"
          >
            {[
              {
                name: 'Farhan Ahmed',
                topic: 'Mathematics & Physics',
                src: photos.mentor,
              },
              {
                name: 'Nusrat Jahan',
                topic: 'English & IELTS',
                src: photos.woman,
              },
              {
                name: 'Teaching community',
                topic: 'Skill-based guidance',
                src: photos.mentor2,
              },
              {
                name: 'New perspectives',
                topic: 'Academic support',
                src: photos.mentor3,
              },
            ].map(({ name, topic, src }) => (
              <li key={name} className="min-w-0 text-center">
                <div
                  className="mx-auto aspect-square w-full max-w-[270px] overflow-hidden
                    rounded-full bg-[var(--cream)]"
                >
                  <Photo
                    src={src}
                    alt=""
                    className="size-full object-cover object-center"
                  />
                </div>

                <h3
                  className="mt-3! text-base! leading-[1.35]! font-bold
                    tracking-[-0.02em]! sm:mt-4! sm:text-xl!"
                >
                  {name}
                </h3>

                <p
                  className="mt-1! text-sm leading-snug text-[#576b81]
                    sm:text-[15px] [html.dark_&]:text-[var(--muted)]"
                >
                  {topic}
                </p>
              </li>
            ))}
          </ul>

          {/* MentorLagbe quick links */}
          <nav
            aria-label="MentorLagbe quick links"
            className="relative isolate mt-12 rounded-[20px] bg-[#202427] px-5 py-5
              text-white sm:mt-14 sm:px-7 sm:py-8 lg:mt-[72px] lg:py-14
              lg:pr-[96px] lg:pl-10 xl:pr-28 xl:pl-[70px]"
          >
            <ul
              role="list"
              className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-y-4
                lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-white/20"
            >
              {[
                {
                  title: 'Find a tutor',
                  text: 'Browse approved tuition listings by subject and class level.',
                  href: '/tuitions',
                },
                {
                  title: 'How to apply',
                  text: 'Learn how to share your goals and availability when you apply.',
                  href: '/how-it-works',
                },
                {
                  title: 'Track applications',
                  text: 'Check your application status in your student dashboard.',
                  href: '/dashboard/student/my-applications',
                },
                {
                  title: 'Compare plans',
                  text: 'See what is included in Free, Pro Student and Pro Tutor.',
                  href: '/pricing',
                },
              ].map(({ title, text, href }) => (
                <li key={href} className="min-w-0">
                  <Link
                    href={href}
                    className="group block h-full rounded-lg px-3 py-3 sm:px-5 lg:py-1.5
                      focus-visible:outline-2 focus-visible:outline-offset-[-2px]
                      focus-visible:outline-[#ed603e]"
                  >
                    <h3
                      className="text-lg! leading-[1.35]! font-bold tracking-[-0.02em]!
                        text-white transition-colors group-hover:text-[#ed603e] sm:text-xl!"
                    >
                      {title}
                    </h3>

                    <p className="mt-3! text-sm leading-relaxed text-[#bcc2c7] sm:text-[15px]">
                      {text}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Decorative 3D illustration */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 bottom-0 hidden w-[112px]
                select-none lg:block xl:-right-7 xl:w-[140px]"
            >
              <Image
                src={mentorChat}
                alt=""
                sizes="(min-width: 1280px) 140px, 112px"
                className="h-auto w-full"
              />
            </div>
          </nav>
        </div>
      </section>

      {/* Pricing */}
      <section
        aria-labelledby="home-pricing-title"
        className="bg-[var(--cream)] py-16 text-[var(--ink)] sm:py-20 lg:pt-[46px] lg:pb-[112px]"
      >
        <div className="container">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <p
              className="flex items-center gap-1.5 text-[11px] leading-4
                font-extrabold tracking-[0.1em] text-[#ed603e]"
            >
              <span aria-hidden="true" className="text-base leading-none">✳</span>
              FIND YOUR PLAN
            </p>

            <h2
              id="home-pricing-title"
              className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]!
                font-bold tracking-[-0.048em]! text-balance"
            >
              Plans for every ambition
            </h2>

            <p
              className="mt-3 max-w-[520px] text-sm leading-relaxed text-[#62768b]
                sm:text-base sm:leading-7 [html.dark_&]:text-[var(--muted)]"
            >
              Start for free. Unlock more when you&apos;re ready to take the next step.
            </p>
          </div>

          <div
            className="mx-auto mt-9 grid max-w-[600px] grid-cols-1 gap-5
              lg:mt-12 lg:max-w-none lg:grid-cols-3 lg:gap-6"
          >
            {[
              {
                audience: 'FOR EVERYONE',
                name: 'Free',
                price: '$0',
                priceNote: '/ always',
                description: 'Everything you need to begin learning or offering your first sessions.',
                benefits: [
                  'Browse approved tuition listings',
                  'Send and manage applications',
                  'Tutors can post up to 2 listings',
                ],
                href: '/sign-up',
                action: 'Get started for free',
              },
              {
                audience: 'FOR STUDENTS',
                name: 'Pro Student',
                price: '$10',
                priceNote: '/ upgrade',
                description: 'Learning perks for students who want to go one step further.',
                benefits: [
                  'Everything in Free',
                  'Pro membership status',
                  'Priority booking benefits',
                ],
                href: '/pricing',
                action: 'Choose student Pro',
                featured: true,
              },
              {
                audience: 'FOR MENTORS',
                name: 'Pro Tutor',
                price: '$15',
                priceNote: '/ upgrade',
                description: 'More room for the impact you want to make as an educator.',
                benefits: [
                  'Unlimited tuition listings',
                  'Pro tutor badge',
                  'All dashboard tools',
                ],
                href: '/pricing',
                action: 'Choose tutor Pro',
              },
            ].map(({ audience, name, price, priceNote, description, benefits, href, action, featured }) => (
              <article
                key={name}
                className={`flex min-w-0 flex-col rounded-[26px] border p-6 sm:p-8 ${
                  featured
                    ? 'border-[#202427] bg-[#202427] text-white [--pricing-muted:#c4c9cc] [--pricing-divider:#ffffff2e]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--ink)] [--pricing-muted:#576b81] [--pricing-divider:var(--border)] [html.dark_&]:[--pricing-muted:var(--muted)]'
                }`}
              >
                <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold tracking-[0.1em] text-[var(--pricing-muted)]">
                    {audience}
                  </span>

                  {featured && (
                    <span
                      className="rounded-full bg-[#ed603e] px-2.5 py-1 text-[10px]
                        leading-4 font-extrabold tracking-[0.07em] text-[#24160f]"
                    >
                      FEATURED PLAN
                    </span>
                  )}
                </div>

                <h3 className="mt-4! text-base! leading-[1.35]! font-bold tracking-[-0.02em]! sm:text-xl!">
                  {name}
                </h3>

                <div className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span
                    className="text-[clamp(2.75rem,4.5vw,3.75rem)] leading-none
                      font-extrabold tracking-[-0.065em] [font-family:Manrope,sans-serif]"
                  >
                    {price}
                  </span>
                  <span className="text-sm font-medium text-[var(--pricing-muted)]">
                    {priceNote}
                  </span>
                </div>

                <p
                  className="mt-4! text-sm leading-6 text-[var(--pricing-muted)]
                    lg:min-h-[72px] xl:min-h-12"
                >
                  {description}
                </p>

                <ul
                  role="list"
                  className="mt-5 space-y-3 border-t border-[var(--pricing-divider)] pt-5"
                >
                  {benefits.map(benefit => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm leading-6">
                      <span
                        className="mt-0.5 grid size-5 shrink-0 place-items-center
                          rounded-full bg-[#ed603e]/15 text-[#ed603e]"
                      >
                        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <Link
                    href={href}
                    className={`relative inline-flex min-h-12 w-full items-center justify-center
                      rounded-full border border-[#ed603e] px-10 py-2 text-center text-sm
                      font-bold transition-shadow hover:shadow-[0_0_0_3px_#ed603e33]
                      focus-visible:outline-2 focus-visible:outline-offset-4
                      focus-visible:outline-[#ed603e] ${
                        featured
                          ? 'bg-[#ed603e] text-[#24160f]!'
                          : 'text-[var(--ink)]!'
                      }`}
                  >
                    {action}
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="absolute top-1/2 right-4 -translate-y-1/2"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Review */}
      <section
        aria-labelledby="home-review-title"
        className="border-b border-[var(--border)] bg-[var(--paper)]
          pt-12 pb-8 text-[var(--ink)] sm:pt-24 sm:pb-20"
      >
        <div className="container">
          <h2 id="home-review-title" className="sr-only">
            The learning community
          </h2>

          <div
            aria-hidden="true"
            className="relative flex h-[132px] items-end justify-center sm:h-[208px]"
          >
            {[
              { src: photos.woman, position: 'top-0 left-[2%] size-12 sm:size-[66px]' },
              { src: photos.mentor2, position: 'bottom-2 left-[14%] hidden size-[74px] sm:block' },
              { src: photos.mentor, position: 'top-0 left-[27%] hidden size-[112px] lg:block' },
              { src: photos.smile, position: 'top-1 right-[29%] hidden size-[67px] sm:block' },
              { src: photos.mentor2, position: 'bottom-9 right-[15%] hidden size-[64px] sm:block' },
              { src: photos.mentor3, position: 'top-4 right-[2%] size-14 sm:size-[92px]' },
            ].map(({ src, position }) => (
              <div
                key={position}
                className={`absolute overflow-hidden rounded-full bg-[var(--cream)] ${position}`}
              >
                <Photo src={src} alt="" className="size-full object-cover grayscale" />
              </div>
            ))}

            <div className="size-[88px] overflow-hidden rounded-full bg-[var(--cream)] sm:size-[120px]">
              <Photo
                src={currentReview.image}
                alt=""
                className="size-full object-cover grayscale"
              />
            </div>
          </div>

          <div
            id="home-review-panel"
            aria-live="polite"
            className="mx-auto mt-8 max-w-[690px] text-center sm:mt-10"
          >
            <Quote
              aria-hidden="true"
              size={30}
              className="mx-auto fill-current text-[#ed603e]"
            />

            <h3
              className="mt-2! text-lg! leading-[1.35]! font-bold
                tracking-[-0.02em]! text-[#ed603e] italic sm:text-xl!"
            >
              {currentReview.title}
            </h3>

            <blockquote
              className="mt-5 text-[clamp(1.125rem,2.1vw,1.625rem)] leading-[1.6]
                text-[#62768b] sm:min-h-[7.5rem] [html.dark_&]:text-[var(--muted)]"
            >
              &ldquo;{currentReview.quote}&rdquo;
            </blockquote>

            <p className="mt-5! text-base font-bold">MentorLagbe Philosophy</p>
            <p className="text-sm text-[#62768b] [html.dark_&]:text-[var(--muted)]">
              Our approach to meaningful learning
            </p>
          </div>

          <div
            role="group"
            aria-label="Review slides"
            className="mt-7 flex justify-center sm:mt-12"
          >
            {reviewSlides.map(({ title }, index) => (
              <button
                key={title}
                type="button"
                aria-label={`Show slide: ${title}`}
                aria-controls="home-review-panel"
                aria-pressed={activeReview === index}
                onClick={() => setActiveReview(index)}
                className="grid size-9 place-items-center rounded-full
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-[#ed603e]"
              >
                <span
                  aria-hidden="true"
                  className={`rounded-full transition-colors ${
                    activeReview === index
                      ? 'size-3 bg-[#ed603e]'
                      : 'size-2 bg-[#9aa6b3] hover:bg-[#ed603e]'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Learning journal */}
      <section
        aria-labelledby="home-journal-title"
        className="bg-[var(--paper)] py-16 text-[var(--ink)] sm:py-20 lg:pt-[112px] lg:pt-[72px]"
      >
        <div className="container">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <p
              className="flex items-center gap-1.5 text-[11px] leading-4
                font-extrabold tracking-[0.1em] text-[#ed603e]"
            >
              <span aria-hidden="true" className="text-base leading-none">✳</span>
              FROM OUR JOURNAL
            </p>

            <h2
              id="home-journal-title"
              className="text-[clamp(2rem,3.75vw,3.25rem)]! leading-[1.19]!
                font-bold tracking-[-0.048em]! text-balance pb-10"
            >
              Practical ideas for{' '}
              <span className="sm:block">learning and teaching.</span>
            </h2>
          </div>

          <div
            className="mt-6 grid w-full grid-cols-1 gap-5
              sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]"
          >
            {[
              {
                tag: 'LEARNING TIPS',
                title: 'How to make the most of your first tutoring session',
                img: photos.library,
              },
              {
                tag: 'STUDENT LIFE',
                title: 'A realistic study routine you can actually stick to',
                img: photos.class,
              },
              {
                tag: 'FOR EDUCATORS',
                title: 'Building confidence through better teaching',
                img: photos.group,
              },
            ].map(({ tag, title, img }, index) => (
              <article key={title} className="min-w-0">
                <Link
                  href="/how-it-works"
                  aria-labelledby={`home-journal-guide-${index}`}
                  className="group flex h-full flex-col rounded-[30px] border
                    border-[var(--border)] bg-[var(--card)] p-3
                    transition-colors hover:border-[#ed603e]/60 sm:p-3.5
                    lg:rounded-[38px] focus-visible:outline-2
                    focus-visible:outline-offset-4 focus-visible:outline-[#ed603e]"
                >
                  <div className="flex flex-1 flex-col px-4 pt-6 pb-8 lg:pt-7 lg:pb-[30px]">
                    <p
                      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]
                        leading-4 font-bold tracking-[0.07em] text-[#62768b]
                        [html.dark_&]:text-[var(--muted)]"
                    >
                      <span>{tag}</span>
                      <span aria-hidden="true" className="text-[#ed603e]">✦</span>
                      <span>5 MIN READ</span>
                    </p>

                    <h3
                      id={`home-journal-guide-${index}`}
                      className="mt-2! pb-5 text-lg! leading-[1.35]! font-bold
                        tracking-[-0.02em]! sm:text-xl! lg:text-[22px]!"
                    >
                      {title}
                    </h3>

                    <span
                      className="mt-auto inline-flex items-center gap-2 text-sm
                        text-[#62768b] [html.dark_&]:text-[var(--muted)]"
                    >
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#ed603e]" />
                      Read learning guide
                    </span>
                  </div>

                  <div className="relative">
                    <div
                      className="aspect-[7/6] overflow-hidden rounded-[22px]
                        bg-[var(--cream)] lg:rounded-[24px]"
                    >
                      <Photo
                        src={img}
                        alt=""
                        className="size-full object-cover motion-safe:transition-transform
                          motion-safe:duration-500 motion-safe:group-hover:scale-105"
                      />
                    </div>

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 right-5 grid size-12
                        -translate-y-1/2 place-items-center rounded-full border
                        border-[var(--border)] bg-[var(--paper)] text-[var(--ink)]
                        transition-colors sm:right-6 sm:size-14 lg:right-7 lg:size-[68px]
                        group-hover:border-[#ed603e] group-hover:bg-[#ed603e]
                        group-hover:text-[#24160f]"
                    >
                      <ArrowUpRight size={23} className="rotate-45" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-bold underline!
                decoration-[#ed603e] decoration-2 underline-offset-4
                focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed603e]"
            >
              Explore learning tips <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>


      {/* Frequently asked questions */}
      <section
        aria-labelledby="home-faq-title"
        className="relative isolate overflow-hidden bg-[var(--paper)]
          py-16 text-[var(--ink)] sm:py-20 lg:py-[96px] border-t border-[var(--border)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[28%] bottom-0 -z-10
            [background:radial-gradient(ellipse_at_26%_51%,#fff0c7,transparent_48%),radial-gradient(ellipse_at_63%_57%,#f8c7cb,transparent_48%),radial-gradient(ellipse_at_95%_42%,#ddd3f8,transparent_47%)]
            [html.dark_&]:opacity-[0.14]"
        />

        <div className="container">
          <div className="mx-auto max-w-[940px]">
            <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-2.5 text-center">
              <p
                className="flex items-center justify-center gap-1.5 text-[11px] leading-4
                  font-extrabold tracking-[0.1em] text-[#ed603e]"
              >
                <span aria-hidden="true" className="text-base leading-none">✳</span>
                GOOD TO KNOW
              </p>

              <h2
                id="home-faq-title"
                className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]!

                font-bold tracking-[-0.048em]! text-balance pb-4"
              >
                Have questions? We’re here to help you get started
              </h2>

              <p
                className="mt-3 max-w-[520px] text-sm leading-relaxed text-[#62768b]
                  sm:text-base sm:leading-7 [html.dark_&]:text-[var(--muted)]"
              >
                Everything you need to feel confident about your first step.
              </p>
            </div>

            <div className="mt-6 divide-y divide-[var(--border)] sm:mt-9">
              {questions.map(([question, answer], index) => {
                const isOpen = openFAQ === index;
                const questionId = `home-faq-question-${index}`;
                const answerId = `home-faq-answer-${index}`;

                return (
                  <div key={question}>
                    <h3>
                      <button
                        id={questionId}
                        type="button"
                        aria-controls={answerId}
                        aria-expanded={isOpen}
                        onClick={() => setOpenFAQ(current => (current === index ? -1 : index))}
                        className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto]
                          items-center gap-3 rounded-xl py-5 text-left sm:gap-6 sm:py-7
                          lg:gap-9 lg:py-8 focus-visible:outline-2
                          focus-visible:outline-offset-4 focus-visible:outline-[#ed603e]"
                      >
                        <span
                          aria-hidden="true"
                          className="grid size-12 place-items-center rounded-[14px]
                            border border-[#c7d4df] bg-[var(--paper)]/40 text-sm
                            leading-none font-bold text-[#62768b] sm:size-[70px]
                            sm:rounded-[19px] sm:text-lg
                            [html.dark_&]:border-[var(--border)]
                            [html.dark_&]:text-[var(--muted)]"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span
                          className="text-base leading-[1.35] font-bold tracking-[-0.02em]
                            transition-colors group-hover:text-[#ed603e] sm:text-xl"
                        >
                          {question}
                        </span>

                        <ChevronDown
                          size={20}
                          aria-hidden="true"
                          className={`shrink-0 transition-transform motion-reduce:transition-none ${
                            isOpen
                              ? 'rotate-180 text-[#ed603e]'
                              : 'text-[#62768b] [html.dark_&]:text-[var(--muted)]'
                          }`}
                        />
                      </button>
                    </h3>

                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      hidden={!isOpen}
                    >
                      <p
                        className="max-w-[850px] pr-7 pb-6 pl-[60px] text-sm leading-7
                          text-[#4b5e71] sm:pb-8 sm:pl-[94px] sm:text-base lg:pl-[106px]
                          [html.dark_&]:text-[var(--muted)]"
                      >
                        {answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Link
              href="/how-it-works"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2
                rounded-full bg-[#ed603e] px-5 py-2 text-center text-sm font-bold
                text-[#ffffff]! transition-shadow hover:shadow-[0_0_0_3px_#ed603e33]
                focus-visible:outline-2 focus-visible:outline-offset-4
                focus-visible:outline-[#ed603e]"
            >
              See how it works
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
