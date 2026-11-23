'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Check, ChevronRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/Providers';
import { post } from '@/lib/api';

type ProRole = 'student' | 'tutor';

const heroImage =
  'https://images.unsplash.com/photo-1773394184330-64651b3a03d7?auto=format&fit=crop&w=2000&q=85';

export default function Pricing() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [busyPlan, setBusyPlan] = useState<ProRole | null>(null);

  async function checkout(role: ProRole) {
    if (!user) {
      router.push('/sign-in?next=/pricing');
      return;
    }

    if (user.role !== role) {
      toast.info(`The ${role} Pro plan is only available for ${role} accounts.`);
      return;
    }

    if (user.plan === 'pro') {
      toast.success('You already have Pro!');
      return;
    }

    setBusyPlan(role);
    try {
      const data: { url?: string } = await post('/api/payments/checkout', {}, token);
      if (!data.url) {
        throw new Error('Stripe Checkout is currently unavailable.');
      }
      window.location.assign(data.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not open Stripe Checkout.');
    } finally {
      setBusyPlan(null);
    }
  }

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      {/* Photo hero */}
      <section
        aria-labelledby="pricing-title"
        className="relative isolate grid min-h-[310px] place-items-center overflow-hidden
          bg-[var(--deep)] bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80')]
          bg-cover bg-center py-14 sm:min-h-[385px] lg:min-h-[440px]"
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
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center justify-center gap-2 text-[11px] font-extrabold tracking-[0.1em] uppercase"
          >
            <Link
              href="/"
              className="rounded-sm hover:text-[#ffd5c8] focus-visible:outline-2
                focus-visible:outline-offset-4 focus-visible:outline-[var(--orange)]"
            >
              Home
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">Pricing</span>
          </nav>
          <h1
            id="pricing-title"
            className="text-[clamp(2.125rem,8.5vw,3.5rem)] leading-[1.05]! font-extrabold
              tracking-[-0.048em]! text-balance lg:text-[clamp(3rem,5vw,4.25rem)]"
          >
            Pricing plans
          </h1>
          <p className="mx-auto! mt-4! max-w-lg text-[15px] leading-[1.75] text-white/90">
            Start for free, then choose a Pro plan for the way you learn or teach.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section
        aria-labelledby="pricing-plans-title"
        className="relative -mt-12 rounded-t-[2.75rem] bg-[var(--paper)] pt-16 pb-14 sm:rounded-t-[4rem] sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24"
      >
        <div className="container">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <p
              className="flex items-center gap-1.5 text-[11px] leading-4
                font-extrabold tracking-[0.1em] text-[#ed603e]"
            >
              FIND YOUR PLAN
            </p>

            <h2
              id="pricing-plans-title"
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
                role: null,
                action: 'Get started for free',
              },
              {
                audience: 'FOR STUDENTS',
                name: 'Pro Student',
                price: '$10',
                priceNote: '/ month',
                description: 'Learning perks for students who want to go one step further.',
                benefits: [
                  'Everything in Free',
                  'Pro membership status',
                  'Priority booking benefits',
                ],
                role: 'student' as const,
                action: 'Choose student Pro',
                featured: true,
              },
              {
                audience: 'FOR MENTORS',
                name: 'Pro Tutor',
                price: '$15',
                priceNote: '/ month',
                description: 'More room for the impact you want to make as an educator.',
                benefits: [
                  'Unlimited tuition listings',
                  'Pro tutor badge',
                  'All dashboard tools',
                ],
                role: 'tutor' as const,
                action: 'Choose tutor Pro',
              },
            ].map(({ audience, name, price, priceNote, description, benefits, role, action, featured }) => {
              const actionClass = `relative inline-flex min-h-12 w-full items-center justify-center
                rounded-full border border-[#ed603e] px-10 py-2 text-center text-sm!
                font-bold! transition-shadow hover:shadow-[0_0_0_3px_#ed603e33]
                focus-visible:outline-2 focus-visible:outline-offset-4
                focus-visible:outline-[#ed603e] ${
                  featured ? 'bg-[#ed603e] text-[#24160f]!' : 'text-[var(--ink)]!'
                }`;
              const arrow = (
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="absolute top-1/2 right-4 -translate-y-1/2"
                />
              );

              return (
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
                    {role ? (
                      <button
                        type="button"
                        className={actionClass}
                        disabled={busyPlan !== null}
                        onClick={() => void checkout(role)}
                      >
                        {busyPlan === role ? 'Opening Stripe…' : action}
                        {arrow}
                      </button>
                    ) : (
                      <Link
                        href={user ? `/dashboard/${user.role}` : '/sign-up'}
                        className={actionClass}
                      >
                        {user ? 'Go to dashboard' : action}
                        {arrow}
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div
            className="mx-auto mt-7 flex max-w-[680px] items-start gap-3 rounded-2xl
              border border-[var(--border)] bg-[var(--card)] px-4 py-3
              text-sm leading-6 text-[#52677b] sm:mt-9 sm:px-5 [html.dark_&]:text-[var(--muted)]"
          >
            <ShieldCheck size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--orange)]" />
            <p>
              Pay with Stripe Checkout. Your Pro plan activates after your payment is confirmed.
            </p>
          </div>

          <div className="mt-10 text-center">
            <h2 className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]! font-bold tracking-[-0.048em]!">
              Still exploring?
            </h2>
            <p className="mt-3! text-sm leading-relaxed text-[#62768b] sm:text-base sm:leading-7 [html.dark_&]:text-[var(--muted)]">
              Start with the Free plan and choose Pro when you need it.
            </p>
            <Link
              href="/tuitions"
              className="mt-4 inline-flex items-center gap-2 rounded-sm text-sm font-bold text-[#b83e25]!
                underline-offset-4 hover:underline focus-visible:outline-2
                focus-visible:outline-offset-4 focus-visible:outline-[var(--orange)] [html.dark_&]:text-[#f5a88b]!"
            >
              Explore tuition listings <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
