'use client';

import Link from 'next/link';
import { ArrowUpRight, Bookmark, CalendarDays, MapPin, MonitorPlay } from 'lucide-react';
import { toast } from 'sonner';
import { request } from '@/lib/api';
import { fallbackImage, formatMoney, type Tuition } from '@/lib/types';
import { useAuth } from './Providers';

type TuitionCardProps = {
  tuition: Tuition;
  showSave?: boolean;
  variant?: 'default' | 'featured';
};

export default function TuitionCard({
  tuition,
  showSave = true,
  variant = 'default',
}: TuitionCardProps) {
  const { user, token } = useAuth();
  const detailHref = `/tuitions/${tuition.id}`;
  const monthlyFee = formatMoney(tuition.monthlyFee);

  const bookmark = async () => {
    if (!user) {
      toast.info('Please sign in as a student to save a tuition.');
      return;
    }

    if (user.role !== 'student') {
      toast.info('Bookmarks are available for students.');
      return;
    }

    try {
      const data = await request<{ saved: boolean }>(
        `/api/student/bookmarks/${tuition.id}`,
        { method: 'POST' },
        token,
      );

      toast.success(data.saved ? 'Saved to your list' : 'Removed from saved tuitions');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (variant === 'featured') {
    return (
      <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[24px]
        border border-[var(--border)] bg-[var(--card)] text-[var(--ink)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-b-[24px] bg-[var(--cream)]">
          <Link href={detailHref} className="block h-full focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed603e]">
            <img
              src={tuition.bannerImage || fallbackImage}
              alt={`${tuition.subject} mentoring session`}
              loading="lazy"
              className="size-full object-cover motion-safe:transition-transform
                motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
            />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/15" />
          </Link>

          <div className="pointer-events-none absolute right-0 bottom-0 rounded-tl-[22px]
            bg-[#ed603e] px-5 py-3 text-sm font-bold text-white">
            {monthlyFee} <span className="text-xs font-medium">/ month</span>
          </div>

          {showSave && (
            <button
              type="button"
              onClick={bookmark}
              aria-label="Save tuition"
              className="absolute top-3 right-3 inline-flex size-9 items-center justify-center
                rounded-full bg-white text-[#101024] hover:bg-[#fff4ed]
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed603e]"
            >
              <Bookmark size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6 xl:px-[30px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]
            leading-4 font-extrabold tracking-[0.11em] uppercase">
            <span className="inline-flex items-center gap-1.5 text-[#ed603e] [html.dark_&]:text-[#f5a88b]">
              <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-current" />
              {tuition.subject}
            </span>
            <span className="text-[var(--muted)]">{tuition.daysPerWeek} days / week</span>
          </div>

          <h3 className="text-xl! leading-[1.35]! font-bold tracking-[-0.025em]!">
            <Link href={detailHref} className="hover:text-[#b73b23]! [html.dark_&]:hover:text-[#f5a88b]!">
              {tuition.title}
            </Link>
          </h3>

          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {tuition.classLevel} · {tuition.mode} · {tuition.location}
          </p>

          <div className="mt-auto pt-3">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2
              border-t border-[var(--border)] pt-4 text-xs uppercase">
              <span className="break-words text-[var(--muted)]">{tuition.tutorName}</span>
              <Link
                href={detailHref}
                className="inline-flex items-center gap-1.5 font-bold text-[var(--ink)]!
                  hover:text-[#b73b23]! [html.dark_&]:hover:text-[#f5a88b]!"
              >
                View mentorship <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="tuition-card">
      <div className="tuition-image">
        <Link href={detailHref}>
          <img
            src={tuition.bannerImage}
            loading="lazy"
            alt={`${tuition.subject} mentoring session`}
          />
        </Link>
        <span className="image-tag">
          {tuition.mode === 'Online' ? <MonitorPlay size={12} /> : <MapPin size={12} />}{' '}
          {tuition.mode}
        </span>
        {showSave && (
          <button className="save-button" onClick={bookmark} aria-label="Save tuition">
            <Bookmark size={17} />
          </button>
        )}
      </div>

      <div className="tuition-body">
        <div className="tuition-meta">
          <span className="subject-label">{tuition.subject}</span>
          <span><CalendarDays size={13} /> {tuition.daysPerWeek} days / week</span>
        </div>
        <Link href={detailHref} className="tuition-title">{tuition.title}</Link>
        <p className="tuition-level">
          {tuition.classLevel} <span>·</span> {tuition.location}
        </p>
        <div className="tuition-bottom">
          <div className="tutor-mini">
            <span className="mini-portrait">
              {tuition.tutorName?.split(' ').map((word) => word[0]).slice(0, 2).join('')}
            </span>
            <div>
              <b>{tuition.tutorName}</b>
              <small>Verified mentor</small>
            </div>
          </div>
          <div className="price">
            <strong>{monthlyFee}</strong>
            <small>/ month</small>
          </div>
        </div>
        <Link href={detailHref} className="card-action">
          View mentorship <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
