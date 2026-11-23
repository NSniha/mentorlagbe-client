'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import { Spinner } from '@/components/Elements';
import TuitionCard from '@/components/TuitionCard';
import { request } from '@/lib/api';
import type { PageResult, Tuition } from '@/lib/types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1758270705317-3ef6142d306f?auto=format&fit=crop&w=2000&q=85';

const SUBJECTS = [
  'All subjects',
  'Mathematics',
  'Physics',
  'Programming',
  'IELTS',
  'English',
  'Chemistry',
  'Biology',
  'Accounting',
];

const LEVELS = [
  'All levels',
  'Class 6–8',
  'SSC / Class 9–10',
  'Class 9–10',
  'HSC / Class 11–12',
  'University / Adult',
];

const MODES = ['All modes', 'Online', 'Offline'];
const DEFAULT_FILTERS = { search: '', subject: 'All subjects', level: 'All levels', mode: 'All modes' };
const EMPTY_RESULT: PageResult<Tuition> = { items: [], page: 1, pages: 1, total: 0 };

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--orange)]';
const buttonText = 'text-sm! font-bold!';
const muted = 'text-[#52677b] [html.dark_&]:text-[var(--muted)]';

type FilterKey = keyof typeof DEFAULT_FILTERS;
type Layout = 'grid' | 'list';

function FilterGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block xl:hidden">
        <span className="mb-1.5 block text-sm font-bold">{label}</span>
        <span className="relative block">
          <select
            value={value}
            onChange={event => onChange(event.target.value)}
            className={`h-11 w-full min-w-0 appearance-none rounded-xl border border-[var(--border)]
              bg-[var(--paper)] pr-8 pl-3 text-sm! ${focus}`}
          >
            {options.map(option => <option key={option}>{option}</option>)}
          </select>
          <ChevronDown size={15} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
        </span>
      </label>

      <fieldset className="hidden min-w-0 xl:block">
        <legend className="mb-2.5 text-base font-extrabold [font-family:Manrope,sans-serif]">
          {label}
        </legend>
        <div className="space-y-1">
          {options.map(option => (
            <label key={option} className={`flex min-h-7 cursor-pointer items-center gap-2.5 text-sm ${muted}`}>
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={event => onChange(event.target.value)}
                className={`size-4 shrink-0 accent-[var(--orange)] ${focus}`}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function LoadingResults() {
  return (
    <div role="status" className="grid min-h-52 place-items-center rounded-3xl border border-[var(--border)] bg-[var(--card)]">
      <span className="sr-only">Loading tuition listings</span>
      <Spinner />
    </div>
  );
}

function BrowseInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    search: params.get('search') || DEFAULT_FILTERS.search,
    subject: params.get('subject') || DEFAULT_FILTERS.subject,
    level: params.get('classLevel') || DEFAULT_FILTERS.level,
    mode: params.get('mode') || DEFAULT_FILTERS.mode,
  }));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(EMPTY_RESULT);
  const [layout, setLayout] = useState<Layout>('grid');

  const { search, subject, level, mode } = filters;
  const hasFilters = Boolean(search) || subject !== DEFAULT_FILTERS.subject ||
    level !== DEFAULT_FILTERS.level || mode !== DEFAULT_FILTERS.mode;

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const query = new URLSearchParams({ page: String(page), limit: '9' });
      if (search) query.set('search', search);
      if (subject !== DEFAULT_FILTERS.subject) query.set('subject', subject);
      if (level !== DEFAULT_FILTERS.level) query.set('classLevel', level);
      if (mode !== DEFAULT_FILTERS.mode) query.set('mode', mode);

      router.replace(`/tuitions?${query}`, { scroll: false });
      setLoading(true);

      try {
        const data = await request<PageResult<Tuition & { _id?: string }>>(
          `/api/tuitions?${query}`,
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return;

        const items = new Map<string, Tuition>();
        for (const tuition of data.items) {
          const id = tuition.id || tuition._id;
          if (typeof id === 'string' && id) items.set(id, { ...tuition, id });
        }
        setResult({ ...data, items: [...items.values()] });
      } catch {
        if (!controller.signal.aborted) setResult(EMPTY_RESULT);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, subject, level, mode, page, router]);

  function updateFilter(key: FilterKey, value: string) {
    setFilters(current => ({ ...current, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  return (
    <div className="container grid items-start gap-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[260px_minmax(0,1fr)]">
      {/* Tuition filters */}
      <aside aria-labelledby="tuition-filters-title" className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal size={19} aria-hidden="true" className="text-[var(--orange)]" />
          <h2 id="tuition-filters-title" className="text-lg! leading-[1.35]! font-bold tracking-[-0.02em]!">
            Filters
          </h2>
        </div>

        <div className="relative mt-4">
          <Search size={17} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="search"
            aria-label="Search by title or subject"
            value={search}
            placeholder="Search tuitions"
            onChange={event => updateFilter('search', event.target.value)}
            className={`h-11 w-full rounded-xl border border-[var(--border)]
              bg-[var(--paper)] pr-9 pl-9 text-sm! [&::-webkit-search-cancel-button]:hidden ${focus}`}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => updateFilter('search', '')}
              className={`absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center
                rounded-full text-[var(--muted)] hover:bg-[var(--cream)] ${focus}`}
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:gap-6">
          <FilterGroup label="Subject" name="subject" options={SUBJECTS} value={subject} onChange={value => updateFilter('subject', value)} />
          <FilterGroup label="Class level" name="classLevel" options={LEVELS} value={level} onChange={value => updateFilter('level', value)} />
          <FilterGroup label="Learning mode" name="mode" options={MODES} value={mode} onChange={value => updateFilter('mode', value)} />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className={`mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full
              border border-[var(--orange)] px-4 hover:bg-[var(--orange)]/10 ${buttonText} ${focus}`}
          >
            Clear filters <X size={15} aria-hidden="true" />
          </button>
        )}
      </aside>

      {/* Results and view controls */}
      <div className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 sm:mb-8">
          <div>
            <h2
              id="browse-results-title"
              className="text-[clamp(1.875rem,3.38vw,2.875rem)]! leading-[1.19]!
                font-bold tracking-[-0.048em]! text-balance"
            >
              Explore mentorships
            </h2>
            <p aria-live="polite" className={`mt-2! text-sm leading-6 ${muted}`}>
              {loading ? 'Loading listings…' : `Showing ${result.items.length} of ${result.total} listings`}
            </p>
          </div>
          <div role="group" aria-label="Results layout" className="hidden items-center gap-2 sm:flex">
            <span className={`mr-1 text-sm font-semibold ${muted}`}>View</span>
            {([
              { value: 'grid', icon: LayoutGrid, label: 'Grid view' },
              { value: 'list', icon: List, label: 'List view' },
            ] as const).map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                aria-pressed={layout === value}
                onClick={() => setLayout(value)}
                className={`grid size-10 place-items-center rounded-full border border-[var(--border)]
                  transition-colors hover:border-[var(--orange)] aria-pressed:border-[var(--orange)]
                  aria-pressed:bg-[var(--orange)]/10 aria-pressed:text-[#b83e25]
                  [html.dark_&]:aria-pressed:text-[#f5a88b] ${focus}`}
              >
                <Icon size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div aria-busy={loading}>
          {loading ? (
            <LoadingResults />
          ) : result.items.length ? (
            <div
              className={layout === 'grid'
                ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6'
                : `grid grid-cols-1 gap-5
                  sm:[&>article]:grid sm:[&>article]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]
                  sm:[&>article>div:first-child]:aspect-auto sm:[&>article>div:first-child]:min-h-56
                  sm:[&>article>div:first-child]:rounded-none!
                  sm:[&>article>div:first-child>a]:absolute sm:[&>article>div:first-child>a]:inset-0`}
            >
              {result.items.map(tuition => (
                <TuitionCard key={tuition.id} tuition={tuition} variant="featured" />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] px-5 py-12 text-center">
              <BookOpen size={31} aria-hidden="true" className="mx-auto mb-4 text-[var(--orange)]" />
              <h3 className="text-xl! font-bold">No matching tuitions yet</h3>
              <p className={`mt-2! text-sm ${muted}`}>Try another subject or clear the filters to see more opportunities.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && result.pages > 1 && (
          <nav aria-label="Tuition pages" className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(current => current - 1)}
              aria-label="Previous page"
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)]
                bg-[var(--card)] px-3 hover:border-[var(--orange)] sm:px-4 ${buttonText} ${focus}`}
            >
              <ArrowLeft size={16} aria-hidden="true" /> <span className="hidden sm:inline">Previous</span>
            </button>
            {Array.from({ length: result.pages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  aria-label={`Page ${pageNumber}`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                  onClick={() => setPage(pageNumber)}
                  className={`grid size-10 place-items-center rounded-full border border-[var(--border)]
                    bg-[var(--card)] hover:border-[var(--orange)] aria-[current=page]:border-[var(--orange)]
                    aria-[current=page]:bg-[var(--orange)] aria-[current=page]:text-[#24160f]
                    ${buttonText} ${focus}`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              type="button"
              disabled={page >= result.pages}
              onClick={() => setPage(current => current + 1)}
              aria-label="Next page"
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)]
                bg-[var(--card)] px-3 hover:border-[var(--orange)] sm:px-4 ${buttonText} ${focus}`}
            >
              <span className="hidden sm:inline">Next</span> <ArrowRight size={16} aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default function TuitionsPage() {
  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      {/* Photo hero */}
      <section
        aria-labelledby="tuitions-title"
        className="relative isolate grid min-h-[300px] place-items-center overflow-hidden bg-[var(--deep)]
          bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80')]
          bg-cover bg-center pb-14 sm:min-h-[360px] lg:min-h-[420px]"
      >
        <Image src={HERO_IMAGE} alt="" fill unoptimized preload className="object-cover object-[center_45%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
        <div className="container relative text-center text-white">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-[11px] leading-4 font-extrabold tracking-[0.1em]">
            <Link href="/" className={`rounded-sm transition-colors hover:text-[#ffd3c3] ${focus}`}>Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">Browse Tuitions</span>
          </nav>
          <h1
            id="tuitions-title"
            className="text-[clamp(2.125rem,8.5vw,3.5rem)] leading-[1.05]! font-extrabold
              tracking-[-0.048em]! text-balance lg:text-[clamp(3rem,5vw,4.25rem)]"
          >
            Browse Tuitions
          </h1>
          <p className="mx-auto! mt-4! max-w-lg text-[15px] leading-[1.75] text-white/90">
            Find approved tuitions by subject, class level, and learning mode.
          </p>
        </div>
      </section>

      <section
        aria-label="Tuition directory"
        className="relative -mt-12 rounded-t-[2.75rem] bg-[var(--paper)] pt-16 pb-16
          sm:rounded-t-[4rem] sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28"
      >
        <Suspense fallback={<div className="container"><LoadingResults /></div>}>
          <BrowseInner />
        </Suspense>
      </section>
    </main>
  );
}
