import Link from 'next/link';
import { ArrowUp, ArrowUpRight, BookOpen, CreditCard, Mail, MapPin } from 'lucide-react';

const primaryLinks = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
] as const;

const footerGroups = [
  {
    title: 'Learn',
    links: [
      { label: 'Find a tutor', href: '/tuitions' },
      { label: 'Online lessons', href: '/tuitions?mode=Online' },
      { label: 'Student dashboard', href: '/dashboard/student' },
    ],
  },
  {
    title: 'Teach',
    links: [
      { label: 'Become a tutor', href: '/sign-up' },
      { label: 'Post a tuition', href: '/dashboard/tutor/post-tuition' },
      { label: 'Tutor dashboard', href: '/dashboard/tutor' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'About MentorLagbe', href: '/about' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Compare plans', href: '/pricing' },
    ],
  },
] as const;

const headingFont = '[font-family:var(--font-heading,Manrope,sans-serif)]!';
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a88b]';
const linkStyle = `rounded-sm text-[#bfcbc5]! transition-colors hover:text-[#f5a88b]! ${focus}`;

export default function Footer() {
  return (
    <footer className="bg-[#161817] text-[15px] leading-relaxed text-[#bfcbc5] [font-family:var(--font-body,'DM_Sans',sans-serif)]">
      <div className="mx-auto w-full max-w-[1260px] px-4 pt-11 sm:px-6 sm:pt-14 lg:px-[30px] lg:pt-18">
        <div className="grid items-center gap-6 border-b border-white/15 pb-8 sm:grid-cols-[1fr_auto] sm:pb-10 lg:grid-cols-[1fr_auto_1fr] lg:pb-12">
          <Link
            href="/"
            aria-label="MentorLagbe home"
            className={`inline-flex w-fit items-center gap-3 rounded-sm text-[25px] leading-none font-extrabold
              tracking-[-0.085em] whitespace-nowrap text-white! ${headingFont} ${focus}`}
          >
            <span className="grid size-10 shrink-0 -rotate-12 place-items-center rounded-[50%_50%_48%_16%] bg-[#ed603e] text-white">
              <BookOpen size={22} strokeWidth={2.3} aria-hidden="true" className="rotate-12" />
            </span>
            <span>mentor<span className="font-medium">lagbe</span><span className="text-[#ed603e]">.</span></span>
          </Link>

          <nav aria-label="Footer primary navigation" className="flex flex-wrap gap-x-5 gap-y-2 sm:row-start-2 lg:row-start-auto lg:justify-center">
            {primaryLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={`font-semibold ${linkStyle}`}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:col-start-2 sm:row-start-1 sm:justify-end lg:col-start-3">
            <Link href="/sign-in" className={`font-semibold ${linkStyle}`}>Sign in</Link>
            <Link
              href="/tuitions"
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ed603e]
                bg-[#c3452a] px-4 py-2 text-sm font-bold whitespace-nowrap text-white!
                transition-colors hover:bg-[#a93822] sm:text-[15px] ${focus}`}
            >
              Browse tuitions <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-9 py-10 sm:py-13 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12 lg:py-18 xl:gap-20">
          <div className="min-w-0">
            <h2
              className={`max-w-[520px] text-[clamp(1.875rem,3.5vw,3rem)]! leading-[1.12]!
                font-extrabold tracking-[-0.048em]! text-balance text-white ${headingFont}`}
            >
              Find the right tutor.<br className="hidden sm:block" /> <span className="text-[#ed603e]">Share what you know.</span>
            </h2>
            <p className="mt-4! max-w-[460px] text-[15px] leading-[1.7] sm:text-base">
              MentorLagbe connects learners and tutors in Bangladesh. Find lessons by subject and class level, or offer tuition in the subjects you teach.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/12 pt-5">
              <li className="flex min-w-0 items-center gap-2">
                <Mail size={17} aria-hidden="true" className="shrink-0 text-[#f5a88b]" />
                <a href="mailto:hello@mentorlagbe.com" className={`wrap-anywhere ${linkStyle}`}>hello@mentorlagbe.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={17} aria-hidden="true" className="shrink-0 text-[#f5a88b]" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 sm:gap-x-7 lg:border-l lg:border-white/15 lg:pl-8 xl:pl-10">
            {footerGroups.map(({ title, links }) => (
              <nav key={title} aria-label={title} className="min-w-0">
                <h2 className={`text-base! leading-snug! font-bold tracking-[-0.02em]! text-white ${headingFont}`}>
                  {title}
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link href={href} className={`underline! decoration-white/25 underline-offset-4 hover:decoration-[#f5a88b] ${linkStyle}`}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-x-5 gap-y-3 border-t border-white/15 py-5 text-sm sm:py-7">
          <p className="basis-full sm:mr-auto sm:basis-auto">
            © {new Date().getFullYear()} MentorLagbe. All rights reserved.
          </p>
          <a
            href="#"
            aria-label="Back to top"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ed603e] text-[#ed603e] transition-all duration-300 hover:bg-[#ed603e] hover:text-white ${focus}`}
          >
            <ArrowUp size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
